/**
 * @jest-environment node
 *
 * Nested replies + real reply likes (post-grill follow-up, Irfan
 * approved 2026-10-21; design §3.10 test plan items 1–10 + 15):
 *  - Create: `replying_to` resolves post-first, then comment; nested
 *    inserts carry the true parent, bump BOTH counters, and notify per
 *    §3.5 (comment_reply to the parent author; post_reply only when
 *    distinct; mentions anchored to the new reply).
 *  - Guards: tombstoned parent comment/post, archived post, unknown id,
 *    REPLY_SINGLE_ONLY / REPLY_MEDIA_UNSUPPORTED at any depth.
 *  - Retrieval: the flat replies stream + user-replies list carry
 *    parent_comment_id, real likes_count / direct replies_count,
 *    parent_comment_author, and with-auth liked state from
 *    comment_likes.
 *  - Comment likes: insert-gated notification, recount maintenance,
 *    tombstone/archived gates — a line-for-line twin of post likes.
 *  - Migration 0012 is additive + idempotent (file contract; the
 *    real-Neon application was verified separately with a no-op
 *    second run).
 *
 * Same harness as post-grill-fixes.test.ts: recording mock DB + the
 * real Hono app via app.request.
 */
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://u:p@localhost:5432/db";

import * as fs from "fs";
import * as path from "path";
import {
  posts,
  comments,
  commentLikes,
  profiles,
  postLikes,
  postViews,
  follows,
  notifications,
  user,
} from "@/db/schema";

type Call = { op: string; method: string; table: string; args?: any[] };

const tableName = (t: any): string => {
  if (t === posts) return "posts";
  if (t === comments) return "comments";
  if (t === commentLikes) return "commentLikes";
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
const PEER = "user-peer-2"; // post author
const THIRD = "user-third-3"; // parent comment author
const FOURTH = "user-fourth-4"; // mentioned user
const POST = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const COMMENT = "ffffffff-ffff-4fff-8fff-ffffffffffff";
const CHILD = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const NEW_REPLY = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const UNKNOWN = "99999999-9999-4999-8999-999999999999";

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
  authorId: THIRD,
  authorName: "Third Person",
  authorAvatar: null,
  membership: "citizen",
  editedAt: null,
  deletedAt: null,
  parentCommentId: null,
  likeCount: 0,
  replyCount: 0,
  ...over,
});

const editorState = (text: string) => ({
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
            text: "@Mentioned",
          })),
        ],
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

// One update statement = one `.set(...)` call on the table's chain
// (the recording proxy also logs `.where(...)` under the same op).
const updateOps = (table: string) =>
  calls.filter(
    (c) => c.op === "update" && c.method === "set" && c.table === table
  );
const deleteOps = (table: string) =>
  calls.filter((c) => c.op === "delete" && c.table === table);

/**
 * Create-flow impl: the FIRST posts select (resolving `replying_to`)
 * returns `firstPostSelect`; later posts selects return [post]. The
 * comments select is fetchCommentRow → [parentComment] (or [] via
 * parentComment === null).
 */
const createImpl = (opts: {
  firstPostSelect: any[];
  post: any;
  parentComment: any | null;
  mentionProfiles?: any[];
}) => {
  let postSelects = 0;
  return (op: string, table: string, meta: { selectKeys: string[] }) => {
    if (op === "select" && table === "posts") {
      postSelects += 1;
      return postSelects === 1 ? opts.firstPostSelect : [opts.post];
    }
    if (op === "select" && table === "comments") {
      return opts.parentComment ? [opts.parentComment] : [];
    }
    if (op === "select" && table === "profiles") {
      if (meta.selectKeys.includes("mentionPermission"))
        return opts.mentionProfiles ?? [];
      return [profileRow];
    }
    if (op === "select" && table === "follows") return [];
    if (op === "insert" && table === "comments") {
      const values = insertValues("comments").slice(-1)[0] || {};
      return [
        commentRow({
          id: NEW_REPLY,
          body: values.body ?? "x",
          authorId: ME,
          authorName: "Me Myself",
          parentCommentId: values.parentCommentId ?? null,
        }),
      ];
    }
    return [];
  };
};

beforeEach(() => {
  calls.length = 0;
  impl = () => [];
  asUser(ME);
});

// ---------------------------------------------------------------------------
// Create / nesting (design §3.10 items 1–6)
// ---------------------------------------------------------------------------
describe("nested reply create", () => {
  test("1. replying_to a comment → 201, true parent stored, both counters bumped, §3.5 notifications", async () => {
    impl = createImpl({
      firstPostSelect: [],
      post: postRow(),
      parentComment: commentRow(),
    });
    const res = await app.request(
      "/api/socials/posts",
      jsonReq("POST", {
        replying_to: COMMENT,
        posts: [{ post_editor_state: editorState("nested hi"), media: [] }],
      })
    );
    expect(res.status).toBe(201);

    const values = insertValues("comments").slice(-1)[0];
    expect(values.postId).toBe(POST);
    expect(values.parentCommentId).toBe(COMMENT);

    // Post counter (all depths) + parent comment counter (direct).
    expect(updateOps("posts")).toHaveLength(1);
    expect(updateOps("comments")).toHaveLength(1);

    const notifs = insertValues("notifications");
    const commentReply = notifs.find((n) => n.type === "comment_reply");
    const postReply = notifs.find((n) => n.type === "post_reply");
    expect(commentReply).toMatchObject({
      userId: THIRD,
      postId: POST,
      commentId: NEW_REPLY,
    });
    // Post author is distinct from parent author + actor → also pinged.
    expect(postReply).toMatchObject({
      userId: PEER,
      postId: POST,
      commentId: NEW_REPLY,
    });
    expect(notifs).toHaveLength(2);

    const body = await res.json();
    expect(body.posts[0]._id).toBe(NEW_REPLY);
    expect(body.posts[0].parent_comment_id).toBe(COMMENT);
    expect(body.posts[0].parent_comment_author).toMatchObject({
      _id: THIRD,
      display_name: "Third Person",
    });
  });

  test("2. replying_to a post → unchanged top-level behavior (regression pin)", async () => {
    impl = createImpl({
      firstPostSelect: [postRow()],
      post: postRow(),
      parentComment: null,
    });
    const res = await app.request(
      "/api/socials/posts",
      jsonReq("POST", {
        replying_to: POST,
        posts: [{ post_editor_state: editorState("top level"), media: [] }],
      })
    );
    expect(res.status).toBe(201);
    const values = insertValues("comments").slice(-1)[0];
    expect(values.parentCommentId).toBeNull();
    // No parent comment → no comment-counter update.
    expect(updateOps("comments")).toHaveLength(0);
    const notifs = insertValues("notifications");
    expect(notifs).toHaveLength(1);
    expect(notifs[0]).toMatchObject({ type: "post_reply", userId: PEER });
    const body = await res.json();
    expect(body.posts[0].parent_comment_id).toBeNull();
  });

  test("3a. replying_to a tombstoned comment → 400 REPLY_DELETED, nothing inserted", async () => {
    impl = createImpl({
      firstPostSelect: [],
      post: postRow(),
      parentComment: commentRow({ deletedAt: new Date() }),
    });
    const res = await app.request(
      "/api/socials/posts",
      jsonReq("POST", {
        replying_to: COMMENT,
        posts: [{ post_editor_state: editorState("too late"), media: [] }],
      })
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("REPLY_DELETED");
    expect(body.message).toMatch(/deleted/i);
    expect(insertValues("comments")).toHaveLength(0);
  });

  test("3b. replying_to a comment under a tombstoned post → 400 POST_DELETED", async () => {
    impl = createImpl({
      firstPostSelect: [],
      post: postRow({ deletedAt: new Date() }),
      parentComment: commentRow(),
    });
    const res = await app.request(
      "/api/socials/posts",
      jsonReq("POST", {
        replying_to: COMMENT,
        posts: [{ post_editor_state: editorState("too late"), media: [] }],
      })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("POST_DELETED");
    expect(insertValues("comments")).toHaveLength(0);
  });

  test("3c. replying_to a comment under an archived post (non-owner) → 404", async () => {
    impl = createImpl({
      firstPostSelect: [],
      post: postRow({ isArchived: true }),
      parentComment: commentRow(),
    });
    const res = await app.request(
      "/api/socials/posts",
      jsonReq("POST", {
        replying_to: COMMENT,
        posts: [{ post_editor_state: editorState("hidden"), media: [] }],
      })
    );
    expect(res.status).toBe(404);
    expect(insertValues("comments")).toHaveLength(0);
  });

  test("3d. replying_to an unknown id → 404 Parent post not found", async () => {
    impl = createImpl({
      firstPostSelect: [],
      post: postRow(),
      parentComment: null,
    });
    const res = await app.request(
      "/api/socials/posts",
      jsonReq("POST", {
        replying_to: UNKNOWN,
        posts: [{ post_editor_state: editorState("nobody"), media: [] }],
      })
    );
    expect(res.status).toBe(404);
    expect((await res.json()).message).toBe("Parent post not found");
    expect(insertValues("comments")).toHaveLength(0);
  });

  test("4. depth is uncapped: replying to a depth-3 comment succeeds", async () => {
    impl = createImpl({
      firstPostSelect: [],
      post: postRow(),
      // The parent comment is itself nested two levels deep.
      parentComment: commentRow({ parentCommentId: CHILD }),
    });
    const res = await app.request(
      "/api/socials/posts",
      jsonReq("POST", {
        replying_to: COMMENT,
        posts: [{ post_editor_state: editorState("deep"), media: [] }],
      })
    );
    expect(res.status).toBe(201);
    expect(insertValues("comments").slice(-1)[0].parentCommentId).toBe(COMMENT);
  });

  test("5a. REPLY_SINGLE_ONLY fires for nested creates too", async () => {
    impl = createImpl({
      firstPostSelect: [],
      post: postRow(),
      parentComment: commentRow(),
    });
    const res = await app.request(
      "/api/socials/posts",
      jsonReq("POST", {
        replying_to: COMMENT,
        posts: [
          { post_editor_state: editorState("one"), media: [] },
          { post_editor_state: editorState("two"), media: [] },
        ],
      })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("REPLY_SINGLE_ONLY");
    expect(insertValues("comments")).toHaveLength(0);
  });

  test("5b. REPLY_MEDIA_UNSUPPORTED fires for nested creates too", async () => {
    impl = createImpl({
      firstPostSelect: [],
      post: postRow(),
      parentComment: commentRow(),
    });
    const res = await app.request(
      "/api/socials/posts",
      jsonReq("POST", {
        replying_to: COMMENT,
        posts: [
          {
            post_editor_state: editorState("with pic"),
            media: [
              {
                object_name:
                  "https://res.cloudinary.com/demo/image/upload/v1/pic.jpg",
                type: "image/jpeg",
              },
            ],
          },
        ],
      })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("REPLY_MEDIA_UNSUPPORTED");
    expect(insertValues("comments")).toHaveLength(0);
  });

  test("6a. post author == parent comment author → exactly one ping (comment_reply)", async () => {
    impl = createImpl({
      firstPostSelect: [],
      post: postRow({ authorId: THIRD }),
      parentComment: commentRow(),
    });
    const res = await app.request(
      "/api/socials/posts",
      jsonReq("POST", {
        replying_to: COMMENT,
        posts: [{ post_editor_state: editorState("hi"), media: [] }],
      })
    );
    expect(res.status).toBe(201);
    const notifs = insertValues("notifications");
    expect(notifs).toHaveLength(1);
    expect(notifs[0]).toMatchObject({ type: "comment_reply", userId: THIRD });
  });

  test("6b. actor == parent comment author → no self-ping; post author still gets post_reply", async () => {
    asUser(THIRD);
    impl = createImpl({
      firstPostSelect: [],
      post: postRow(),
      parentComment: commentRow(),
    });
    const res = await app.request(
      "/api/socials/posts",
      jsonReq("POST", {
        replying_to: COMMENT,
        posts: [{ post_editor_state: editorState("self reply"), media: [] }],
      })
    );
    expect(res.status).toBe(201);
    const notifs = insertValues("notifications");
    expect(notifs).toHaveLength(1);
    expect(notifs[0]).toMatchObject({ type: "post_reply", userId: PEER });
  });

  test("6c. a mention inside a nested reply notifies, anchored to the new reply", async () => {
    impl = createImpl({
      firstPostSelect: [],
      post: postRow(),
      parentComment: commentRow(),
      mentionProfiles: [{ userId: FOURTH, mentionPermission: "everyone" }],
    });
    const res = await app.request(
      "/api/socials/posts",
      jsonReq("POST", {
        replying_to: COMMENT,
        posts: [
          {
            post_editor_state: editorStateWithMentions([FOURTH]),
            media: [],
          },
        ],
      })
    );
    expect(res.status).toBe(201);
    const mention = insertValues("notifications").find(
      (n) => n.type === "mention_in_post"
    );
    expect(mention).toMatchObject({
      userId: FOURTH,
      postId: POST,
      commentId: NEW_REPLY,
    });
  });
});

// ---------------------------------------------------------------------------
// Retrieval / mapping (design §3.10 items 7–8)
// ---------------------------------------------------------------------------
describe("replies retrieval carries the nested fields", () => {
  const listRows = [
    commentRow({
      id: CHILD,
      authorId: ME,
      authorName: "Me Myself",
      parentCommentId: COMMENT,
      likeCount: 5,
      replyCount: 2,
      createdAt: new Date("2026-10-21T10:00:00Z"),
    }),
    commentRow({
      id: COMMENT,
      likeCount: 1,
      replyCount: 1,
      createdAt: new Date("2026-10-21T09:00:00Z"),
    }),
  ];

  const listImpl =
    (likedRows: any[]) =>
    (op: string, table: string, meta: { selectKeys: string[] }) => {
      if (op === "select" && table === "posts") return [postRow()];
      if (op === "select" && table === "comments") {
        if (meta.selectKeys.includes("parentPostId")) return listRows;
        if (meta.selectKeys.includes("parentCommentId")) return listRows;
        // Parent-author batch lookup: exactly {id, authorId, authorName}.
        if (meta.selectKeys.length === 3)
          return [{ id: COMMENT, authorId: THIRD, authorName: "Third Person" }];
        return [];
      }
      if (op === "select" && table === "commentLikes") return likedRows;
      return [];
    };

  test("7a. plain replies list: parent id, real counts, parent author; no liked state", async () => {
    impl = listImpl([]);
    const res = await app.request(`/api/socials/posts/${POST}/replies`);
    expect(res.status).toBe(200);
    const body = await res.json();
    const child = body.posts.find((p: any) => p._id === CHILD);
    const parent = body.posts.find((p: any) => p._id === COMMENT);
    expect(child.parent_comment_id).toBe(COMMENT);
    expect(child.likes_count).toBe(5);
    expect(child.replies_count).toBe(2);
    expect(child.parent_comment_author).toMatchObject({
      _id: THIRD,
      display_name: "Third Person",
    });
    expect(child.liked_by_loggedin_user).toBe(false);
    expect(parent.parent_comment_id).toBeNull();
    expect(parent.parent_comment_author).toBeNull();
    expect(parent.likes_count).toBe(1);
    expect(parent.replies_count).toBe(1);
  });

  test("7b. with-auth replies list: liked state comes from comment_likes", async () => {
    impl = listImpl([{ commentId: CHILD }]);
    const res = await app.request(
      `/api/socials/posts/${POST}/replies/with-auth`
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    const child = body.posts.find((p: any) => p._id === CHILD);
    const parent = body.posts.find((p: any) => p._id === COMMENT);
    expect(child.liked_by_loggedin_user).toBe(true);
    expect(parent.liked_by_loggedin_user).toBe(false);
  });

  test("8. user-replies list carries the same fields + the viewer's liked state", async () => {
    impl = listImpl([{ commentId: CHILD }]);
    const res = await app.request(`/api/socials/posts/user/replies`);
    expect(res.status).toBe(200);
    const body = await res.json();
    const child = body.postsReplies.find((p: any) => p._id === CHILD);
    expect(child.parent_comment_id).toBe(COMMENT);
    expect(child.likes_count).toBe(5);
    expect(child.replies_count).toBe(2);
    expect(child.parent_comment_author).toMatchObject({ _id: THIRD });
    expect(child.liked_by_loggedin_user).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Comment likes (design §3.10 items 9–10)
// ---------------------------------------------------------------------------
describe("comment likes endpoint", () => {
  const likeImpl =
    (opts: {
      comment: any | null;
      post?: any;
      insertReturns?: any[];
      count?: number;
    }) =>
    (op: string, table: string, meta: { selectKeys: string[] }) => {
      if (op === "select" && table === "comments") {
        // Parent-author batch selects (mapFetchedComment etc.) — not
        // used by this endpoint; fetchCommentRow is the 13-key select.
        if (meta.selectKeys.length === 3) return [];
        return opts.comment ? [opts.comment] : [];
      }
      if (op === "select" && table === "posts") return [opts.post ?? postRow()];
      if (op === "insert" && table === "commentLikes")
        return opts.insertReturns ?? [{ commentId: COMMENT }];
      if (op === "select" && table === "commentLikes") {
        if (meta.selectKeys.includes("count"))
          return [{ count: opts.count ?? 1 }];
        return [];
      }
      return [];
    };

  const likeReq = (commentId: string, actionType: "like" | "unlike") =>
    app.request(
      "/api/socials/analytics/comment-likes",
      jsonReq("POST", { commentId, actionType })
    );

  test("9a. like → row inserted, count recounted, author notified once (comment_like)", async () => {
    impl = likeImpl({ comment: commentRow(), count: 1 });
    const res = await likeReq(COMMENT, "like");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({
      likes_count: 1,
      liked: true,
      comment_id: COMMENT,
    });
    expect(insertValues("commentLikes")).toEqual([
      { commentId: COMMENT, userId: ME },
    ]);
    const notifs = insertValues("notifications");
    expect(notifs).toHaveLength(1);
    expect(notifs[0]).toMatchObject({
      type: "comment_like",
      userId: THIRD,
      postId: POST,
      commentId: COMMENT,
    });
    // Denormalized counter written from the recount.
    expect(updateOps("comments")).toHaveLength(1);
  });

  test("9b. repeat like (no row inserted) → zero new notifications, count stays 1", async () => {
    impl = likeImpl({
      comment: commentRow(),
      insertReturns: [],
      count: 1,
    });
    const res = await likeReq(COMMENT, "like");
    expect(res.status).toBe(200);
    expect((await res.json()).likes_count).toBe(1);
    expect(insertValues("notifications")).toHaveLength(0);
  });

  test("9c. unlike → row deleted, count 0, no notification", async () => {
    impl = likeImpl({ comment: commentRow(), count: 0 });
    const res = await likeReq(COMMENT, "unlike");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ likes_count: 0, liked: false });
    expect(deleteOps("commentLikes")).toHaveLength(1);
    expect(insertValues("notifications")).toHaveLength(0);
  });

  test("9d. liking your own reply → row + count, but no self-notification", async () => {
    impl = likeImpl({ comment: commentRow({ authorId: ME }), count: 1 });
    const res = await likeReq(COMMENT, "like");
    expect(res.status).toBe(200);
    expect(insertValues("commentLikes")).toHaveLength(1);
    expect(insertValues("notifications")).toHaveLength(0);
    expect((await res.json()).likes_count).toBe(1);
  });

  test("10a. tombstoned comment → 400 REPLY_DELETED", async () => {
    impl = likeImpl({ comment: commentRow({ deletedAt: new Date() }) });
    const res = await likeReq(COMMENT, "like");
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("REPLY_DELETED");
    expect(insertValues("commentLikes")).toHaveLength(0);
  });

  test("10b. comment under a tombstoned post → 400 POST_DELETED", async () => {
    impl = likeImpl({
      comment: commentRow(),
      post: postRow({ deletedAt: new Date() }),
    });
    const res = await likeReq(COMMENT, "like");
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("POST_DELETED");
    expect(insertValues("commentLikes")).toHaveLength(0);
  });

  test("10c. comment under an archived post (non-owner) → 404", async () => {
    impl = likeImpl({
      comment: commentRow(),
      post: postRow({ isArchived: true }),
    });
    const res = await likeReq(COMMENT, "like");
    expect(res.status).toBe(404);
    expect(insertValues("commentLikes")).toHaveLength(0);
  });

  test("10d. unknown comment → 404; logged out → 401", async () => {
    impl = likeImpl({ comment: null });
    const res = await likeReq(UNKNOWN, "like");
    expect(res.status).toBe(404);

    asUser(null);
    impl = likeImpl({ comment: commentRow() });
    const anon = await likeReq(COMMENT, "like");
    expect(anon.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Migration 0012 (design §3.10 item 15 — file contract)
// ---------------------------------------------------------------------------
describe("migration 0012_nested_replies.sql", () => {
  const sqlText = fs.readFileSync(
    path.join(process.cwd(), "drizzle/0012_nested_replies.sql"),
    "utf8"
  );

  test("additive only: no DROP, no destructive ALTER", () => {
    expect(sqlText).not.toMatch(/DROP\s+(TABLE|COLUMN)/i);
    expect(sqlText).not.toMatch(/DELETE\s+FROM/i);
    expect(sqlText).not.toMatch(/TRUNCATE/i);
  });

  test("idempotent: IF NOT EXISTS guards + guarded FK block", () => {
    expect(sqlText).toContain('ADD COLUMN IF NOT EXISTS "parent_comment_id"');
    expect(sqlText).toContain('ADD COLUMN IF NOT EXISTS "like_count"');
    expect(sqlText).toContain('ADD COLUMN IF NOT EXISTS "reply_count"');
    expect(sqlText).toContain('CREATE TABLE IF NOT EXISTS "comment_likes"');
    expect(sqlText).toContain(
      'CREATE INDEX IF NOT EXISTS "comments_parent_idx"'
    );
    expect(sqlText).toMatch(
      /IF NOT EXISTS \(\s*SELECT 1 FROM pg_constraint WHERE conname = 'comments_parent_comment_id_fkey'/
    );
  });

  test("shape: self-FK with SET NULL; comment_likes mirrors post_likes PK", () => {
    expect(sqlText).toMatch(
      /FOREIGN KEY \("parent_comment_id"\) REFERENCES "comments"\("id"\)\s*ON DELETE SET NULL/
    );
    expect(sqlText).toMatch(/PRIMARY KEY \("comment_id", "user_id"\)/);
  });
});
