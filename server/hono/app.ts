import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { and, desc, eq, ilike, inArray, ne, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  channels,
  channelMessages,
  citizenships,
  collections,
  comments,
  conversations,
  launchpads,
  messages,
  nfts,
  postLikes,
  posts,
  profiles,
  stakingPools,
  user,
} from "@/db/schema";
import { auth } from "@/lib/auth/better-auth";

type AppEnv = {
  Variables: {
    userId: string | null;
  };
};

const apiError = (message: string, code = "BAD_REQUEST", status = 400) => {
  throw new HTTPException(status as 400, {
    message: JSON.stringify({ message, code }),
  });
};

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

const wrapPlainTextEditorState = (text: string) => ({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text,
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
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

const extractTextFromEditorState = (state: unknown): string => {
  const texts: string[] = [];
  const walk = (nodes: unknown) => {
    if (!Array.isArray(nodes)) return;
    for (const node of nodes) {
      if (!node || typeof node !== "object") continue;
      const n = node as { type?: string; text?: string; children?: unknown };
      if (
        (n.type === "text" ||
          n.type === "hashtag" ||
          n.type === "mention" ||
          n.type === "link") &&
        typeof n.text === "string"
      ) {
        texts.push(n.text);
      }
      if (n.children) walk(n.children);
    }
  };
  const root = (state as { root?: { children?: unknown } } | null)?.root;
  walk(root?.children);
  return texts.join(" ").trim();
};

const parseStoredPostBody = (body: string) => {
  try {
    const parsed = JSON.parse(body) as { root?: { children?: unknown } };
    if (parsed?.root?.children) {
      return {
        text: extractTextFromEditorState(parsed) || body,
        post_editor_state: parsed,
      };
    }
  } catch {
    // plain text seed posts
  }
  return {
    text: body,
    post_editor_state: wrapPlainTextEditorState(body),
  };
};

const mapPostRow = (
  row: {
    id: string;
    body: string;
    likeCount: number;
    commentCount: number;
    createdAt: Date | string;
    authorId: string;
    authorName: string | null;
    authorAvatar: string | null;
    membership: string | null;
  },
  opts?: { likedByLoggedInUser?: boolean }
) => {
  const { text, post_editor_state } = parseStoredPostBody(row.body);
  return {
    _id: row.id,
    user: {
      _id: row.authorId,
      display_name: row.authorName || "Centher Demo",
      profile_image: row.authorAvatar || "/images/centher.logo.favicon.png",
      membership: {
        last_status:
          (row.membership as "citizen" | "verified" | "none") || "citizen",
        status:
          (row.membership as "citizen" | "verified" | "none") || "citizen",
        endAt: 0,
      },
    },
    viewed_by_loggedin_user: false,
    liked_by_loggedin_user: opts?.likedByLoggedInUser ?? false,
    replies_count: row.commentCount,
    likes_count: row.likeCount,
    is_thread: false,
    thread_id: undefined,
    thread_index: undefined,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : String(row.createdAt),
    version: 2,
    status: "complete" as const,
    parent_post: undefined,
    post_editor_state,
    text_content: text,
    media: [],
  };
};

/**
 * Phase 2: map a `comments` row to the CompletedPost shape the UI expects for
 * replies. Replies live in the `comments` table (one level deep); the parent
 * post is attached as `parent_post`.
 */
const mapCommentRow = (
  row: {
    id: string;
    body: string;
    createdAt: Date | string;
    authorId: string;
    authorName: string | null;
    authorAvatar: string | null;
    membership: string | null;
  },
  parent: {
    id: string;
    createdAt: Date | string;
    authorId: string;
    authorName: string | null;
    authorAvatar: string | null;
  }
) => {
  const mapped = mapPostRow({
    id: row.id,
    body: row.body,
    likeCount: 0,
    commentCount: 0,
    createdAt: row.createdAt,
    authorId: row.authorId,
    authorName: row.authorName,
    authorAvatar: row.authorAvatar,
    membership: row.membership,
  });
  return {
    ...mapped,
    replies_count: 0,
    parent_post: {
      _id: parent.id,
      createdAt:
        parent.createdAt instanceof Date
          ? parent.createdAt.toISOString()
          : String(parent.createdAt),
      user: {
        _id: parent.authorId,
        display_name: parent.authorName || "Centher Demo",
        profile_image:
          parent.authorAvatar || "/images/centher.logo.favicon.png",
      },
    },
  };
};

/** Phase 2: which of these posts the current user has liked (for /with-auth). */
const getLikedPostIds = async (
  userId: string | null,
  postIds: string[]
): Promise<Set<string>> => {
  if (!userId || postIds.length === 0) return new Set<string>();
  const rows = await db
    .select({ postId: postLikes.postId })
    .from(postLikes)
    .where(
      and(eq(postLikes.userId, userId), inArray(postLikes.postId, postIds))
    );
  return new Set(rows.map((r) => r.postId));
};

/** Phase 2: single post row with author profile, or null. */
const fetchPostRow = async (id: string) => {
  const [row] = await db
    .select({
      id: posts.id,
      body: posts.body,
      likeCount: posts.likeCount,
      commentCount: posts.commentCount,
      viewCount: posts.viewCount,
      isArchived: posts.isArchived,
      createdAt: posts.createdAt,
      authorId: posts.authorId,
      authorName: profiles.displayName,
      authorAvatar: profiles.avatarUrl,
      membership: profiles.membership,
    })
    .from(posts)
    .leftJoin(profiles, eq(posts.authorId, profiles.userId))
    .where(eq(posts.id, id))
    .limit(1);
  return row ?? null;
};

/** Phase 2: shared limit/offset parsing for post lists. */
const parseListQuery = (c: {
  req: { query: (k: string) => string | undefined };
}) => {
  const limit = z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10)
    .parse(c.req.query("limit") ?? 10);
  const offset = z.coerce
    .number()
    .int()
    .min(0)
    .default(0)
    .parse(c.req.query("offset") ?? 0);
  return { limit, offset };
};

export const createHonoApp = () => {
  const app = new Hono<AppEnv>().basePath("/api");

  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      try {
        const parsed = JSON.parse(err.message) as {
          message: string;
          code: string;
        };
        return c.json(parsed, err.status);
      } catch {
        return c.json({ message: err.message, code: "HTTP_ERROR" }, err.status);
      }
    }
    console.error(err);
    return c.json({ message: "Internal server error", code: "INTERNAL" }, 500);
  });

  app.use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    c.set("userId", session?.user?.id ?? null);
    await next();
  });

  app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

  app.get("/health", (c) =>
    c.json({ ok: true, brand: process.env.NEXT_PUBLIC_BRAND_NAME || "Centher" })
  );

  app.get("/users/me", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId!))
      .limit(1);

    const [authUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId!))
      .limit(1);

    const membershipStatus =
      profile?.membership === "citizen" || profile?.membership === "verified"
        ? profile.membership
        : "citizen";

    // Shape matches LoggedInUser used by useUser / header
    return c.json({
      _id: userId,
      display_name: profile?.displayName || authUser?.name || "Centher Demo",
      profile_image: profile?.avatarUrl || "/images/centher.logo.favicon.png",
      cover_image: "",
      membership: {
        last_status: membershipStatus,
        status: membershipStatus,
        endAt: 0,
      },
      profile_bio: profile?.bio || "",
      social_media: {
        website_url: "",
        twitter_username: "",
        facebook_username: "",
        instagram_username: "",
        twitch_username: "",
        onlyfans_username: "",
        youtube_url: "",
        tiktok_username: "",
        telegram_username: "",
      },
      organization: null,
      createdAt:
        authUser?.createdAt?.toISOString?.() || new Date().toISOString(),
      updatedAt:
        authUser?.updatedAt?.toISOString?.() || new Date().toISOString(),
      first_name: authUser?.name?.split(" ")[0] || "Centher",
      last_name: authUser?.name?.split(" ").slice(1).join(" ") || "Demo",
      pseudonym: profile?.username || "centher_demo",
      referrer_address: null,
      display_name_field: "pseudonym",
      has_seen_notifications_page: true,
      // Default granted so cookies banner does not block demo sessions
      cookies_consent: {
        consent_given: true,
        timestamp: new Date().toISOString(),
      },
      email: authUser?.email,
    });
  });

  app.patch("/users/cookies-consent", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const body = z
      .object({ consent_given: z.boolean() })
      .parse(await c.req.json().catch(() => ({})));
    return c.json({
      cookies_consent: {
        consent_given: body.consent_given,
        timestamp: new Date().toISOString(),
      },
    });
  });

  app.get("/users/:userId", async (c) => {
    const userId = c.req.param("userId");
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);
    const [authUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    if (!profile && !authUser) apiError("User not found", "NOT_FOUND", 404);
    const membershipStatus =
      profile?.membership === "citizen" || profile?.membership === "verified"
        ? profile.membership
        : "citizen";
    return c.json({
      _id: userId,
      display_name: profile?.displayName || authUser?.name || "Centher User",
      profile_image: profile?.avatarUrl || "/images/centher.logo.favicon.png",
      cover_image: "",
      membership: {
        last_status: membershipStatus,
        status: membershipStatus,
        endAt: 0,
      },
      profile_bio: profile?.bio || "",
      social_media: {
        website_url: "",
        twitter_username: "",
        facebook_username: "",
        instagram_username: "",
        twitch_username: "",
        onlyfans_username: "",
        youtube_url: "",
        tiktok_username: "",
        telegram_username: "",
      },
      organization: null,
      createdAt:
        authUser?.createdAt?.toISOString?.() || new Date().toISOString(),
      updatedAt:
        authUser?.updatedAt?.toISOString?.() || new Date().toISOString(),
    });
  });

  app.get("/socials/recommended-people", async (c) => {
    const userId = c.get("userId");
    const rows = await db
      .select({
        userId: profiles.userId,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
        membership: profiles.membership,
      })
      .from(profiles)
      .where(userId ? ne(profiles.userId, userId) : undefined)
      .limit(8);

    return c.json({
      users: rows.map((row) => ({
        _id: row.userId,
        display_name: row.displayName || "Centher User",
        profile_image: row.avatarUrl || "/images/centher.logo.favicon.png",
        membership: {
          last_status:
            (row.membership as "citizen" | "verified" | "none") || "citizen",
          status:
            (row.membership as "citizen" | "verified" | "none") || "citizen",
          endAt: 0,
        },
        is_followed_by_loggedin_user: false,
      })),
    });
  });

  app.get("/socials/analytics/profile-card/:userId", async (c) => {
    const userId = c.req.param("userId");
    const [{ count: postsCount }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(eq(posts.authorId, userId));

    return c.json({
      profileCardDetails: {
        _id: userId,
        posts_count: postsCount ?? 0,
        followers_count: 12,
        following_count: 8,
        total_referrees: 0,
        posts_views_count: 42,
        profile_views_count: 18,
      },
    });
  });

  app.get("/socials/analytics/profile-card/:userId/with-auth", async (c) => {
    const userId = c.req.param("userId");
    const [{ count: postsCount }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(eq(posts.authorId, userId));

    return c.json({
      profileCardDetails: {
        _id: userId,
        posts_count: postsCount ?? 0,
        followers_count: 12,
        following_count: 8,
        total_referrees: 0,
        posts_views_count: 42,
        profile_views_count: 18,
      },
    });
  });

  app.get("/socials/posts", async (c) => {
    const limit = z.coerce
      .number()
      .int()
      .min(1)
      .max(50)
      .default(10)
      .parse(c.req.query("limit") ?? 10);

    const offsetParam = c.req.query("offset");
    const pageParam = c.req.query("page") ?? c.req.query("Page");
    const offset =
      offsetParam != null
        ? z.coerce.number().int().min(0).parse(offsetParam)
        : (z.coerce
            .number()
            .int()
            .min(1)
            .default(1)
            .parse(pageParam ?? 1) -
            1) *
          limit;

    const rows = await db
      .select({
        id: posts.id,
        body: posts.body,
        likeCount: posts.likeCount,
        commentCount: posts.commentCount,
        createdAt: posts.createdAt,
        authorId: posts.authorId,
        authorName: profiles.displayName,
        authorUsername: profiles.username,
        authorAvatar: profiles.avatarUrl,
        membership: profiles.membership,
      })
      .from(posts)
      .leftJoin(profiles, eq(posts.authorId, profiles.userId))
      .where(eq(posts.isArchived, false))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const mapped = rows.map((row) => mapPostRow(row));

    return c.json({
      posts: mapped,
      data: mapped,
      offset,
      limit,
    });
  });

  app.get("/socials/posts/mention", async (c) => {
    const q = (c.req.query("q") || "").trim();
    const limit = z.coerce
      .number()
      .int()
      .min(1)
      .max(20)
      .default(5)
      .parse(c.req.query("limit") ?? 5);

    const pattern = `%${q}%`;
    const rows = await db
      .select({
        userId: profiles.userId,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
        membership: profiles.membership,
        username: profiles.username,
      })
      .from(profiles)
      .where(
        q
          ? or(
              ilike(profiles.displayName, pattern),
              ilike(profiles.username, pattern)
            )
          : undefined
      )
      .limit(limit);

    return c.json({
      mention_users: rows.map((row) => ({
        _id: row.userId,
        display_name: row.displayName || row.username,
        profile_image: row.avatarUrl || "/images/centher.logo.favicon.png",
        membership: {
          last_status:
            (row.membership as "citizen" | "verified" | "none") || "citizen",
          status:
            (row.membership as "citizen" | "verified" | "none") || "citizen",
          endAt: 0,
        },
        mention_permission: "everyone" as const,
      })),
    });
  });

  /**
   * Phase 2 — Social write layer.
   * Static paths are registered before `/socials/posts/:id` so Hono matches
   * them first. Replies live in the `comments` table (one level deep).
   */

  // Own archived posts (auth required)
  app.get("/socials/posts/archived", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { limit, offset } = parseListQuery(c);

    const rows = await db
      .select({
        id: posts.id,
        body: posts.body,
        likeCount: posts.likeCount,
        commentCount: posts.commentCount,
        createdAt: posts.createdAt,
        authorId: posts.authorId,
        authorName: profiles.displayName,
        authorAvatar: profiles.avatarUrl,
        membership: profiles.membership,
      })
      .from(posts)
      .leftJoin(profiles, eq(posts.authorId, profiles.userId))
      .where(and(eq(posts.authorId, userId!), eq(posts.isArchived, true)))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const mapped = rows.map((row) => ({
      ...mapPostRow(row),
      status: "archived" as const,
      parent_post_id: undefined as string | undefined,
    }));
    return c.json({ posts: mapped, data: mapped, offset, limit });
  });

  // Own replies (from the comments table; the store reads `data.postsReplies`)
  app.get("/socials/posts/user/replies", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { limit, offset } = parseListQuery(c);

    const rows = await db
      .select({
        id: comments.id,
        body: comments.body,
        createdAt: comments.createdAt,
        authorId: comments.authorId,
        authorName: profiles.displayName,
        authorAvatar: profiles.avatarUrl,
        membership: profiles.membership,
        parentPostId: comments.postId,
      })
      .from(comments)
      .leftJoin(profiles, eq(comments.authorId, profiles.userId))
      .where(eq(comments.authorId, userId!))
      .orderBy(desc(comments.createdAt))
      .limit(limit)
      .offset(offset);

    const mapped = [];
    for (const row of rows) {
      const parent = await fetchPostRow(row.parentPostId);
      if (!parent) continue;
      mapped.push(
        mapCommentRow(row, {
          id: parent.id,
          createdAt: parent.createdAt,
          authorId: parent.authorId,
          authorName: parent.authorName,
          authorAvatar: parent.authorAvatar,
        })
      );
    }
    return c.json({ postsReplies: mapped, data: mapped, offset, limit });
  });

  // Posts by a user (top-level only; archived excluded)
  const handleUserPosts = async (c: any, withAuth: boolean) => {
    const targetUserId = z.string().min(1).parse(c.req.param("userId"));
    const { limit, offset } = parseListQuery(c);

    const rows = await db
      .select({
        id: posts.id,
        body: posts.body,
        likeCount: posts.likeCount,
        commentCount: posts.commentCount,
        createdAt: posts.createdAt,
        authorId: posts.authorId,
        authorName: profiles.displayName,
        authorAvatar: profiles.avatarUrl,
        membership: profiles.membership,
      })
      .from(posts)
      .leftJoin(profiles, eq(posts.authorId, profiles.userId))
      .where(and(eq(posts.authorId, targetUserId), eq(posts.isArchived, false)))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const liked = withAuth
      ? await getLikedPostIds(
          c.get("userId"),
          rows.map((r) => r.id)
        )
      : new Set<string>();
    const mapped = rows.map((row) =>
      mapPostRow(row, { likedByLoggedInUser: liked.has(row.id) })
    );
    return c.json({ posts: mapped, data: mapped, offset, limit });
  };
  app.get("/socials/posts/user/:userId", (c) => handleUserPosts(c, false));
  app.get("/socials/posts/user/:userId/with-auth", (c) =>
    handleUserPosts(c, true)
  );

  // Single post (+ /with-auth variant the client calls when logged in)
  const handleSinglePost = async (c: any, withAuth: boolean) => {
    const id = z.string().uuid().parse(c.req.param("id"));
    const row = await fetchPostRow(id);
    const viewerId = c.get("userId") as string | null;
    if (!row || (row.isArchived && row.authorId !== viewerId)) {
      apiError("Post not found", "NOT_FOUND", 404);
    }
    const liked = withAuth
      ? await getLikedPostIds(viewerId, [row!.id])
      : new Set<string>();
    const mapped = mapPostRow(row!, {
      likedByLoggedInUser: liked.has(row!.id),
    });
    return c.json({ posts: [mapped], data: [mapped] });
  };
  app.get("/socials/posts/:id", (c) => handleSinglePost(c, false));
  app.get("/socials/posts/:id/with-auth", (c) => handleSinglePost(c, true));

  // Replies to a post (from the comments table)
  const handlePostReplies = async (c: any, withAuth: boolean) => {
    const id = z.string().uuid().parse(c.req.param("id"));
    const { limit, offset } = parseListQuery(c);

    const parent = await fetchPostRow(id);
    if (!parent) apiError("Post not found", "NOT_FOUND", 404);

    const rows = await db
      .select({
        id: comments.id,
        body: comments.body,
        createdAt: comments.createdAt,
        authorId: comments.authorId,
        authorName: profiles.displayName,
        authorAvatar: profiles.avatarUrl,
        membership: profiles.membership,
      })
      .from(comments)
      .leftJoin(profiles, eq(comments.authorId, profiles.userId))
      .where(eq(comments.postId, id))
      .orderBy(desc(comments.createdAt))
      .limit(limit)
      .offset(offset);

    const mapped = rows.map((row) =>
      mapCommentRow(row, {
        id: parent!.id,
        createdAt: parent!.createdAt,
        authorId: parent!.authorId,
        authorName: parent!.authorName,
        authorAvatar: parent!.authorAvatar,
      })
    );
    return c.json({ posts: mapped, data: mapped, offset, limit });
  };
  app.get("/socials/posts/:id/replies", (c) => handlePostReplies(c, false));
  app.get("/socials/posts/:id/replies/with-auth", (c) =>
    handlePostReplies(c, true)
  );

  // Edit a post (owner only)
  app.patch("/socials/posts/:id", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const id = z.string().uuid().parse(c.req.param("id"));

    const payload = z
      .object({
        post_editor_state: z.any().optional(),
        text: z.string().min(1).max(5000).optional(),
        deleted_media: z.array(z.string()).optional().default([]),
      })
      .parse(await c.req.json());

    const existing = await fetchPostRow(id);
    if (!existing) apiError("Post not found", "NOT_FOUND", 404);
    if (existing!.authorId !== userId) apiError("Forbidden", "FORBIDDEN", 403);

    let newBody: string;
    if (payload.post_editor_state?.root) {
      newBody = JSON.stringify(payload.post_editor_state).slice(0, 20000);
    } else if (payload.text) {
      newBody = JSON.stringify(wrapPlainTextEditorState(payload.text)).slice(
        0,
        20000
      );
    } else {
      apiError("Nothing to update", "BAD_REQUEST", 400);
      newBody = "";
    }

    const [updated] = await db
      .update(posts)
      .set({ body: newBody })
      .where(eq(posts.id, id))
      .returning();
    const mapped = mapPostRow({
      id: updated.id,
      body: updated.body,
      likeCount: updated.likeCount,
      commentCount: updated.commentCount,
      createdAt: updated.createdAt,
      authorId: updated.authorId,
      authorName: existing!.authorName,
      authorAvatar: existing!.authorAvatar,
      membership: existing!.membership,
    });
    return c.json({ posts: [mapped], data: [mapped] });
  });

  // Archive / unarchive (owner only)
  const handleArchive = async (c: any, archived: boolean) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const id = z.string().uuid().parse(c.req.param("id"));

    const existing = await fetchPostRow(id);
    if (!existing) apiError("Post not found", "NOT_FOUND", 404);
    if (existing!.authorId !== userId) apiError("Forbidden", "FORBIDDEN", 403);

    await db
      .update(posts)
      .set({ isArchived: archived })
      .where(eq(posts.id, id));
    return c.json({ archived, post_id: id });
  };
  app.patch("/socials/posts/:id/archive", (c) => handleArchive(c, true));
  app.patch("/socials/posts/:id/unarchive", (c) => handleArchive(c, false));

  // Delete a post (owner only; comments + likes cascade)
  app.delete("/socials/posts/:id", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const id = z.string().uuid().parse(c.req.param("id"));

    const existing = await fetchPostRow(id);
    if (!existing) apiError("Post not found", "NOT_FOUND", 404);
    if (existing!.authorId !== userId) apiError("Forbidden", "FORBIDDEN", 403);

    await db.delete(posts).where(eq(posts.id, id));
    return c.json({ deleted: true, post_id: id });
  });

  // Like / unlike toggle
  app.post("/socials/analytics/likes", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { postId, actionType } = z
      .object({
        postId: z.string().uuid(),
        actionType: z.enum(["like", "unlike"]),
      })
      .parse(await c.req.json());

    const target = await fetchPostRow(postId);
    if (!target) apiError("Post not found", "NOT_FOUND", 404);

    if (actionType === "like") {
      await db
        .insert(postLikes)
        .values({ postId, userId: userId! })
        .onConflictDoNothing();
    } else {
      await db
        .delete(postLikes)
        .where(
          and(eq(postLikes.postId, postId), eq(postLikes.userId, userId!))
        );
    }

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(postLikes)
      .where(eq(postLikes.postId, postId));
    await db
      .update(posts)
      .set({ likeCount: count })
      .where(eq(posts.id, postId));

    return c.json({
      likes_count: count,
      liked: actionType === "like",
      post_id: postId,
    });
  });

  // Post view (impression) tracking
  app.post("/socials/analytics/post-views", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { post_id } = z
      .object({ post_id: z.string().uuid() })
      .parse(await c.req.json());

    const [updated] = await db
      .update(posts)
      .set({ viewCount: sql`${posts.viewCount} + 1` })
      .where(eq(posts.id, post_id))
      .returning({ viewCount: posts.viewCount });
    if (!updated) apiError("Post not found", "NOT_FOUND", 404);
    return c.json({ view_count: updated!.viewCount, post_id });
  });

  app.post("/socials/posts", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);

    const payload = await c.req.json();

    // Simple demo body: { body: "text" }
    if (typeof payload?.body === "string") {
      const text = z.string().min(1).max(5000).parse(payload.body);
      const [created] = await db
        .insert(posts)
        .values({ authorId: userId!, body: text })
        .returning();
      return c.json({ data: created }, 201);
    }

    // UI create-post payload: { replying_to, posts: [{ uuid, post_editor_state, media }] }
    // Phase 2: replying_to is honored — replies are stored in the `comments`
    // table and threaded under the parent post (see GET /:id/replies).
    const replyingTo = payload?.replying_to
      ? z.string().uuid().parse(payload.replying_to)
      : null;
    let parentRow: Awaited<ReturnType<typeof fetchPostRow>> | null = null;
    if (replyingTo) {
      parentRow = await fetchPostRow(replyingTo);
      if (!parentRow) apiError("Parent post not found", "NOT_FOUND", 404);
    }

    const postsInput = z
      .array(
        z.object({
          uuid: z.string().optional(),
          post_editor_state: z.any(),
          media: z.array(z.any()).optional().default([]),
        })
      )
      .min(1)
      .parse(payload.posts);

    const [authorProfile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId!))
      .limit(1);

    const createdMapped = [];
    for (const item of postsInput) {
      const text =
        extractTextFromEditorState(item.post_editor_state) || "(empty post)";
      const storedBody = item.post_editor_state?.root
        ? JSON.stringify(item.post_editor_state)
        : text;

      if (parentRow) {
        // Reply: store in comments, bump the parent's comment count
        const [reply] = await db
          .insert(comments)
          .values({
            postId: parentRow.id,
            authorId: userId!,
            body: storedBody.slice(0, 20000),
          })
          .returning();
        await db
          .update(posts)
          .set({ commentCount: sql`${posts.commentCount} + 1` })
          .where(eq(posts.id, parentRow.id));
        createdMapped.push(
          mapCommentRow(
            {
              id: reply.id,
              body: reply.body,
              createdAt: reply.createdAt,
              authorId: userId!,
              authorName: authorProfile?.displayName || "Centher Demo",
              authorAvatar:
                authorProfile?.avatarUrl || "/images/centher.logo.favicon.png",
              membership: authorProfile?.membership || "citizen",
            },
            {
              id: parentRow.id,
              createdAt: parentRow.createdAt,
              authorId: parentRow.authorId,
              authorName: parentRow.authorName,
              authorAvatar: parentRow.authorAvatar,
            }
          )
        );
        continue;
      }

      const [created] = await db
        .insert(posts)
        .values({
          authorId: userId!,
          body: storedBody.slice(0, 20000),
        })
        .returning();

      createdMapped.push(
        mapPostRow({
          id: created.id,
          body: created.body,
          likeCount: created.likeCount,
          commentCount: created.commentCount,
          createdAt: created.createdAt,
          authorId: userId!,
          authorName: authorProfile?.displayName || "Centher Demo",
          authorAvatar:
            authorProfile?.avatarUrl || "/images/centher.logo.favicon.png",
          membership: authorProfile?.membership || "citizen",
        })
      );
    }

    return c.json({ posts: createdMapped, data: createdMapped }, 201);
  });

  // Phase 2: honest 501 — no S3/media pipeline is configured, so presigned
  // URLs cannot be issued. The client catches this and posts text-only.
  app.post("/socials/posts/media/presigned-urls", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    return c.json(
      {
        message: "Media uploads are not configured on this deployment",
        code: "MEDIA_UPLOAD_UNAVAILABLE",
      },
      501
    );
  });

  app.get("/chat/conversations", async (c) => {
    const rows = await db
      .select()
      .from(conversations)
      .orderBy(desc(conversations.createdAt));
    return c.json({ data: rows });
  });

  app.get("/chat/conversations/:id/messages", async (c) => {
    const id = c.req.param("id");
    const rows = await db
      .select({
        id: messages.id,
        body: messages.body,
        senderId: messages.senderId,
        createdAt: messages.createdAt,
        senderName: profiles.displayName,
      })
      .from(messages)
      .leftJoin(profiles, eq(messages.senderId, profiles.userId))
      .where(eq(messages.conversationId, id))
      .orderBy(messages.createdAt);
    return c.json({ data: rows });
  });

  app.get("/stream/channels", async (c) => {
    const rows = await db
      .select({
        id: channels.id,
        name: channels.name,
        description: channels.description,
        kind: channels.kind,
        isLive: channels.isLive,
        memberCount: channels.memberCount,
        hostId: channels.hostId,
        hostName: profiles.displayName,
        createdAt: channels.createdAt,
      })
      .from(channels)
      .leftJoin(profiles, eq(channels.hostId, profiles.userId))
      .orderBy(desc(channels.createdAt));
    return c.json({ data: rows });
  });

  app.get("/stream/channels/:id", async (c) => {
    const id = c.req.param("id");
    const [channel] = await db
      .select()
      .from(channels)
      .where(eq(channels.id, id))
      .limit(1);
    if (!channel) apiError("Channel not found", "NOT_FOUND", 404);

    const msgs = await db
      .select()
      .from(channelMessages)
      .where(eq(channelMessages.channelId, id))
      .orderBy(channelMessages.createdAt)
      .limit(50);

    return c.json({
      data: {
        ...channel,
        messages: msgs,
        media: {
          mode: "demo",
          note: "Voice/WebRTC is simulated for demo. Room state and chat are live from Neon.",
        },
      },
    });
  });

  app.get("/marketplace/nfts", async (c) => {
    const { page, limit } = paginationSchema.parse({
      page: c.req.query("page") ?? 1,
      limit: c.req.query("limit") ?? 12,
    });
    const offset = (page - 1) * limit;

    const rows = await db
      .select({
        id: nfts.id,
        name: nfts.name,
        description: nfts.description,
        imageUrl: nfts.imageUrl,
        price: nfts.price,
        listed: nfts.listed,
        collectionId: nfts.collectionId,
        collectionName: collections.name,
        ownerId: nfts.ownerId,
      })
      .from(nfts)
      .leftJoin(collections, eq(nfts.collectionId, collections.id))
      .where(eq(nfts.listed, true))
      .orderBy(desc(nfts.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(nfts)
      .where(eq(nfts.listed, true));

    return c.json({
      data: rows,
      page,
      limit,
      total: count,
      totalPages: Math.max(1, Math.ceil(count / limit)),
    });
  });

  app.get("/marketplace/collections", async (c) => {
    const rows = await db
      .select()
      .from(collections)
      .orderBy(desc(collections.createdAt));
    return c.json({ data: rows });
  });

  app.get("/staking/pools", async (c) => {
    const rows = await db
      .select()
      .from(stakingPools)
      .orderBy(desc(stakingPools.createdAt));
    return c.json({ data: rows });
  });

  app.get("/launchpads", async (c) => {
    const rows = await db
      .select()
      .from(launchpads)
      .orderBy(desc(launchpads.createdAt));
    return c.json({ data: rows });
  });

  app.get("/citizenship/me", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const [row] = await db
      .select()
      .from(citizenships)
      .where(eq(citizenships.userId, userId!))
      .limit(1);
    return c.json({ data: row ?? null });
  });

  app.get("/profiles/:userId", async (c) => {
    const userId = c.req.param("userId");
    const [profile] = await db
      .select()
      .from(profiles)
      .where(and(eq(profiles.userId, userId)))
      .limit(1);
    if (!profile) apiError("Profile not found", "NOT_FOUND", 404);
    return c.json({ data: profile });
  });

  /**
   * Phase 1: honest 501 for unmapped API routes — no mock-backed 200s.
   * Real endpoints are added phase by phase (see centher-plan.md); genuinely
   * unknown calls are logged server-side so they show up in Vercel/Node logs.
   */
  app.all("*", (c) => {
    const method = c.req.method;
    const path = c.req.path;
    console.warn(`[api] 501 unmapped route: ${method} ${path}`);
    return c.json(
      {
        message: "Endpoint not implemented yet",
        code: "NOT_IMPLEMENTED",
        path,
      },
      501
    );
  });

  return app;
};

export type HonoApp = ReturnType<typeof createHonoApp>;
