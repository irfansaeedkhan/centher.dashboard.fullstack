/**
 * @jest-environment node
 *
 * Chat-grill FIXER regression tests (2026-10-16).
 *
 * Every grill question classified BUG gets a test that fails without the
 * fix. Pure helpers are unit-tested directly; route behavior is tested
 * through the real Hono app with a recording mock DB (phase13 pattern:
 * mock @/db + better-auth, then app.request).
 */
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/test";

import {
  messages,
  conversations,
  conversationMembers,
  chatAttachments,
  messageReactions,
  chatTyping,
  profiles,
  user,
  follows,
} from "@/db/schema";
import { isTrustedAttachmentUrl } from "@/lib/chat/attachments";
import { mergeMessages, prependOlder } from "@/lib/chat/merge";
import {
  prepareAttachments,
  sendPreparedAttachments,
} from "@/lib/chat/send-attachments";
import { dmPairKey, isEditExpired, EDIT_WINDOW_MS } from "@/lib/chat/utils";

// ---------------------------------------------------------------------------
// Recording mock DB (routes use the drizzle chaining API; we record ops).
// ---------------------------------------------------------------------------
type Call = { op: string; method: string; table: string; args?: any[] };
const tableKey = (t: any): string => {
  if (t === messages) return "messages";
  if (t === conversations) return "conversations";
  if (t === conversationMembers) return "conversationMembers";
  if (t === chatAttachments) return "chatAttachments";
  if (t === messageReactions) return "messageReactions";
  if (t === chatTyping) return "chatTyping";
  if (t === profiles) return "profiles";
  if (t === user) return "user";
  if (t === follows) return "follows";
  return "other";
};

const makeDb = (rowsFor: (op: string, table: string) => any[]) => {
  const calls: Call[] = [];
  const chain = (op: string, initialTable = "none") => {
    let table = initialTable;
    const q: any = new Proxy(() => {}, {
      get(_t, prop) {
        if (prop === "then") return (res: any) => res(rowsFor(op, table));
        return (...args: any[]) => {
          if (String(prop) === "from" && args[0]) table = tableKey(args[0]);
          calls.push({ op, method: String(prop), table, args });
          return q;
        };
      },
      apply() {
        return q;
      },
    });
    return q;
  };
  const db: any = {
    select: (..._a: any[]) => chain("select"),
    insert: (t: any) => chain("insert", tableKey(t)),
    update: (t: any) => chain("update", tableKey(t)),
    delete: (t: any) => chain("delete", tableKey(t)),
    execute: async (..._a: any[]) => {
      calls.push({ op: "execute", method: "execute", table: "raw" });
      return rowsFor("execute", "raw");
    },
  };
  return { db, calls };
};

// The mock DB is a mutable holder: app.ts reads `db` lazily at request
// time (compiled TS accesses the export per use), so tests can swap the
// programmed behavior between cases without re-requiring the app.
const mockHolder: { db: any; calls: Call[] } = { db: null, calls: [] };

jest.mock("@/db", () => ({
  get db() {
    return mockHolder.db;
  },
}));
jest.mock("@/lib/auth/better-auth", () => ({
  auth: { api: { getSession: jest.fn() }, handler: jest.fn() },
}));

// require (not import): ES imports hoist above the jest.mock calls.
const { createHonoApp } = require("@/server/hono/app");
const { auth } = require("@/lib/auth/better-auth");

const asUser = (id: string | null) =>
  (auth.api.getSession as jest.Mock).mockResolvedValue(
    id ? { user: { id } } : null
  );

const ME = "user-me-1";
const PEER = "user-peer-2";
const CONVO = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const MSG = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

const memRow = {
  conversationId: CONVO,
  userId: ME,
  isPinned: false,
  lastReadAt: null,
  joinedAt: new Date(),
};
const msgRow = (over: Record<string, any> = {}) => ({
  id: MSG,
  conversationId: CONVO,
  senderId: PEER,
  body: "hello",
  kind: "text",
  attachmentId: null,
  replyToId: null,
  replySnapshot: null,
  status: "sent",
  isDeleted: false,
  editedAt: null,
  createdAt: new Date("2026-10-16T10:00:00Z"),
  ...over,
});

function installDb(rowsFor: (op: string, table: string) => any[]) {
  const { db, calls } = makeDb(rowsFor);
  mockHolder.db = db;
  mockHolder.calls = calls;
  return { calls };
}

const byTable = (op: string, table: string, rows: any[]) => {
  const map: Record<string, any[]> = { [`${op}:${table}`]: rows };
  return (o: string, t: string) => map[`${o}:${t}`] ?? [];
};

beforeEach(() => {
  (auth.api.getSession as jest.Mock).mockReset();
  mockHolder.db = null;
  mockHolder.calls = [];
});

// ---------------------------------------------------------------------------
// Q1 — attachment host allowlist
// ---------------------------------------------------------------------------
describe("Q1 attachment host allowlist", () => {
  test("unit: only https://res.cloudinary.com is trusted", () => {
    expect(
      isTrustedAttachmentUrl(
        "https://res.cloudinary.com/demo/image/upload/x.png"
      )
    ).toBe(true);
    expect(isTrustedAttachmentUrl("https://evil.example/pixel.png")).toBe(
      false
    );
    expect(isTrustedAttachmentUrl("http://res.cloudinary.com/x.png")).toBe(
      false
    );
    expect(isTrustedAttachmentUrl("not a url")).toBe(false);
    expect(isTrustedAttachmentUrl(null)).toBe(false);
    expect(
      isTrustedAttachmentUrl("https://res.cloudinary.com.evil.example/x.png")
    ).toBe(false);
  });

  test("POST /chat/attachments rejects an off-host URL before any insert", async () => {
    const { calls } = installDb(() => []);
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request("/api/chat/attachments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "image",
        mime_type: "image/png",
        file_name: "pixel.png",
        file_size: 100,
        url: "https://evil.example/pixel.png",
      }),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/host/i);
    expect(calls.some((c) => c.op.startsWith("insert"))).toBe(false);
  });

  test("POST /chat/attachments accepts a Cloudinary URL", async () => {
    const att = {
      id: "att-1",
      kind: "image",
      mimeType: "image/png",
      fileName: "x.png",
      fileSize: 100,
      url: "https://res.cloudinary.com/demo/image/upload/x.png",
      durationSec: null,
      width: 10,
      height: 10,
      thumbnailUrl: null,
    };
    installDb(byTable("insert", "chatAttachments", [att]));
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request("/api/chat/attachments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "image",
        mime_type: "image/png",
        file_name: "x.png",
        file_size: 100,
        url: "https://res.cloudinary.com/demo/image/upload/x.png",
      }),
    });
    expect(res.status).toBe(201);
  });
});

// ---------------------------------------------------------------------------
// Q2 — tombstone schema contract
// ---------------------------------------------------------------------------
describe("Q2 user-deletion tombstone (schema contract)", () => {
  test("messages.senderId is nullable (no more cascade-wipe)", () => {
    expect((messages.senderId as any).notNull).toBe(false);
  });
  test("grill columns exist", () => {
    expect((conversations as any).dmPairKey).toBeDefined();
    expect((messages as any).editedAt).toBeDefined();
    expect((messages as any).replySnapshot).toBeDefined();
    // Q5: claim table (neon-http has no multi-statement transactions, so no
    // advisory lock); Q20: explicit bot role on profiles.
    const { botReplyClaims } = require("@/db/schema");
    expect(botReplyClaims).toBeDefined();
    expect((profiles as any).botRole).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Q3 — DM dedup key
// ---------------------------------------------------------------------------
describe("Q3 DM dedup key", () => {
  test("dmPairKey is order-free and canonical", () => {
    expect(dmPairKey("a", "b")).toBe("dm:a:b");
    expect(dmPairKey("b", "a")).toBe("dm:a:b");
    expect(dmPairKey("a", "b")).toBe(dmPairKey("b", "a"));
  });
});

// ---------------------------------------------------------------------------
// Q4+Q9 — read route: validate before mutate, single boundary
// ---------------------------------------------------------------------------
describe("Q4/Q9 read route", () => {
  const readUrl = `/api/chat/conversations/${CONVO}/read`;

  test("unknown up_to_message_id → 404 WITHOUT touching lastReadAt", async () => {
    const { calls } = installDb((op, table) => {
      if (op === "select" && table === "conversationMembers") return [memRow];
      return []; // message lookup finds nothing
    });
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(readUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        up_to_message_id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      }),
    });
    expect(res.status).toBe(404);
    // The old code updated lastReadAt BEFORE the lookup — the badge would
    // clear on a failed call. Now: no update op at all.
    expect(calls.some((c) => c.op.startsWith("update"))).toBe(false);
    expect(calls.some((c) => c.op === "execute")).toBe(false);
  });

  test("valid up_to_message_id → one boundary drives lastReadAt AND status ticks", async () => {
    const refDate = new Date("2026-10-16T09:30:00Z");
    const { calls } = installDb((op, table) => {
      if (op === "select" && table === "conversationMembers") return [memRow];
      if (op === "select" && table === "messages")
        return [{ createdAt: refDate }];
      return [];
    });
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(readUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ up_to_message_id: MSG }),
    });
    expect(res.status).toBe(200);
    const setCall = calls.find(
      (c) =>
        c.op === "update" &&
        c.table === "conversationMembers" &&
        c.method === "set"
    );
    if (!setCall) throw new Error("expected conversationMembers update");
    const lastReadAtVal: any = setCall.args![0].lastReadAt;
    // Q9: single boundary via subquery on the message id — NOT a JS Date
    // round-trip (µs truncation would leave the boundary message itself
    // counted as unread, re-splitting badge and ticks).
    expect(lastReadAtVal).not.toBeInstanceOf(Date);
    // The message id travels inside the subquery's chunks (drizzle inlines
    // template params there) — proving the boundary is the ref message,
    // not a JS Date.
    expect(JSON.stringify((lastReadAtVal as any)?.queryChunks ?? "")).toContain(
      MSG
    );
    // The status flip runs in the same route (sender ticks keep working).
    const msgUpdate = calls.find(
      (c) => c.op === "update" && c.table === "messages" && c.method === "set"
    );
    if (!msgUpdate) throw new Error("expected messages status update");
    expect(msgUpdate.args![0].status).toBe("read");
  });
});

// ---------------------------------------------------------------------------
// Q6 — send must not bump lastReadAt
// ---------------------------------------------------------------------------
describe("Q6 send does not mark others' messages read", () => {
  test("POST message performs no conversation_members update", async () => {
    const row = msgRow({ id: "new-msg", senderId: ME, body: "hi" });
    const { calls } = installDb((op, table) => {
      if (op === "select" && table === "conversationMembers") return [memRow];
      if (op === "insert" && table === "messages") return [row];
      if (op === "select" && table === "messages") return [row];
      return [];
    });
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(`/api/chat/conversations/${CONVO}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: "hi" }),
    });
    expect(res.status).toBe(201);
    expect(
      calls.some((c) => c.op === "update" && c.table === "conversationMembers")
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Q14 — edit window
// ---------------------------------------------------------------------------
describe("Q14 edit window", () => {
  const url = `/api/chat/messages/${MSG}`;

  test("edit after 15 minutes → 400, no update", async () => {
    const { calls } = installDb((op, table) => {
      if (op === "select" && table === "messages")
        return [
          msgRow({
            senderId: ME,
            createdAt: new Date(Date.now() - 16 * 60 * 1000),
          }),
        ];
      return [];
    });
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: "too late" }),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("EDIT_WINDOW_EXPIRED");
    expect(calls.some((c) => c.op.startsWith("update"))).toBe(false);
  });

  test("edit inside the window → 200 and editedAt is set", async () => {
    const fresh = msgRow({
      senderId: ME,
      createdAt: new Date(Date.now() - 60 * 1000),
    });
    const { calls } = installDb((op, table) => {
      if (op === "select" && table === "messages") return [fresh];
      return [];
    });
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: "fixed typo" }),
    });
    expect(res.status).toBe(200);
    const setCall = calls.find(
      (c) => c.op === "update" && c.table === "messages" && c.method === "set"
    );
    if (!setCall) throw new Error("expected messages update");
    expect(setCall.args![0].body).toBe("fixed typo");
    expect(setCall.args![0].editedAt).toBeInstanceOf(Date);
  });

  test("unit: isEditExpired", () => {
    expect(isEditExpired(new Date(Date.now() - 16 * 60 * 1000))).toBe(true);
    expect(isEditExpired(new Date(Date.now() - 60 * 1000))).toBe(false);
    expect(EDIT_WINDOW_MS).toBe(15 * 60 * 1000);
  });
});

// ---------------------------------------------------------------------------
// Q7 — poll merge (pure)
// ---------------------------------------------------------------------------
const m = (
  id: string,
  sender: string,
  created: string,
  over: Record<string, any> = {}
): any => ({
  id,
  body: `body-${id}`,
  kind: "text",
  sender_id: sender,
  created_at: created,
  status: "sent",
  is_deleted: false,
  edited_at: null,
  sender: null,
  attachment: null,
  reply_to: null,
  reactions: [],
  ...over,
});

describe("Q7 poll merge", () => {
  test("optimistic own message survives a stale poll", () => {
    const mine = m("m2", "me", "2026-10-16T10:00:02Z");
    const prev = [m("m1", "peer", "2026-10-16T10:00:01Z"), mine];
    const incoming = [m("m1", "peer", "2026-10-16T10:00:01Z")]; // poll started pre-send
    const out = mergeMessages(prev, incoming, "me");
    expect(out.map((x) => x.id)).toEqual(["m1", "m2"]);
  });

  test("edited message upserts by id", () => {
    const prev = [m("m1", "peer", "2026-10-16T10:00:01Z", { body: "a" })];
    const out = mergeMessages(
      prev,
      [m("m1", "peer", "2026-10-16T10:00:01Z", { body: "b" })],
      "me"
    );
    expect(out[0].body).toBe("b");
  });

  test("peer's message missing inside the window is dropped (deleted)", () => {
    const prev = [
      m("m0", "peer", "2026-10-16T10:00:00Z"),
      m("m1", "peer", "2026-10-16T10:00:01Z"),
      m("m2", "peer", "2026-10-16T10:00:02Z"),
    ];
    const out = mergeMessages(
      prev,
      [
        m("m0", "peer", "2026-10-16T10:00:00Z"),
        m("m2", "peer", "2026-10-16T10:00:02Z"),
      ],
      "me"
    );
    // m1 (10:00:01) is newer than the window's oldest (10:00:00) but absent
    // from the fresh list → deleted → dropped. m0/m2 survive.
    expect(out.map((x) => x.id)).toEqual(["m0", "m2"]);
  });

  test("older-than-window messages are kept (pagination)", () => {
    const prev = [m("m0", "peer", "2026-10-16T09:00:00Z")];
    const out = mergeMessages(
      prev,
      [m("m1", "peer", "2026-10-16T10:00:01Z")],
      "me"
    );
    expect(out.map((x) => x.id)).toEqual(["m0", "m1"]);
  });

  test("result stays chronological", () => {
    const prev = [m("m2", "me", "2026-10-16T10:00:02Z")];
    const out = mergeMessages(
      prev,
      [m("m1", "peer", "2026-10-16T10:00:01Z")],
      "me"
    );
    expect(out.map((x) => x.id)).toEqual(["m1", "m2"]);
  });
});

describe("Q13 prependOlder", () => {
  test("prepends deduplicated and sorted", () => {
    const prev = [m("m2", "peer", "2026-10-16T10:00:02Z")];
    const older = [
      m("m1", "peer", "2026-10-16T10:00:01Z"),
      m("m2", "peer", "2026-10-16T10:00:02Z"),
    ];
    expect(prependOlder(prev, older).map((x) => x.id)).toEqual(["m1", "m2"]);
  });
});

// ---------------------------------------------------------------------------
// Q17 — two-phase attachment send (pure, injected deps)
// ---------------------------------------------------------------------------
describe("Q17 two-phase attachment send", () => {
  const file = (name: string) => ({ name } as unknown as File);

  test("a failure in phase 1 aborts before anything is sent", async () => {
    const registered: string[] = [];
    const sent: string[] = [];
    const deps = {
      upload: async (f: File) => {
        if ((f as any).name === "b.png") throw new Error("upload boom");
        return {
          kind: "image" as const,
          mimeType: "image/png",
          fileName: (f as any).name,
          fileSize: 1,
          url: "https://res.cloudinary.com/x",
        };
      },
      register: async (d: any) => {
        registered.push(d.file_name);
        return { id: `att-${d.file_name}` };
      },
      sendMessage: async (body: string) => {
        sent.push(body);
      },
    };
    await expect(
      prepareAttachments(
        [file("a.png"), file("b.png")],
        ["image", "image"],
        deps
      )
    ).rejects.toThrow("upload boom");
    expect(sent).toEqual([]); // nothing was ever sent
    expect(registered).toEqual(["a.png"]); // phase 1 stopped at the failure
  });

  test("phase 2 sends in order with the caption on the first message", async () => {
    const sent: Array<{ body: string; att: string }> = [];
    const prepared = [
      {
        kind: "image" as const,
        mimeType: "image/png",
        fileName: "a.png",
        fileSize: 1,
        url: "u",
        attachmentId: "att-a",
      },
      {
        kind: "image" as const,
        mimeType: "image/png",
        fileName: "b.png",
        fileSize: 1,
        url: "u",
        attachmentId: "att-b",
      },
    ];
    await sendPreparedAttachments(prepared, "my caption", undefined, {
      sendMessage: async (body: string, opts: any) => {
        sent.push({ body, att: opts.attachment_id });
      },
    });
    expect(sent).toEqual([
      { body: "my caption", att: "att-a" },
      { body: "", att: "att-b" },
    ]);
  });
});

// ---------------------------------------------------------------------------
// Q12 — keyset response contract
// ---------------------------------------------------------------------------
describe("Q12 keyset pagination contract", () => {
  test("list messages responds with has_more", async () => {
    installDb((op, table) => {
      if (op === "select" && table === "conversationMembers") return [memRow];
      if (op === "select" && table === "messages") return [msgRow()];
      return [];
    });
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(
      `/api/chat/conversations/${CONVO}/messages?limit=1`
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(typeof body.has_more).toBe("boolean");
    expect(body.has_more).toBe(true); // 1 row with limit=1 → more may exist
  });
});

// Module scope guard (see phase5-chat.test.ts).
export {};
