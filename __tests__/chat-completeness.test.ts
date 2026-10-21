/**
 * @jest-environment node
 *
 * Chat completeness regression tests (2026-10-21) — chat-grill Q24
 * (message search, presence, DM notifications) + Q26 (group lifecycle).
 *
 * Route behavior is tested through the real Hono app with a recording
 * mock DB (chat-grill-fixes pattern: mock @/db + better-auth, then
 * app.request). The mock returns programmed rows per (op, table); the
 * authZ assertions lean on the recorded calls + status codes.
 */
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://user:pass@localhost:5432/test";

import {
  messages,
  conversations,
  conversationMembers,
  notifications,
  profiles,
  user,
} from "@/db/schema";

// ---------------------------------------------------------------------------
// Recording mock DB (routes use the drizzle chaining API; we record ops).
// ---------------------------------------------------------------------------
type Call = { op: string; method: string; table: string; args?: any[] };
const tableKey = (t: any): string => {
  if (t === messages) return "messages";
  if (t === conversations) return "conversations";
  if (t === conversationMembers) return "conversationMembers";
  if (t === notifications) return "notifications";
  if (t === profiles) return "profiles";
  if (t === user) return "user";
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
const THIRD = "user-third-3";
const NEW = "user-new-4";
const CONVO = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const MSG = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

const memRow = (userId: string, over: Record<string, any> = {}) => ({
  conversationId: CONVO,
  userId,
  isPinned: false,
  lastReadAt: null,
  joinedAt: new Date("2026-10-01T10:00:00Z"),
  ...over,
});
const groupConvo = (over: Record<string, any> = {}) => ({
  id: CONVO,
  title: "Team Chat",
  dmPairKey: null,
  createdBy: ME,
  createdAt: new Date("2026-10-01T10:00:00Z"),
  ...over,
});
const dmConvo = (over: Record<string, any> = {}) => ({
  id: CONVO,
  title: "",
  dmPairKey: `dm:${ME}:${PEER}`,
  createdBy: ME,
  createdAt: new Date("2026-10-01T10:00:00Z"),
  ...over,
});
const msgRow = (over: Record<string, any> = {}) => ({
  id: MSG,
  conversationId: CONVO,
  senderId: ME,
  body: "hello there",
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
const profileRow = (userId: string, over: Record<string, any> = {}) => ({
  userId,
  displayName: "Some User",
  avatarUrl: null,
  membership: "citizen",
  isBot: false,
  lastSeenAt: null,
  ...over,
});

function installDb(rowsFor: (op: string, table: string) => any[]) {
  const { db, calls } = makeDb(rowsFor);
  mockHolder.db = db;
  mockHolder.calls = calls;
  return { calls };
}

beforeEach(() => {
  (auth.api.getSession as jest.Mock).mockReset();
  mockHolder.db = null;
  mockHolder.calls = [];
});

// ---------------------------------------------------------------------------
// Route registration
// ---------------------------------------------------------------------------
describe("routes are registered", () => {
  const app = createHonoApp();
  const registered = new Set(
    app.routes.map(
      (r: { method: string; path: string }) => `${r.method} ${r.path}`
    )
  );
  test.each([
    ["GET", "/api/chat/search"],
    ["POST", "/api/chat/presence"],
    ["PATCH", "/api/chat/conversations/:id"],
    ["POST", "/api/chat/conversations/:id/members"],
    ["DELETE", "/api/chat/conversations/:id/members/:user_id"],
  ])("%s %s", (method, path) => {
    expect(registered.has(`${method} ${path}`)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Q24 — presence heartbeat
// ---------------------------------------------------------------------------
describe("Q24 presence heartbeat", () => {
  test("unauthenticated → 401, no write", async () => {
    const { calls } = installDb(() => []);
    const app = createHonoApp();
    asUser(null);
    const res = await app.request("/api/chat/presence", { method: "POST" });
    expect(res.status).toBe(401);
    expect(calls.some((c) => c.op === "update")).toBe(false);
  });

  test("authed → 200 and a throttled last_seen_at write on MY profile", async () => {
    const { calls } = installDb(() => []);
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request("/api/chat/presence", { method: "POST" });
    expect(res.status).toBe(200);
    const setCall = calls.find(
      (c) => c.op === "update" && c.table === "profiles" && c.method === "set"
    );
    if (!setCall) throw new Error("expected a profiles update");
    expect(setCall.args![0].lastSeenAt).toBeInstanceOf(Date);
    expect(Object.keys(setCall.args![0])).toEqual(["lastSeenAt"]);
  });
});

// ---------------------------------------------------------------------------
// Q24 — message search
// ---------------------------------------------------------------------------
describe("Q24 message search", () => {
  const searchRow = {
    id: MSG,
    conversationId: CONVO,
    conversationTitle: "Team Chat",
    body: "the deploy checklist is ready",
    kind: "text",
    senderId: PEER,
    createdAt: new Date("2026-10-16T10:00:00Z"),
  };

  test("unauthenticated → 401", async () => {
    installDb(() => []);
    const app = createHonoApp();
    asUser(null);
    const res = await app.request("/api/chat/search?q=deploy");
    expect(res.status).toBe(401);
  });

  test("query under 2 chars → 400", async () => {
    installDb(() => []);
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request("/api/chat/search?q=d");
    expect(res.status).toBe(400);
  });

  test("results carry the sender card; the query JOINS membership (the authZ boundary)", async () => {
    const { calls } = installDb((op, table) => {
      if (op === "select" && table === "messages") return [searchRow];
      if (op === "select" && table === "profiles")
        return [
          profileRow(PEER, {
            displayName: "Peer Person",
            lastSeenAt: new Date(),
          }),
        ];
      return [];
    });
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request("/api/chat/search?q=deploy");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.results).toHaveLength(1);
    expect(data.results[0].conversation_id).toBe(CONVO);
    expect(data.results[0].body).toContain("deploy");
    expect(data.results[0].sender.display_name).toBe("Peer Person");
    // Presence rides along on the card: a just-seen sender is online.
    expect(data.results[0].sender.is_online).toBe(true);
    expect(data.results[0].sender.last_seen_at).toBeTruthy();
    // The ONLY data path joins conversation_members on MY user id — a
    // non-member's search can never surface other people's chats.
    const join = calls.find(
      (c) => c.method === "innerJoin" && c.args?.[0] === conversationMembers
    );
    if (!join) throw new Error("expected a membership innerJoin");
  });

  test("stale last_seen → is_online false", async () => {
    installDb((op, table) => {
      if (op === "select" && table === "messages") return [searchRow];
      if (op === "select" && table === "profiles")
        return [
          profileRow(PEER, {
            lastSeenAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          }),
        ];
      return [];
    });
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request("/api/chat/search?q=deploy");
    const data = await res.json();
    expect(data.results[0].sender.is_online).toBe(false);
    expect(data.results[0].sender.last_seen_at).toBeTruthy();
  });

  test("no matching rows (e.g. not a member anywhere relevant) → empty results", async () => {
    installDb(() => []);
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request("/api/chat/search?q=deploy");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.results).toEqual([]);
    expect(data.has_more).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Q24 — DM / group notifications on new messages
// ---------------------------------------------------------------------------
describe("Q24 chat notifications", () => {
  const sendUrl = `/api/chat/conversations/${CONVO}/messages`;
  const send = (app: any) =>
    app.request(sendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: "hello there" }),
    });

  const baseRows =
    (members: any[], senderProfile: any) => (op: string, table: string) => {
      if (op === "select" && table === "conversationMembers") return members;
      if (op === "insert" && table === "messages") return [msgRow()];
      if (op === "select" && table === "messages") return [msgRow()];
      if (op === "select" && table === "profiles") return [senderProfile];
      return [];
    };

  const notificationInserts = (calls: Call[]) =>
    calls.filter(
      (c) =>
        c.op === "insert" &&
        c.table === "notifications" &&
        c.method === "values"
    );

  test("DM: the peer gets exactly one chat_message notification", async () => {
    const { calls } = installDb(
      baseRows([memRow(ME), memRow(PEER)], profileRow(ME))
    );
    const app = createHonoApp();
    asUser(ME);
    const res = await send(app);
    expect(res.status).toBe(201);
    const inserts = notificationInserts(calls);
    expect(inserts).toHaveLength(1);
    expect(inserts[0].args![0]).toMatchObject({
      userId: PEER,
      type: "chat_message",
      actorId: ME,
      conversationId: CONVO,
    });
  });

  test("group: every OTHER member is notified, never the sender", async () => {
    const { calls } = installDb(
      baseRows([memRow(ME), memRow(PEER), memRow(THIRD)], profileRow(ME))
    );
    const app = createHonoApp();
    asUser(ME);
    const res = await send(app);
    expect(res.status).toBe(201);
    const targets = notificationInserts(calls).map((c) => c.args![0].userId);
    expect(targets.sort()).toEqual([PEER, THIRD].sort());
  });

  test("bot sender → NO notifications (the chat badge covers discovery)", async () => {
    const { calls } = installDb(
      baseRows([memRow(ME), memRow(PEER)], profileRow(ME, { isBot: true }))
    );
    const app = createHonoApp();
    asUser(ME);
    const res = await send(app);
    expect(res.status).toBe(201);
    expect(notificationInserts(calls)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Q26 — group lifecycle
// ---------------------------------------------------------------------------
describe("Q26 group lifecycle", () => {
  const renameUrl = `/api/chat/conversations/${CONVO}`;
  const membersUrl = `/api/chat/conversations/${CONVO}/members`;

  /** Mocks for a group whose buildConversation can complete. */
  const groupRows =
    (members: any[], convo: any) => (op: string, table: string) => {
      if (op === "select" && table === "conversationMembers") return members;
      if (op === "select" && table === "conversations") return [convo];
      return [];
    };

  test("rename by a NON-member → 403, no write", async () => {
    const { calls } = installDb(() => []);
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(renameUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New name" }),
    });
    expect(res.status).toBe(403);
    expect(
      calls.some((c) => c.op === "update" && c.table === "conversations")
    ).toBe(false);
  });

  test("rename a DM → 400 readable (lifecycle is groups-only)", async () => {
    installDb(groupRows([memRow(ME)], dmConvo()));
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(renameUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New name" }),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/direct message/i);
  });

  test("rename a group by a member → 200 + title update", async () => {
    const { calls } = installDb(groupRows([memRow(ME)], groupConvo()));
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(renameUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New name" }),
    });
    expect(res.status).toBe(200);
    const setCall = calls.find(
      (c) =>
        c.op === "update" && c.table === "conversations" && c.method === "set"
    );
    if (!setCall) throw new Error("expected a conversations update");
    expect(setCall.args![0]).toMatchObject({ title: "New name" });
    const data = await res.json();
    expect(data.is_group).toBe(true);
    expect(data.created_by).toBe(ME);
  });

  test("add members: a member can add a new user", async () => {
    const { calls } = installDb((op, table) => {
      if (op === "select" && table === "conversationMembers")
        return [memRow(ME)];
      if (op === "select" && table === "conversations") return [groupConvo()];
      if (op === "select" && table === "user") return [{ id: NEW }];
      return [];
    });
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(membersUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_ids: [NEW] }),
    });
    expect(res.status).toBe(200);
    const insert = calls.find(
      (c) =>
        c.op === "insert" &&
        c.table === "conversationMembers" &&
        c.method === "values"
    );
    if (!insert) throw new Error("expected a conversationMembers insert");
    expect(insert.args![0]).toEqual([{ conversationId: CONVO, userId: NEW }]);
  });

  test("add members: adding someone already in is a no-op success", async () => {
    const { calls } = installDb((op, table) => {
      if (op === "select" && table === "conversationMembers")
        return [memRow(ME), memRow(PEER)];
      if (op === "select" && table === "conversations") return [groupConvo()];
      if (op === "select" && table === "user") return [{ id: PEER }];
      return [];
    });
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(membersUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_ids: [PEER] }),
    });
    expect(res.status).toBe(200);
    expect(calls.some((c) => c.op === "insert")).toBe(false);
  });

  test("add members: the 50-member cap is enforced", async () => {
    const fifty = Array.from({ length: 50 }, (_, i) => memRow(`user-${i}`));
    const { calls } = installDb((op, table) => {
      if (op === "select" && table === "conversationMembers") return fifty;
      if (op === "select" && table === "conversations") return [groupConvo()];
      if (op === "select" && table === "user") return [{ id: NEW }];
      return [];
    });
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(membersUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_ids: [NEW] }),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/50 members/);
    expect(calls.some((c) => c.op === "insert")).toBe(false);
  });

  test("add members by a NON-member → 403", async () => {
    installDb(() => []);
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(membersUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_ids: [NEW] }),
    });
    expect(res.status).toBe(403);
  });

  test("remove: a NON-creator removing someone else → 403, no delete", async () => {
    const { calls } = installDb(
      groupRows(
        [memRow(ME), memRow(PEER), memRow(THIRD)],
        groupConvo({ createdBy: THIRD })
      )
    );
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(`${membersUrl}/${PEER}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(403);
    expect((await res.json()).message).toMatch(/creator/i);
    expect(
      calls.some((c) => c.op === "delete" && c.table === "conversationMembers")
    ).toBe(false);
  });

  test("remove: the creator can remove another member", async () => {
    const { calls } = installDb(
      groupRows([memRow(ME), memRow(PEER)], groupConvo({ createdBy: ME }))
    );
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(`${membersUrl}/${PEER}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(200);
    expect(
      calls.some((c) => c.op === "delete" && c.table === "conversationMembers")
    ).toBe(true);
    // Creator stays creator — no succession update.
    expect(
      calls.some(
        (c) =>
          c.op === "update" &&
          c.table === "conversations" &&
          c.method === "set" &&
          (c.args![0] as any).createdBy !== undefined
      )
    ).toBe(false);
  });

  test("remove: a member can always remove THEMSELVES (leave)", async () => {
    const { calls } = installDb(
      groupRows([memRow(ME), memRow(PEER)], groupConvo({ createdBy: PEER }))
    );
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(`${membersUrl}/${ME}`, { method: "DELETE" });
    expect(res.status).toBe(200);
    expect((await res.json()).left).toBe(true);
    expect(
      calls.some((c) => c.op === "delete" && c.table === "conversationMembers")
    ).toBe(true);
  });

  test("remove: when the CREATOR leaves, ownership passes to the longest-standing remaining member", async () => {
    // PEER joined before ME (the creator) in row order — the remaining
    // select is ordered by joined_at, so PEER is the successor.
    const { calls } = installDb(
      groupRows(
        [
          memRow(PEER, { joinedAt: new Date("2026-09-01T10:00:00Z") }),
          memRow(ME, { joinedAt: new Date("2026-10-01T10:00:00Z") }),
        ],
        groupConvo({ createdBy: ME })
      )
    );
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(`${membersUrl}/${ME}`, { method: "DELETE" });
    expect(res.status).toBe(200);
    const setCall = calls.find(
      (c) =>
        c.op === "update" &&
        c.table === "conversations" &&
        c.method === "set" &&
        (c.args![0] as any).createdBy !== undefined
    );
    if (!setCall) throw new Error("expected a succession update");
    expect((setCall.args![0] as any).createdBy).toBe(PEER);
  });

  test("remove on a DM → 400 readable", async () => {
    installDb(groupRows([memRow(ME), memRow(PEER)], dmConvo()));
    const app = createHonoApp();
    asUser(ME);
    const res = await app.request(`${membersUrl}/${ME}`, { method: "DELETE" });
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/direct message/i);
  });
});
