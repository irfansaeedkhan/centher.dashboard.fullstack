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
  follows,
  launchpads,
  messages,
  nfts,
  notifications,
  orgInvites,
  orgMembers,
  postLikes,
  posts,
  profiles,
  recentSearches,
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

/** Phase 3: map a profile+user row to the user-card shape the UI expects. */
const mapUserCard = (
  row: {
    userId: string;
    displayName: string | null;
    avatarUrl: string | null;
    membership: string | null;
  },
  opts?: { isFollowedByLoggedInUser?: boolean }
) => ({
  _id: row.userId,
  display_name: row.displayName || "Centher User",
  profile_image: row.avatarUrl || "/images/centher.logo.favicon.png",
  membership: {
    last_status:
      (row.membership as "citizen" | "verified" | "none") || "citizen",
    status: (row.membership as "citizen" | "verified" | "none") || "citizen",
    endAt: 0,
  },
  is_followed_by_loggedin_user: opts?.isFollowedByLoggedInUser ?? false,
});

/** Phase 3: which of these user ids the viewer follows. */
const getFollowedUserIds = async (
  viewerId: string | null,
  targetIds: string[]
): Promise<Set<string>> => {
  if (!viewerId || targetIds.length === 0) return new Set<string>();
  const rows = await db
    .select({ followingId: follows.followingId })
    .from(follows)
    .where(
      and(
        eq(follows.followerId, viewerId),
        inArray(follows.followingId, targetIds)
      )
    );
  return new Set(rows.map((r) => r.followingId));
};

/** Phase 3: follower/following counts for a user. */
const getFollowCounts = async (userId: string) => {
  const [followersRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(follows)
    .where(eq(follows.followingId, userId));
  const [followingRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(follows)
    .where(eq(follows.followerId, userId));
  return {
    followersCount: followersRow?.count ?? 0,
    followingCount: followingRow?.count ?? 0,
  };
};

/** Phase 3: fetch profile rows for a list of user ids (single query). */
const fetchUserCards = async (userIds: string[], viewerId: string | null) => {
  if (userIds.length === 0) return [];
  const rows = await db
    .select({
      userId: profiles.userId,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
      membership: profiles.membership,
    })
    .from(profiles)
    .where(inArray(profiles.userId, userIds));
  const followed = await getFollowedUserIds(viewerId, userIds);
  // Preserve the requested order.
  const byId = new Map(rows.map((r) => [r.userId, r]));
  return userIds
    .map((id) => byId.get(id))
    .filter((r): r is NonNullable<typeof r> => !!r)
    .map((r) =>
      mapUserCard(r, { isFollowedByLoggedInUser: followed.has(r.userId) })
    );
};

/** Phase 3: create an in-app notification (never notifies self). */
const createNotification = async (input: {
  userId: string;
  type: string;
  actorId: string | null;
  postId?: string | null;
}) => {
  if (input.actorId && input.actorId === input.userId) return;
  await db.insert(notifications).values({
    userId: input.userId,
    type: input.type,
    actorId: input.actorId,
    postId: input.postId ?? null,
    status: "unread",
  });
};

/** Phase 3: map a notification row to the shape the notifications UI reads. */
const mapNotificationRow = (row: {
  id: string;
  type: string;
  status: string | null;
  createdAt: Date | string;
  postId: string | null;
  actorId: string | null;
  actorName: string | null;
  actorAvatar: string | null;
  actorMembership: string | null;
}) => ({
  _id: row.id,
  type: row.type,
  status: row.status || "unread",
  createdAt:
    row.createdAt instanceof Date
      ? row.createdAt.toISOString()
      : String(row.createdAt),
  post_id: row.postId,
  by: {
    _id: row.actorId || "",
    display_name: row.actorName || "Centher User",
    profile_image: row.actorAvatar || "/images/centher.logo.favicon.png",
    membership: {
      last_status:
        (row.actorMembership as "citizen" | "verified" | "none") || "citizen",
      status:
        (row.actorMembership as "citizen" | "verified" | "none") || "citizen",
      endAt: 0,
    },
  },
});

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
    // Phase 3 carry-forward: invalid params (bad UUIDs, bad query values)
    // are client errors, not 500s.
    if (err instanceof z.ZodError) {
      return c.json(
        {
          message: "Invalid request",
          code: "VALIDATION_ERROR",
          issues: err.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        400
      );
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

  /**
   * Phase 4: single source of truth for the LoggedInUser shape.
   * GET /users/me and every PATCH below return this so the client's
   * `mutate("/api/users/me", updatedUserRes, false)` stays consistent.
   */
  const toMembershipStatus = (m: string | null | undefined) =>
    m === "citizen" || m === "verified" ? m : "citizen";

  const SOCIAL_MEDIA_DEFAULTS: Record<string, string> = {
    website_url: "",
    twitter_username: "",
    facebook_username: "",
    instagram_username: "",
    twitch_username: "",
    onlyfans_username: "",
    youtube_url: "",
    tiktok_username: "",
    telegram_username: "",
  };

  /**
   * Phase 4: the org a user belongs to as a team member (legacy 369x model:
   * every citizen account is its own org; members join the owner's account).
   */
  const fetchOrganizationOf = async (
    userId: string
  ): Promise<{
    org_id: string;
    profile_image: string;
    title: string;
    joined_at: string;
  } | null> => {
    const [membership] = await db
      .select()
      .from(orgMembers)
      .where(eq(orgMembers.memberId, userId))
      .limit(1);
    if (!membership) return null;
    const [ownerProfile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, membership.orgOwnerId))
      .limit(1);
    return {
      org_id: membership.orgOwnerId,
      profile_image:
        ownerProfile?.avatarUrl || "/images/centher.logo.favicon.png",
      title: membership.title,
      joined_at: membership.joinedAt.toISOString(),
    };
  };

  const buildLoggedInUser = async (userId: string) => {
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

    const membershipStatus = toMembershipStatus(profile?.membership);

    const organization = await fetchOrganizationOf(userId);

    // Shape matches LoggedInUser used by useUser / header
    return {
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
        ...SOCIAL_MEDIA_DEFAULTS,
        ...((profile?.socialLinks as Record<string, string> | null) ?? {}),
      },
      organization,
      createdAt:
        authUser?.createdAt?.toISOString?.() || new Date().toISOString(),
      updatedAt:
        authUser?.updatedAt?.toISOString?.() || new Date().toISOString(),
      first_name: authUser?.name?.split(" ")[0] || "Centher",
      last_name: authUser?.name?.split(" ").slice(1).join(" ") || "Demo",
      pseudonym: profile?.username || "centher_demo",
      referrer_address: null,
      display_name_field:
        (profile?.displayNameField as
          | "real_name"
          | "pseudonym"
          | "account_address") || "pseudonym",
      has_seen_notifications_page: true,
      // null until the user answers — the consent banner shows then.
      cookies_consent:
        (profile?.cookiesConsent as {
          consent_given: boolean;
          timestamp: string;
        } | null) ?? null,
      email: authUser?.email,
    };
  };

  /** Ensure a profiles row exists (fresh sign-ups may not have one yet). */
  const ensureProfile = async (userId: string, authName: string) => {
    const [existing] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);
    if (existing) return existing;
    const base = `user_${userId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12)}`;
    const [created] = await db
      .insert(profiles)
      .values({
        userId,
        displayName: authName || "Centher Demo",
        username: base,
      })
      .returning();
    return created;
  };

  const resolveDisplayName = (
    field: "real_name" | "pseudonym" | "account_address",
    opts: { username: string; realName: string; userId: string }
  ) =>
    field === "real_name"
      ? opts.realName
      : field === "account_address"
      ? opts.userId
      : opts.username;

  app.get("/users/me", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    return c.json(await buildLoggedInUser(userId!));
  });

  const SOCIAL_MEDIA_KEYS = Object.keys(SOCIAL_MEDIA_DEFAULTS);

  const updateMeSchema = z.object({
    pseudonym: z
      .string()
      .trim()
      .min(1)
      .max(50)
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Pseudonym may only contain letters, numbers and underscores"
      )
      .optional(),
    first_name: z.string().trim().max(100).optional(),
    last_name: z.string().trim().max(100).optional(),
    display_name_field: z
      .enum(["real_name", "pseudonym", "account_address"])
      .optional(),
    profile_bio: z.string().max(160).optional(),
    ...Object.fromEntries(
      SOCIAL_MEDIA_KEYS.map((k) => [k, z.string().trim().max(200).optional()])
    ),
  });

  /**
   * Phase 4: profile/about/social-links saves. Persists to profiles (+ the
   * Better Auth user row for the real name) and returns the full LoggedInUser
   * shape so the client's SWR cache stays consistent — no more
   * success-toast-then-revert.
   */
  app.patch("/users/me", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const body = updateMeSchema.parse(await c.req.json().catch(() => ({})));

    const [authUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId!))
      .limit(1);
    if (!authUser) apiError("User not found", "NOT_FOUND", 404);
    const profile = await ensureProfile(userId!, authUser!.name);

    const profilePatch: Partial<typeof profiles.$inferInsert> = {};
    let newUsername = profile.username;
    let newRealName = authUser!.name;

    if (body.first_name !== undefined || body.last_name !== undefined) {
      const first = body.first_name ?? authUser!.name.split(" ")[0] ?? "";
      const last =
        body.last_name ?? authUser!.name.split(" ").slice(1).join(" ") ?? "";
      newRealName = `${first} ${last}`.trim() || authUser!.name;
      await db
        .update(user)
        .set({ name: newRealName, updatedAt: new Date() })
        .where(eq(user.id, userId!));
    }

    if (body.pseudonym !== undefined && body.pseudonym !== profile.username) {
      const [taken] = await db
        .select({ id: profiles.userId })
        .from(profiles)
        .where(eq(profiles.username, body.pseudonym))
        .limit(1);
      if (taken && taken.id !== userId)
        apiError("That pseudonym is already taken", "CONFLICT", 409);
      newUsername = body.pseudonym;
      profilePatch.username = body.pseudonym;
    }

    const newField =
      body.display_name_field ??
      (profile.displayNameField as
        | "real_name"
        | "pseudonym"
        | "account_address");
    if (body.display_name_field !== undefined) {
      profilePatch.displayNameField = body.display_name_field;
    }
    if (
      body.pseudonym !== undefined ||
      body.first_name !== undefined ||
      body.last_name !== undefined ||
      body.display_name_field !== undefined
    ) {
      profilePatch.displayName = resolveDisplayName(newField, {
        username: newUsername,
        realName: newRealName,
        userId: userId!,
      });
    }

    if (body.profile_bio !== undefined) {
      profilePatch.bio = body.profile_bio;
    }

    const socialPatch: Record<string, string> = {};
    for (const k of SOCIAL_MEDIA_KEYS) {
      const v = (body as Record<string, string | undefined>)[k];
      if (v !== undefined) socialPatch[k] = v;
    }
    if (Object.keys(socialPatch).length > 0) {
      profilePatch.socialLinks = {
        ...((profile.socialLinks as Record<string, string> | null) ?? {}),
        ...socialPatch,
      };
    }

    if (Object.keys(profilePatch).length > 0) {
      await db
        .update(profiles)
        .set(profilePatch)
        .where(eq(profiles.userId, userId!));
    }

    return c.json(await buildLoggedInUser(userId!));
  });

  app.patch("/users/cookies-consent", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const body = z
      .object({ consent_given: z.boolean() })
      .parse(await c.req.json().catch(() => ({})));
    const [authUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId!))
      .limit(1);
    await ensureProfile(userId!, authUser?.name || "Centher Demo");
    await db
      .update(profiles)
      .set({
        cookiesConsent: {
          consent_given: body.consent_given,
          timestamp: new Date().toISOString(),
        },
      })
      .where(eq(profiles.userId, userId!));
    return c.json(await buildLoggedInUser(userId!));
  });

  const MENTION_PERMISSIONS = [
    "everyone",
    "followers",
    "followings",
    "followers_and_followings",
    "no_one",
  ] as const;

  app.get("/users/mention-permission", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const [profile] = await db
      .select({ mentionPermission: profiles.mentionPermission })
      .from(profiles)
      .where(eq(profiles.userId, userId!))
      .limit(1);
    return c.json({
      mention_permission: profile?.mentionPermission ?? "everyone",
    });
  });

  app.patch("/users/mention-permission", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const body = z
      .object({ mention_permission: z.enum(MENTION_PERMISSIONS) })
      .parse(await c.req.json().catch(() => ({})));
    const [authUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId!))
      .limit(1);
    await ensureProfile(userId!, authUser?.name || "Centher Demo");
    await db
      .update(profiles)
      .set({ mentionPermission: body.mention_permission })
      .where(eq(profiles.userId, userId!));
    return c.json(await buildLoggedInUser(userId!));
  });

  /**
   * Phase 3: batch user read for chat user resolution.
   * `GET /users?user_ids=a,b,c` → `{ users: [...] }`.
   * Registered before `/users/:userId` (static wins, but explicit is safer).
   */
  app.get("/users", async (c) => {
    // Phase 4: the legacy file-service read (`?key=`) has no backend in this
    // build — fail honestly instead of returning a misleading empty list.
    if (c.req.query("key")) {
      return apiError(
        "File-service reads are not available in this build",
        "NOT_IMPLEMENTED",
        501
      );
    }
    const raw = c.req.query("user_ids") ?? "";
    const ids = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 100);
    const viewerId = c.get("userId");
    const users = await fetchUserCards(ids, viewerId);
    return c.json({ users });
  });

  /**
   * Phase 4: preset avatars. There is no object-storage backend in this
   * build, so custom uploads are an honest 501 — but picking one of the
   * bundled presets is a real, persisted choice.
   */
  const PRESET_AVATARS = [
    { path: "/images/___chat-bot.png", object_name: "preset:___chat-bot.png" },
    {
      path: "/images/___contract-bot.png",
      object_name: "preset:___contract-bot.png",
    },
    {
      path: "/images/___crypto-signals.png",
      object_name: "preset:___crypto-signals.png",
    },
    {
      path: "/images/___exchange-bot.png",
      object_name: "preset:___exchange-bot.png",
    },
    {
      path: "/images/___staking-bot.png",
      object_name: "preset:___staking-bot.png",
    },
    {
      path: "/images/___trade-bot.png",
      object_name: "preset:___trade-bot.png",
    },
    {
      path: "/images/antonio-de-rosa.png",
      object_name: "preset:antonio-de-rosa.png",
    },
    {
      path: "/images/antonio-monaco.png",
      object_name: "preset:antonio-monaco.png",
    },
  ];

  app.get("/avatars", (c) => c.json(PRESET_AVATARS));

  app.get("/users/image-upload-url", (c) => {
    if (!c.get("userId")) apiError("Unauthorized", "UNAUTHORIZED", 401);
    return apiError(
      "Custom image uploads are not available in this build — choose a preset avatar instead",
      "NOT_IMPLEMENTED",
      501
    );
  });

  app.patch("/users/image", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const body = z
      .object({
        type: z.enum(["profile_image", "cover_image"]),
        object_name: z.string().min(1),
      })
      .parse(await c.req.json().catch(() => ({})));
    const preset = PRESET_AVATARS.find(
      (a) => a.object_name === body.object_name
    );
    // Only bundled presets can be persisted — there is no object storage
    // for custom uploads in this build.
    if (body.type !== "profile_image" || !preset) {
      return apiError(
        "Custom image uploads are not available in this build — choose a preset avatar instead",
        "NOT_IMPLEMENTED",
        501
      );
    }
    const [authUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId!))
      .limit(1);
    await ensureProfile(userId!, authUser?.name || "Centher Demo");
    await db
      .update(profiles)
      .set({ avatarUrl: preset.path })
      .where(eq(profiles.userId, userId!));
    return c.json({ profile_image: preset.path });
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
    const membershipStatus = toMembershipStatus(profile?.membership);
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
        ...SOCIAL_MEDIA_DEFAULTS,
        ...((profile?.socialLinks as Record<string, string> | null) ?? {}),
      },
      organization: await fetchOrganizationOf(userId),
      createdAt:
        authUser?.createdAt?.toISOString?.() || new Date().toISOString(),
      updatedAt:
        authUser?.updatedAt?.toISOString?.() || new Date().toISOString(),
    });
  });

  /**
   * Phase 4: orgs / team members. Legacy 369x model — every citizen account
   * is its own org; team members join the org owner's account. All routes
   * auth-gated; mutations are owner- or invitee-scoped.
   */
  const toOrgUserCard = (
    id: string,
    p: typeof profiles.$inferSelect | undefined,
    a: typeof user.$inferSelect | undefined
  ) => ({
    _id: id,
    display_name: p?.displayName || a?.name || "Centher User",
    profile_image: p?.avatarUrl || "/images/centher.logo.favicon.png",
    membership: {
      last_status: toMembershipStatus(p?.membership),
      status: toMembershipStatus(p?.membership),
      endAt: 0,
    },
  });

  const fetchOrgUserCards = async (userIds: string[]) => {
    if (userIds.length === 0) return [];
    const pRows = await db
      .select()
      .from(profiles)
      .where(inArray(profiles.userId, userIds));
    const aRows = await db.select().from(user).where(inArray(user.id, userIds));
    const pById = new Map(pRows.map((r) => [r.userId, r]));
    const aById = new Map(aRows.map((r) => [r.id, r]));
    return userIds
      .map((id) => {
        const p = pById.get(id);
        const a = aById.get(id);
        if (!p && !a) return null;
        return toOrgUserCard(id, p, a);
      })
      .filter((c): c is NonNullable<typeof c> => !!c);
  };

  const toPendingInvite = async (invite: typeof orgInvites.$inferSelect) => {
    const [ownerCard] = await fetchOrgUserCards([invite.orgOwnerId]);
    const [inviteeCard] = await fetchOrgUserCards([invite.inviteeId]);
    return {
      _id: invite.id,
      org: ownerCard ?? toOrgUserCard(invite.orgOwnerId, undefined, undefined),
      user:
        inviteeCard ?? toOrgUserCard(invite.inviteeId, undefined, undefined),
      title: invite.title,
      invited_at: invite.createdAt.toISOString(),
    };
  };

  const requireInvitee = async (inviteId: string, me: string) => {
    const [invite] = await db
      .select()
      .from(orgInvites)
      .where(eq(orgInvites.id, inviteId))
      .limit(1);
    if (!invite) apiError("Invite not found", "NOT_FOUND", 404);
    if (invite!.inviteeId !== me)
      apiError(
        "Only the invited user can act on this invite",
        "FORBIDDEN",
        403
      );
    if (invite!.status !== "pending")
      apiError("This invite is no longer pending", "CONFLICT", 409);
    return invite!;
  };

  app.get("/orgs/members/invites/received", async (c) => {
    const me = c.get("userId");
    if (!me) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const rows = await db
      .select()
      .from(orgInvites)
      .where(
        and(eq(orgInvites.inviteeId, me!), eq(orgInvites.status, "pending"))
      )
      .orderBy(desc(orgInvites.createdAt));
    return c.json(await Promise.all(rows.map(toPendingInvite)));
  });

  app.get("/orgs/members/invites/sent", async (c) => {
    const me = c.get("userId");
    if (!me) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const rows = await db
      .select()
      .from(orgInvites)
      .where(
        and(eq(orgInvites.inviterId, me!), eq(orgInvites.status, "pending"))
      )
      .orderBy(desc(orgInvites.createdAt));
    return c.json(await Promise.all(rows.map(toPendingInvite)));
  });

  app.post("/orgs/members/invites", async (c) => {
    const me = c.get("userId");
    if (!me) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const body = z
      .object({
        user_id: z.string().min(1, "A user is required"),
        title: z.string().trim().min(1, "A title is required").max(100),
      })
      .parse(await c.req.json().catch(() => ({})));
    if (body.user_id === me)
      apiError("You cannot invite yourself", "BAD_REQUEST", 400);
    const [invitee] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, body.user_id))
      .limit(1);
    if (!invitee) apiError("User not found", "NOT_FOUND", 404);
    const [alreadyMember] = await db
      .select({ memberId: orgMembers.memberId })
      .from(orgMembers)
      .where(
        and(
          eq(orgMembers.orgOwnerId, me!),
          eq(orgMembers.memberId, body.user_id)
        )
      )
      .limit(1);
    if (alreadyMember)
      apiError("This user is already a team member", "CONFLICT", 409);
    const [pending] = await db
      .select({ id: orgInvites.id })
      .from(orgInvites)
      .where(
        and(
          eq(orgInvites.orgOwnerId, me!),
          eq(orgInvites.inviteeId, body.user_id),
          eq(orgInvites.status, "pending")
        )
      )
      .limit(1);
    if (pending) apiError("An invite is already pending", "CONFLICT", 409);
    const [invite] = await db
      .insert(orgInvites)
      .values({
        orgOwnerId: me!,
        inviterId: me!,
        inviteeId: body.user_id,
        title: body.title,
      })
      .returning();
    return c.json(await toPendingInvite(invite), 201);
  });

  app.post("/orgs/members/invites/:inviteId/accept", async (c) => {
    const me = c.get("userId");
    if (!me) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const invite = await requireInvitee(c.req.param("inviteId"), me!);
    await db
      .insert(orgMembers)
      .values({
        orgOwnerId: invite.orgOwnerId,
        memberId: invite.inviteeId,
        title: invite.title,
      })
      .onConflictDoNothing();
    await db
      .update(orgInvites)
      .set({ status: "accepted" })
      .where(eq(orgInvites.id, invite.id));
    return c.json(await toPendingInvite({ ...invite, status: "accepted" }));
  });

  app.post("/orgs/members/invites/:inviteId/reject", async (c) => {
    const me = c.get("userId");
    if (!me) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const invite = await requireInvitee(c.req.param("inviteId"), me!);
    await db
      .update(orgInvites)
      .set({ status: "rejected" })
      .where(eq(orgInvites.id, invite.id));
    return c.json(await toPendingInvite({ ...invite, status: "rejected" }));
  });

  app.delete("/orgs/members/invites/:inviteId", async (c) => {
    const me = c.get("userId");
    if (!me) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const [invite] = await db
      .select()
      .from(orgInvites)
      .where(eq(orgInvites.id, c.req.param("inviteId")))
      .limit(1);
    if (!invite) apiError("Invite not found", "NOT_FOUND", 404);
    if (invite!.inviterId !== me)
      apiError("Only the inviter can delete this invite", "FORBIDDEN", 403);
    await db.delete(orgInvites).where(eq(orgInvites.id, invite!.id));
    return c.json({ ok: true });
  });

  app.get("/orgs/members/:orgId", async (c) => {
    const viewer = c.get("userId");
    if (!viewer) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const orgId = c.req.param("orgId");
    const [owner] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, orgId))
      .limit(1);
    if (!owner) apiError("Organization not found", "NOT_FOUND", 404);
    const rows = await db
      .select()
      .from(orgMembers)
      .where(eq(orgMembers.orgOwnerId, orgId))
      .orderBy(orgMembers.joinedAt);
    const cards = await fetchOrgUserCards(rows.map((r) => r.memberId));
    const byId = new Map(cards.map((cc) => [cc._id, cc]));
    return c.json({
      members: rows.flatMap((r) => {
        const card = byId.get(r.memberId);
        return card
          ? [{ ...card, title: r.title, joined_at: r.joinedAt.toISOString() }]
          : [];
      }),
    });
  });

  app.patch("/orgs/members/:userId", async (c) => {
    const me = c.get("userId");
    if (!me) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const body = z
      .object({ title: z.string().trim().min(1).max(100) })
      .parse(await c.req.json().catch(() => ({})));
    const [member] = await db
      .select()
      .from(orgMembers)
      .where(
        and(
          eq(orgMembers.orgOwnerId, me!),
          eq(orgMembers.memberId, c.req.param("userId"))
        )
      )
      .limit(1);
    if (!member) apiError("Team member not found", "NOT_FOUND", 404);
    await db
      .update(orgMembers)
      .set({ title: body.title })
      .where(
        and(
          eq(orgMembers.orgOwnerId, me!),
          eq(orgMembers.memberId, c.req.param("userId"))
        )
      );
    return c.json({ ok: true });
  });

  app.delete("/orgs/members/:userId", async (c) => {
    const me = c.get("userId");
    if (!me) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const target = c.req.param("userId");
    if (target === me)
      apiError(
        "You cannot remove yourself — leave the organization instead",
        "BAD_REQUEST",
        400
      );
    const [member] = await db
      .select()
      .from(orgMembers)
      .where(
        and(eq(orgMembers.orgOwnerId, me!), eq(orgMembers.memberId, target))
      )
      .limit(1);
    if (!member) apiError("Team member not found", "NOT_FOUND", 404);
    await db
      .delete(orgMembers)
      .where(
        and(eq(orgMembers.orgOwnerId, me!), eq(orgMembers.memberId, target))
      );
    return c.json({ ok: true });
  });

  app.delete("/orgs/leave", async (c) => {
    const me = c.get("userId");
    if (!me) apiError("Unauthorized", "UNAUTHORIZED", 401);
    await db.delete(orgMembers).where(eq(orgMembers.memberId, me!));
    return c.json({ ok: true });
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

  /**
   * Phase 3: profile-card stats are real now (follows table + view counters).
   * The `/with-auth` variant the client calls when logged in shares the same
   * handler — the old copy-pasted duplicate handler is gone.
   */
  const handleProfileCard = async (c: any) => {
    const userId = z.string().min(1).parse(c.req.param("userId"));
    const [{ count: postsCount }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(and(eq(posts.authorId, userId), eq(posts.isArchived, false)));
    const [{ views: postsViews }] = await db
      .select({ views: sql<number>`coalesce(sum(${posts.viewCount}),0)::int` })
      .from(posts)
      .where(eq(posts.authorId, userId));
    const [profile] = await db
      .select({ viewCount: profiles.viewCount })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);
    const { followersCount, followingCount } = await getFollowCounts(userId);

    return c.json({
      profileCardDetails: {
        _id: userId,
        posts_count: postsCount ?? 0,
        followers_count: followersCount,
        following_count: followingCount,
        total_referrees: 0,
        posts_views_count: postsViews ?? 0,
        profile_views_count: profile?.viewCount ?? 0,
      },
    });
  };
  app.get("/socials/analytics/profile-card/:userId", (c) =>
    handleProfileCard(c)
  );
  app.get("/socials/analytics/profile-card/:userId/with-auth", (c) =>
    handleProfileCard(c)
  );

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
    // Phase 3 carry-forward: archived posts are invisible to non-owners —
    // same guard as GET /:id.
    const viewerId = c.get("userId") as string | null;
    if (parent!.isArchived && parent!.authorId !== viewerId)
      apiError("Post not found", "NOT_FOUND", 404);

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
      // Phase 3: notify the post author (never self — helper guards it).
      await createNotification({
        userId: target!.authorId,
        type: "post_like",
        actorId: userId!,
        postId,
      });
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

  // ---------------------------------------------------------------------------
  // Phase 3: social graph — follows, counts, profile views, search,
  // notifications. All zod-validated, auth-gated, user-scoped.
  // ---------------------------------------------------------------------------

  // Profile view tracking (mirrors post-views; feeds profile-card stats)
  app.post("/socials/analytics/profile-views", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { user_id } = z
      .object({ user_id: z.string().min(1) })
      .parse(await c.req.json());

    const [updated] = await db
      .update(profiles)
      .set({ viewCount: sql`${profiles.viewCount} + 1` })
      .where(eq(profiles.userId, user_id))
      .returning({ viewCount: profiles.viewCount });
    if (!updated) apiError("User not found", "NOT_FOUND", 404);
    return c.json({ profile_views_count: updated.viewCount, user_id });
  });

  // Follow / unfollow toggle. The client (profile.header) keys its UI off
  // the exact `message` values below — keep them stable.
  app.post("/socials/followers", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { following_id } = z
      .object({ following_id: z.string().min(1) })
      .parse(await c.req.json());

    if (following_id === userId)
      apiError("You cannot follow yourself", "BAD_REQUEST", 400);
    const [target] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, following_id))
      .limit(1);
    if (!target) apiError("User not found", "NOT_FOUND", 404);

    const [existing] = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, userId!),
          eq(follows.followingId, following_id)
        )
      )
      .limit(1);

    if (existing) {
      await db
        .delete(follows)
        .where(
          and(
            eq(follows.followerId, userId!),
            eq(follows.followingId, following_id)
          )
        );
      return c.json({ message: "unfollow_success" });
    }

    await db
      .insert(follows)
      .values({
        followerId: userId!,
        followingId: following_id,
      })
      .onConflictDoNothing();
    await createNotification({
      userId: following_id,
      type: "follow",
      actorId: userId!,
    });
    return c.json({ message: "follow_success" });
  });

  // Is the viewer following this user? (+ /with-auth variant the client
  // appends outside development)
  const handleIsFollowed = async (c: any) => {
    const viewerId = c.get("userId");
    const targetId = z.string().min(1).parse(c.req.param("id"));
    if (!viewerId) return c.json({ is_followed: false });
    const [row] = await db
      .select()
      .from(follows)
      .where(
        and(eq(follows.followerId, viewerId), eq(follows.followingId, targetId))
      )
      .limit(1);
    return c.json({ is_followed: !!row });
  };
  app.get("/socials/followers/is-followed/:id", (c) => handleIsFollowed(c));
  app.get("/socials/followers/is-followed/:id/with-auth", (c) =>
    handleIsFollowed(c)
  );

  // Users following me / users I follow (chat sidebar + followers pages).
  // Registered before the `:userId` param route below.
  app.get("/socials/users/my-followers", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { limit, offset } = parseListQuery(c);
    const rows = await db
      .select({ followerId: follows.followerId })
      .from(follows)
      .where(eq(follows.followingId, userId!))
      .orderBy(desc(follows.createdAt))
      .limit(limit)
      .offset(offset);
    const followers = await fetchUserCards(
      rows.map((r) => r.followerId),
      userId!
    );
    return c.json({ followers });
  });

  app.get("/socials/users/my-following", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { limit, offset } = parseListQuery(c);
    const rows = await db
      .select({ followingId: follows.followingId })
      .from(follows)
      .where(eq(follows.followerId, userId!))
      .orderBy(desc(follows.createdAt))
      .limit(limit)
      .offset(offset);
    const following = await fetchUserCards(
      rows.map((r) => r.followingId),
      userId!
    );
    return c.json({ following });
  });

  // Sidebar/header badge counts: unread notifications + active chats.
  app.get("/socials/users/counts", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const [{ count: unread }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId!),
          eq(notifications.status, "unread")
        )
      );
    // Chats with inbound activity (messages from someone else) — the best
    // "needs attention" proxy without per-conversation read state.
    // Scoped to conversations the viewer participates in (has sent a message
    // in); otherwise every conversation with any inbound message inflates
    // everyone's badge.
    const [{ count: chats }] = await db
      .select({
        count: sql<number>`count(distinct ${messages.conversationId})::int`,
      })
      .from(messages)
      .where(
        and(
          ne(messages.senderId, userId!),
          inArray(
            messages.conversationId,
            db
              .select({ id: messages.conversationId })
              .from(messages)
              .where(eq(messages.senderId, userId!))
          )
        )
      );
    return c.json({
      counts: { notifications: unread ?? 0, chats: chats ?? 0, none: 0 },
    });
  });

  // "Followed by X, Y and N others" — people the viewer follows who also
  // follow the target profile.
  app.get("/socials/users/:userId/mutual-followers", async (c) => {
    const viewerId = c.get("userId");
    const targetUserId = z.string().min(1).parse(c.req.param("userId"));
    if (!viewerId)
      return c.json({ mutual_followers: { other_users_count: 0, users: [] } });

    const mine = db
      .select({ id: follows.followingId })
      .from(follows)
      .where(eq(follows.followerId, viewerId));
    const rows = await db
      .select({ userId: follows.followerId })
      .from(follows)
      .where(
        and(
          eq(follows.followingId, targetUserId),
          inArray(follows.followerId, mine)
        )
      )
      .orderBy(desc(follows.createdAt))
      .limit(4);
    const users = await fetchUserCards(
      rows.map((r) => r.userId),
      viewerId
    );
    const [{ count: total }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(follows)
      .where(
        and(
          eq(follows.followingId, targetUserId),
          inArray(follows.followerId, mine)
        )
      );
    return c.json({
      mutual_followers: {
        other_users_count: Math.max(0, (total ?? 0) - users.length),
        users: users.map((u) => ({
          _id: u._id,
          display_name: u.display_name,
          profile_image: u.profile_image,
        })),
      },
    });
  });

  // Search users by display name / username.
  app.get("/search", async (c) => {
    const viewerId = c.get("userId");
    // Sanitize BEFORE validating: LIKE wildcards (% / _) and the escape char
    // (\) are stripped first, so q="%" or "_" can never match the directory.
    const sanitized = (c.req.query("q") ?? "").replace(/[%_\\]/g, "").trim();
    if (!sanitized) return c.json({ search_results: [] });
    const q = z.string().min(1).max(100).parse(sanitized);
    const { limit, offset } = parseListQuery(c);
    const like = `%${q}%`;

    const rows = await db
      .select({
        userId: profiles.userId,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
        membership: profiles.membership,
      })
      .from(profiles)
      .where(
        or(ilike(profiles.displayName, like), ilike(profiles.username, like))
      )
      .orderBy(desc(profiles.createdAt))
      .limit(limit)
      .offset(offset);
    const followed = await getFollowedUserIds(
      viewerId,
      rows.map((r) => r.userId)
    );
    return c.json({
      search_results: rows.map((r) =>
        mapUserCard(r, { isFollowedByLoggedInUser: followed.has(r.userId) })
      ),
    });
  });

  // Recent-search history (search popup).
  app.get("/search/recent", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const rows = await db
      .select({
        id: recentSearches.id,
        searchType: recentSearches.searchType,
        query: recentSearches.query,
        searchedUserId: recentSearches.searchedUserId,
        resultCount: recentSearches.resultCount,
        createdAt: recentSearches.createdAt,
        updatedAt: recentSearches.updatedAt,
      })
      .from(recentSearches)
      .where(eq(recentSearches.userId, userId!))
      .orderBy(desc(recentSearches.updatedAt))
      .limit(20);

    const userIds = rows
      .map((r) => r.searchedUserId)
      .filter((id): id is string => !!id);
    const cards = await fetchUserCards(userIds, userId!);
    const byId = new Map(cards.map((u) => [u._id, u]));

    return c.json({
      recent_search: rows.map((r) => {
        const base = {
          _id: r.id,
          user: userId!,
          result_count: r.resultCount,
          createdAt:
            r.createdAt instanceof Date
              ? r.createdAt.toISOString()
              : String(r.createdAt),
          updatedAt:
            r.updatedAt instanceof Date
              ? r.updatedAt.toISOString()
              : String(r.updatedAt),
        };
        if (r.searchType === "user" && r.searchedUserId) {
          const u = byId.get(r.searchedUserId);
          return {
            ...base,
            search_type: "user" as const,
            searched_user: r.searchedUserId,
            user_data: u
              ? {
                  _id: u._id,
                  display_name: u.display_name,
                  profile_image: u.profile_image,
                  membership: u.membership,
                }
              : null,
          };
        }
        return { ...base, search_type: "query" as const, query: r.query ?? "" };
      }),
    });
  });

  app.post("/search/recent", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const payload = z
      .object({
        search_type: z.enum(["user", "query"]),
        searched_user: z.string().min(1).optional(),
        query: z.string().max(100).optional(),
        result_count: z.coerce.number().int().min(0).optional().default(0),
      })
      .parse(await c.req.json());

    if (payload.search_type === "user" && !payload.searched_user)
      apiError("searched_user is required", "BAD_REQUEST", 400);
    if (payload.search_type === "query" && !payload.query)
      apiError("query is required", "BAD_REQUEST", 400);

    // Upsert-ish: bump the existing row for the same query/user instead of
    // duplicating history.
    const [existing] = await db
      .select({ id: recentSearches.id })
      .from(recentSearches)
      .where(
        and(
          eq(recentSearches.userId, userId!),
          payload.search_type === "user"
            ? eq(recentSearches.searchedUserId, payload.searched_user!)
            : eq(recentSearches.query, payload.query!)
        )
      )
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(recentSearches)
        .set({
          resultCount: payload.result_count,
          updatedAt: new Date(),
        })
        .where(eq(recentSearches.id, existing.id))
        .returning();
      return c.json(updated);
    }

    const [created] = await db
      .insert(recentSearches)
      .values({
        userId: userId!,
        searchType: payload.search_type,
        query: payload.query ?? null,
        searchedUserId: payload.searched_user ?? null,
        resultCount: payload.result_count,
      })
      .returning();
    return c.json(created, 201);
  });

  app.delete("/search/recent/:searchId", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const searchId = z.string().uuid().parse(c.req.param("searchId"));
    const [existing] = await db
      .select({ id: recentSearches.id })
      .from(recentSearches)
      .where(
        and(eq(recentSearches.id, searchId), eq(recentSearches.userId, userId!))
      )
      .limit(1);
    if (!existing) apiError("Recent search not found", "NOT_FOUND", 404);
    await db.delete(recentSearches).where(eq(recentSearches.id, searchId));
    return c.json({ deleted: true });
  });

  app.delete("/search/recent", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    await db.delete(recentSearches).where(eq(recentSearches.userId, userId!));
    return c.json({ deleted: true });
  });

  // Notifications inbox.
  app.get("/notifications", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { limit, offset } = parseListQuery(c);
    const rows = await db
      .select({
        id: notifications.id,
        type: notifications.type,
        status: notifications.status,
        createdAt: notifications.createdAt,
        postId: notifications.postId,
        actorId: notifications.actorId,
        actorName: profiles.displayName,
        actorAvatar: profiles.avatarUrl,
        actorMembership: profiles.membership,
      })
      .from(notifications)
      .leftJoin(user, eq(notifications.actorId, user.id))
      .leftJoin(profiles, eq(notifications.actorId, profiles.userId))
      .where(eq(notifications.userId, userId!))
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);
    return c.json({ notifications: rows.map(mapNotificationRow) });
  });

  app.patch("/notifications/:id", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const id = z.string().uuid().parse(c.req.param("id"));
    const [existing] = await db
      .select({ id: notifications.id })
      .from(notifications)
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId!)))
      .limit(1);
    if (!existing) apiError("Notification not found", "NOT_FOUND", 404);
    await db
      .update(notifications)
      .set({ status: "read" })
      .where(eq(notifications.id, id));
    return c.json({ marked_read: true });
  });

  app.patch("/notifications", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    await db
      .update(notifications)
      .set({ status: "read" })
      .where(eq(notifications.userId, userId!));
    return c.json({ marked_all_read: true });
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
      // Phase 3 carry-forward: archived posts are invisible to non-owners —
      // same guard as GET /:id (no reading or replying to them).
      if (parentRow!.isArchived && parentRow!.authorId !== userId)
        apiError("Parent post not found", "NOT_FOUND", 404);
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
        // Phase 3: notify the parent post author.
        await createNotification({
          userId: parentRow.authorId,
          type: "post_reply",
          actorId: userId!,
          postId: parentRow.id,
        });
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
