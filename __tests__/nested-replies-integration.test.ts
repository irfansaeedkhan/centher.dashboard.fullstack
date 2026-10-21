/**
 * @jest-environment node
 *
 * Nested replies + reply likes — integration tests against real
 * Postgres (Neon demo DB). These prove the parts a recording mock
 * cannot: the migration-0012 columns/table behave under the REAL
 * drizzle queries (nested insert with parent FK, the reply_count
 * increment SQL, comment_likes onConflictDoNothing + recount), and
 * the with-auth liked state joins correctly.
 *
 * Gated on CENTHER_TEST_DB_URL (same convention as
 * marketplace-grill-integration / chat-grill-bots); the whole suite
 * skips when it is unset. `@/db` is NOT mocked here; only better-auth
 * is, with the session user taken from an `x-test-user-id` header.
 * All seeded rows are nested-scoped and cleaned up.
 */
process.env.DATABASE_URL =
  process.env.CENTHER_TEST_DB_URL ||
  "postgresql://dummy:dummy@localhost:5432/dummy";

jest.mock("@/lib/auth/better-auth", () => ({
  auth: {
    api: {
      getSession: jest.fn(async ({ headers }: any) => {
        const id =
          headers && typeof headers.get === "function"
            ? headers.get("x-test-user-id")
            : null;
        return id ? { user: { id } } : null;
      }),
    },
    handler: jest.fn(),
  },
}));

// require (not import): ES imports hoist above the jest.mock call.
const { createHonoApp } = require("@/server/hono/app");

const dbUrl = process.env.CENTHER_TEST_DB_URL;
const describeOrSkip = dbUrl ? describe : describe.skip;

jest.setTimeout(60_000);

describeOrSkip("nested replies (Neon integration)", () => {
  const { neon } = require("@neondatabase/serverless");
  const sql = neon(dbUrl!);
  const q = (stmt: string, params?: any[]) =>
    sql.query(stmt, params) as Promise<any[]>;

  const app = createHonoApp();
  const run = Math.random().toString(36).slice(2, 8);
  const authorA = `nested-a-${run}`; // post author
  const replierB = `nested-b-${run}`; // top-level + parent comment author
  const nesterC = `nested-c-${run}`; // nested replier
  const postId = crypto.randomUUID();

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

  const reqAs = (userId: string, method: string, path: string, body?: any) =>
    app.request(path, {
      method,
      headers: {
        "content-type": "application/json",
        "x-test-user-id": userId,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

  const createReply = (userId: string, replyingTo: string, text: string) =>
    reqAs(userId, "POST", "/api/socials/posts", {
      replying_to: replyingTo,
      posts: [{ post_editor_state: editorState(text), media: [] }],
    });

  beforeAll(async () => {
    for (const [id, name] of [
      [authorA, "Nested Author"],
      [replierB, "Nested Replier"],
      [nesterC, "Nested Nester"],
    ] as const) {
      await q(`INSERT INTO "user" (id, name, email) VALUES ($1, $2, $3)`, [
        id,
        name,
        `${id}@nested.test`,
      ]);
      await q(
        `INSERT INTO profiles (user_id, display_name, username)
         VALUES ($1, $2, $3)`,
        [id, name, id]
      );
    }
    await q(`INSERT INTO posts (id, author_id, body) VALUES ($1, $2, $3)`, [
      postId,
      authorA,
      "integration root post",
    ]);
  });

  afterAll(async () => {
    await q(
      `DELETE FROM comment_likes WHERE comment_id IN
      (SELECT id FROM comments WHERE post_id = $1)`,
      [postId]
    );
    await q(`DELETE FROM notifications WHERE post_id = $1`, [postId]);
    await q(`DELETE FROM comments WHERE post_id = $1`, [postId]);
    await q(`DELETE FROM posts WHERE id = $1`, [postId]);
    for (const id of [authorA, replierB, nesterC]) {
      await q(`DELETE FROM profiles WHERE user_id = $1`, [id]);
      await q(`DELETE FROM "user" WHERE id = $1`, [id]);
    }
  });

  test("nested create + counters + real comment likes, end to end", async () => {
    // B replies top-level to A's post.
    const topRes = await createReply(replierB, postId, "top level");
    expect(topRes.status).toBe(201);
    const topBody = await topRes.json();
    const parentId = topBody.posts[0]._id as string;
    expect(topBody.posts[0].parent_comment_id).toBeNull();

    // C replies to B's comment — the nested create that 404'd before.
    const nestedRes = await createReply(nesterC, parentId, "nested reply");
    expect(nestedRes.status).toBe(201);
    const nestedBody = await nestedRes.json();
    const nestedId = nestedBody.posts[0]._id as string;
    expect(nestedBody.posts[0].parent_comment_id).toBe(parentId);
    expect(nestedBody.posts[0].parent_comment_author).toMatchObject({
      _id: replierB,
    });

    // Counters in the real DB: post counts all depths (2), the parent
    // comment counts its direct child (1).
    const [post] = await q(`SELECT comment_count FROM posts WHERE id = $1`, [
      postId,
    ]);
    expect(post.comment_count).toBe(2);
    const [parent] = await q(`SELECT reply_count FROM comments WHERE id = $1`, [
      parentId,
    ]);
    expect(parent.reply_count).toBe(1);

    // Notifications: B got exactly one comment_reply; A (post author,
    // distinct) got post_reply for both events.
    const notifs = await q(
      `SELECT user_id, type FROM notifications WHERE post_id = $1
       ORDER BY type, user_id`,
      [postId]
    );
    const forB = notifs.filter((n) => n.user_id === replierB);
    expect(forB).toEqual([expect.objectContaining({ type: "comment_reply" })]);
    const forA = notifs.filter((n) => n.user_id === authorA);
    expect(forA).toHaveLength(2);
    expect(forA.every((n) => n.type === "post_reply")).toBe(true);

    // A likes C's nested reply — real storage now.
    const likeRes = await reqAs(
      authorA,
      "POST",
      "/api/socials/analytics/comment-likes",
      { commentId: nestedId, actionType: "like" }
    );
    expect(likeRes.status).toBe(200);
    expect(await likeRes.json()).toMatchObject({
      likes_count: 1,
      liked: true,
      comment_id: nestedId,
    });
    const [liked] = await q(`SELECT like_count FROM comments WHERE id = $1`, [
      nestedId,
    ]);
    expect(liked.like_count).toBe(1);
    const likeNotifs = await q(
      `SELECT count(*)::int AS n FROM notifications
       WHERE post_id = $1 AND type = 'comment_like' AND user_id = $2`,
      [postId, nesterC]
    );
    expect(likeNotifs[0].n).toBe(1);

    // Repeat like: no second row, no second notification.
    const againRes = await reqAs(
      authorA,
      "POST",
      "/api/socials/analytics/comment-likes",
      { commentId: nestedId, actionType: "like" }
    );
    expect((await againRes.json()).likes_count).toBe(1);
    const likeNotifs2 = await q(
      `SELECT count(*)::int AS n FROM notifications
       WHERE post_id = $1 AND type = 'comment_like'`,
      [postId]
    );
    expect(likeNotifs2[0].n).toBe(1);

    // With-auth replies list: A sees the nested reply as liked, with
    // its true parent + counts.
    const listRes = await reqAs(
      authorA,
      "GET",
      `/api/socials/posts/${postId}/replies/with-auth`
    );
    expect(listRes.status).toBe(200);
    const list = await listRes.json();
    const nestedRow = list.posts.find((p: any) => p._id === nestedId);
    expect(nestedRow.parent_comment_id).toBe(parentId);
    expect(nestedRow.likes_count).toBe(1);
    expect(nestedRow.liked_by_loggedin_user).toBe(true);
    const parentRow = list.posts.find((p: any) => p._id === parentId);
    expect(parentRow.replies_count).toBe(1);

    // B tombstones their comment: new children are refused readably,
    // the existing nested reply survives beneath the placeholder.
    const delRes = await reqAs(
      replierB,
      "DELETE",
      `/api/socials/comments/${parentId}`
    );
    expect(delRes.status).toBe(200);
    const orphanAttempt = await createReply(nesterC, parentId, "too late");
    expect(orphanAttempt.status).toBe(400);
    expect((await orphanAttempt.json()).code).toBe("REPLY_DELETED");

    const afterRes = await reqAs(
      authorA,
      "GET",
      `/api/socials/posts/${postId}/replies`
    );
    const after = await afterRes.json();
    const tomb = after.posts.find((p: any) => p._id === parentId);
    expect(tomb.status).toBe("deleted");
    expect(tomb.text_content).toBe("");
    expect(after.posts.some((p: any) => p._id === nestedId)).toBe(true);
  });
});
