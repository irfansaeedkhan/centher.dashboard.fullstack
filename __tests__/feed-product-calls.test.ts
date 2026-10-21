/**
 * @jest-environment node
 *
 * Feed product-calls regression tests (Irfan approved 2026-10-21):
 *  - Q14: post edit window (15 min, same as chat) + edited_at mark
 *  - Q21: post delete = tombstone (replies survive, counts freeze)
 *  - Q12/Q13: reply edit/delete endpoints (window + mark + tombstone)
 *  - Q23: @mention notifications (mention_in_post, permission-aware,
 *         edit dedupe via onlyNew)
 *  - Judge PR #29 follow-ups: read-side media strip in
 *    normalizePostMedia; deleted_media-only PATCH must succeed.
 *
 * Same harness as feed-grill-fixes.test.ts: recording mock DB + the
 * real Hono app via app.request.
 */
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/test";

import { posts, comments } from "@/db/schema";
import {
  extractMentionUserIds,
  MAX_MENTION_NOTIFICATIONS,
} from "@/lib/feed/mentions";
import { normalizePostMedia } from "@/lib/feed/media";

// ---------------------------------------------------------------------------
// Recording mock DB (routes use the drizzle chaining API; we record ops).
// ---------------------------------------------------------------------------
type Call = { op: string; method: string; table: string; args?: any[] };

// Mock tables are matched by reference against the imported schema.
import {
  profiles,
  postLikes,
  postViews,
  follows,
  notifications,
  user,
} from "@/db/schema";
const tableName = (t: any): string => {
  if (t === posts) return "posts";
  if (t === comments) return "comments";
  if (t === profiles) return "profiles";
  if (t === postLikes) return "postLikes";
  if (t === postViews) return "postViews";
  if (t === follows) return "follows";
  if (t === notifications) return "notifications";
  if (t === user) return "user";
  return "other";
};

type RowsFor = (
  op: string,
  table: string,
  meta: { selectKeys: string[] }
) => any[];

const makeDb = (rowsFor: RowsFor) => {
  const calls: Call[] = [];
  const chain = (
    op: string,
    initialTable = "none",
    selectKeys: string[] = []
  ) => {
    let table = initialTable;
    const q: any = new Proxy(() => {}, {
      get(_t, prop) {
        if (prop === "then")
          return (res: any) => res(rowsFor(op, table, { selectKeys }));
        return (...args: any[]) => {
          if (String(prop) === "from" && args[0]) table = tableName(args[0]);
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
    select: (fields: any) =>
      chain("select", "none", fields ? Object.keys(fields) : []),
    insert: (t: any) => chain("insert", tableName(t)),
    update: (t: any) => chain("update", tableName(t)),
    delete: (t: any) => chain("delete", tableName(t)),
    execute: async () => rowsFor("execute", "raw", { selectKeys: [] }),
  };
  return { db, calls };
};

let impl: RowsFor = () => [];
const { db: mockDb, calls } = makeDb((op, table, meta) =>
  impl(op, table, meta)
);
const mockHolder: { db: any } = { db: mockDb };

jest.mock("@/db", () => ({
  get db() {
    return mockHolder.db;
  },
}));
jest.mock("@/lib/auth/better-auth", () => ({
  auth: { api: { getSession: jest.fn() }, handler: jest.fn() },
}));

const { createHonoApp } = require("@/server/hono/app");
const { auth } = require("@/lib/auth/better-auth");

const asUser = (id: string | null) =>
  (auth.api.getSession as jest.Mock).mockResolvedValue(
    id ? { user: { id } } : null
  );

const app = createHonoApp();

const ME = "user-me-1";
const PEER = "user-peer-2";
const THIRD = "user-third-3";
const POST = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const COMMENT = "ffffffff-ffff-4fff-8fff-ffffffffffff";
const CLOUD_IMG = "https://res.cloudinary.com/demo/image/upload/v1/pic.jpg";
const CLOUD_VID = "https://res.cloudinary.com/demo/video/upload/v1/clip.mp4";

const FRESH = () => new Date();
const STALE = () => new Date(Date.now() - 20 * 60 * 1000);

const profileRow = {
  userId: ME,
  displayName: "Me Myself",
  avatarUrl: null,
  membership: "citizen",
  username: "me",
};

const postRow = (over: Record<string, any> = {}) => ({
  id: POST,
  body: "hello world",
  likeCount: 3,
  commentCount: 2,
  viewCount: 5,
  isArchived: false,
  createdAt: FRESH(),
  authorId: PEER,
  authorName: "Peer Person",
  authorAvatar: null,
  membership: "citizen",
  mediaUrls: null,
  editedAt: null,
  deletedAt: null,
  ...over,
});

const commentRow = (over: Record<string, any> = {}) => ({
  id: COMMENT,
  postId: POST,
  body: "a reply",
  createdAt: FRESH(),
  authorId: ME,
  authorName: "Me Myself",
  authorAvatar: null,
  membership: "citizen",
  editedAt: null,
  deletedAt: null,
  ...over,
});

const editorStateWithMentions = (userIds: string[]) => ({
  root: {
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", text: "hey " },
          ...userIds.map((id) => ({
            type: "mention",
            user_id: id,
            text: "@Someone",
          })),
        ],
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
});

const jsonReq = (method: string, body: unknown) => ({
  method,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

const insertValues = (table: string) =>
  calls
    .filter(
      (c) => c.op === "insert" && c.method === "values" && c.table === table
    )
    .map((c) => c.args![0]);

const updateSets = (table: string) =>
  calls
    .filter((c) => c.op === "update" && c.method === "set" && c.table === table)
    .map((c) => c.args![0]);

const deleteOps = (table: string) =>
  calls.filter((c) => c.op === "delete" && c.table === table);

beforeEach(() => {
  calls.length = 0;
  impl = () => [];
  asUser(ME);
});

// ---------------------------------------------------------------------------
// Schema: the four new columns exist
// ---------------------------------------------------------------------------
describe("schema: product-call columns", () => {
  test("posts and comments carry edited_at + deleted_at", () => {
    expect((posts as any).editedAt).toBeDefined();
    expect((posts as any).deletedAt).toBeDefined();
    expect((comments as any).editedAt).toBeDefined();
    expect((comments as any).deletedAt).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Q23 unit: mention extraction mirrors the renderer
// ---------------------------------------------------------------------------
describe("Q23: extractMentionUserIds", () => {
  test("collects mention node user_ids, deduped, in order", () => {
    const state = editorStateWithMentions([PEER, THIRD, PEER]);
    expect(extractMentionUserIds(state)).toEqual([PEER, THIRD]);
  });

  test("walks nested children; ignores text/hashtag/link nodes", () => {
    const state = {
      root: {
        children: [
          {
            type: "paragraph",
            children: [
              { type: "text", text: "@user-peer-2 as plain text" },
              {
                type: "link",
                url: "https://example.com",
                children: [{ type: "mention", user_id: PEER, text: "@P" }],
              },
            ],
          },
        ],
      },
    };
    expect(extractMentionUserIds(state)).toEqual([PEER]);
  });

  test("garbage in → empty out (plain-text bodies notify nobody)", () => {
    expect(extractMentionUserIds(null)).toEqual([]);
    expect(extractMentionUserIds("just text")).toEqual([]);
    expect(extractMentionUserIds({ root: { children: "nope" } })).toEqual([]);
    expect(
      extractMentionUserIds({ root: { children: [{ type: "mention" }] } })
    ).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Judge #1: read-side media strip
// ---------------------------------------------------------------------------
describe("Judge follow-up: normalizePostMedia strips off-host media at read", () => {
  test("legacy string rows: off-host URLs dropped, Cloudinary survives", () => {
    expect(
      normalizePostMedia([
        "https://evil.example/pixel.png",
        CLOUD_IMG,
        "http://res.cloudinary.com/demo/image/upload/v1/insecure.jpg",
      ])
    ).toEqual([{ url: CLOUD_IMG, type: "image" }]);
  });

  test("object rows: off-host dropped, Cloudinary video survives", () => {
    expect(
      normalizePostMedia([
        { url: "https://evil.example/x.png", type: "image" },
        { url: CLOUD_VID, type: "video" },
        { object_name: "https://attacker.example/track.gif" },
      ])
    ).toEqual([{ url: CLOUD_VID, type: "video" }]);
  });

  test("a feed row stored pre-fix renders without the tracking pixel", async () => {
    const legacy = postRow({
      mediaUrls: ["https://evil.example/pixel.png", CLOUD_IMG],
    });
    impl = (op, table, meta) => {
      if (op === "select" && table === "posts") {
        if (meta.selectKeys.includes("authorUsername")) return [legacy];
        return [legacy];
      }
      return [];
    };
    const res = await app.request("/api/socials/posts?limit=10");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(JSON.stringify(body.posts[0].media)).not.toContain("evil.example");
    expect(body.posts[0].media).toEqual([
      { object_name: CLOUD_IMG, url: CLOUD_IMG, type: "image" },
    ]);
  });
});

// ---------------------------------------------------------------------------
// Q14: post edit window + edited mark; Judge #2: deleted_media-only PATCH
// ---------------------------------------------------------------------------
describe("Q14: PATCH /socials/posts/:id edit window", () => {
  const patchImpl =
    (existing: any) =>
    (op: string, table: string): any[] => {
      if (op === "select" && table === "posts") return [existing];
      if (op === "update" && table === "posts") {
        const set = updateSets("posts").slice(-1)[0] || {};
        return [{ ...existing, ...set }];
      }
      return [];
    };

  test("edit inside the window succeeds and stamps edited_at", async () => {
    const existing = postRow({ authorId: ME });
    impl = patchImpl(existing);
    const res = await app.request(
      `/api/socials/posts/${POST}`,
      jsonReq("PATCH", { text: "edited text" })
    );
    expect(res.status).toBe(200);
    const set = updateSets("posts")[0];
    expect(set.editedAt).toBeInstanceOf(Date);
    expect(set.body).toContain("edited text");
    const body = await res.json();
    expect(body.posts[0].edited_at).toBeTruthy();
  });

  test("edit after 15 minutes is rejected with the readable message", async () => {
    const existing = postRow({ authorId: ME, createdAt: STALE() });
    impl = patchImpl(existing);
    const res = await app.request(
      `/api/socials/posts/${POST}`,
      jsonReq("PATCH", { text: "too late" })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).message).toBe(
      "Posts can only be edited within 15 minutes"
    );
    expect(updateSets("posts")).toHaveLength(0);
  });

  test("editing a deleted post is a readable error", async () => {
    const existing = postRow({ authorId: ME, deletedAt: new Date() });
    impl = patchImpl(existing);
    const res = await app.request(
      `/api/socials/posts/${POST}`,
      jsonReq("PATCH", { text: "revive" })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/deleted/i);
    expect(updateSets("posts")).toHaveLength(0);
  });

  test("someone else's post is 403, window or not", async () => {
    const existing = postRow({ authorId: PEER });
    impl = patchImpl(existing);
    const res = await app.request(
      `/api/socials/posts/${POST}`,
      jsonReq("PATCH", { text: "not mine" })
    );
    expect(res.status).toBe(403);
    expect(updateSets("posts")).toHaveLength(0);
  });

  test("Judge #2: deleted_media-only PATCH applies the removal (no 400)", async () => {
    const existing = postRow({
      authorId: ME,
      mediaUrls: [CLOUD_IMG, { url: CLOUD_VID, type: "video" }],
    });
    impl = patchImpl(existing);
    const res = await app.request(
      `/api/socials/posts/${POST}`,
      jsonReq("PATCH", { deleted_media: [CLOUD_IMG] })
    );
    expect(res.status).toBe(200);
    const set = updateSets("posts")[0];
    expect(set.mediaUrls).toEqual([{ url: CLOUD_VID, type: "video" }]);
    // Body is untouched by a media-only edit.
    expect(set.body).toBe(existing.body);
  });

  test("a truly empty PATCH still 400s 'Nothing to update'", async () => {
    const existing = postRow({ authorId: ME });
    impl = patchImpl(existing);
    const res = await app.request(
      `/api/socials/posts/${POST}`,
      jsonReq("PATCH", {})
    );
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/Nothing to update/);
  });
});

// ---------------------------------------------------------------------------
// Q21: post delete = tombstone
// ---------------------------------------------------------------------------
describe("Q21: DELETE /socials/posts/:id tombstones instead of wiping", () => {
  test("delete sets deleted_at (no row delete); response is a redacted stub", async () => {
    const existing = postRow({
      authorId: ME,
      body: "secret words",
      mediaUrls: [CLOUD_IMG],
    });
    impl = (op, table) => {
      if (op === "select" && table === "posts") return [existing];
      return [];
    };
    const res = await app.request(`/api/socials/posts/${POST}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(200);
    expect(deleteOps("posts")).toHaveLength(0);
    expect(updateSets("posts")[0].deletedAt).toBeInstanceOf(Date);
    const body = await res.json();
    expect(body.deleted).toBe(true);
    expect(body.posts[0].status).toBe("deleted");
    expect(body.posts[0].is_deleted).toBe(true);
    expect(body.posts[0].text_content).toBe("");
    expect(body.posts[0].media).toEqual([]);
    expect(JSON.stringify(body)).not.toContain("secret words");
  });

  test("deleting an already-deleted post is idempotent (no second write)", async () => {
    const existing = postRow({ authorId: ME, deletedAt: new Date() });
    impl = (op, table) => {
      if (op === "select" && table === "posts") return [existing];
      return [];
    };
    const res = await app.request(`/api/socials/posts/${POST}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(200);
    expect(updateSets("posts")).toHaveLength(0);
  });

  test("someone else's post cannot be deleted", async () => {
    const existing = postRow({ authorId: PEER });
    impl = (op, table) => {
      if (op === "select" && table === "posts") return [existing];
      return [];
    };
    const res = await app.request(`/api/socials/posts/${POST}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(403);
    expect(updateSets("posts")).toHaveLength(0);
  });

  test("GET a deleted post resolves as the stub (replies never 404)", async () => {
    const deleted = postRow({
      body: "gone",
      deletedAt: new Date(),
      mediaUrls: [CLOUD_IMG],
    });
    impl = (op, table) => {
      if (op === "select" && table === "posts") return [deleted];
      return [];
    };
    const res = await app.request(`/api/socials/posts/${POST}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.posts[0].status).toBe("deleted");
    expect(body.posts[0].text_content).toBe("");
    expect(body.posts[0].media).toEqual([]);
    expect(body.posts[0].replies_count).toBe(2);
  });

  test("feed list renders the tombstone as a stub, edited posts carry the mark", async () => {
    const deleted = postRow({
      id: POST,
      body: "gone",
      deletedAt: new Date(),
      createdAt: new Date(Date.now() - 3600_000),
    });
    const edited = postRow({
      id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      editedAt: new Date("2026-10-21T09:00:00Z"),
      createdAt: new Date(Date.now() - 7200_000),
    });
    impl = (op, table, meta) => {
      if (op === "select" && table === "posts") {
        if (meta.selectKeys.includes("authorUsername"))
          return [deleted, edited];
        return [deleted];
      }
      return [];
    };
    const res = await app.request("/api/socials/posts?limit=10");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.posts[0].status).toBe("deleted");
    expect(body.posts[0].text_content).toBe("");
    expect(body.posts[1].status).toBe("complete");
    expect(body.posts[1].edited_at).toBe("2026-10-21T09:00:00.000Z");
  });

  test("liking a deleted post is a readable error and writes nothing", async () => {
    const deleted = postRow({ deletedAt: new Date() });
    impl = (op, table) => {
      if (op === "select" && table === "posts") return [deleted];
      return [];
    };
    const res = await app.request(
      "/api/socials/analytics/likes",
      jsonReq("POST", { postId: POST, actionType: "like" })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/deleted/i);
    expect(insertValues("postLikes")).toHaveLength(0);
    expect(insertValues("notifications")).toHaveLength(0);
  });

  test("viewing a deleted post returns the frozen count, no ledger write", async () => {
    impl = (op, table, meta) => {
      if (op === "select" && table === "posts")
        return [{ id: POST, viewCount: 7, deletedAt: new Date() }];
      return [];
    };
    const res = await app.request(
      "/api/socials/analytics/post-views",
      jsonReq("POST", { post_id: POST })
    );
    expect(res.status).toBe(200);
    expect((await res.json()).view_count).toBe(7);
    expect(insertValues("postViews")).toHaveLength(0);
    expect(updateSets("posts")).toHaveLength(0);
  });

  test("replying to a deleted post is a readable error", async () => {
    const deleted = postRow({ deletedAt: new Date() });
    impl = (op, table, meta) => {
      if (op === "select" && table === "posts") return [deleted];
      if (op === "select" && table === "profiles") return [profileRow];
      return [];
    };
    const res = await app.request(
      "/api/socials/posts",
      jsonReq("POST", {
        replying_to: POST,
        posts: [{ post_editor_state: editorStateWithMentions([]), media: [] }],
      })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/deleted/i);
    expect(insertValues("comments")).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Q23: @mention notifications
// ---------------------------------------------------------------------------
describe("Q23: mention notifications on create", () => {
  const createImpl =
    (mentionProfiles: any[], followRows: any[] = []) =>
    (op: string, table: string, meta: { selectKeys: string[] }): any[] => {
      if (op === "select" && table === "profiles") {
        if (meta.selectKeys.includes("mentionPermission"))
          return mentionProfiles;
        return [profileRow];
      }
      if (op === "select" && table === "follows") return followRows;
      if (op === "insert" && table === "posts") {
        const values = insertValues("posts").slice(-1)[0] || {};
        return [
          postRow({
            id: POST,
            authorId: ME,
            body: values.body ?? "x",
            likeCount: 0,
            commentCount: 0,
            viewCount: 0,
            mediaUrls: values.mediaUrls ?? null,
          }),
        ];
      }
      return [];
    };

  const createPost = (state: any) =>
    app.request(
      "/api/socials/posts",
      jsonReq("POST", { posts: [{ post_editor_state: state, media: [] }] })
    );

  test("a mentioned user gets a mention_in_post notification", async () => {
    impl = createImpl([{ userId: PEER, mentionPermission: "everyone" }]);
    const res = await createPost(editorStateWithMentions([PEER]));
    expect(res.status).toBe(201);
    const notifs = insertValues("notifications");
    expect(notifs).toHaveLength(1);
    expect(notifs[0]).toMatchObject({
      userId: PEER,
      type: "mention_in_post",
      actorId: ME,
      postId: POST,
    });
  });

  test("mention notifications cap at the first 20 unique mentions", async () => {
    const ids = Array.from({ length: 25 }, (_, i) => `user-cap-${i + 1}`);
    impl = createImpl(
      ids.map((userId) => ({ userId, mentionPermission: "everyone" }))
    );
    const res = await createPost(editorStateWithMentions(ids));
    expect(res.status).toBe(201);
    const notifs = insertValues("notifications");
    expect(notifs).toHaveLength(MAX_MENTION_NOTIFICATIONS);
    expect(notifs.map((n) => n.userId)).toEqual(
      ids.slice(0, MAX_MENTION_NOTIFICATIONS)
    );
    expect(notifs.map((n) => n.userId)).not.toContain(ids[24]);
  });

  test("mentioning yourself notifies nobody", async () => {
    impl = createImpl([{ userId: ME, mentionPermission: "everyone" }]);
    const res = await createPost(editorStateWithMentions([ME]));
    expect(res.status).toBe(201);
    expect(insertValues("notifications")).toHaveLength(0);
  });

  test("mentioning a nonexistent user notifies nobody", async () => {
    impl = createImpl([]);
    const res = await createPost(editorStateWithMentions(["user-ghost-9"]));
    expect(res.status).toBe(201);
    expect(insertValues("notifications")).toHaveLength(0);
  });

  test("mention_permission 'no_one' is respected", async () => {
    impl = createImpl([{ userId: PEER, mentionPermission: "no_one" }]);
    const res = await createPost(editorStateWithMentions([PEER]));
    expect(res.status).toBe(201);
    expect(insertValues("notifications")).toHaveLength(0);
  });

  test("mention_permission 'followers' requires the follow edge", async () => {
    impl = createImpl([{ userId: PEER, mentionPermission: "followers" }], []);
    let res = await createPost(editorStateWithMentions([PEER]));
    expect(res.status).toBe(201);
    expect(insertValues("notifications")).toHaveLength(0);

    calls.length = 0;
    impl = createImpl(
      [{ userId: PEER, mentionPermission: "followers" }],
      [{ followerId: PEER, followingId: ME }]
    );
    res = await createPost(editorStateWithMentions([PEER]));
    expect(res.status).toBe(201);
    expect(insertValues("notifications")).toHaveLength(1);
  });

  test("a reply notifies its mentions too (post_reply + mention)", async () => {
    const parent = postRow(); // authored by PEER
    impl = (op, table, meta) => {
      if (op === "select" && table === "posts") return [parent];
      if (op === "select" && table === "profiles") {
        if (meta.selectKeys.includes("mentionPermission"))
          return [{ userId: THIRD, mentionPermission: "everyone" }];
        return [profileRow];
      }
      if (op === "select" && table === "follows") return [];
      if (op === "insert" && table === "comments") {
        const values = insertValues("comments").slice(-1)[0] || {};
        return [commentRow({ body: values.body ?? "x" })];
      }
      return [];
    };
    const res = await app.request(
      "/api/socials/posts",
      jsonReq("POST", {
        replying_to: POST,
        posts: [
          { post_editor_state: editorStateWithMentions([THIRD]), media: [] },
        ],
      })
    );
    expect(res.status).toBe(201);
    const notifs = insertValues("notifications");
    expect(notifs.map((n) => n.type).sort()).toEqual([
      "mention_in_post",
      "post_reply",
    ]);
    const mention = notifs.find((n) => n.type === "mention_in_post");
    expect(mention).toMatchObject({ userId: THIRD, postId: POST, actorId: ME });
  });

  test("editing a post notifies only NEW mentions (no re-ping)", async () => {
    const existing = postRow({
      authorId: ME,
      body: JSON.stringify(editorStateWithMentions([PEER])),
    });
    impl = (op, table, meta) => {
      if (op === "select" && table === "posts") return [existing];
      if (op === "update" && table === "posts") {
        const set = updateSets("posts").slice(-1)[0] || {};
        return [{ ...existing, ...set }];
      }
      if (op === "select" && table === "profiles")
        return [
          { userId: PEER, mentionPermission: "everyone" },
          { userId: THIRD, mentionPermission: "everyone" },
        ];
      if (op === "select" && table === "follows") return [];
      if (op === "select" && table === "notifications")
        return [{ userId: PEER }];
      return [];
    };
    const res = await app.request(
      `/api/socials/posts/${POST}`,
      jsonReq("PATCH", {
        post_editor_state: editorStateWithMentions([PEER, THIRD]),
      })
    );
    expect(res.status).toBe(200);
    const notifs = insertValues("notifications");
    expect(notifs).toHaveLength(1);
    expect(notifs[0]).toMatchObject({ userId: THIRD, type: "mention_in_post" });
  });
});

// ---------------------------------------------------------------------------
// Q12/Q13: reply edit/delete endpoints
// ---------------------------------------------------------------------------
describe("Q12/Q13: /socials/comments/:id edit + delete", () => {
  test("comment routes are registered", () => {
    const paths = app.routes.map(
      (r: { method: string; path: string }) => `${r.method} ${r.path}`
    );
    expect(paths).toContain("PATCH /api/socials/comments/:id");
    expect(paths).toContain("DELETE /api/socials/comments/:id");
  });

  const commentImpl =
    (comment: any, parent: any = postRow()) =>
    (op: string, table: string): any[] => {
      if (op === "select" && table === "comments") return [comment];
      if (op === "select" && table === "posts") return [parent];
      if (op === "update" && table === "comments") {
        const set = updateSets("comments").slice(-1)[0] || {};
        return [{ ...comment, ...set }];
      }
      return [];
    };

  test("author edits inside the window; edited_at is stamped", async () => {
    impl = commentImpl(commentRow());
    const res = await app.request(
      `/api/socials/comments/${COMMENT}`,
      jsonReq("PATCH", { text: "fixed typo" })
    );
    expect(res.status).toBe(200);
    const set = updateSets("comments")[0];
    expect(set.editedAt).toBeInstanceOf(Date);
    expect(set.body).toContain("fixed typo");
    const body = await res.json();
    expect(body.posts[0].text_content).toBe("fixed typo");
    expect(body.posts[0].edited_at).toBeTruthy();
    expect(body.posts[0].parent_post._id).toBe(POST);
  });

  test("reply edit after 15 minutes is rejected readably", async () => {
    impl = commentImpl(commentRow({ createdAt: STALE() }));
    const res = await app.request(
      `/api/socials/comments/${COMMENT}`,
      jsonReq("PATCH", { text: "too late" })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).message).toBe(
      "Replies can only be edited within 15 minutes"
    );
    expect(updateSets("comments")).toHaveLength(0);
  });

  test("someone else's reply is 403", async () => {
    impl = commentImpl(commentRow({ authorId: PEER }));
    const res = await app.request(
      `/api/socials/comments/${COMMENT}`,
      jsonReq("PATCH", { text: "not mine" })
    );
    expect(res.status).toBe(403);
    expect(updateSets("comments")).toHaveLength(0);
  });

  test("editing a deleted reply is a readable error", async () => {
    impl = commentImpl(commentRow({ deletedAt: new Date() }));
    const res = await app.request(
      `/api/socials/comments/${COMMENT}`,
      jsonReq("PATCH", { text: "revive" })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/deleted/i);
  });

  test("reply edit with a javascript: link is sanitized (Q1 guard)", async () => {
    impl = commentImpl(commentRow());
    const evil = {
      root: {
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: "javascript:alert(1)",
                children: [{ type: "text", text: "click" }],
              },
            ],
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    };
    const res = await app.request(
      `/api/socials/comments/${COMMENT}`,
      jsonReq("PATCH", { post_editor_state: evil })
    );
    expect(res.status).toBe(200);
    expect(updateSets("comments")[0].body).not.toContain("javascript:");
    expect(updateSets("comments")[0].body).toContain("click");
  });

  test("a mention added by a reply edit notifies (onlyNew)", async () => {
    const comment = commentRow();
    impl = (op, table, meta) => {
      if (op === "select" && table === "comments") return [comment];
      if (op === "select" && table === "posts") return [postRow()];
      if (op === "update" && table === "comments") {
        const set = updateSets("comments").slice(-1)[0] || {};
        return [{ ...comment, ...set }];
      }
      if (op === "select" && table === "profiles")
        return [{ userId: THIRD, mentionPermission: "everyone" }];
      if (op === "select" && table === "follows") return [];
      if (op === "select" && table === "notifications") return [];
      return [];
    };
    const res = await app.request(
      `/api/socials/comments/${COMMENT}`,
      jsonReq("PATCH", {
        post_editor_state: editorStateWithMentions([THIRD]),
      })
    );
    expect(res.status).toBe(200);
    const notifs = insertValues("notifications");
    expect(notifs).toHaveLength(1);
    expect(notifs[0]).toMatchObject({
      userId: THIRD,
      type: "mention_in_post",
      postId: POST,
      actorId: ME,
    });
  });

  test("author deletes → soft-delete tombstone, row survives", async () => {
    impl = commentImpl(commentRow({ body: "regretted words" }));
    const res = await app.request(`/api/socials/comments/${COMMENT}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(200);
    expect(deleteOps("comments")).toHaveLength(0);
    expect(updateSets("comments")[0].deletedAt).toBeInstanceOf(Date);
    const body = await res.json();
    expect(body.deleted).toBe(true);
    expect(body.posts[0].status).toBe("deleted");
    expect(body.posts[0].text_content).toBe("");
    expect(JSON.stringify(body)).not.toContain("regretted words");
  });

  test("someone else's reply cannot be deleted", async () => {
    impl = commentImpl(commentRow({ authorId: PEER }));
    const res = await app.request(`/api/socials/comments/${COMMENT}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(403);
    expect(updateSets("comments")).toHaveLength(0);
  });

  test("replies list shows deleted replies as stubs and edited marks", async () => {
    const parent = postRow();
    const deletedReply = commentRow({
      body: "gone",
      deletedAt: new Date(),
      authorId: PEER,
      authorName: "Peer Person",
    });
    const editedReply = commentRow({
      id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      body: "kept",
      editedAt: new Date("2026-10-21T08:00:00Z"),
      authorId: PEER,
      authorName: "Peer Person",
    });
    impl = (op, table, meta) => {
      if (op === "select" && table === "posts") return [parent];
      if (op === "select" && table === "comments") {
        if (meta.selectKeys.length <= 2) return [deletedReply];
        return [deletedReply, editedReply];
      }
      return [];
    };
    const res = await app.request(`/api/socials/posts/${POST}/replies`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.posts[0].status).toBe("deleted");
    expect(body.posts[0].text_content).toBe("");
    expect(body.posts[1].status).toBe("complete");
    expect(body.posts[1].edited_at).toBe("2026-10-21T08:00:00.000Z");
  });
});
