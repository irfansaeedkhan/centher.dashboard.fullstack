/**
 * @jest-environment node
 *
 * Feed-grill FIXER regression tests (2026-10-21).
 *
 * One test per fixed grill question: Q1 (stored XSS), Q3 (arbitrary-host
 * media), Q4 (batch cap + rate limit), Q5/Q6 (notification spam),
 * Q10 (keyset pagination), Q15 (deleted_media), Q16 (video media type),
 * Q18 (post-view dedup), Q19 (feed /with-auth liked state).
 *
 * Pure helpers are unit-tested directly; route behavior goes through the
 * real Hono app with a recording mock DB (chat-grill pattern: mock @/db +
 * better-auth, then app.request).
 */
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/test";

import {
  posts,
  profiles,
  postLikes,
  postViews,
  follows,
  notifications,
  user,
  comments,
} from "@/db/schema";
import {
  isSafeLinkUrl,
  safeHttpUrl,
  sanitizeEditorState,
} from "@/lib/feed/editor-state";
import {
  mediaKindForMime,
  mediaKindForUrl,
  normalizePostMedia,
  withoutDeletedMedia,
} from "@/lib/feed/media";
import { isTrustedAttachmentUrl } from "@/lib/chat/attachments";

// ---------------------------------------------------------------------------
// Recording mock DB (routes use the drizzle chaining API; we record ops).
// ---------------------------------------------------------------------------
type Call = { op: string; method: string; table: string; args?: any[] };
const tableKey = (t: any): string => {
  if (t === posts) return "posts";
  if (t === profiles) return "profiles";
  if (t === postLikes) return "postLikes";
  if (t === postViews) return "postViews";
  if (t === follows) return "follows";
  if (t === notifications) return "notifications";
  if (t === user) return "user";
  if (t === comments) return "comments";
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
    select: (fields: any) =>
      chain("select", "none", fields ? Object.keys(fields) : []),
    insert: (t: any) => chain("insert", tableKey(t)),
    update: (t: any) => chain("update", tableKey(t)),
    delete: (t: any) => chain("delete", tableKey(t)),
    execute: async () => rowsFor("execute", "raw", { selectKeys: [] }),
  };
  return { db, calls };
};

// Mutable program: each test installs its own row behavior.
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

// require (not import): ES imports hoist above the jest.mock calls.
const { createHonoApp } = require("@/server/hono/app");
const { auth } = require("@/lib/auth/better-auth");

const asUser = (id: string | null) =>
  (auth.api.getSession as jest.Mock).mockResolvedValue(
    id ? { user: { id } } : null
  );

const app = createHonoApp();

const ME = "user-me-1";
const PEER = "user-peer-2";
const POST = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const POST2 = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const POST3 = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
const COMMENT = "ffffffff-ffff-4fff-8fff-ffffffffffff";

const CLOUD_IMG = "https://res.cloudinary.com/demo/image/upload/v1/pic.jpg";
const CLOUD_VID = "https://res.cloudinary.com/demo/video/upload/v1/clip.mp4";

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
  commentCount: 1,
  viewCount: 5,
  isArchived: false,
  createdAt: new Date("2026-10-20T10:00:00Z"),
  authorId: PEER,
  authorName: "Peer Person",
  authorAvatar: null,
  membership: "citizen",
  mediaUrls: null,
  ...over,
});

const editorStateWithLinks = () => ({
  root: {
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", text: "check this" },
          {
            type: "link",
            url: "javascript:alert(document.cookie)",
            children: [{ type: "text", text: "free money" }],
          },
          {
            type: "link",
            url: "https://example.com/docs",
            children: [{ type: "text", text: "docs" }],
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

beforeEach(() => {
  calls.length = 0;
  impl = () => [];
  asUser(ME);
});

// ---------------------------------------------------------------------------
// Q1 — editor-state sanitizer (unit)
// ---------------------------------------------------------------------------
describe("Q1: sanitizeEditorState strips dangerous link hrefs", () => {
  test("javascript: link is unwrapped, its text survives", () => {
    const out = sanitizeEditorState(editorStateWithLinks()) as any;
    const json = JSON.stringify(out);
    expect(json).not.toContain("javascript:");
    expect(json).toContain("free money");
    expect(json).toContain("https://example.com/docs");
  });

  test("data: and vbscript: links are unwrapped too", () => {
    const state = {
      root: {
        children: [
          {
            type: "link",
            url: "data:text/html,<script>alert(1)</script>",
            children: [{ type: "text", text: "a" }],
          },
          {
            type: "link",
            url: "vbscript:msgbox(1)",
            children: [{ type: "text", text: "b" }],
          },
        ],
      },
    };
    const json = JSON.stringify(sanitizeEditorState(state));
    expect(json).not.toContain("data:text/html");
    expect(json).not.toContain("vbscript:");
    expect(json).toContain('"a"');
    expect(json).toContain('"b"');
  });

  test("unparseable and relative URLs are unwrapped (Q2 crash guard)", () => {
    const state = {
      root: {
        children: [
          {
            type: "link",
            url: "::::",
            children: [{ type: "text", text: "broken" }],
          },
          {
            type: "link",
            url: "/profile/someone",
            children: [{ type: "text", text: "relative" }],
          },
        ],
      },
    };
    const out = sanitizeEditorState(state) as any;
    const types = out.root.children.map((n: any) => n.type);
    expect(types).not.toContain("link");
  });

  test("http/https links are preserved; input is not mutated", () => {
    const state = editorStateWithLinks();
    const before = JSON.stringify(state);
    const out = sanitizeEditorState(state) as any;
    expect(JSON.stringify(state)).toBe(before);
    const links = JSON.stringify(out).match(/"type":"link"/g) || [];
    expect(links.length).toBe(1); // only the https link remains a link
  });

  test("safeHttpUrl / isSafeLinkUrl", () => {
    expect(safeHttpUrl("https://example.com/x")).toBe("https://example.com/x");
    expect(safeHttpUrl("http://example.com")).toBe("http://example.com");
    expect(safeHttpUrl("javascript:alert(1)")).toBeNull();
    expect(safeHttpUrl("::::")).toBeNull();
    expect(safeHttpUrl("")).toBeNull();
    expect(safeHttpUrl(null)).toBeNull();
    expect(isSafeLinkUrl("https://a.b")).toBe(true);
    expect(isSafeLinkUrl("data:text/html,x")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Q3 + Q16 — media helpers (unit)
// ---------------------------------------------------------------------------
describe("Q3/Q16: post media helpers", () => {
  test("mediaKindForUrl reads Cloudinary path + extension", () => {
    expect(mediaKindForUrl(CLOUD_VID)).toBe("video");
    expect(mediaKindForUrl(CLOUD_IMG)).toBe("image");
    expect(mediaKindForUrl("https://res.cloudinary.com/x/movie.mov")).toBe(
      "video"
    );
    expect(mediaKindForUrl("https://res.cloudinary.com/x/a.webm?dl=1")).toBe(
      "video"
    );
  });

  test("mediaKindForMime", () => {
    expect(mediaKindForMime("video/mp4")).toBe("video");
    expect(mediaKindForMime("image/png")).toBe("image");
    expect(mediaKindForMime("text/plain")).toBeNull();
    expect(mediaKindForMime(undefined)).toBeNull();
  });

  test("normalizePostMedia upgrades legacy strings and keeps objects", () => {
    expect(normalizePostMedia([CLOUD_IMG, CLOUD_VID])).toEqual([
      { url: CLOUD_IMG, type: "image" },
      { url: CLOUD_VID, type: "video" },
    ]);
    expect(
      normalizePostMedia([{ url: CLOUD_VID, type: "video" }, "junk", 42, null])
    ).toEqual([{ url: CLOUD_VID, type: "video" }]);
    expect(normalizePostMedia(null)).toEqual([]);
    expect(normalizePostMedia("nope")).toEqual([]);
  });

  test("withoutDeletedMedia removes by URL from both shapes (Q15)", () => {
    const stored = [CLOUD_IMG, { url: CLOUD_VID, type: "video" }];
    expect(withoutDeletedMedia(stored, [CLOUD_IMG])).toEqual([
      { url: CLOUD_VID, type: "video" },
    ]);
    expect(withoutDeletedMedia(stored, [])).toHaveLength(2);
  });

  test("the chat allowlist is the post-media trust check (Q3)", () => {
    expect(isTrustedAttachmentUrl(CLOUD_IMG)).toBe(true);
    expect(isTrustedAttachmentUrl("https://evil.example/pixel.png")).toBe(
      false
    );
  });
});

// ---------------------------------------------------------------------------
// Route tests
// ---------------------------------------------------------------------------

/** insert/posts echoes the recorded values back as the created row. */
const echoCreatedPost = (op: string, table: string): any[] => {
  if (op === "select" && table === "profiles") return [profileRow];
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

describe("Q1+Q3+Q16: POST /socials/posts sanitizes, allowlists, types media", () => {
  test("javascript: href never reaches the DB; off-host media dropped; video typed", async () => {
    impl = echoCreatedPost;
    const res = await app.request(
      "/api/socials/posts",
      jsonReq("POST", {
        posts: [
          {
            post_editor_state: editorStateWithLinks(),
            media: [
              {
                object_name: "https://evil.example/pixel.png",
                type: "image/png",
              },
              { object_name: CLOUD_VID, type: "video/mp4" },
              { object_name: CLOUD_IMG, type: "image/jpeg" },
            ],
          },
        ],
      })
    );
    expect(res.status).toBe(201);

    const values = insertValues("posts")[0];
    expect(values.body).not.toContain("javascript:");
    expect(values.body).toContain("https://example.com/docs");
    expect(values.body).toContain("free money");
    expect(values.mediaUrls).toEqual([
      { url: CLOUD_VID, type: "video" },
      { url: CLOUD_IMG, type: "image" },
    ]);

    const body = await res.json();
    const media = body.posts[0].media;
    expect(media.map((m: any) => m.type)).toEqual(["video", "image"]);
    expect(JSON.stringify(media)).not.toContain("evil.example");
  });
});

describe("Q4: batch cap + rate limit on post creation", () => {
  test("11 posts in one request is rejected with a readable 400", async () => {
    impl = echoCreatedPost;
    const many = Array.from({ length: 11 }, () => ({
      post_editor_state: editorStateWithLinks(),
      media: [],
    }));
    const res = await app.request(
      "/api/socials/posts",
      jsonReq("POST", { posts: many })
    );
    expect(res.status).toBe(400);
    expect(insertValues("posts")).toHaveLength(0);
  });

  test("the 21st create in a minute gets a readable 429", async () => {
    asUser("user-rate-limited");
    impl = echoCreatedPost;
    const payload = {
      posts: [{ post_editor_state: editorStateWithLinks(), media: [] }],
    };
    let lastStatus = 0;
    for (let i = 0; i < 21; i++) {
      const res = await app.request(
        "/api/socials/posts",
        jsonReq("POST", payload)
      );
      lastStatus = res.status;
      if (i < 20) expect(res.status).toBe(201);
    }
    expect(lastStatus).toBe(429);
  });
});

describe("Q5: like notifies only when the like row is new", () => {
  const likeImpl =
    (likeInsertRows: any[]) =>
    (op: string, table: string): any[] => {
      if (op === "select" && table === "posts") return [postRow()];
      if (op === "insert" && table === "postLikes") return likeInsertRows;
      if (op === "select" && table === "postLikes") return [{ count: 1 }];
      return [];
    };

  test("first like notifies once; repeat like (conflict) does not notify", async () => {
    impl = likeImpl([{ postId: POST }]);
    const res1 = await app.request(
      "/api/socials/analytics/likes",
      jsonReq("POST", { postId: POST, actionType: "like" })
    );
    expect(res1.status).toBe(200);
    expect(insertValues("notifications")).toHaveLength(1);

    impl = likeImpl([]); // onConflictDoNothing → nothing inserted
    const res2 = await app.request(
      "/api/socials/analytics/likes",
      jsonReq("POST", { postId: POST, actionType: "like" })
    );
    expect(res2.status).toBe(200);
    expect(insertValues("notifications")).toHaveLength(1);
  });
});

describe("Q6: follow notifies only when the follow row is new", () => {
  const followImpl =
    (followInsertRows: any[]) =>
    (op: string, table: string): any[] => {
      if (op === "select" && table === "user") return [{ id: PEER }];
      if (op === "select" && table === "follows") return [];
      if (op === "insert" && table === "follows") return followInsertRows;
      return [];
    };

  test("raced follow (insert conflicts) sends no notification", async () => {
    impl = followImpl([]);
    const res = await app.request(
      "/api/socials/followers",
      jsonReq("POST", { following_id: PEER })
    );
    expect(res.status).toBe(200);
    expect((await res.json()).message).toBe("follow_success");
    expect(insertValues("notifications")).toHaveLength(0);
  });

  test("genuine new follow notifies exactly once", async () => {
    impl = followImpl([{ followerId: ME }]);
    const res = await app.request(
      "/api/socials/followers",
      jsonReq("POST", { following_id: PEER })
    );
    expect(res.status).toBe(200);
    expect(insertValues("notifications")).toHaveLength(1);
  });
});

describe("Q18: post-views dedup — one counted view per user/post/day", () => {
  const viewsImpl =
    (ledgerInsertRows: any[]) =>
    (op: string, table: string): any[] => {
      if (op === "select" && table === "posts")
        return [{ id: POST, viewCount: 5 }];
      if (op === "insert" && table === "postViews") return ledgerInsertRows;
      if (op === "update" && table === "posts") return [{ viewCount: 6 }];
      return [];
    };

  test("repeat view today does not increment the counter", async () => {
    impl = viewsImpl([]);
    const res = await app.request(
      "/api/socials/analytics/post-views",
      jsonReq("POST", { post_id: POST })
    );
    expect(res.status).toBe(200);
    expect((await res.json()).view_count).toBe(5);
    expect(updateSets("posts")).toHaveLength(0);
  });

  test("first view today increments exactly once", async () => {
    impl = viewsImpl([{ id: "view-row-1" }]);
    const res = await app.request(
      "/api/socials/analytics/post-views",
      jsonReq("POST", { post_id: POST })
    );
    expect(res.status).toBe(200);
    expect((await res.json()).view_count).toBe(6);
    expect(updateSets("posts")).toHaveLength(1);
  });

  test("missing post still 404s", async () => {
    impl = () => [];
    const res = await app.request(
      "/api/socials/analytics/post-views",
      jsonReq("POST", { post_id: POST })
    );
    expect(res.status).toBe(404);
  });
});

describe("Q15+Q1: PATCH honors deleted_media and sanitizes editor state", () => {
  test("deleted media is removed from the stored rows; the rest survive typed", async () => {
    const existing = postRow({
      authorId: ME,
      // Fresh timestamp: edits are window-checked (feed product call Q14).
      createdAt: new Date(),
      mediaUrls: [CLOUD_IMG, { url: CLOUD_VID, type: "video" }],
    });
    impl = (op, table) => {
      if (op === "select" && table === "posts") return [existing];
      if (op === "update" && table === "posts") {
        const set = updateSets("posts").slice(-1)[0] || {};
        return [{ ...existing, body: set.body, mediaUrls: set.mediaUrls }];
      }
      return [];
    };
    const res = await app.request(
      `/api/socials/posts/${POST}`,
      jsonReq("PATCH", { text: "edited text", deleted_media: [CLOUD_IMG] })
    );
    expect(res.status).toBe(200);
    expect(updateSets("posts")[0].mediaUrls).toEqual([
      { url: CLOUD_VID, type: "video" },
    ]);
    const body = await res.json();
    expect(body.posts[0].media).toEqual([
      { object_name: CLOUD_VID, url: CLOUD_VID, type: "video" },
    ]);
  });

  test("PATCH with a javascript: link stores a sanitized body", async () => {
    const existing = postRow({ authorId: ME, createdAt: new Date() });
    impl = (op, table) => {
      if (op === "select" && table === "posts") return [existing];
      if (op === "update" && table === "posts") {
        const set = updateSets("posts").slice(-1)[0] || {};
        return [{ ...existing, body: set.body, mediaUrls: set.mediaUrls }];
      }
      return [];
    };
    const res = await app.request(
      `/api/socials/posts/${POST}`,
      jsonReq("PATCH", { post_editor_state: editorStateWithLinks() })
    );
    expect(res.status).toBe(200);
    expect(updateSets("posts")[0].body).not.toContain("javascript:");
    expect(updateSets("posts")[0].body).toContain("https://example.com/docs");
  });
});

describe("Q10+Q19: feed list keyset pagination + /with-auth liked state", () => {
  const page1 = [
    postRow({ id: POST, createdAt: new Date("2026-10-20T12:00:00Z") }),
    postRow({ id: POST2, createdAt: new Date("2026-10-20T11:00:00Z") }),
  ];
  const page2 = [
    postRow({ id: POST3, createdAt: new Date("2026-10-20T10:00:00Z") }),
  ];

  const listImpl =
    (listRows: any[]) =>
    (op: string, table: string, meta: { selectKeys: string[] }): any[] => {
      if (op === "select" && table === "posts") {
        if (meta.selectKeys.includes("authorUsername")) return listRows;
        if (meta.selectKeys.length <= 2) return [listRows[0]]; // cursor ref
        return listRows;
      }
      if (op === "select" && table === "postLikes") return [{ postId: POST }];
      return [];
    };

  test("/with-auth route is registered before /:id", () => {
    const paths = app.routes.map(
      (r: { method: string; path: string }) => `${r.method} ${r.path}`
    );
    expect(paths).toContain("GET /api/socials/posts/with-auth");
    expect(paths.indexOf("GET /api/socials/posts/with-auth")).toBeLessThan(
      paths.indexOf("GET /api/socials/posts/:id")
    );
  });

  test("first page returns next_cursor; liked state is viewer-aware", async () => {
    impl = listImpl(page1);
    const res = await app.request("/api/socials/posts/with-auth?limit=2");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.posts).toHaveLength(2);
    expect(body.next_cursor).toBe(POST2);
    expect(body.has_more).toBe(true);
    expect(body.posts[0].liked_by_loggedin_user).toBe(true);
    expect(body.posts[1].liked_by_loggedin_user).toBe(false);
  });

  test("cursor page returns the older posts and ends the stream", async () => {
    impl = listImpl(page2);
    const res = await app.request(
      `/api/socials/posts/with-auth?limit=2&cursor=${POST2}`
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.posts.map((p: any) => p._id)).toEqual([POST3]);
    expect(body.next_cursor).toBeNull();
    expect(body.has_more).toBe(false);
  });

  test("unknown cursor is a readable 400, not a 500", async () => {
    impl = (op, table, meta) => {
      if (op === "select" && table === "posts" && meta.selectKeys.length <= 2)
        return [];
      return [];
    };
    const res = await app.request(`/api/socials/posts?cursor=${POST2}`);
    expect(res.status).toBe(400);
  });
});

describe("Q10: replies keyset pagination", () => {
  test("cursor page of replies returns next_cursor bookkeeping", async () => {
    const parent = postRow();
    const replyRow = {
      id: COMMENT,
      body: "a reply",
      createdAt: new Date("2026-10-20T09:00:00Z"),
      authorId: PEER,
      authorName: "Peer Person",
      authorAvatar: null,
      membership: "citizen",
    };
    impl = (op, table, meta) => {
      if (op === "select" && table === "posts") return [parent];
      if (op === "select" && table === "comments") {
        if (meta.selectKeys.length <= 2) return [replyRow]; // cursor ref
        return [replyRow];
      }
      return [];
    };
    const res = await app.request(
      `/api/socials/posts/${POST}/replies?limit=1&cursor=${COMMENT}`
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.posts).toHaveLength(1);
    expect(body.has_more).toBe(true);
    expect(body.next_cursor).toBe(COMMENT);
  });
});
