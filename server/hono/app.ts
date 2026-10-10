import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { and, asc, desc, eq, gt, ilike, inArray, ne, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  autoRestakeSettings,
  channels,
  channelMessages,
  citizenships,
  collections,
  comments,
  conversationMembers,
  conversations,
  follows,
  launchpads,
  messageReactions,
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
    // Sanitize BEFORE use: LIKE wildcards (% / _) and the escape char (\)
    // are stripped first, so q="%" or "_" can never dump the user directory
    // (this endpoint is intentionally public for the compose mention picker).
    const sanitized = (c.req.query("q") ?? "").replace(/[%_\\]/g, "").trim();
    if (!sanitized) return c.json({ mention_users: [] });
    const q = z.string().min(1).max(100).parse(sanitized);
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
        mentionPermission: profiles.mentionPermission,
      })
      .from(profiles)
      .where(
        or(
          ilike(profiles.displayName, pattern),
          ilike(profiles.username, pattern)
        )
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
        mention_permission: (row.mentionPermission ??
          "everyone") as (typeof MENTION_PERMISSIONS)[number],
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

  // Phase 5: replaced by the user-scoped versions below (member-only).

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

  // Phase 6: replaced by the CFS-mapped version below.

  // Phase 7: replaced by the mapped/filtered versions below.

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
  /**
   * Phase 5: chat — Hono REST backend replaces the dead ProductLive/Hasura
   * adapter (wss://testingapi.centher.io). Every route is user-scoped via
   * conversation_members; message edits/deletes are sender-scoped.
   */

  const chatIdParam = z.object({ id: z.string().uuid() });
  const chatMessageIdParam = z.object({ id: z.string().uuid() });

  /** My membership row, or 404 (never leaks other users' conversations). */
  const requireMembership = async (conversationId: string, userId: string) => {
    const [m] = await db
      .select()
      .from(conversationMembers)
      .where(
        and(
          eq(conversationMembers.conversationId, conversationId),
          eq(conversationMembers.userId, userId)
        )
      )
      .limit(1);
    if (!m) apiError("Conversation not found", "NOT_FOUND", 404);
    return m!;
  };

  /** Full conversation shape for the client (members, last message, unread). */
  const buildConversation = async (
    conversationId: string,
    viewerId: string
  ) => {
    const [convo] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);
    if (!convo) apiError("Conversation not found", "NOT_FOUND", 404);

    const [myMem] = await db
      .select()
      .from(conversationMembers)
      .where(
        and(
          eq(conversationMembers.conversationId, conversationId),
          eq(conversationMembers.userId, viewerId)
        )
      )
      .limit(1);

    const memRows = await db
      .select({ userId: conversationMembers.userId })
      .from(conversationMembers)
      .where(eq(conversationMembers.conversationId, conversationId));
    const memberCards = await fetchUserCards(
      memRows.map((m) => m.userId),
      viewerId
    );

    const [lastMsg] = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(1);

    let unreadCount = 0;
    if (lastMsg) {
      const unreadRows = await db
        .select({ id: messages.id })
        .from(messages)
        .where(
          and(
            eq(messages.conversationId, conversationId),
            ne(messages.senderId, viewerId),
            myMem?.lastReadAt
              ? gt(messages.createdAt, myMem.lastReadAt)
              : undefined
          )
        );
      unreadCount = unreadRows.length;
    }

    return {
      id: convo!.id,
      title: convo!.title,
      created_at: convo!.createdAt,
      is_pinned: myMem?.isPinned ?? false,
      members: memberCards,
      last_message: lastMsg
        ? {
            id: lastMsg.id,
            body: lastMsg.body,
            sender_id: lastMsg.senderId,
            created_at: lastMsg.createdAt,
          }
        : null,
      unread_count: unreadCount,
    };
  };

  /** Message shape with sender card + grouped reactions. */
  const buildMessage = async (messageId: string, viewerId: string) => {
    const [msg] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId))
      .limit(1);
    if (!msg) apiError("Message not found", "NOT_FOUND", 404);

    const [senderCard] = await fetchUserCards([msg!.senderId], viewerId);
    const reactionRows = await db
      .select()
      .from(messageReactions)
      .where(eq(messageReactions.messageId, messageId));
    const byEmoji = new Map<string, { count: number; reacted_by_me: boolean }>();
    for (const r of reactionRows) {
      const e = byEmoji.get(r.emoji) ?? { count: 0, reacted_by_me: false };
      e.count += 1;
      if (r.userId === viewerId) e.reacted_by_me = true;
      byEmoji.set(r.emoji, e);
    }

    return {
      id: msg!.id,
      body: msg!.body,
      sender_id: msg!.senderId,
      created_at: msg!.createdAt,
      sender: senderCard ?? null,
      reactions: [...byEmoji.entries()].map(([emoji, v]) => ({
        emoji,
        ...v,
      })),
    };
  };

  // List my conversations (pinned first, then by last activity).
  app.get("/chat/conversations", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);

    const mine = await db
      .select({ conversationId: conversationMembers.conversationId })
      .from(conversationMembers)
      .where(eq(conversationMembers.userId, userId!));
    if (mine.length === 0) return c.json({ conversations: [] });

    const list = await Promise.all(
      mine.map((m) => buildConversation(m.conversationId, userId!))
    );
    list.sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      const at = a.last_message?.created_at ?? a.created_at;
      const bt = b.last_message?.created_at ?? b.created_at;
      return +new Date(bt) - +new Date(at);
    });
    return c.json({ conversations: list });
  });

  // Create a conversation (1-on-1 dedups to the existing thread).
  app.post("/chat/conversations", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);

    const body = z
      .object({
        user_ids: z.array(z.string().min(1)).min(1).max(50),
        title: z.string().trim().max(100).optional(),
      })
      .parse(await c.req.json());
    const otherIds = [...new Set(body.user_ids)].filter((id) => id !== userId);
    if (otherIds.length === 0)
      apiError("Add at least one other participant", "BAD_REQUEST", 400);

    const existingUsers = await db
      .select({ id: user.id })
      .from(user)
      .where(inArray(user.id, otherIds));
    if (existingUsers.length !== otherIds.length)
      apiError("Unknown user", "NOT_FOUND", 404);

    if (otherIds.length === 1) {
      const other = otherIds[0];
      const want = [userId!, other].sort();
      const myConvos = await db
        .select({ conversationId: conversationMembers.conversationId })
        .from(conversationMembers)
        .where(eq(conversationMembers.userId, userId!));
      for (const mc of myConvos) {
        const mems = await db
          .select({ userId: conversationMembers.userId })
          .from(conversationMembers)
          .where(eq(conversationMembers.conversationId, mc.conversationId));
        const ids = mems.map((m) => m.userId).sort();
        if (ids.length === 2 && ids[0] === want[0] && ids[1] === want[1]) {
          return c.json(await buildConversation(mc.conversationId, userId!));
        }
      }
    }

    const [convo] = await db
      .insert(conversations)
      .values({ title: body.title?.trim() || "" })
      .returning();
    await db.insert(conversationMembers).values(
      [userId!, ...otherIds].map((id) => ({
        conversationId: convo.id,
        userId: id,
      }))
    );
    return c.json(await buildConversation(convo.id, userId!), 201);
  });

  // Leave a conversation (deletes it when the last member leaves).
  app.delete("/chat/conversations/:id", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatIdParam.parse(c.req.param());

    await requireMembership(id, userId!);
    await db
      .delete(conversationMembers)
      .where(
        and(
          eq(conversationMembers.conversationId, id),
          eq(conversationMembers.userId, userId!)
        )
      );
    const remaining = await db
      .select({ userId: conversationMembers.userId })
      .from(conversationMembers)
      .where(eq(conversationMembers.conversationId, id))
      .limit(1);
    if (remaining.length === 0) {
      await db.delete(conversations).where(eq(conversations.id, id));
    }
    return c.json({ ok: true });
  });

  // Pin / unpin a conversation for me.
  app.post("/chat/conversations/:id/pin", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatIdParam.parse(c.req.param());

    await requireMembership(id, userId!);
    await db
      .update(conversationMembers)
      .set({ isPinned: true })
      .where(
        and(
          eq(conversationMembers.conversationId, id),
          eq(conversationMembers.userId, userId!)
        )
      );
    return c.json({ ok: true, is_pinned: true });
  });

  app.post("/chat/conversations/:id/unpin", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatIdParam.parse(c.req.param());

    await requireMembership(id, userId!);
    await db
      .update(conversationMembers)
      .set({ isPinned: false })
      .where(
        and(
          eq(conversationMembers.conversationId, id),
          eq(conversationMembers.userId, userId!)
        )
      );
    return c.json({ ok: true, is_pinned: false });
  });

  // Mark a conversation as read.
  app.post("/chat/conversations/:id/read", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatIdParam.parse(c.req.param());

    await requireMembership(id, userId!);
    await db
      .update(conversationMembers)
      .set({ lastReadAt: new Date() })
      .where(
        and(
          eq(conversationMembers.conversationId, id),
          eq(conversationMembers.userId, userId!)
        )
      );
    return c.json({ ok: true });
  });

  // List messages (member-only, chronological, paginated).
  app.get("/chat/conversations/:id/messages", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatIdParam.parse(c.req.param());

    await requireMembership(id, userId!);
    const query = z
      .object({
        limit: z.coerce.number().int().min(1).max(100).optional(),
        before: z.string().uuid().optional(),
      })
      .parse(c.req.query());
    const limit = query.limit ?? 50;

    let beforeDate: Date | undefined;
    if (query.before) {
      const [ref] = await db
        .select({ createdAt: messages.createdAt })
        .from(messages)
        .where(
          and(eq(messages.id, query.before), eq(messages.conversationId, id))
        )
        .limit(1);
      if (!ref) apiError("Message not found", "NOT_FOUND", 404);
      beforeDate = ref!.createdAt;
    }

    const rows = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.conversationId, id),
          beforeDate ? sql`${messages.createdAt} < ${beforeDate}` : undefined
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(limit);

    const list = await Promise.all(
      rows.reverse().map((m) => buildMessage(m.id, userId!))
    );
    return c.json({ messages: list });
  });

  // Send a message.
  app.post("/chat/conversations/:id/messages", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatIdParam.parse(c.req.param());

    await requireMembership(id, userId!);
    const body = z
      .object({ body: z.string().trim().min(1).max(5000) })
      .parse(await c.req.json());

    const [msg] = await db
      .insert(messages)
      .values({ conversationId: id, senderId: userId!, body: body.body })
      .returning();
    await db
      .update(conversationMembers)
      .set({ lastReadAt: new Date() })
      .where(
        and(
          eq(conversationMembers.conversationId, id),
          eq(conversationMembers.userId, userId!)
        )
      );
    return c.json(await buildMessage(msg.id, userId!), 201);
  });

  // Edit my message.
  app.patch("/chat/messages/:id", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatMessageIdParam.parse(c.req.param());

    const [msg] = await db
      .select()
      .from(messages)
      .where(and(eq(messages.id, id), eq(messages.senderId, userId!)))
      .limit(1);
    if (!msg) apiError("Message not found", "NOT_FOUND", 404);

    const body = z
      .object({ body: z.string().trim().min(1).max(5000) })
      .parse(await c.req.json());
    await db.update(messages).set({ body: body.body }).where(eq(messages.id, id));
    return c.json(await buildMessage(id, userId!));
  });

  // Delete my message.
  app.delete("/chat/messages/:id", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatMessageIdParam.parse(c.req.param());

    const [msg] = await db
      .select({ id: messages.id })
      .from(messages)
      .where(and(eq(messages.id, id), eq(messages.senderId, userId!)))
      .limit(1);
    if (!msg) apiError("Message not found", "NOT_FOUND", 404);

    await db.delete(messages).where(eq(messages.id, id));
    return c.json({ ok: true });
  });

  // Toggle an emoji reaction (member of the conversation only).
  app.post("/chat/messages/:id/reactions", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatMessageIdParam.parse(c.req.param());

    const [msg] = await db
      .select({ conversationId: messages.conversationId })
      .from(messages)
      .where(eq(messages.id, id))
      .limit(1);
    if (!msg) apiError("Message not found", "NOT_FOUND", 404);
    await requireMembership(msg!.conversationId, userId!);

    const body = z
      .object({ emoji: z.string().trim().min(1).max(20) })
      .parse(await c.req.json());

    const [existing] = await db
      .select({ id: messageReactions.id })
      .from(messageReactions)
      .where(
        and(
          eq(messageReactions.messageId, id),
          eq(messageReactions.userId, userId!),
          eq(messageReactions.emoji, body.emoji)
        )
      )
      .limit(1);
    if (existing) {
      await db
        .delete(messageReactions)
        .where(eq(messageReactions.id, existing.id));
      return c.json({ ok: true, reacted: false });
    }
    await db.insert(messageReactions).values({
      messageId: id,
      userId: userId!,
      emoji: body.emoji,
    });
    return c.json({ ok: true, reacted: true });
  });

  /**
   * Phase 6: marketplace read layer. The DB holds collections/nfts with uuid
   * ids; the client expects the legacy CFS shapes, so rows are mapped to
   * CFSCollection/CFSNFT. Specific routes are registered BEFORE parametric
   * ones (Hono matches in registration order).
   */

  const marketplacePaging = z.object({
    first: z.coerce.number().int().min(1).max(100).optional(),
    skip: z.coerce.number().int().min(0).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  });

  /** CFS-shaped user card for creator_data / owner_data. */
  const cfsUserCard = (p: {
    userId: string;
    displayName: string | null;
    avatarUrl: string | null;
    membership: unknown;
  }) => ({
    _id: p.userId,
    display_name: p.displayName ?? "Unnamed",
    profile_image: p.avatarUrl ?? "",
    membership: p.membership ?? null,
  });

  const fetchCfsUserCards = async (userIds: string[]) => {
    const uniq = [...new Set(userIds)];
    if (uniq.length === 0) return new Map<string, ReturnType<typeof cfsUserCard>>();
    const rows = await db
      .select({
        userId: profiles.userId,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
        membership: profiles.membership,
      })
      .from(profiles)
      .where(inArray(profiles.userId, uniq));
    return new Map(rows.map((r) => [r.userId, cfsUserCard(r)]));
  };

  const fallbackCard = (userId: string) =>
    cfsUserCard({ userId, displayName: "Unnamed", avatarUrl: "", membership: null });

  const mapCfsCollection = (
    c: typeof collections.$inferSelect,
    creatorCard: ReturnType<typeof cfsUserCard>
  ) => ({
    id: c.id,
    collection: c.id,
    name: c.name,
    symbol: "",
    maxSupply: "0",
    totalSupply: "0",
    creator: c.creatorId,
    ipfs: c.imageUrl ?? "",
    txTime: c.createdAt ? Math.floor(+c.createdAt / 1000).toString() : "0",
    createHash: "",
    tradingVolumn: "0",
    ipfs_metadata: {
      name: c.name,
      symbol: "",
      description: c.description ?? "",
      totalsupply: { type: "BigNumber" as const, hex: "0x00" },
      url: "",
      category: "All",
      yoursite: "",
      facebook: "",
      twitter: "",
      profileIPFSHash: c.imageUrl ?? "",
      coverIPFSHash: "",
    },
    creator_data: creatorCard,
  });

  const mapCfsNft = (
    n: typeof nfts.$inferSelect,
    collectionId: string,
    creatorId: string,
    ownerCard: ReturnType<typeof cfsUserCard>,
    creatorCard: ReturnType<typeof cfsUserCard>
  ) => {
    const img = n.imageUrl ?? "";
    const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(img);
    return {
      id: n.id,
      collection: collectionId,
      createTime: n.createdAt ? n.createdAt.toISOString() : new Date(0).toISOString(),
      creator: creatorId,
      mintHash: "",
      ipfs: img,
      saleState: n.listed ? "Sale" : "NotForSale",
      tokenId: n.id,
      price: n.price ?? "0",
      owner: n.ownerId,
      unlock: "0",
      listInfo: { price: n.price ?? "0", bidSize: 0, bids: [] as unknown[] },
      auctionInfo: {
        endTime: "0",
        highestBidPrice: "0",
        highestBidAddress: "",
        bidSize: 0,
        startPrice: "0",
        bids: [] as unknown[],
      },
      ipfs_metadata: {
        name: n.name,
        description: n.description ?? "",
        supply: 1,
        image: img,
        type: isVideo ? "video/mp4" : "image/png",
        collection: collectionId,
        attributes: [] as unknown[],
        videoThumbnail: null as string | null,
      },
      creator_data: creatorCard,
      owner_data: { ...ownerCard, is_registered: true },
    };
  };

  /** Load NFTs with their collections + user cards in bulk. */
  const loadNfts = async (
    where: ReturnType<typeof eq> | ReturnType<typeof and> | undefined,
    order: "newest" | "oldest",
    limit: number,
    offset: number
  ) => {
    const rows = await db
      .select()
      .from(nfts)
      .where(where)
      .orderBy(
        order === "newest" ? desc(nfts.createdAt) : asc(nfts.createdAt)
      )
      .limit(limit)
      .offset(offset);
    if (rows.length === 0) return [];
    const collectionIds = [...new Set(rows.map((r) => r.collectionId))];
    const collRows = await db
      .select()
      .from(collections)
      .where(inArray(collections.id, collectionIds));
    const collById = new Map(collRows.map((c) => [c.id, c]));
    const userIds = [
      ...rows.map((r) => r.ownerId),
      ...collRows.map((c) => c.creatorId),
    ];
    const cards = await fetchCfsUserCards(userIds);
    return rows.map((n) => {
      const coll = collById.get(n.collectionId);
      const ownerCard = cards.get(n.ownerId) ?? fallbackCard(n.ownerId);
      const creatorCard =
        cards.get(coll?.creatorId ?? "") ?? fallbackCard(coll?.creatorId ?? "");
      return mapCfsNft(n, n.collectionId, coll?.creatorId ?? "", ownerCard, creatorCard);
    });
  };

  // ---- Collections ----

  // List collections (paginated).
  app.get("/marketplace/collections", async (c) => {
    const q = marketplacePaging.parse(c.req.query());
    const limit = q.first ?? q.limit ?? 15;
    const offset = q.skip ?? 0;
    const rows = await db
      .select()
      .from(collections)
      .orderBy(desc(collections.createdAt))
      .limit(limit)
      .offset(offset);
    const cards = await fetchCfsUserCards(rows.map((r) => r.creatorId));
    return c.json({
      collections: rows.map((r) =>
        mapCfsCollection(r, cards.get(r.creatorId) ?? fallbackCard(r.creatorId))
      ),
    });
  });

  // Hot collections (most NFTs first).
  app.get("/marketplace/collections/hot-collections", async (c) => {
    const q = marketplacePaging.parse(c.req.query());
    const limit = q.first ?? q.limit ?? 15;
    const offset = q.skip ?? 0;
    const counts = await db
      .select({
        collectionId: nfts.collectionId,
        count: sql<number>`count(*)::int`,
      })
      .from(nfts)
      .groupBy(nfts.collectionId)
      .orderBy(desc(sql`count(*)`))
      .limit(limit)
      .offset(offset);
    const ids = counts.map((r) => r.collectionId);
    if (ids.length === 0) return c.json({ collections: [] });
    const rows = await db
      .select()
      .from(collections)
      .where(inArray(collections.id, ids));
    const byId = new Map(rows.map((r) => [r.id, r]));
    const cards = await fetchCfsUserCards(rows.map((r) => r.creatorId));
    return c.json({
      collections: ids
        .map((id) => byId.get(id))
        .filter((r): r is NonNullable<typeof r> => !!r)
        .map((r) =>
          mapCfsCollection(r, cards.get(r.creatorId) ?? fallbackCard(r.creatorId))
        ),
    });
  });

  // Top creators (by NFT count, then collection count).
  app.get("/marketplace/collections/top-creators", async (c) => {
    const q = marketplacePaging.parse(c.req.query());
    const limit = q.first ?? 10;
    const offset = q.skip ?? 0;
    const nftCounts = await db
      .select({
        creatorId: collections.creatorId,
        nftCount: sql<number>`count(${nfts.id})::int`,
      })
      .from(collections)
      .leftJoin(nfts, eq(nfts.collectionId, collections.id))
      .groupBy(collections.creatorId)
      .orderBy(desc(sql`count(${nfts.id})`))
      .limit(limit)
      .offset(offset);
    if (nftCounts.length === 0) return c.json({ users: [] });
    const collCounts = await db
      .select({
        creatorId: collections.creatorId,
        collCount: sql<number>`count(*)::int`,
      })
      .from(collections)
      .where(
        inArray(
          collections.creatorId,
          nftCounts.map((r) => r.creatorId)
        )
      )
      .groupBy(collections.creatorId);
    const collByCreator = new Map(collCounts.map((r) => [r.creatorId, r.collCount]));
    const cards = await fetchCfsUserCards(nftCounts.map((r) => r.creatorId));
    return c.json({
      users: nftCounts.map((r) => {
        const card = cards.get(r.creatorId) ?? fallbackCard(r.creatorId);
        return {
          _id: r.creatorId,
          display_name: card.display_name,
          profile_image: card.profile_image,
          membership: card.membership,
          createNFTCount: r.nftCount,
          createCollectionCount: collByCreator.get(r.creatorId) ?? 0,
        };
      }),
    });
  });

  // Collections by a single creator.
  app.get("/marketplace/collections/creator/:creator", async (c) => {
    const creator = c.req.param("creator");
    const q = marketplacePaging.parse(c.req.query());
    const limit = q.first ?? q.limit ?? 15;
    const offset = q.skip ?? 0;
    const rows = await db
      .select()
      .from(collections)
      .where(eq(collections.creatorId, creator))
      .orderBy(desc(collections.createdAt))
      .limit(limit)
      .offset(offset);
    const cards = await fetchCfsUserCards(rows.map((r) => r.creatorId));
    return c.json({
      collections: rows.map((r) =>
        mapCfsCollection(r, cards.get(r.creatorId) ?? fallbackCard(r.creatorId))
      ),
    });
  });

  // Single collection (parametric — registered after the specific routes).
  app.get("/marketplace/collections/:address", async (c) => {
    const address = z.string().uuid().parse(c.req.param("address"));
    const [row] = await db
      .select()
      .from(collections)
      .where(eq(collections.id, address))
      .limit(1);
    if (!row) apiError("Collection not found", "NOT_FOUND", 404);
    const cards = await fetchCfsUserCards([row!.creatorId]);
    return c.json(
      mapCfsCollection(row!, cards.get(row!.creatorId) ?? fallbackCard(row!.creatorId))
    );
  });

  // ---- NFTs ----

  // Hot NFTs (listed first, newest first).
  app.get("/marketplace/nfts/hot-nfts", async (c) => {
    const q = marketplacePaging.parse(c.req.query());
    const limit = q.first ?? q.limit ?? 15;
    const offset = q.skip ?? 0;
    const list = await loadNfts(eq(nfts.listed, true), "newest", limit, offset);
    return c.json({ nfts: list });
  });

  // Legacy DXC meta NFTs (no legacy rows exist — honest empty list).
  app.get("/marketplace/nfts/old-dxc-meta-nfts", async (c) => {
    return c.json({ nfts: [] });
  });

  // NFTs by creator (across collections).
  app.get("/marketplace/nfts/creator/:creator", async (c) => {
    const creator = c.req.param("creator");
    const q = marketplacePaging.parse(c.req.query());
    const limit = q.first ?? q.limit ?? 50;
    const offset = q.skip ?? 0;
    const collRows = await db
      .select({ id: collections.id })
      .from(collections)
      .where(eq(collections.creatorId, creator));
    const ids = collRows.map((r) => r.id);
    if (ids.length === 0) return c.json({ nfts: [] });
    const list = await loadNfts(
      inArray(nfts.collectionId, ids),
      "newest",
      limit,
      offset
    );
    return c.json({ nfts: list });
  });

  // NFTs owned by an address (image-card shape + cursor).
  app.get("/marketplace/nfts/owner/:owner", async (c) => {
    const owner = c.req.param("owner");
    const q = marketplacePaging.parse(c.req.query());
    const limit = q.limit ?? q.first ?? 50;
    const offset = q.skip ?? 0;
    const list = await loadNfts(eq(nfts.ownerId, owner), "newest", limit + 1, offset);
    const hasMore = list.length > limit;
    const page = hasMore ? list.slice(0, limit) : list;
    return c.json({
      nfts: page.map((n) => ({
        id: n.id,
        collection: n.collection,
        tokenId: n.tokenId,
        creator: n.creator,
        createTime: n.createTime,
        ipfs: n.ipfs,
        saleState: n.saleState,
        owner: n.owner,
        endTime: n.auctionInfo.endTime,
        unlock: n.unlock,
        mintHash: n.mintHash,
        owner_data: n.owner_data,
        creator_data: n.creator_data,
        ipfs_metadata: n.ipfs_metadata,
        external: false,
      })),
      cursor: hasMore ? String(offset + limit) : "",
    });
  });

  // Listed NFTs owned by an address.
  app.get("/marketplace/nfts/owner/:owner/listed", async (c) => {
    const owner = c.req.param("owner");
    const q = marketplacePaging.parse(c.req.query());
    const limit = q.first ?? q.limit ?? 50;
    const offset = q.skip ?? 0;
    const list = await loadNfts(
      and(eq(nfts.ownerId, owner), eq(nfts.listed, true)),
      "newest",
      limit,
      offset
    );
    return c.json({ nfts: list });
  });

  // NFTs in a single collection (parametric).
  app.get("/marketplace/nfts/:collection", async (c) => {
    const collection = z.string().uuid().parse(c.req.param("collection"));
    const q = z
      .object({
        first: z.coerce.number().int().min(1).max(100).optional(),
        skip: z.coerce.number().int().min(0).optional(),
        orderDir: z.enum(["asc", "desc"]).optional(),
        saleState: z.string().optional(),
      })
      .parse(c.req.query());
    const limit = q.first ?? 50;
    const offset = q.skip ?? 0;
    let where: ReturnType<typeof eq> | ReturnType<typeof and> | undefined =
      eq(nfts.collectionId, collection);
    if (q.saleState && q.saleState !== "All") {
      where = and(where, eq(nfts.listed, q.saleState === "Sale"));
    }
    const list = await loadNfts(
      where,
      q.orderDir === "asc" ? "oldest" : "newest",
      limit,
      offset
    );
    return c.json({ nfts: list });
  });

  // Single NFT page data (most parametric — registered last).
  app.get("/marketplace/nfts/:collection/:tokenId/page-data", async (c) => {
    const collection = z.string().uuid().parse(c.req.param("collection"));
    const tokenId = z.string().uuid().parse(c.req.param("tokenId"));
    const [row] = await db
      .select()
      .from(nfts)
      .where(and(eq(nfts.collectionId, collection), eq(nfts.id, tokenId)))
      .limit(1);
    if (!row) apiError("NFT not found", "NOT_FOUND", 404);
    const [coll] = await db
      .select()
      .from(collections)
      .where(eq(collections.id, row!.collectionId))
      .limit(1);
    const cards = await fetchCfsUserCards([row!.ownerId, coll?.creatorId ?? ""]);
    const ownerCard = cards.get(row!.ownerId) ?? fallbackCard(row!.ownerId);
    const creatorCard =
      cards.get(coll?.creatorId ?? "") ?? fallbackCard(coll?.creatorId ?? "");
    const nft = mapCfsNft(
      row!,
      row!.collectionId,
      coll?.creatorId ?? "",
      ownerCard,
      creatorCard
    );
    const totalSupply = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(nfts)
      .where(eq(nfts.collectionId, row!.collectionId));
    return c.json({
      ...nft,
      marketplaceSaleHistory: [],
      collectionInfo: { totalSupply: String(totalSupply[0]?.count ?? 0) },
    });
  });

  // ---- IPFS (no backend — honest 501s) ----

  app.post("/ipfs/upload/file", async (c) => {
    return c.json(
      {
        message:
          "File upload is not available in this build yet. NFT creation with media is disabled.",
        code: "IPFS_UPLOAD_UNAVAILABLE",
      },
      501
    );
  });

  app.post("/ipfs/upload/metadata", async (c) => {
    return c.json(
      {
        message:
          "Metadata upload is not available in this build yet. NFT creation is disabled.",
        code: "IPFS_UPLOAD_UNAVAILABLE",
      },
      501
    );
  });

  /**
   * Phase 7: staking / launchpad / citizenship read layer + auto-restake.
   * The on-chain (ethers) flows stay where they work; these REST endpoints
   * back the list pages and toggles that were hanging on dead services.
   */

  // ---- Auto-restake (per-user pool id list) ----

  const getAutoRestakeIds = async (userId: string): Promise<string[]> => {
    const [row] = await db
      .select()
      .from(autoRestakeSettings)
      .where(eq(autoRestakeSettings.userId, userId))
      .limit(1);
    return row?.poolIds ?? [];
  };

  // The client compares with `auto_restake.includes(+poolId)` — return
  // numeric ids as numbers.
  const toAutoRestakeResponse = (userId: string, poolIds: string[]) => ({
    _id: userId,
    auto_restake: poolIds.map((id) => {
      const n = Number(id);
      return id.trim() !== "" && Number.isFinite(n) ? n : id;
    }),
  });

  const getAutoRestake = async (userId: string) =>
    toAutoRestakeResponse(userId, await getAutoRestakeIds(userId));

  app.get("/auto-restake", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    return c.json(await getAutoRestake(userId!));
  });

  app.patch("/auto-restake", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const body = z
      .object({
        pool_id: z.union([z.string(), z.number()]),
        is_auto_restake_enabled: z.boolean(),
      })
      .parse(await c.req.json());
    const poolId = String(body.pool_id);

    const currentIds = await getAutoRestakeIds(userId!);
    const next = body.is_auto_restake_enabled
      ? [...new Set([...currentIds, poolId])]
      : currentIds.filter((id) => id !== poolId);

    await db
      .insert(autoRestakeSettings)
      .values({ userId: userId!, poolIds: next })
      .onConflictDoUpdate({
        target: autoRestakeSettings.userId,
        set: { poolIds: next, updatedAt: new Date() },
      });
    return c.json(toAutoRestakeResponse(userId!, next));
  });

  // ---- Launchpads ----

  const mapLaunchpad = (row: typeof launchpads.$inferSelect) => ({
    id: row.id,
    name: row.name,
    symbol: row.symbol,
    status: row.status,
    raised: row.raised,
    soft_cap: row.softCap,
    created_at: row.createdAt,
  });

  app.get("/launchpads", async (c) => {
    const { list_type } = z
      .object({ list_type: z.string().optional() })
      .parse(c.req.query());
    const where =
      list_type === "live"
        ? eq(launchpads.status, "live")
        : list_type === "upcoming"
          ? eq(launchpads.status, "upcoming")
          : undefined;
    const rows = await db
      .select()
      .from(launchpads)
      .where(where)
      .orderBy(desc(launchpads.createdAt));
    return c.json({ launchpads: rows.map(mapLaunchpad) });
  });

  app.get("/launchpads/:id", async (c) => {
    const id = z.string().uuid().parse(c.req.param("id"));
    const [row] = await db
      .select()
      .from(launchpads)
      .where(eq(launchpads.id, id))
      .limit(1);
    if (!row) apiError("Launchpad not found", "NOT_FOUND", 404);
    return c.json(mapLaunchpad(row!));
  });

  // ---- Staking pools ----

  const mapStakingPool = (row: typeof stakingPools.$inferSelect) => ({
    id: row.id,
    name: row.name,
    apy: row.apy,
    tvl: row.tvl,
    status: row.status,
    price: row.price,
    duration_days: row.durationDays,
    claim_lockup_days: row.claimLockupDays,
    created_at: row.createdAt,
  });

  app.get("/staking/pools", async (c) => {
    const rows = await db
      .select()
      .from(stakingPools)
      .orderBy(desc(stakingPools.createdAt));
    return c.json({ pools: rows.map(mapStakingPool) });
  });

  app.get("/staking/pools/:id", async (c) => {
    const id = z.string().uuid().parse(c.req.param("id"));
    const [row] = await db
      .select()
      .from(stakingPools)
      .where(eq(stakingPools.id, id))
      .limit(1);
    if (!row) apiError("Staking pool not found", "NOT_FOUND", 404);
    return c.json(mapStakingPool(row!));
  });

  // ---- Citizenship ----

  app.get("/citizenship", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const [row] = await db
      .select()
      .from(citizenships)
      .where(eq(citizenships.userId, userId!))
      .limit(1);
    return c.json({
      citizenship: row
        ? {
            id: row.id,
            status: row.status,
            tier: row.tier,
            created_at: row.createdAt,
          }
        : null,
    });
  });

  // Records a citizenship purchase (called after the on-chain tx succeeds;
  // the chain remains the source of truth for the token itself).
  app.post("/citizenship/purchase", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const body = z
      .object({
        tier: z.string().trim().min(1).max(50).optional(),
        tx_hash: z.string().trim().max(120).optional(),
      })
      .parse(await c.req.json().catch(() => ({})));

    const [row] = await db
      .insert(citizenships)
      .values({ userId: userId!, tier: body.tier ?? "standard" })
      .onConflictDoUpdate({
        target: citizenships.userId,
        set: {
          status: "active",
          tier: body.tier ?? "standard",
        },
      })
      .returning();
    return c.json(
      {
        citizenship: {
          id: row.id,
          status: row.status,
          tier: row.tier,
          created_at: row.createdAt,
        },
      },
      201
    );
  });

  // Phase 5: chat REST endpoints are registered above this line.
  /**
   * Phase 8: admin console — server-side admin enforcement. Every /api/admin/*
   * route requires an authenticated admin (user.is_admin). Non-admins get
   * 403, unauthenticated get 401. This replaces the legacy UI-only +
   * middleware-cookie-presence gating.
   */

  /** Throw 401/403 unless the caller is an authenticated admin. */
  const requireAdmin = async (c: { get: (k: "userId") => string | null }) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const [row] = await db
      .select({ isAdmin: user.isAdmin })
      .from(user)
      .where(eq(user.id, userId!))
      .limit(1);
    if (!row?.isAdmin) apiError("Forbidden: admin only", "FORBIDDEN", 403);
    return userId!;
  };

  const adminPoolSchema = z.object({
    name: z.string().trim().min(1).max(100),
    apy: z.coerce.number().min(0).max(10000),
    price: z.coerce.number().min(0).default(0),
    duration_days: z.coerce.number().int().min(0).default(0),
    claim_lockup_days: z.coerce.number().int().min(0).default(0),
    status: z.enum(["active", "disabled"]).default("active"),
  });

  // Admin: session admin check for middleware (Edge-safe). Returns 200
  // only for admins; 401/403 otherwise.
  app.get("/admin/check", async (c) => {
    await requireAdmin(c);
    return c.json({ is_admin: true });
  });

  // Admin: list users (paginated).
  app.get("/admin/users", async (c) => {
    await requireAdmin(c);
    const { limit, offset } = parseListQuery(c);
    const rows = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt))
      .limit(limit)
      .offset(offset);
    return c.json({ users: rows });
  });

  // Admin: create a staking pool.
  app.post("/admin/staking-pools", async (c) => {
    await requireAdmin(c);
    const body = adminPoolSchema.parse(await c.req.json());
    const [row] = await db
      .insert(stakingPools)
      .values({
        name: body.name,
        apy: String(body.apy),
        price: String(body.price),
        durationDays: body.duration_days,
        claimLockupDays: body.claim_lockup_days,
        status: body.status,
      })
      .returning();
    return c.json(mapStakingPool(row), 201);
  });

  // Admin: update a staking pool.
  app.patch("/admin/staking-pools/:id", async (c) => {
    await requireAdmin(c);
    const id = z.string().uuid().parse(c.req.param("id"));
    const body = adminPoolSchema.partial().parse(await c.req.json());

    const [existing] = await db
      .select({ id: stakingPools.id })
      .from(stakingPools)
      .where(eq(stakingPools.id, id))
      .limit(1);
    if (!existing) apiError("Staking pool not found", "NOT_FOUND", 404);

    const patch: Partial<typeof stakingPools.$inferInsert> = {};
    if (body.name !== undefined) patch.name = body.name;
    if (body.apy !== undefined) patch.apy = String(body.apy);
    if (body.price !== undefined) patch.price = String(body.price);
    if (body.duration_days !== undefined)
      patch.durationDays = body.duration_days;
    if (body.claim_lockup_days !== undefined)
      patch.claimLockupDays = body.claim_lockup_days;
    if (body.status !== undefined) patch.status = body.status;

    const [row] = await db
      .update(stakingPools)
      .set(patch)
      .where(eq(stakingPools.id, id))
      .returning();
    return c.json(mapStakingPool(row));
  });

  // Admin: delete a staking pool.
  app.delete("/admin/staking-pools/:id", async (c) => {
    await requireAdmin(c);
    const id = z.string().uuid().parse(c.req.param("id"));
    const [existing] = await db
      .select({ id: stakingPools.id })
      .from(stakingPools)
      .where(eq(stakingPools.id, id))
      .limit(1);
    if (!existing) apiError("Staking pool not found", "NOT_FOUND", 404);
    await db.delete(stakingPools).where(eq(stakingPools.id, id));
    return c.json({ ok: true });
  });

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
