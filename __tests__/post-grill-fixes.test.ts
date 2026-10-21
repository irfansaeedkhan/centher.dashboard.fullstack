/**
 * @jest-environment node
 *
 * Post-grill regression tests (sweep scope #3 — post detail page):
 *  - Q3: reply payload guards — media on a reply and multi-item reply
 *    payloads are rejected readably instead of silently dropped /
 *    fanned out into sibling comments.
 *  - Q12: notifications carry the reply id (comment_id); the mention
 *    edit-dedupe is scoped per comment, not per post.
 *  - Q15: mapPostRow surfaces is_archived so an archived post stops
 *    rendering as a live one on its own detail page.
 *  - Q1 (server contract): a created reply returns the fully mapped
 *    comment (parent_post attached) that the client now consumes
 *    directly — no posts-endpoint refetch.
 *
 * Same harness as feed-product-calls.test.ts: recording mock DB + the
 * real Hono app via app.request.
 */
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://mock:mock@localhost/mock";

import { notifications } from "@/db/schema";

// ---------------------------------------------------------------------------
// Recording mock DB (routes use the drizzle chaining API; we record ops).
// ---------------------------------------------------------------------------
type Call = { op: string; method: string; table: string; args?: any[] };

import {
  posts,
  comments,
  profiles,
  postLikes,
  postViews,
  follows,
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
const OTHER_COMMENT = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const CLOUD_IMG = "https://res.cloudinary.com/demo/image/upload/v1/pic.jpg";

const FRESH = () => new Date();

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

const textState = (text: string) => ({
  root: {
    children: [
      {
        type: "paragraph",
        children: [{ type: "text", text }],
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
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

/** Reply-create impl: parent post by PEER, author profile for ME. */
const replyImpl: RowsFor = (op, table, meta) => {
  if (op === "select" && table === "posts") return [postRow()];
  if (op === "select" && table === "profiles") {
    if (meta.selectKeys.includes("mentionPermission")) return [];
    return [profileRow];
  }
  if (op === "select" && table === "follows") return [];
  if (op === "insert" && table === "comments") {
    const values = insertValues("comments").slice(-1)[0] || {};
    return [commentRow({ body: values.body ?? "x" })];
  }
  return [];
};

beforeEach(() => {
  calls.length = 0;
  impl = () => [];
  asUser(ME);
});

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
describe("schema: post-grill columns", () => {
  test("notifications carries comment_id", () => {
    expect((notifications as any).commentId).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Q3: reply payload guards
// ---------------------------------------------------------------------------
describe("Q3: POST /socials/posts reply guards", () => {
  const postReply = (items: any[]) =>
    app.request(
      "/api/socials/posts",
      jsonReq("POST", { replying_to: POST, posts: items })
    );

  test("a reply carrying media is rejected readably — nothing is inserted", async () => {
    impl = replyImpl;
    const res = await postReply([
      {
        post_editor_state: textState("with pic"),
        media: [{ object_name: CLOUD_IMG, type: "image/png" }],
      },
    ]);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("REPLY_MEDIA_UNSUPPORTED");
    expect(body.message).toMatch(/media/i);
    expect(insertValues("comments")).toHaveLength(0);
  });

  test("a multi-item reply payload is rejected — no sibling comments", async () => {
    impl = replyImpl;
    const res = await postReply([
      { post_editor_state: textState("one"), media: [] },
      { post_editor_state: textState("two"), media: [] },
    ]);
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("REPLY_SINGLE_ONLY");
    expect(insertValues("comments")).toHaveLength(0);
  });

  test("a media slot with an empty object_name (text-only fallback) still posts", async () => {
    impl = replyImpl;
    const res = await postReply([
      {
        post_editor_state: textState("just text"),
        media: [{ object_name: "", type: "image/png" }],
      },
    ]);
    expect(res.status).toBe(201);
    expect(insertValues("comments")).toHaveLength(1);
  });

  test("Q1 contract: the created reply returns fully mapped, parent attached", async () => {
    impl = replyImpl;
    const res = await postReply([
      { post_editor_state: textState("hello parent"), media: [] },
    ]);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.posts).toHaveLength(1);
    expect(body.posts[0]._id).toBe(COMMENT);
    expect(body.posts[0].parent_post._id).toBe(POST);
    expect(body.posts[0].text_content).toBe("hello parent");
  });
});

// ---------------------------------------------------------------------------
// Q12: comment anchors on notifications + per-comment mention dedupe
// ---------------------------------------------------------------------------
describe("Q12: notification comment anchors", () => {
  test("reply create: post_reply AND mention notifications carry the comment id", async () => {
    impl = (op, table, meta) => {
      if (op === "select" && table === "posts") return [postRow()];
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
    const postReply = notifs.find((n) => n.type === "post_reply");
    const mention = notifs.find((n) => n.type === "mention_in_post");
    expect(postReply).toMatchObject({ userId: PEER, commentId: COMMENT });
    expect(mention).toMatchObject({ userId: THIRD, commentId: COMMENT });
  });

  test("GET /notifications returns comment_id for the deep link", async () => {
    impl = (op, table) => {
      if (op === "select" && table === "notifications") {
        return [
          {
            id: "notif-1",
            type: "mention_in_post",
            status: "unread",
            createdAt: FRESH(),
            postId: POST,
            commentId: COMMENT,
            actorId: PEER,
            actorName: "Peer Person",
            actorAvatar: null,
            actorMembership: "citizen",
          },
        ];
      }
      return [];
    };
    const res = await app.request("/api/notifications");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.notifications[0].comment_id).toBe(COMMENT);
    expect(body.notifications[0].post._id).toBe(POST);
  });
});

describe("Q12: mention edit-dedupe is scoped per comment", () => {
  /**
   * The mock DB can't evaluate drizzle where-clauses, so the impl
   * plays the part of a real DB: it inspects the dedupe query the
   * handler actually built. If the query is scoped to THIS comment,
   * an existing mention notification from a DIFFERENT comment does
   * not match (returns []); the same-comment case returns the row.
   */
  const deepContains = (
    value: any,
    needle: string,
    seen = new Set<any>()
  ): boolean => {
    if (typeof value === "string") return value.includes(needle);
    if (!value || typeof value !== "object") return false;
    if (seen.has(value)) return false;
    seen.add(value);
    const parts = Array.isArray(value) ? value : Object.values(value);
    return parts.some((v) => deepContains(v, needle, seen));
  };

  const dedupeScopedToThisComment = () => {
    const whereCalls = calls.filter(
      (c) =>
        c.op === "select" && c.table === "notifications" && c.method === "where"
    );
    const last = whereCalls[whereCalls.length - 1];
    if (!last) return false;
    // The where-clause references the comment_id column (and the value).
    return (
      deepContains(last.args, "comment_id") && deepContains(last.args, COMMENT)
    );
  };

  const editImpl =
    (existingNotif: "other-comment" | "this-comment" | "none") =>
    (op: string, table: string, meta: { selectKeys: string[] }): any[] => {
      if (op === "select" && table === "comments") return [commentRow()];
      if (op === "select" && table === "posts") return [postRow()];
      if (op === "update" && table === "comments") return [commentRow()];
      if (op === "select" && table === "profiles") {
        if (meta.selectKeys.includes("mentionPermission"))
          return [{ userId: PEER, mentionPermission: "everyone" }];
        return [profileRow];
      }
      if (op === "select" && table === "follows") return [];
      if (op === "select" && table === "notifications") {
        if (existingNotif === "none") return [];
        if (!dedupeScopedToThisComment()) {
          // Unscoped (post-level) query matches ANY prior mention of
          // PEER by ME on this post — the old, buggy behavior.
          return [{ userId: PEER }];
        }
        // Scoped: only a notification for THIS comment matches.
        return existingNotif === "this-comment" ? [{ userId: PEER }] : [];
      }
      return [];
    };

  const editReplyMentioningPeer = () =>
    app.request(
      `/api/socials/comments/${COMMENT}`,
      jsonReq("PATCH", {
        post_editor_state: editorStateWithMentions([PEER]),
      })
    );

  test("a mention of the same person in a DIFFERENT reply still notifies", async () => {
    impl = editImpl("other-comment");
    const res = await editReplyMentioningPeer();
    expect(res.status).toBe(200);
    const notifs = insertValues("notifications");
    expect(notifs).toHaveLength(1);
    expect(notifs[0]).toMatchObject({
      userId: PEER,
      type: "mention_in_post",
      postId: POST,
      commentId: COMMENT,
      actorId: ME,
    });
  });

  test("re-editing the SAME reply does not re-ping its mentions", async () => {
    impl = editImpl("this-comment");
    const res = await editReplyMentioningPeer();
    expect(res.status).toBe(200);
    expect(insertValues("notifications")).toHaveLength(0);
  });

  test("OTHER_COMMENT fixture sanity: ids differ", () => {
    expect(OTHER_COMMENT).not.toBe(COMMENT);
  });
});

// ---------------------------------------------------------------------------
// Q15: archived posts surface is_archived
// ---------------------------------------------------------------------------
describe("Q15: GET /socials/posts/:id archived surfacing", () => {
  test("the owner's archived post maps is_archived=true (not live)", async () => {
    impl = (op, table) => {
      if (op === "select" && table === "posts")
        return [postRow({ isArchived: true, authorId: ME })];
      return [];
    };
    const res = await app.request(`/api/socials/posts/${POST}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.posts[0].is_archived).toBe(true);
    expect(body.posts[0].status).toBe("complete");
  });

  test("a live post maps is_archived=false", async () => {
    impl = (op, table) => {
      if (op === "select" && table === "posts")
        return [postRow({ isArchived: false, authorId: ME })];
      return [];
    };
    const res = await app.request(`/api/socials/posts/${POST}`);
    expect(res.status).toBe(200);
    expect((await res.json()).posts[0].is_archived).toBe(false);
  });

  test("an archived post stays invisible to non-owners", async () => {
    asUser(THIRD);
    impl = (op, table) => {
      if (op === "select" && table === "posts")
        return [postRow({ isArchived: true, authorId: ME })];
      return [];
    };
    const res = await app.request(`/api/socials/posts/${POST}`);
    expect(res.status).toBe(404);
  });
});
