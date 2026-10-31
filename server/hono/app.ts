import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import {
  and,
  asc,
  desc,
  eq,
  gt,
  ilike,
  inArray,
  isNull,
  lt,
  lte,
  ne,
  or,
  sql,
} from "drizzle-orm";
import { db } from "@/db";
import {
  autoRestakeSettings,
  channels,
  channelMessages,
  chatAttachments,
  chatTyping,
  citizenships,
  collections,
  comments,
  conversationMembers,
  conversations,
  follows,
  launchpads,
  messageReactions,
  messages,
  nftBids,
  nftPurchases,
  nfts,
  notifications,
  orgInvites,
  orgMembers,
  postLikes,
  postViews,
  posts,
  profiles,
  recentSearches,
  stakingPools,
  user,
} from "@/db/schema";
import { auth } from "@/lib/auth/better-auth";
import { mintVoiceToken } from "@/lib/voice/voice-token";
import {
  CHAT_AUDIO_MIMES,
  CHAT_FILE_MIMES,
  CHAT_IMAGE_MIMES,
  CHAT_VIDEO_MIMES,
} from "@/lib/media/cloudinary";
import { isTrustedAttachmentUrl } from "@/lib/chat/attachments";
import { dmPairKey, EDIT_WINDOW_MS, isEditExpired } from "@/lib/chat/utils";
import { sanitizeEditorState } from "@/lib/feed/editor-state";
import {
  parseBnbAmount,
  storedBnbToScaled,
  type ParsedBnbAmount,
} from "@/lib/marketplace/bnb-amount";
import type { NFTSaleState } from "@/models/nft";
import {
  extractMentionUserIds,
  MAX_MENTION_NOTIFICATIONS,
} from "@/lib/feed/mentions";
import {
  mediaKindForMime,
  mediaKindForUrl,
  normalizePostMedia,
  withoutDeletedMedia,
} from "@/lib/feed/media";

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

const EMPTY_EDITOR_STATE = {
  root: {
    children: [],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
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
    mediaUrls?: unknown;
    editedAt?: Date | string | null;
    deletedAt?: Date | string | null;
    isArchived?: boolean | null;
  },
  opts?: { likedByLoggedInUser?: boolean }
) => {
  // Feed product call Q21 (tombstone): a deleted post's body and media
  // never leave the server — the row renders as the client's "deleted"
  // stub while its replies stay reachable underneath (chat Q16 rule).
  const deleted = !!row.deletedAt;
  const { text, post_editor_state } = deleted
    ? { text: "", post_editor_state: EMPTY_EDITOR_STATE }
    : parseStoredPostBody(row.body);
  return {
    _id: row.id,
    user: {
      _id: row.authorId,
      display_name: row.authorName || "Sociaket Demo",
      profile_image: row.authorAvatar || "/images/sociaket.logo.favicon.png",
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
    status: deleted ? ("deleted" as const) : ("complete" as const),
    // Feed product calls: "edited" mark (Q14) + tombstone flag (Q21).
    edited_at: row.editedAt
      ? row.editedAt instanceof Date
        ? row.editedAt.toISOString()
        : String(row.editedAt)
      : null,
    is_deleted: deleted,
    // Post-grill Q15: the detail page must be able to tell an archived
    // post apart from a live one — without this the owner's own
    // archived post rendered as live, offered Archive again, and had
    // no Restore path. (mapCommentRow's synthetic rows omit it →
    // replies report false, correctly: comments can't be archived.)
    is_archived: !!row.isArchived,
    parent_post: undefined,
    post_editor_state,
    text_content: text,
    // Feed-grill Q16: real media kind (was hardcoded "image", so videos
    // rendered as broken <img>s). normalizePostMedia handles both the
    // legacy string[] rows and the new {url,type}[] rows.
    media: deleted
      ? []
      : normalizePostMedia(row.mediaUrls).map((m) => ({
          object_name: m.url,
          url: m.url,
          type: m.type,
        })),
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
    editedAt?: Date | string | null;
    deletedAt?: Date | string | null;
  },
  parent: {
    id: string;
    createdAt: Date | string;
    authorId: string;
    authorName: string | null;
    authorAvatar: string | null;
    membership: string | null;
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
    // Feed product calls Q12/Q13: reply edited mark + tombstone ride the
    // same mapPostRow redaction as posts.
    editedAt: row.editedAt,
    deletedAt: row.deletedAt,
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
        display_name: parent.authorName || "Sociaket Demo",
        profile_image:
          parent.authorAvatar || "/images/sociaket.logo.favicon.png",
        // QA-fix: replies render PostHeader's verification tick against
        // parent_post.user.membership — it must never be undefined.
        membership: {
          last_status:
            (parent.membership as "citizen" | "verified" | "none") || "citizen",
          status:
            (parent.membership as "citizen" | "verified" | "none") || "citizen",
          endAt: 0,
        },
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
      mediaUrls: posts.mediaUrls,
      editedAt: posts.editedAt,
      deletedAt: posts.deletedAt,
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
/**
 * Chat completeness Q24 (presence): a user counts as "online" when their
 * last heartbeat (profiles.last_seen_at, written by POST /api/chat/presence)
 * is younger than this window. Computed at read time — never stored — and
 * it rides along on every user card, so surfaces that already fetch cards
 * (chat list, thread senders) get presence with ZERO extra queries.
 */
const PRESENCE_ONLINE_MS = 3 * 60 * 1000;
/** Heartbeat writes are throttled server-side: at most one per user / 60s. */
const PRESENCE_WRITE_THROTTLE_MS = 60 * 1000;

const mapUserCard = (
  row: {
    userId: string;
    displayName: string | null;
    avatarUrl: string | null;
    membership: string | null;
    isBot?: boolean | null;
    lastSeenAt?: Date | string | null;
  },
  opts?: { isFollowedByLoggedInUser?: boolean }
) => ({
  _id: row.userId,
  display_name: row.displayName || "Sociaket User",
  profile_image: row.avatarUrl || "/images/sociaket.logo.favicon.png",
  is_bot: !!row.isBot,
  last_seen_at: row.lastSeenAt
    ? new Date(row.lastSeenAt as unknown as string).toISOString()
    : null,
  is_online: row.lastSeenAt
    ? Date.now() - +new Date(row.lastSeenAt as unknown as string) <
      PRESENCE_ONLINE_MS
    : false,
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
  const uniq = [...new Set(userIds)];
  const rows = await db
    .select({
      userId: profiles.userId,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
      membership: profiles.membership,
      isBot: profiles.isBot,
      // Q24 presence rides along in this same batched query — the chat
      // grill (Q18) killed per-row queries; presence must not re-add any.
      lastSeenAt: profiles.lastSeenAt,
    })
    .from(profiles)
    .where(inArray(profiles.userId, uniq));
  const followed = await getFollowedUserIds(viewerId, uniq);
  // Preserve the requested order.
  const byId = new Map(rows.map((r) => [r.userId, r]));
  // Chat-grill Q27: ids with no profile row (never onboarded, or row
  // missing) used to vanish here — conversations rendered as "Chat" and
  // senders as "Someone". Fall back to the auth user row so every real
  // user gets a name instead of a placeholder.
  const missing = uniq.filter((id) => !byId.has(id));
  if (missing.length > 0) {
    const urows = await db
      .select({ id: user.id, name: user.name, image: user.image })
      .from(user)
      .where(inArray(user.id, missing));
    for (const u of urows) {
      byId.set(u.id, {
        userId: u.id,
        displayName: u.name,
        avatarUrl: u.image,
        membership: "citizen",
        isBot: false,
        lastSeenAt: null,
      });
    }
  }
  return uniq
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
  /** Post-grill Q12: the reply this notification is about, if any. */
  commentId?: string | null;
  /** Chat completeness Q24: the chat conversation this is about, if any. */
  conversationId?: string | null;
}) => {
  if (input.actorId && input.actorId === input.userId) return;
  await db.insert(notifications).values({
    userId: input.userId,
    type: input.type,
    actorId: input.actorId,
    postId: input.postId ?? null,
    commentId: input.commentId ?? null,
    conversationId: input.conversationId ?? null,
    status: "unread",
  });
};

/**
 * Feed product call Q23: notify users @mentioned in a post or reply.
 *
 * The type is `mention_in_post` — the notifications UI already renders
 * it ("mentioned you in a post", deep-links to the post), so no new
 * client type was needed. Rules:
 *  - Mentions come from the editor state's mention nodes (the same
 *    parse the renderer uses — see lib/feed/mentions.ts).
 *  - The mentioned user must exist (profile row) and their
 *    `mention_permission` must allow this actor: everyone / followers
 *    (they follow the actor) / followings (actor follows them) /
 *    followers_and_followings / no_one.
 *  - The author never notifies themselves (createNotification guards,
 *    and self-mentions are filtered here too).
 *  - On edits (`onlyNew`), anyone who already has a mention
 *    notification for this post from this actor is skipped — an edit
 *    must not re-ping; brand-new mentions on the edit still notify.
 *  - Post-grill Q12: when the mention lives in a reply (`commentId`
 *    set), the dedupe is scoped to THAT comment — a mention of the
 *    same person in a different reply under the same post is a new
 *    context and must still notify — and the notification carries
 *    the comment id so the deep link can anchor to the reply.
 */
const notifyMentions = async (input: {
  editorState: unknown;
  actorId: string;
  postId: string;
  commentId?: string | null;
  onlyNew?: boolean;
}) => {
  // Cap per event (MAX_MENTION_NOTIFICATIONS): first-seen unique
  // mentions only — a huge body must not mass-ping ~200 people.
  const mentionedIds = extractMentionUserIds(input.editorState)
    .filter((id) => id !== input.actorId)
    .slice(0, MAX_MENTION_NOTIFICATIONS);
  if (mentionedIds.length === 0) return;

  const profileRows = await db
    .select({
      userId: profiles.userId,
      mentionPermission: profiles.mentionPermission,
    })
    .from(profiles)
    .where(inArray(profiles.userId, mentionedIds));
  if (profileRows.length === 0) return;

  // Follow graph for the permission check, in one query both directions.
  const followRows = await db
    .select({
      followerId: follows.followerId,
      followingId: follows.followingId,
    })
    .from(follows)
    .where(
      or(
        and(
          inArray(follows.followerId, mentionedIds),
          eq(follows.followingId, input.actorId)
        ),
        and(
          eq(follows.followerId, input.actorId),
          inArray(follows.followingId, mentionedIds)
        )
      )
    );
  const mentionedFollowsActor = new Set(
    followRows
      .filter((r) => r.followingId === input.actorId)
      .map((r) => r.followerId)
  );
  const actorFollowsMentioned = new Set(
    followRows
      .filter((r) => r.followerId === input.actorId)
      .map((r) => r.followingId)
  );

  const allowed = profileRows.filter((p) => {
    const perm = p.mentionPermission ?? "everyone";
    if (perm === "everyone") return true;
    if (perm === "no_one") return false;
    if (perm === "followers") return mentionedFollowsActor.has(p.userId);
    if (perm === "followings") return actorFollowsMentioned.has(p.userId);
    if (perm === "followers_and_followings")
      return (
        mentionedFollowsActor.has(p.userId) &&
        actorFollowsMentioned.has(p.userId)
      );
    return true;
  });
  if (allowed.length === 0) return;

  // Hard cap at the notification stage as well: no more than
  // MAX_MENTION_NOTIFICATIONS pings leave this function per event.
  let targets = allowed
    .map((p) => p.userId)
    .slice(0, MAX_MENTION_NOTIFICATIONS);
  if (input.onlyNew) {
    const already = await db
      .select({ userId: notifications.userId })
      .from(notifications)
      .where(
        and(
          inArray(notifications.userId, targets),
          eq(notifications.type, "mention_in_post"),
          eq(notifications.postId, input.postId),
          eq(notifications.actorId, input.actorId),
          // Q12: reply mentions dedupe per comment, not per post —
          // without this, a genuinely new mention of the same person
          // in a different reply was silently suppressed forever.
          input.commentId
            ? eq(notifications.commentId, input.commentId)
            : undefined
        )
      );
    const alreadySet = new Set(already.map((r) => r.userId));
    targets = targets.filter((id) => !alreadySet.has(id));
  }

  for (const userId of targets) {
    await createNotification({
      userId,
      type: "mention_in_post",
      actorId: input.actorId,
      postId: input.postId,
      commentId: input.commentId ?? null,
    });
  }
};

/** Phase 3: map a notification row to the shape the notifications UI reads. */
const mapNotificationRow = (row: {
  id: string;
  type: string;
  status: string | null;
  createdAt: Date | string;
  postId: string | null;
  commentId?: string | null;
  conversationId?: string | null;
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
  // Post-grill Q12: the reply a mention/reply notification points at,
  // so the UI can deep-link to /post/<id>?reply=<comment_id> and the
  // post page can scroll to + highlight that exact reply.
  comment_id: row.commentId ?? null,
  // Chat completeness Q24: chat-message notifications deep-link to the
  // conversation (/chat/<conversation_id>).
  conversation_id: row.conversationId ?? null,
  // Phase 12: nested shape the notifications UI reads (notification.post._id).
  post: row.postId ? { _id: row.postId, user_id: "" } : null,
  by: {
    _id: row.actorId || "",
    display_name: row.actorName || "Sociaket User",
    profile_image: row.actorAvatar || "/images/sociaket.logo.favicon.png",
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
    c.json({
      ok: true,
      brand: process.env.NEXT_PUBLIC_BRAND_NAME || "Sociaket",
    })
  );

  /**
   * GET /api/voice/token — mints a short-lived JWT for the Sociaket voice
   * server (Sociaket Space rooms). Session required.
   *
   * Contract (locked — the voice server verifies exactly this):
   * HS256, secret = BETTER_AUTH_SECRET,
   * payload { sub: userId, aud: "centher-voice", iat, exp: now+15min }.
   *
   * Rate limit: cheap to mint, but throttled per user (30/min) so a stuck
   * client can't spin it. In-memory per instance — a best-effort guard,
   * the session check is the real gate.
   */
  const voiceTokenHits = new Map<string, number[]>();
  app.get("/voice/token", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);

    const nowMs = Date.now();
    const hits = (voiceTokenHits.get(userId!) || []).filter(
      (t) => nowMs - t < 60_000
    );
    if (hits.length >= 30) apiError("Too many requests", "RATE_LIMITED", 429);
    hits.push(nowMs);
    voiceTokenHits.set(userId!, hits);

    return c.json({ token: mintVoiceToken(userId!) });
  });

  /**
   * Feed-grill Q4: per-user write throttle for the feed surface, same
   * in-memory sliding-window pattern as the voice-token limiter above
   * (best-effort per instance; auth is the real gate). Keyed per route
   * bucket so e.g. liking can't starve posting. Throws a readable 429 —
   * the client surfaces it as a toast, never a silent failure.
   */
  const feedWriteHits = new Map<string, number[]>();
  const rateLimitFeedWrite = (
    bucket: string,
    userId: string,
    maxPerMinute: number
  ) => {
    const key = `${bucket}:${userId}`;
    const nowMs = Date.now();
    const hits = (feedWriteHits.get(key) || []).filter(
      (t) => nowMs - t < 60_000
    );
    if (hits.length >= maxPerMinute)
      apiError(
        "You're doing that too fast — wait a few seconds and try again",
        "RATE_LIMITED",
        429
      );
    hits.push(nowMs);
    feedWriteHits.set(key, hits);
  };

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
   * Phase 4: the org a user belongs to as a team member (legacy model:
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
        ownerProfile?.avatarUrl || "/images/sociaket.logo.favicon.png",
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
      display_name: profile?.displayName || authUser?.name || "Sociaket Demo",
      profile_image: profile?.avatarUrl || "/images/sociaket.logo.favicon.png",
      cover_image: profile?.coverImageUrl || "",
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
      first_name: authUser?.name?.split(" ")[0] || "Sociaket",
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
        displayName: authName || "Sociaket Demo",
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
    await ensureProfile(userId!, authUser?.name || "Sociaket Demo");
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
    await ensureProfile(userId!, authUser?.name || "Sociaket Demo");
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
    { path: "/images/chat-bot.png", object_name: "preset:chat-bot.png" },
    {
      path: "/images/contract-bot.png",
      object_name: "preset:contract-bot.png",
    },
    {
      path: "/images/crypto-signals.png",
      object_name: "preset:crypto-signals.png",
    },
    {
      path: "/images/exchange-bot.png",
      object_name: "preset:exchange-bot.png",
    },
    {
      path: "/images/staking-bot.png",
      object_name: "preset:staking-bot.png",
    },
    {
      path: "/images/trade-bot.png",
      object_name: "preset:trade-bot.png",
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
    const [authUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId!))
      .limit(1);
    await ensureProfile(userId!, authUser?.name || "Sociaket Demo");

    // Phase 11: a Cloudinary secure_url (https://…) is persisted directly.
    // The browser uploads to Cloudinary itself; the server just stores the URL.
    if (body.object_name.startsWith("https://")) {
      if (body.type === "profile_image") {
        await db
          .update(profiles)
          .set({ avatarUrl: body.object_name })
          .where(eq(profiles.userId, userId!));
        return c.json({ profile_image: body.object_name });
      }
      if (body.type === "cover_image") {
        await db
          .update(profiles)
          .set({ coverImageUrl: body.object_name })
          .where(eq(profiles.userId, userId!));
        return c.json({ cover_image: body.object_name });
      }
    }

    // Bundled preset avatars (profile_image only).
    if (body.type !== "profile_image" || !preset) {
      return apiError(
        "Custom image uploads are not available in this build — choose a preset avatar instead",
        "NOT_IMPLEMENTED",
        501
      );
    }
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
      display_name: profile?.displayName || authUser?.name || "Sociaket User",
      profile_image: profile?.avatarUrl || "/images/sociaket.logo.favicon.png",
      cover_image: profile?.coverImageUrl || "",
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
   * Phase 4: orgs / team members. Legacy model - every citizen account
   * is its own org; team members join the org owner's account. All routes
   * auth-gated; mutations are owner- or invitee-scoped.
   */
  const toOrgUserCard = (
    id: string,
    p: typeof profiles.$inferSelect | undefined,
    a: typeof user.$inferSelect | undefined
  ) => ({
    _id: id,
    display_name: p?.displayName || a?.name || "Sociaket User",
    profile_image: p?.avatarUrl || "/images/sociaket.logo.favicon.png",
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
        display_name: row.displayName || "Sociaket User",
        profile_image: row.avatarUrl || "/images/sociaket.logo.favicon.png",
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
    // Feed fix 2026-10-29 (count lag after delete): soft-deleted
    // posts (deletedAt set) used to still count here, so every
    // profile-card refetch overwrote the client's optimistic
    // decrement and the count "lagged" back to the pre-delete value
    // — including when navigating feed -> profile after a delete.
    // Deleted posts are not live posts, so they are excluded.
    const [{ count: postsCount }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(
        and(
          eq(posts.authorId, userId),
          eq(posts.isArchived, false),
          isNull(posts.deletedAt)
        )
      );
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

  /**
   * Feed list. Feed-grill Q10: keyset pagination on (created_at, id) —
   * the old OFFSET window silently skipped posts whenever anything was
   * created above the fold. Clients pass `cursor` = the last post id of
   * the previous page (chat-grill Q12 pattern); the response carries
   * `next_cursor`. `offset`/`page` are still honored when no cursor is
   * given, for older clients.
   *
   * Feed-grill Q19: `/with-auth` variant (same split as /:id and
   * /user/:userId) so the main feed can render `liked_by_loggedin_user` —
   * without it every like button on the highest-traffic page showed
   * "not liked".
   */
  const handleFeedList = async (c: any, withAuth: boolean) => {
    const limit = z.coerce
      .number()
      .int()
      .min(1)
      .max(50)
      .default(10)
      .parse(c.req.query("limit") ?? 10);

    const cursorParam = c.req.query("cursor");
    let cursor: { createdAt: Date | string; id: string } | undefined;
    if (cursorParam) {
      const cursorId = z.string().uuid().parse(cursorParam);
      const [ref] = await db
        .select({ createdAt: posts.createdAt, id: posts.id })
        .from(posts)
        .where(eq(posts.id, cursorId))
        .limit(1);
      if (!ref) apiError("Invalid feed cursor", "BAD_REQUEST", 400);
      cursor = { createdAt: ref!.createdAt, id: ref!.id };
    }

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

    const baseQuery = db
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
        mediaUrls: posts.mediaUrls,
        editedAt: posts.editedAt,
        deletedAt: posts.deletedAt,
      })
      .from(posts)
      .leftJoin(profiles, eq(posts.authorId, profiles.userId))
      .where(
        and(
          eq(posts.isArchived, false),
          cursor
            ? sql`(${posts.createdAt}, ${posts.id}) < (${cursor.createdAt}, ${cursor.id})`
            : undefined
        )
      )
      .orderBy(desc(posts.createdAt), desc(posts.id))
      .limit(limit);

    const rows = await (cursor ? baseQuery : baseQuery.offset(offset));

    const liked = withAuth
      ? await getLikedPostIds(
          c.get("userId"),
          rows.map((r) => r.id)
        )
      : new Set<string>();
    const mapped = rows.map((row) =>
      mapPostRow(row, { likedByLoggedInUser: liked.has(row.id) })
    );

    return c.json({
      posts: mapped,
      data: mapped,
      offset: cursor ? 0 : offset,
      limit,
      next_cursor: rows.length === limit ? rows[rows.length - 1].id : null,
      has_more: rows.length === limit,
    });
  };
  app.get("/socials/posts", (c) => handleFeedList(c, false));
  app.get("/socials/posts/with-auth", (c) => handleFeedList(c, true));

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
        profile_image: row.avatarUrl || "/images/sociaket.logo.favicon.png",
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
        mediaUrls: posts.mediaUrls,
        editedAt: posts.editedAt,
        deletedAt: posts.deletedAt,
      })
      .from(posts)
      .leftJoin(profiles, eq(posts.authorId, profiles.userId))
      .where(
        and(
          eq(posts.authorId, userId!),
          eq(posts.isArchived, true),
          // A deleted post is a tombstone, not an archived post to manage.
          isNull(posts.deletedAt)
        )
      )
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
        editedAt: comments.editedAt,
        deletedAt: comments.deletedAt,
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
          membership: parent.membership,
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
        mediaUrls: posts.mediaUrls,
        editedAt: posts.editedAt,
        deletedAt: posts.deletedAt,
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
  // Feed-grill Q10: keyset pagination on (created_at, id) via `cursor`
  // (last reply id of the previous page), same as the feed list; OFFSET
  // silently skipped replies when new ones landed above the fold.
  // `offset` still works when no cursor is given (older clients).
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

    let cursor: { createdAt: Date | string; id: string } | undefined;
    const cursorParam = c.req.query("cursor");
    if (cursorParam) {
      const cursorId = z.string().uuid().parse(cursorParam);
      const [ref] = await db
        .select({ createdAt: comments.createdAt, id: comments.id })
        .from(comments)
        .where(and(eq(comments.id, cursorId), eq(comments.postId, id)))
        .limit(1);
      if (!ref) apiError("Invalid replies cursor", "BAD_REQUEST", 400);
      cursor = { createdAt: ref!.createdAt, id: ref!.id };
    }

    const baseQuery = db
      .select({
        id: comments.id,
        body: comments.body,
        createdAt: comments.createdAt,
        authorId: comments.authorId,
        authorName: profiles.displayName,
        authorAvatar: profiles.avatarUrl,
        membership: profiles.membership,
        editedAt: comments.editedAt,
        deletedAt: comments.deletedAt,
      })
      .from(comments)
      .leftJoin(profiles, eq(comments.authorId, profiles.userId))
      .where(
        and(
          eq(comments.postId, id),
          cursor
            ? sql`(${comments.createdAt}, ${comments.id}) < (${cursor.createdAt}, ${cursor.id})`
            : undefined
        )
      )
      .orderBy(desc(comments.createdAt), desc(comments.id))
      .limit(limit);

    const rows = await (cursor ? baseQuery : baseQuery.offset(offset));

    const mapped = rows.map((row) =>
      mapCommentRow(row, {
        id: parent!.id,
        createdAt: parent!.createdAt,
        authorId: parent!.authorId,
        authorName: parent!.authorName,
        authorAvatar: parent!.authorAvatar,
        membership: parent!.membership,
      })
    );
    return c.json({
      posts: mapped,
      data: mapped,
      offset: cursor ? 0 : offset,
      limit,
      next_cursor: rows.length === limit ? rows[rows.length - 1].id : null,
      has_more: rows.length === limit,
    });
  };
  app.get("/socials/posts/:id/replies", (c) => handlePostReplies(c, false));
  app.get("/socials/posts/:id/replies/with-auth", (c) =>
    handlePostReplies(c, true)
  );

  // Edit a post (owner only)
  // Feed product call Q14 (Irfan 2026-10-21): same rule as chat — a
  // 15-minute edit window, enforced server-side, and an "edited" mark
  // (edited_at) the client renders. Before this, edits were silent and
  // unlimited: a year-old post could be rewritten with zero trace.
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
    if (existing!.deletedAt)
      apiError("This post has been deleted", "POST_DELETED", 400);
    if (isEditExpired(existing!.createdAt))
      apiError(
        "Posts can only be edited within 15 minutes",
        "EDIT_WINDOW_EXPIRED",
        400
      );

    // Judge follow-up (PR #29): a PATCH carrying ONLY deleted_media is
    // a real update — the old code 400'd "Nothing to update" before the
    // deletions were ever applied, so the removal silently failed.
    const hasTextUpdate = !!payload.post_editor_state?.root || !!payload.text;
    if (!hasTextUpdate && payload.deleted_media.length === 0)
      apiError("Nothing to update", "BAD_REQUEST", 400);

    let newBody = existing!.body;
    if (payload.post_editor_state?.root) {
      // Feed-grill Q1: sanitize before persisting (see POST /socials/posts).
      newBody = JSON.stringify(
        sanitizeEditorState(payload.post_editor_state)
      ).slice(0, 20000);
    } else if (payload.text) {
      newBody = JSON.stringify(wrapPlainTextEditorState(payload.text)).slice(
        0,
        20000
      );
    }

    // Feed-grill Q15: honor deleted_media — it was parsed and then never
    // read, so "removed" photos kept rendering for everyone. The stored
    // media rows are now actually dropped (the URLs stop rendering
    // everywhere immediately; Cloudinary-side asset deletion is a
    // follow-up).
    const remainingMedia = withoutDeletedMedia(
      existing!.mediaUrls,
      payload.deleted_media
    );

    const [updated] = await db
      .update(posts)
      .set({
        body: newBody,
        mediaUrls: remainingMedia.length > 0 ? remainingMedia : null,
        editedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();

    // Q23: mentions newly added by this edit notify (onlyNew — people
    // already notified for this post are never re-pinged by an edit).
    if (hasTextUpdate) {
      await notifyMentions({
        editorState: parseStoredPostBody(newBody).post_editor_state,
        actorId: userId!,
        postId: id,
        onlyNew: true,
      });
    }

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
      mediaUrls: updated.mediaUrls ?? [],
      editedAt: updated.editedAt,
      deletedAt: updated.deletedAt,
      isArchived: updated.isArchived,
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
    if (existing!.deletedAt)
      apiError("This post has been deleted", "POST_DELETED", 400);

    await db
      .update(posts)
      .set({ isArchived: archived })
      .where(eq(posts.id, id));
    return c.json({ archived, post_id: id });
  };
  app.patch("/socials/posts/:id/archive", (c) => handleArchive(c, true));
  app.patch("/socials/posts/:id/unarchive", (c) => handleArchive(c, false));

  // Delete a post (owner only)
  // Feed product call Q21 (Irfan 2026-10-21): tombstone, NOT a hard
  // delete. The old handler removed the row and ON DELETE CASCADE wiped
  // every reply other people had written under it. Now deleted_at is
  // set; mapPostRow redacts body/media and renders the "deleted" stub,
  // replies stay visible, and the detail page still resolves so reply
  // links never 404. (Same call Irfan made for chat user deletion.)
  app.delete("/socials/posts/:id", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const id = z.string().uuid().parse(c.req.param("id"));

    const existing = await fetchPostRow(id);
    if (!existing) apiError("Post not found", "NOT_FOUND", 404);
    if (existing!.authorId !== userId) apiError("Forbidden", "FORBIDDEN", 403);

    if (!existing!.deletedAt) {
      await db
        .update(posts)
        .set({ deletedAt: new Date() })
        .where(eq(posts.id, id));
    }
    const mapped = mapPostRow({ ...existing!, deletedAt: new Date() });
    return c.json({
      deleted: true,
      post_id: id,
      posts: [mapped],
      data: [mapped],
    });
  });

  // ---------------------------------------------------------------------
  // Feed product calls Q12/Q13: reply edit/delete. Replies used to have
  // NO endpoints at all — write-once forever. These mirror the post and
  // chat-message conventions: author only, 15-minute edit window +
  // edited_at mark, soft delete with a placeholder so the thread
  // structure survives (parent comment_count is left untouched — the
  // placeholder still occupies its slot, like chat's deleted messages).
  // ---------------------------------------------------------------------

  const fetchCommentRow = async (id: string) => {
    const [row] = await db
      .select({
        id: comments.id,
        postId: comments.postId,
        body: comments.body,
        createdAt: comments.createdAt,
        authorId: comments.authorId,
        authorName: profiles.displayName,
        authorAvatar: profiles.avatarUrl,
        membership: profiles.membership,
        editedAt: comments.editedAt,
        deletedAt: comments.deletedAt,
      })
      .from(comments)
      .leftJoin(profiles, eq(comments.authorId, profiles.userId))
      .where(eq(comments.id, id))
      .limit(1);
    return row ?? null;
  };

  const mapFetchedComment = async (
    row: NonNullable<Awaited<ReturnType<typeof fetchCommentRow>>>
  ) => {
    const parent = await fetchPostRow(row.postId);
    return mapCommentRow(row, {
      id: row.postId,
      createdAt: parent?.createdAt ?? row.createdAt,
      authorId: parent?.authorId ?? row.authorId,
      authorName: parent?.authorName ?? null,
      authorAvatar: parent?.authorAvatar ?? null,
      membership: parent?.membership ?? null,
    });
  };

  // Edit a reply (author only, 15-minute window)
  app.patch("/socials/comments/:id", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const id = z.string().uuid().parse(c.req.param("id"));

    const payload = z
      .object({
        post_editor_state: z.any().optional(),
        text: z.string().min(1).max(5000).optional(),
      })
      .parse(await c.req.json());

    const existing = await fetchCommentRow(id);
    if (!existing) apiError("Reply not found", "NOT_FOUND", 404);
    if (existing!.authorId !== userId) apiError("Forbidden", "FORBIDDEN", 403);
    if (existing!.deletedAt)
      apiError("This reply has been deleted", "REPLY_DELETED", 400);
    if (isEditExpired(existing!.createdAt))
      apiError(
        "Replies can only be edited within 15 minutes",
        "EDIT_WINDOW_EXPIRED",
        400
      );

    let newBody: string;
    if (payload.post_editor_state?.root) {
      // Same stored-XSS guard as post writes (feed-grill Q1).
      newBody = JSON.stringify(
        sanitizeEditorState(payload.post_editor_state)
      ).slice(0, 20000);
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
      .update(comments)
      .set({ body: newBody, editedAt: new Date() })
      .where(eq(comments.id, id))
      .returning();

    // Q23: mentions newly added by this edit notify (onlyNew dedupe).
    // Post-grill Q12: the dedupe is scoped to THIS comment — the old
    // post-level scope suppressed genuinely new mentions of the same
    // person made in a different reply under the same post.
    await notifyMentions({
      editorState: parseStoredPostBody(newBody).post_editor_state,
      actorId: userId!,
      postId: existing!.postId,
      commentId: id,
      onlyNew: true,
    });

    const mapped = await mapFetchedComment({
      ...existing!,
      body: updated.body,
      editedAt: updated.editedAt,
      deletedAt: updated.deletedAt,
    });
    return c.json({ posts: [mapped], data: [mapped] });
  });

  // Delete a reply (author only, soft delete → placeholder)
  app.delete("/socials/comments/:id", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const id = z.string().uuid().parse(c.req.param("id"));

    const existing = await fetchCommentRow(id);
    if (!existing) apiError("Reply not found", "NOT_FOUND", 404);
    if (existing!.authorId !== userId) apiError("Forbidden", "FORBIDDEN", 403);

    if (!existing!.deletedAt) {
      await db
        .update(comments)
        .set({ deletedAt: new Date() })
        .where(eq(comments.id, id));
    }
    const mapped = await mapFetchedComment({
      ...existing!,
      deletedAt: new Date(),
    });
    return c.json({
      deleted: true,
      comment_id: id,
      posts: [mapped],
      data: [mapped],
    });
  });

  // Like / unlike toggle
  app.post("/socials/analytics/likes", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    rateLimitFeedWrite("likes", userId!, 60);
    const { postId, actionType } = z
      .object({
        postId: z.string().uuid(),
        actionType: z.enum(["like", "unlike"]),
      })
      .parse(await c.req.json());

    const target = await fetchPostRow(postId);
    if (!target) apiError("Post not found", "NOT_FOUND", 404);
    // Q21: a tombstoned post accepts no new likes/views and its counts
    // are frozen — liking one returns a readable error, not silent drift.
    if (target!.deletedAt)
      apiError("This post has been deleted", "POST_DELETED", 400);

    if (actionType === "like") {
      // Feed-grill Q5: notify ONLY when the like row was actually
      // inserted. The old code notified unconditionally after
      // onConflictDoNothing, so a double-click (or like→unlike→like)
      // wrote N "liked your post" notifications for one like.
      const inserted = await db
        .insert(postLikes)
        .values({ postId, userId: userId! })
        .onConflictDoNothing()
        .returning({ postId: postLikes.postId });
      if (inserted.length > 0) {
        // Phase 3: notify the post author (never self — helper guards it).
        await createNotification({
          userId: target!.authorId,
          type: "post_like",
          actorId: userId!,
          postId,
        });
      }
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
  // Feed-grill Q18: server-side dedup via the post_views ledger — one
  // counted view per user per post per day. The old handler incremented
  // unconditionally, so a loop could inflate any post's count without
  // bound. Repeat views still return the current count (no error — the
  // client fires this on scroll and must never be stranded by it).
  app.post("/socials/analytics/post-views", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    rateLimitFeedWrite("post-views", userId!, 120);
    const { post_id } = z
      .object({ post_id: z.string().uuid() })
      .parse(await c.req.json());

    const [existing] = await db
      .select({
        id: posts.id,
        viewCount: posts.viewCount,
        deletedAt: posts.deletedAt,
        authorId: posts.authorId,
      })
      .from(posts)
      .where(eq(posts.id, post_id))
      .limit(1);
    if (!existing) apiError("Post not found", "NOT_FOUND", 404);
    // Q21: views on a tombstone don't count — but this endpoint fires
    // automatically on scroll, so it returns the frozen count instead of
    // an error (the user is never stranded by an impression ping).
    if (existing!.deletedAt)
      return c.json({ view_count: existing!.viewCount, post_id });
    // Feed fix 2026-10-29 (owner views): the author's own view never
    // counts, same frozen-count response as a tombstone. The client
    // also skips the ping (SinglePostV2); this is defence in depth
    // for any other caller.
    if (
      existing!.authorId &&
      existing!.authorId.toLowerCase() === userId!.toLowerCase()
    )
      return c.json({ view_count: existing!.viewCount, post_id });

    const viewDate = new Date().toISOString().slice(0, 10);
    const inserted = await db
      .insert(postViews)
      .values({ postId: post_id, userId: userId!, viewDate })
      .onConflictDoNothing()
      .returning({ id: postViews.id });

    let viewCount = existing!.viewCount;
    if (inserted.length > 0) {
      const [updated] = await db
        .update(posts)
        .set({ viewCount: sql`${posts.viewCount} + 1` })
        .where(eq(posts.id, post_id))
        .returning({ viewCount: posts.viewCount });
      viewCount = updated?.viewCount ?? viewCount + 1;
    }
    return c.json({ view_count: viewCount, post_id });
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

    // Feed fix 2026-10-29 (owner views): the owner's own visit never
    // counts. Return the current count unchanged (same shape as the
    // increment path). The client hook also skips the ping; this is
    // defence in depth for any other caller.
    const [existing] = await db
      .select({ viewCount: profiles.viewCount })
      .from(profiles)
      .where(eq(profiles.userId, user_id))
      .limit(1);
    if (!existing) apiError("User not found", "NOT_FOUND", 404);
    if (user_id.toLowerCase() === userId!.toLowerCase())
      return c.json({
        profile_views_count: existing!.viewCount,
        user_id,
      });

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
    rateLimitFeedWrite("follows", userId!, 60);
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

    // Feed-grill Q6: notify ONLY when the follow row was actually
    // inserted. The old check-then-act raced: two concurrent follows both
    // saw "no existing", both inserted (one no-oped on the PK), and both
    // notified — duplicate "X followed you" from a single double-click.
    const inserted = await db
      .insert(follows)
      .values({
        followerId: userId!,
        followingId: following_id,
      })
      .onConflictDoNothing()
      .returning({ followerId: follows.followerId });
    if (inserted.length > 0) {
      await createNotification({
        userId: following_id,
        type: "follow",
        actorId: userId!,
      });
    }
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
    // Chat-grill Q10: the old "chats" count was wrong in both directions —
    // it only counted conversations the viewer had also sent in (a first
    // message from a stranger never lit the badge) and it never decreased
    // on read. Now: conversations with at least one message newer than my
    // lastReadAt — the same read state the chat list itself uses.
    const [{ count: chats }] = await db
      .select({
        count: sql<number>`count(distinct ${conversationMembers.conversationId})::int`,
      })
      .from(conversationMembers)
      .where(
        and(
          eq(conversationMembers.userId, userId!),
          sql`EXISTS (
            SELECT 1 FROM "messages" m
            WHERE m."conversation_id" = ${conversationMembers.conversationId}
              AND m."sender_id" != ${userId}
              AND m."created_at" > COALESCE(${conversationMembers.lastReadAt}, 'epoch'::timestamptz)
          )`
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
        isBot: profiles.isBot,
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
        commentId: notifications.commentId,
        conversationId: notifications.conversationId,
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
    rateLimitFeedWrite("posts", userId!, 20);

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
      // Q21: a tombstoned post is closed — its existing replies stay
      // readable, but no new ones land under a "deleted" stub.
      if (parentRow!.deletedAt)
        apiError("This post has been deleted", "POST_DELETED", 400);
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
      // Feed-grill Q4: was unbounded — one request could insert thousands
      // of posts. 10 covers the UI's longest thread with headroom.
      .max(10)
      .parse(payload.posts);

    // Post-grill Q3: replies are single, text-only comments — say so
    // honestly instead of silently diverging. The old handler ignored
    // `item.media` entirely (the comments table has no media column),
    // so an attached photo was uploaded, accepted with a 201, and
    // vanished; and a multi-item payload created one sibling comment
    // per item while the client tracked only the first, drifting every
    // count apart. Reject both shapes readably, before any insert.
    if (parentRow) {
      if (postsInput.length > 1)
        apiError(
          "A reply must be a single post — remove the extra drafts and try again",
          "REPLY_SINGLE_ONLY",
          400
        );
      const replyHasMedia = postsInput.some((item) =>
        (item.media || []).some(
          (m: any) =>
            typeof m?.object_name === "string" && m.object_name.length > 0
        )
      );
      if (replyHasMedia)
        apiError(
          "Replies can't include media yet — remove the attachment to post your reply",
          "REPLY_MEDIA_UNSUPPORTED",
          400
        );
    }

    const [authorProfile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId!))
      .limit(1);

    const createdMapped = [];
    for (const item of postsInput) {
      // Feed-grill Q1: sanitize the editor state before it is extracted
      // from or persisted — link nodes with javascript:/data: hrefs are
      // unwrapped to plain text (see lib/feed/editor-state.ts).
      const editorState = sanitizeEditorState(item.post_editor_state);
      const text = extractTextFromEditorState(editorState) || "(empty post)";
      const storedBody = editorState?.root ? JSON.stringify(editorState) : text;

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
        // Phase 3: notify the parent post author. Post-grill Q12:
        // carry the reply id so the notification deep-links to the
        // reply itself, not just the top of the post page.
        await createNotification({
          userId: parentRow.authorId,
          type: "post_reply",
          actorId: userId!,
          postId: parentRow.id,
          commentId: reply.id,
        });
        // Q23: notify anyone @mentioned in the reply. Q12: same
        // anchoring — the notification names the reply it came from.
        await notifyMentions({
          editorState,
          actorId: userId!,
          postId: parentRow.id,
          commentId: reply.id,
        });
        createdMapped.push(
          mapCommentRow(
            {
              id: reply.id,
              body: reply.body,
              createdAt: reply.createdAt,
              authorId: userId!,
              authorName: authorProfile?.displayName || "Sociaket Demo",
              authorAvatar:
                authorProfile?.avatarUrl || "/images/sociaket.logo.favicon.png",
              membership: authorProfile?.membership || "citizen",
            },
            {
              id: parentRow.id,
              createdAt: parentRow.createdAt,
              authorId: parentRow.authorId,
              authorName: parentRow.authorName,
              authorAvatar: parentRow.authorAvatar,
              membership: parentRow.membership,
            }
          )
        );
        continue;
      }

      // Phase 11 + feed-grill Q3/Q16: persist uploaded media (Cloudinary
      // secure_urls). Q3: only trusted Cloudinary hosts survive — any
      // other https URL is dropped, so a post can't make every viewer's
      // browser fetch an attacker URL. Q16: the media kind is persisted
      // alongside the URL ({url, type}) so videos stop rendering as
      // broken images.
      const mediaUrls = (item.media || [])
        .map((m: any) => {
          const url = m?.object_name;
          if (typeof url !== "string" || !isTrustedAttachmentUrl(url))
            return null;
          return {
            url,
            type: mediaKindForMime(m?.type) ?? mediaKindForUrl(url),
          };
        })
        .filter((m: { url: string } | null) => m !== null);

      const [created] = await db
        .insert(posts)
        .values({
          authorId: userId!,
          body: storedBody.slice(0, 20000),
          mediaUrls: mediaUrls.length > 0 ? mediaUrls : null,
        })
        .returning();

      // Q23: notify anyone @mentioned in the post.
      await notifyMentions({
        editorState,
        actorId: userId!,
        postId: created.id,
      });

      createdMapped.push(
        mapPostRow({
          id: created.id,
          body: created.body,
          likeCount: created.likeCount,
          commentCount: created.commentCount,
          createdAt: created.createdAt,
          authorId: userId!,
          authorName: authorProfile?.displayName || "Sociaket Demo",
          authorAvatar:
            authorProfile?.avatarUrl || "/images/sociaket.logo.favicon.png",
          membership: authorProfile?.membership || "citizen",
          mediaUrls: created.mediaUrls ?? [],
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
   * Real endpoints are added phase by phase (see sociaket-plan.md); genuinely
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

  /**
   * Chat completeness Q26: membership gate for group-lifecycle ops.
   * Unlike the read routes (404 — never leak that a conversation exists),
   * lifecycle ops answer 403: the caller is trying to CHANGE a group, and
   * the spec'd contract is "members only (403 otherwise)".
   */
  const requireGroupMembership = async (
    conversationId: string,
    userId: string
  ) => {
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
    if (!m)
      apiError("You are not a member of this conversation", "FORBIDDEN", 403);
    return m!;
  };

  /**
   * Chat completeness Q26: the conversation must be a GROUP. A DM is any
   * conversation carrying a dm_pair_key (set at 1-on-1 creation); groups
   * never have one, even if leaves shrink them to 2 members.
   */
  const requireGroup = async (conversationId: string) => {
    const [convo] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);
    if (!convo) apiError("Conversation not found", "NOT_FOUND", 404);
    if (convo!.dmPairKey)
      apiError(
        "This is a direct message — group settings are only available in group chats",
        "NOT_A_GROUP",
        400
      );
    return convo!;
  };

  /**
   * Chat completeness Q26: remove one member, applying creator succession
   * and last-member cleanup. Shared by the leave route and the lifecycle
   * remove route so the rules can't drift.
   * - Last member out → the conversation row is deleted (existing leave
   *   semantics).
   * - Creator out (or creator unset, e.g. their account was deleted) →
   *   ownership passes to the longest-standing remaining member
   *   (earliest joined_at, user_id tie-break — deterministic).
   */
  const removeChatMember = async (
    conversationId: string,
    targetUserId: string
  ) => {
    await db
      .delete(conversationMembers)
      .where(
        and(
          eq(conversationMembers.conversationId, conversationId),
          eq(conversationMembers.userId, targetUserId)
        )
      );
    const remaining = await db
      .select({
        userId: conversationMembers.userId,
        joinedAt: conversationMembers.joinedAt,
      })
      .from(conversationMembers)
      .where(eq(conversationMembers.conversationId, conversationId))
      .orderBy(
        asc(conversationMembers.joinedAt),
        asc(conversationMembers.userId)
      );
    if (remaining.length === 0) {
      await db
        .delete(conversations)
        .where(eq(conversations.id, conversationId));
      return { conversationDeleted: true };
    }
    const [convo] = await db
      .select({ createdBy: conversations.createdBy })
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);
    const creator = convo?.createdBy ?? null;
    if (creator === null || creator === targetUserId) {
      await db
        .update(conversations)
        .set({ createdBy: remaining[0].userId })
        .where(eq(conversations.id, conversationId));
    }
    return { conversationDeleted: false };
  };

  /**
   * Chat completeness Q24: ping the other members about a new message.
   * Rules (deliberately conservative — the chat badge already covers
   * passive discovery, the bell is for pull):
   * - never for a soft-deleted/redacted message (guard kept explicit even
   *   though a fresh insert is never deleted);
   * - never when the sender is a team bot — bots reply in DMs on a cron,
   *   and bell-spam per bot reply would bury real signals;
   * - never for the sender themselves (createNotification also guards);
   * - group messages notify every other member, DMs the one peer.
   */
  const notifyChatMessage = async (input: {
    conversationId: string;
    senderId: string;
    isDeleted: boolean | null | undefined;
  }) => {
    if (input.isDeleted) return;
    const [senderProfile] = await db
      .select({ isBot: profiles.isBot })
      .from(profiles)
      .where(eq(profiles.userId, input.senderId))
      .limit(1);
    if (senderProfile?.isBot) return;
    const memberRows = await db
      .select({ userId: conversationMembers.userId })
      .from(conversationMembers)
      .where(eq(conversationMembers.conversationId, input.conversationId));
    for (const m of memberRows) {
      if (m.userId === input.senderId) continue;
      await createNotification({
        userId: m.userId,
        type: "chat_message",
        actorId: input.senderId,
        conversationId: input.conversationId,
      });
    }
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
      // Chat-grill Q18: COUNT(*) instead of selecting every id just to
      // take .length (was an unbounded fetch on 10k-unread threads).
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
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
      unreadCount = count ?? 0;
    }

    return {
      id: convo!.id,
      title: convo!.title,
      created_at: convo!.createdAt,
      is_pinned: myMem?.isPinned ?? false,
      // Q26: a conversation is a group iff it has no DM dedup key (groups
      // can shrink to 2 members via leaves — member count is NOT the test).
      is_group: convo!.dmPairKey == null,
      created_by: convo!.createdBy ?? null,
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

  /**
   * Chat-grill Q2: synthetic sender card for tombstoned messages (the
   * sender's account was deleted — sender_id is NULL). Rendered as a
   * "deleted" placeholder in everyone else's threads instead of vanishing.
   */
  const deletedUserCard = () => ({
    _id: "",
    display_name: "Deleted user",
    profile_image: "/images/sociaket.logo.favicon.png",
    last_seen_at: null,
    is_online: false,
    membership: {
      last_status: "citizen" as const,
      status: "citizen" as const,
      endAt: 0,
    },
    is_followed_by_loggedin_user: false,
  });

  /** Single-message shape (thin wrapper — batch path does the work). */
  const buildMessage = async (messageId: string, viewerId: string) => {
    const [msg] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId))
      .limit(1);
    if (!msg) apiError("Message not found", "NOT_FOUND", 404);
    const [built] = await buildMessages([msg!], viewerId);
    return built;
  };

  /**
   * Chat-grill Q18: batched message assembly. The old per-message builder
   * ran 5-7 queries per message (re-select, sender card, reactions,
   * attachment, reply-to + its card) — ~500+ queries for a 100-message
   * poll. This issues ~6 queries total regardless of batch size:
   * reactions, attachments, legacy reply targets, and one sender-card
   * fetch for every distinct sender involved.
   *
   * Also applies the trust/tombstone rules:
   * - Q1: attachments whose URL is not on the trusted host are stripped
   *   (never rendered as embeds) — legacy off-host rows stay in the DB.
   * - Q2: null sender_id (deleted account) -> deleted placeholder.
   * - Q14: reply_to prefers the frozen reply_snapshot; legacy rows fall
   *   back to a live lookup. edited_at is exposed for the "edited" mark.
   * - Q16: soft-deleted messages are redacted (no body/attachment leak).
   */
  type MessageRow = typeof messages.$inferSelect;
  const buildMessages = async (rows: MessageRow[], viewerId: string) => {
    if (rows.length === 0) return [];
    const ids = rows.map((m) => m.id);

    const reactionRows = await db
      .select()
      .from(messageReactions)
      .where(inArray(messageReactions.messageId, ids));

    const attachmentIds = [
      ...new Set(
        rows.map((m) => m.attachmentId).filter((a): a is string => !!a)
      ),
    ];
    const attById = new Map<string, typeof chatAttachments.$inferSelect>();
    if (attachmentIds.length > 0) {
      const attRows = await db
        .select()
        .from(chatAttachments)
        .where(inArray(chatAttachments.id, attachmentIds));
      for (const a of attRows) attById.set(a.id, a);
    }

    // Legacy reply targets (rows that predate reply_snapshot).
    const liveReplyIds = [
      ...new Set(
        rows
          .filter((m) => m.replyToId && !m.replySnapshot)
          .map((m) => m.replyToId as string)
      ),
    ];
    const liveById = new Map<string, MessageRow>();
    if (liveReplyIds.length > 0) {
      const liveRows = await db
        .select()
        .from(messages)
        .where(inArray(messages.id, liveReplyIds));
      for (const r of liveRows) liveById.set(r.id, r);
    }

    const senderIds = new Set<string>();
    for (const m of rows) if (m.senderId) senderIds.add(m.senderId);
    for (const r of liveById.values())
      if (r.senderId) senderIds.add(r.senderId);
    const cards = await fetchUserCards([...senderIds], viewerId);
    const cardById = new Map<string, (typeof cards)[number]>();
    for (const c of cards) cardById.set((c as any)._id, c);

    const reactionsByMsg = new Map<
      string,
      Map<string, { count: number; reacted_by_me: boolean }>
    >();
    for (const r of reactionRows) {
      let byEmoji = reactionsByMsg.get(r.messageId);
      if (!byEmoji) {
        byEmoji = new Map();
        reactionsByMsg.set(r.messageId, byEmoji);
      }
      const e = byEmoji.get(r.emoji) ?? { count: 0, reacted_by_me: false };
      e.count += 1;
      if (r.userId === viewerId) e.reacted_by_me = true;
      byEmoji.set(r.emoji, e);
    }

    return rows.map((msg) => {
      const tombstoned = msg.senderId == null; // Q2: account deleted
      const deleted = msg.isDeleted || tombstoned; // Q16: soft delete

      let attachment: any = null;
      const att = msg.attachmentId ? attById.get(msg.attachmentId) : undefined;
      if (att && !deleted && isTrustedAttachmentUrl(att.url)) {
        attachment = {
          id: att.id,
          kind: att.kind,
          mime_type: att.mimeType,
          file_name: att.fileName,
          file_size: att.fileSize,
          url: att.url,
          duration_sec: att.durationSec,
          width: att.width,
          height: att.height,
          thumbnail_url: att.thumbnailUrl,
        };
      }

      let replyTo: any = null;
      const snap = msg.replySnapshot as {
        id: string;
        body: string;
        kind: string;
        sender_name: string;
      } | null;
      if (snap) {
        replyTo = {
          id: snap.id,
          body: snap.body,
          kind: snap.kind,
          sender_name: snap.sender_name,
        };
      } else if (msg.replyToId) {
        const rm = liveById.get(msg.replyToId);
        if (rm && !rm.isDeleted && rm.senderId) {
          const rc: any = cardById.get(rm.senderId);
          replyTo = {
            id: rm.id,
            body: rm.body,
            kind: rm.kind,
            sender_name: rc?.display_name ?? "Someone",
          };
        }
      }

      const senderCard = tombstoned
        ? deletedUserCard()
        : msg.senderId
        ? (cardById.get(msg.senderId) as any) ?? null
        : null;

      return {
        id: msg.id,
        // Q16: redacted — deleted content never leaves the server.
        body: deleted ? "" : msg.body,
        kind: msg.kind ?? "text",
        sender_id: msg.senderId,
        created_at: msg.createdAt,
        status: msg.status ?? "sent",
        is_deleted: deleted,
        edited_at: msg.editedAt ? msg.editedAt.toISOString() : null,
        sender: senderCard,
        attachment,
        reply_to: replyTo,
        reactions: [...(reactionsByMsg.get(msg.id)?.entries() ?? [])].map(
          ([emoji, v]) => ({ emoji, ...v })
        ),
      };
    });
  };

  // List my conversations (pinned first, then by last activity).
  // Chat-grill Q18: the old version called buildConversation per
  // conversation (~6 queries each, plus an unbounded unread-id select).
  // This batches the whole list into a fixed handful of queries.
  app.get("/chat/conversations", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);

    const myMems = await db
      .select()
      .from(conversationMembers)
      .where(eq(conversationMembers.userId, userId!));
    if (myMems.length === 0) return c.json({ conversations: [] });
    const convoIds = myMems.map((m) => m.conversationId);
    const inConvos = sql.join(
      convoIds.map((id) => sql`${id}`),
      sql`, `
    );

    const convos = await db
      .select()
      .from(conversations)
      .where(inArray(conversations.id, convoIds));
    const convoById = new Map(convos.map((cv) => [cv.id, cv]));

    const allMems = await db
      .select({
        conversationId: conversationMembers.conversationId,
        userId: conversationMembers.userId,
      })
      .from(conversationMembers)
      .where(inArray(conversationMembers.conversationId, convoIds));
    const memberIdsByConvo = new Map<string, string[]>();
    for (const m of allMems) {
      const arr = memberIdsByConvo.get(m.conversationId) ?? [];
      arr.push(m.userId);
      memberIdsByConvo.set(m.conversationId, arr);
    }
    const cards = await fetchUserCards(
      [...new Set(allMems.map((m) => m.userId))],
      userId!
    );
    const cardById = new Map<string, (typeof cards)[number]>();
    for (const cd of cards) cardById.set((cd as any)._id, cd);

    // Latest message per conversation (DISTINCT ON — bounded, no full scan).
    // rowsOf: neon-http's execute returns rows directly; normalize
    // defensively so a driver-shape change can't break the list.
    const rowsOf = <T>(raw: unknown): T[] => {
      if (Array.isArray(raw)) return raw as T[];
      if (raw && typeof raw === "object" && Array.isArray((raw as any).rows))
        return (raw as any).rows as T[];
      return [];
    };
    const lastRows = rowsOf<{
      id: string;
      conversation_id: string;
      body: string;
      sender_id: string | null;
      created_at: Date;
    }>(
      await db.execute(sql`
      SELECT DISTINCT ON (m."conversation_id")
        m."id", m."conversation_id", m."body", m."sender_id", m."created_at"
      FROM "messages" m
      WHERE m."conversation_id" IN (${inConvos})
      ORDER BY m."conversation_id", m."created_at" DESC, m."id" DESC
    `)
    );
    const lastByConvo = new Map(lastRows.map((r) => [r.conversation_id, r]));

    // Unread counts per conversation, one GROUP BY (Q18: was an unbounded
    // select-ids-then-length per conversation).
    const unreadRows = rowsOf<{ conversation_id: string; count: number }>(
      await db.execute(sql`
      SELECT m."conversation_id", COUNT(*)::int AS "count"
      FROM "messages" m
      JOIN "conversation_members" cm
        ON cm."conversation_id" = m."conversation_id"
        AND cm."user_id" = ${userId}
      WHERE m."conversation_id" IN (${inConvos})
        AND m."sender_id" != ${userId}
        AND m."created_at" > COALESCE(cm."last_read_at", 'epoch'::timestamptz)
      GROUP BY m."conversation_id"
    `)
    );
    const unreadByConvo = new Map(
      unreadRows.map((r) => [r.conversation_id, Number(r.count)])
    );

    const myMemByConvo = new Map(myMems.map((m) => [m.conversationId, m]));
    const list = convoIds
      .map((cid) => {
        const convo = convoById.get(cid);
        if (!convo) return null;
        const last = lastByConvo.get(cid);
        return {
          id: convo.id,
          title: convo.title,
          created_at: convo.createdAt,
          is_pinned: myMemByConvo.get(cid)?.isPinned ?? false,
          is_group: convo.dmPairKey == null,
          created_by: convo.createdBy ?? null,
          members: (memberIdsByConvo.get(cid) ?? [])
            .map((uid) => cardById.get(uid))
            .filter((mc): mc is (typeof cards)[number] => !!mc),
          last_message: last
            ? {
                id: last.id,
                body: last.body,
                sender_id: last.sender_id,
                created_at: last.created_at,
              }
            : null,
          unread_count: unreadByConvo.get(cid) ?? 0,
        };
      })
      .filter((x): x is NonNullable<typeof x> => !!x);
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
      // Chat-grill Q3: the old scan-then-insert raced — two concurrent
      // creates (double-click, two tabs) both passed the scan and made
      // duplicate DM threads no constraint could heal. The UNIQUE
      // dm_pair_key makes the insert itself the atomic check: the loser
      // gets the existing row. (neon-http has no interactive
      // transactions, so an advisory-lock approach would not work here.)
      const other = otherIds[0];
      const pairKey = dmPairKey(userId!, other);
      const [convo] = await db
        .insert(conversations)
        .values({
          title: body.title?.trim() || "",
          dmPairKey: pairKey,
          createdBy: userId!,
        })
        .onConflictDoNothing({ target: conversations.dmPairKey })
        .returning();
      if (convo) {
        await db.insert(conversationMembers).values(
          [userId!, other].map((id) => ({
            conversationId: convo.id,
            userId: id,
          }))
        );
        return c.json(await buildConversation(convo.id, userId!), 201);
      }
      const [existing] = await db
        .select({ id: conversations.id })
        .from(conversations)
        .where(eq(conversations.dmPairKey, pairKey))
        .limit(1);
      if (existing)
        return c.json(await buildConversation(existing.id, userId!));
      apiError("Conversation not found", "NOT_FOUND", 404);
    }

    const [convo] = await db
      .insert(conversations)
      .values({ title: body.title?.trim() || "", createdBy: userId! })
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
  // Q26: removal + creator succession + cleanup live in removeChatMember,
  // shared with the group-lifecycle remove route.
  app.delete("/chat/conversations/:id", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatIdParam.parse(c.req.param());

    await requireMembership(id, userId!);
    await removeChatMember(id, userId!);
    return c.json({ ok: true });
  });

  // ---------------------------------------------------------------------
  // Chat completeness Q24/Q26 (2026-10-21): presence heartbeat, message
  // search, and the group lifecycle (rename / add / remove members).
  // ---------------------------------------------------------------------

  // Presence heartbeat: stamp MY last_seen_at — at most one write per
  // ~60s, enforced by the WHERE clause (a fresh row simply doesn't match,
  // so chatty clients can't amplify writes). Self only, by construction.
  app.post("/chat/presence", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);

    await db
      .update(profiles)
      .set({ lastSeenAt: new Date() })
      .where(
        and(
          eq(profiles.userId, userId!),
          or(
            isNull(profiles.lastSeenAt),
            lt(
              profiles.lastSeenAt,
              new Date(Date.now() - PRESENCE_WRITE_THROTTLE_MS)
            )
          )
        )
      );
    return c.json({ ok: true });
  });

  // Message search across MY conversations. The membership join IS the
  // security boundary: a message is only searchable by someone who belongs
  // to its conversation. ILIKE on body (escaped, so %/_ in the query are
  // literals); the (conversation_id, created_at, id) keyset index from
  // 0006 keeps it bounded. Deleted messages are excluded — their bodies
  // are redacted everywhere else too. Full-text (tsvector) is the future
  // upgrade if ILIKE latency ever shows up in practice.
  app.get("/chat/search", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);

    const query = z
      .object({
        q: z.string().trim().min(2).max(100),
        limit: z.coerce.number().int().min(1).max(50).optional(),
        before: z.string().uuid().optional(),
      })
      .parse(c.req.query());
    const limit = query.limit ?? 20;

    let cursor: { createdAt: Date; id: string } | undefined;
    if (query.before) {
      const [ref] = await db
        .select({ createdAt: messages.createdAt, id: messages.id })
        .from(messages)
        .innerJoin(
          conversationMembers,
          and(
            eq(conversationMembers.conversationId, messages.conversationId),
            eq(conversationMembers.userId, userId!)
          )
        )
        .where(eq(messages.id, query.before))
        .limit(1);
      if (!ref) apiError("Message not found", "NOT_FOUND", 404);
      cursor = { createdAt: ref!.createdAt, id: ref!.id };
    }

    const pattern = `%${query.q.replace(/[%_\\]/g, (ch) => `\\${ch}`)}%`;
    const rows = await db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        conversationTitle: conversations.title,
        body: messages.body,
        kind: messages.kind,
        senderId: messages.senderId,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .innerJoin(
        conversationMembers,
        and(
          eq(conversationMembers.conversationId, messages.conversationId),
          eq(conversationMembers.userId, userId!)
        )
      )
      .innerJoin(conversations, eq(conversations.id, messages.conversationId))
      .where(
        and(
          ilike(messages.body, pattern),
          eq(messages.isDeleted, false),
          cursor
            ? sql`(${messages.createdAt}, ${messages.id}) < (${cursor.createdAt}, ${cursor.id})`
            : undefined
        )
      )
      .orderBy(desc(messages.createdAt), desc(messages.id))
      .limit(limit);

    const senderIds = [
      ...new Set(rows.map((r) => r.senderId).filter((s): s is string => !!s)),
    ];
    const cards = await fetchUserCards(senderIds, userId!);
    const cardById = new Map<string, (typeof cards)[number]>();
    for (const cd of cards) cardById.set((cd as any)._id, cd);

    return c.json({
      results: rows.map((r) => ({
        id: r.id,
        conversation_id: r.conversationId,
        conversation_title: r.conversationTitle,
        body: r.body,
        kind: r.kind ?? "text",
        sender_id: r.senderId,
        created_at: r.createdAt,
        sender: r.senderId
          ? (cardById.get(r.senderId) as any) ?? null
          : deletedUserCard(),
      })),
      has_more: rows.length === limit,
    });
  });

  // Rename a group (any member may rename; members only — 403 otherwise).
  app.patch("/chat/conversations/:id", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatIdParam.parse(c.req.param());
    const body = z
      .object({ title: z.string().trim().min(1).max(100) })
      .parse(await c.req.json());

    await requireGroupMembership(id, userId!);
    await requireGroup(id);
    await db
      .update(conversations)
      .set({ title: body.title })
      .where(eq(conversations.id, id));
    return c.json(await buildConversation(id, userId!));
  });

  // Add members to a group (any current member may add; adding someone
  // who is already in is a no-op success; the 50-member cap from creation
  // applies here too).
  app.post("/chat/conversations/:id/members", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatIdParam.parse(c.req.param());
    const body = z
      .object({
        user_ids: z.array(z.string().min(1)).min(1).max(50),
      })
      .parse(await c.req.json());

    await requireGroupMembership(id, userId!);
    await requireGroup(id);

    const requestedIds = [...new Set(body.user_ids)];
    const existingUsers = await db
      .select({ id: user.id })
      .from(user)
      .where(inArray(user.id, requestedIds));
    if (existingUsers.length !== requestedIds.length)
      apiError("Unknown user", "NOT_FOUND", 404);

    const current = await db
      .select({ userId: conversationMembers.userId })
      .from(conversationMembers)
      .where(eq(conversationMembers.conversationId, id));
    const currentSet = new Set(current.map((m) => m.userId));
    const toAdd = requestedIds.filter((uid) => !currentSet.has(uid));
    if (current.length + toAdd.length > 50)
      apiError("Groups are limited to 50 members", "BAD_REQUEST", 400);

    if (toAdd.length > 0) {
      await db
        .insert(conversationMembers)
        .values(toAdd.map((uid) => ({ conversationId: id, userId: uid })))
        .onConflictDoNothing();
    }
    return c.json(await buildConversation(id, userId!));
  });

  // Remove a member / leave a group. Removing YOURSELF is always allowed
  // (that's leaving); removing SOMEONE ELSE requires being the creator.
  app.delete("/chat/conversations/:id/members/:user_id", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const params = z
      .object({ id: z.string().uuid(), user_id: z.string().min(1) })
      .parse(c.req.param());
    const id = params.id;
    const targetUserId = params.user_id;

    await requireGroupMembership(id, userId!);
    const convo = await requireGroup(id);

    if (targetUserId !== userId! && convo.createdBy !== userId!)
      apiError(
        "Only the group creator can remove other members",
        "FORBIDDEN",
        403
      );

    const [targetMem] = await db
      .select({ userId: conversationMembers.userId })
      .from(conversationMembers)
      .where(
        and(
          eq(conversationMembers.conversationId, id),
          eq(conversationMembers.userId, targetUserId)
        )
      )
      .limit(1);
    if (!targetMem)
      apiError(
        "That user is not a member of this conversation",
        "NOT_FOUND",
        404
      );

    await removeChatMember(id, targetUserId);
    if (targetUserId === userId!) return c.json({ ok: true, left: true });
    return c.json(await buildConversation(id, userId!));
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

  // Mark a conversation as read + bulk-mark its messages read.
  // Accepts an optional up_to_message_id: messages up to and including that
  // message (by created_at) are marked read. Omitting it marks everything.
  //
  // Chat-grill Q4: the old code mutated lastReadAt BEFORE validating
  // up_to_message_id — a 404 still cleared the unread badge. Validation now
  // runs before any mutation.
  // Chat-grill Q9: the old code set lastReadAt=now() but only advanced
  // message statuses to the ref message — two sources of truth disagreeing.
  // Now both derive from one boundary: the ref message's created_at (or
  // now() when no ref is given).
  app.post("/chat/conversations/:id/read", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatIdParam.parse(c.req.param());
    const body = z
      .object({ up_to_message_id: z.string().uuid().optional() })
      .parse(await c.req.json().catch(() => ({})));

    // Chat-grill Q4: validate everything BEFORE mutating — the old code
    // bumped lastReadAt before checking the message existed (404 after
    // a write).
    await requireMembership(id, userId!);

    let upToMessageId: string | undefined;
    if (body.up_to_message_id) {
      const [ref] = await db
        .select({ id: messages.id })
        .from(messages)
        .where(
          and(
            eq(messages.id, body.up_to_message_id),
            eq(messages.conversationId, id)
          )
        )
        .limit(1);
      if (!ref) apiError("Message not found", "NOT_FOUND", 404);
      upToMessageId = body.up_to_message_id;
    }

    // Chat-grill Q9: ONE boundary drives both the badge (lastReadAt) and
    // the ticks (message statuses) — the old code used now() for one and
    // the ref's created_at for the other, so they disagreed. The boundary
    // is the ref message's exact created_at via subquery: never a JS Date
    // round-trip (µs truncation would leave the boundary message itself
    // counted as unread).
    const boundary = upToMessageId
      ? sql`(SELECT "created_at" FROM "messages" WHERE "id" = ${upToMessageId})`
      : sql`NOW()`;
    await db
      .update(conversationMembers)
      .set({ lastReadAt: boundary as unknown as Date })
      .where(
        and(
          eq(conversationMembers.conversationId, id),
          eq(conversationMembers.userId, userId!)
        )
      );
    await db
      .update(messages)
      .set({ status: "read" })
      .where(
        and(
          eq(messages.conversationId, id),
          ne(messages.senderId, userId!),
          ne(messages.status, "read"),
          lte(messages.createdAt, boundary)
        )
      );
    return c.json({ ok: true });
  });

  // List messages (member-only, chronological, paginated).
  // Chat-grill Q12: keyset on (created_at, id). The old `created_at <`
  // cursor permanently skipped messages sharing a millisecond timestamp;
  // tuple comparison can't. Chat-grill Q18: batched assembly instead of
  // one buildMessage (5-7 queries) per row.
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

    let cursor: { createdAt: Date; id: string } | undefined;
    if (query.before) {
      const [ref] = await db
        .select({ createdAt: messages.createdAt, id: messages.id })
        .from(messages)
        .where(
          and(eq(messages.id, query.before), eq(messages.conversationId, id))
        )
        .limit(1);
      if (!ref) apiError("Message not found", "NOT_FOUND", 404);
      cursor = { createdAt: ref!.createdAt, id: ref!.id };
    }

    const rows = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.conversationId, id),
          cursor
            ? sql`(${messages.createdAt}, ${messages.id}) < (${cursor.createdAt}, ${cursor.id})`
            : undefined
        )
      )
      .orderBy(desc(messages.createdAt), desc(messages.id))
      .limit(limit);

    const list = await buildMessages(rows.reverse(), userId!);
    return c.json({ messages: list, has_more: rows.length === limit });
  });

  // Send a message.
  app.post("/chat/conversations/:id/messages", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatIdParam.parse(c.req.param());

    await requireMembership(id, userId!);
    const body = z
      .object({
        body: z.string().trim().max(5000).optional().default(""),
        kind: z
          .enum(["text", "image", "video", "audio", "file", "voice"])
          .optional()
          .default("text"),
        attachment_id: z.string().uuid().optional(),
        reply_to_id: z.string().uuid().optional(),
      })
      .parse(await c.req.json());

    // Non-text messages require an attachment; text requires a body.
    if (body.kind === "text" && !body.body.trim()) {
      apiError("Message body is required", "VALIDATION_ERROR", 400);
    }
    if (body.kind !== "text" && !body.attachment_id) {
      apiError(
        "Attachment is required for media messages",
        "VALIDATION_ERROR",
        400
      );
    }
    // Verify the attachment belongs to the sender.
    if (body.attachment_id) {
      const [att] = await db
        .select({ id: chatAttachments.id })
        .from(chatAttachments)
        .where(
          and(
            eq(chatAttachments.id, body.attachment_id),
            eq(chatAttachments.uploaderId, userId!)
          )
        )
        .limit(1);
      if (!att) apiError("Attachment not found", "NOT_FOUND", 404);
    }
    // Verify the reply target is in this conversation.
    // Chat-grill Q14: freeze a snapshot of the quoted message so later
    // edits/deletes of the original can't silently rewrite quoted history.
    let replySnapshot: {
      id: string;
      body: string;
      kind: string;
      sender_name: string;
    } | null = null;
    if (body.reply_to_id) {
      const [rm] = await db
        .select({
          id: messages.id,
          body: messages.body,
          kind: messages.kind,
          senderId: messages.senderId,
        })
        .from(messages)
        .where(
          and(
            eq(messages.id, body.reply_to_id),
            eq(messages.conversationId, id)
          )
        )
        .limit(1);
      if (!rm) apiError("Replied message not found", "NOT_FOUND", 404);
      const [rc] = rm!.senderId
        ? await fetchUserCards([rm!.senderId], userId!)
        : [];
      replySnapshot = {
        id: rm!.id,
        body: rm!.body,
        kind: rm!.kind ?? "text",
        sender_name: (rc as any)?.display_name ?? "Someone",
      };
    }

    const [msg] = await db
      .insert(messages)
      .values({
        conversationId: id,
        senderId: userId!,
        body: body.body,
        kind: body.kind,
        attachmentId: body.attachment_id ?? null,
        replyToId: body.reply_to_id ?? null,
        replySnapshot,
        status: "sent",
      })
      .returning();
    // Chat-grill Q6: no lastReadAt bump on send. The old code advanced the
    // sender's read marker past peer messages that arrived milliseconds
    // before the send — marking them "read" sight unseen. The poller's
    // markAsRead (which only advances to messages actually fetched) is the
    // correct mechanism.
    // Chat completeness Q24: notify the other members (DM peer / group).
    await notifyChatMessage({
      conversationId: id,
      senderId: userId!,
      isDeleted: msg.isDeleted,
    });
    return c.json(await buildMessage(msg.id, userId!), 201);
  });

  // Edit my message.
  // Chat-grill Q14 (Irfan's product call): 15-minute edit window + edited
  // flag. Edits after the window are rejected with a readable error; the
  // client hides the edit button for expired messages too.
  app.patch("/chat/messages/:id", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatMessageIdParam.parse(c.req.param());

    const [msg] = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.id, id),
          eq(messages.senderId, userId!),
          eq(messages.isDeleted, false)
        )
      )
      .limit(1);
    if (!msg) apiError("Message not found", "NOT_FOUND", 404);

    const createdMs = +new Date(msg!.createdAt as unknown as string);
    if (Date.now() - createdMs > EDIT_WINDOW_MS) {
      apiError(
        "The 15-minute edit window has expired",
        "EDIT_WINDOW_EXPIRED",
        400
      );
    }

    const body = z
      .object({ body: z.string().trim().min(1).max(5000) })
      .parse(await c.req.json());
    await db
      .update(messages)
      .set({ body: body.body, editedAt: new Date() })
      .where(eq(messages.id, id));
    return c.json(await buildMessage(id, userId!));
  });

  // Delete my message (soft delete — Q16).
  // Chat-grill Q16: is_deleted was a dead column (DELETE hard-deleted, so
  // the "This message was deleted" UI was unreachable and the column lied
  // about the data model). Now delete sets the flag: the row stays, the
  // API redacts it, and the UI shows the placeholder.
  // Chat-grill Q15: the attachment row is released when no non-deleted
  // message references it anymore (Cloudinary file cleanup needs a
  // server-side API secret — not configured; tracked as follow-up).
  app.delete("/chat/messages/:id", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatMessageIdParam.parse(c.req.param());

    const [msg] = await db
      .select({ id: messages.id, attachmentId: messages.attachmentId })
      .from(messages)
      .where(and(eq(messages.id, id), eq(messages.senderId, userId!)))
      .limit(1);
    if (!msg) apiError("Message not found", "NOT_FOUND", 404);

    await db
      .update(messages)
      .set({ isDeleted: true })
      .where(eq(messages.id, id));

    if (msg!.attachmentId) {
      const [other] = await db
        .select({ id: messages.id })
        .from(messages)
        .where(
          and(
            eq(messages.attachmentId, msg!.attachmentId),
            eq(messages.isDeleted, false)
          )
        )
        .limit(1);
      if (!other) {
        await db
          .delete(chatAttachments)
          .where(eq(chatAttachments.id, msg!.attachmentId));
      }
    }
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
   * Phase 15: chat completeness.
   */

  // In-memory typing indicators (ephemeral, 5s TTL). Keyed by
  // `${conversationId}:${userId}` -> timestamp. Vercel-safe (no sockets).
  // Phase 15 fix (Judge F2): typing indicators are DB-backed (chat_typing
  // table) — in-memory Maps don't survive across Vercel serverless instances.
  const TYPING_TTL_MS = 5000;
  const TYPING_STALE_MS = 60_000; // opportunistic cleanup threshold

  // Phase 15 fix (Judge F3): server-side MIME allowlist, mirroring the
  // client's classifyChatFile sets. mime_type is attacker-controlled
  // (the file is uploaded directly to Cloudinary by the browser), so the
  // kind enum alone is not enough. SVG is excluded from images
  // (stored-XSS when served inline) — company-os pattern.
  const CHAT_MIME_ALLOWLIST: Record<string, Set<string>> = {
    image: CHAT_IMAGE_MIMES,
    video: CHAT_VIDEO_MIMES,
    audio: CHAT_AUDIO_MIMES,
    file: CHAT_FILE_MIMES,
  };

  // Register a chat attachment (file already uploaded to Cloudinary by the client).
  app.post("/chat/attachments", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);

    const body = z
      .object({
        kind: z.enum(["image", "video", "audio", "file"]),
        mime_type: z.string().min(1).max(120),
        file_name: z.string().min(1).max(255),
        file_size: z
          .number()
          .int()
          .min(1)
          .max(100 * 1024 * 1024),
        url: z.string().url().startsWith("https://"),
        duration_sec: z.number().int().min(0).optional(),
        width: z.number().int().min(0).optional(),
        height: z.number().int().min(0).optional(),
        thumbnail_url: z.string().url().optional(),
      })
      .parse(await c.req.json());

    // SVG rejected (stored-XSS when served inline) — company-os pattern.
    // Now enforced via the full per-kind allowlist (Judge F3).
    const allowedMimes = CHAT_MIME_ALLOWLIST[body.kind];
    if (!allowedMimes?.has(body.mime_type)) {
      apiError(
        `MIME type "${body.mime_type}" is not allowed for ${body.kind} attachments`,
        "VALIDATION_ERROR",
        400
      );
    }

    // Chat-grill Q1 (security): the URL is attacker-controlled input (the
    // browser uploads straight to Cloudinary; this endpoint only
    // *registers* metadata). MIME was allowlisted but the host was not —
    // an arbitrary https:// URL here becomes a tracking pixel / phishing
    // link rendered inline to every recipient. Only the Cloudinary host
    // is trusted.
    if (!isTrustedAttachmentUrl(body.url)) {
      apiError("Attachment URL host is not allowed", "VALIDATION_ERROR", 400);
    }
    if (body.thumbnail_url && !isTrustedAttachmentUrl(body.thumbnail_url)) {
      apiError(
        "Attachment thumbnail URL host is not allowed",
        "VALIDATION_ERROR",
        400
      );
    }

    const [att] = await db
      .insert(chatAttachments)
      .values({
        uploaderId: userId!,
        kind: body.kind,
        mimeType: body.mime_type,
        fileName: body.file_name,
        fileSize: body.file_size,
        url: body.url,
        durationSec: body.duration_sec ?? null,
        width: body.width ?? null,
        height: body.height ?? null,
        thumbnailUrl: body.thumbnail_url ?? null,
      })
      .returning();
    return c.json(
      {
        id: att.id,
        kind: att.kind,
        mime_type: att.mimeType,
        file_name: att.fileName,
        file_size: att.fileSize,
        url: att.url,
        duration_sec: att.durationSec,
        width: att.width,
        height: att.height,
        thumbnail_url: att.thumbnailUrl,
      },
      201
    );
  });

  // Send a typing indicator (ephemeral, DB-backed — Vercel-safe).
  app.post("/chat/conversations/:id/typing", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatIdParam.parse(c.req.param());
    await requireMembership(id, userId!);
    await db
      .insert(chatTyping)
      .values({ conversationId: id, userId: userId!, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: [chatTyping.conversationId, chatTyping.userId],
        set: { updatedAt: new Date() },
      });
    return c.json({ ok: true });
  });

  // Get active typing indicators for a conversation (excluding self).
  app.get("/chat/conversations/:id/typing", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    const { id } = chatIdParam.parse(c.req.param());
    await requireMembership(id, userId!);

    // Opportunistic cleanup of stale rows, scoped to this conversation
    // (chat-grill Q19: the old global delete made every user's poll write
    // against every other user's stale rows).
    await db
      .delete(chatTyping)
      .where(
        and(
          eq(chatTyping.conversationId, id),
          lt(chatTyping.updatedAt, new Date(Date.now() - TYPING_STALE_MS))
        )
      );

    const rows = await db
      .select({ userId: chatTyping.userId })
      .from(chatTyping)
      .where(
        and(
          eq(chatTyping.conversationId, id),
          ne(chatTyping.userId, userId!),
          gt(chatTyping.updatedAt, new Date(Date.now() - TYPING_TTL_MS))
        )
      );
    const typing: { user_id: string; display_name: string | null }[] = [];
    const userIds = rows.map((r) => r.userId);
    if (userIds.length > 0) {
      const cards = await fetchUserCards(userIds, userId!);
      for (const card of cards) {
        typing.push({ user_id: card._id, display_name: card.display_name });
      }
    }
    return c.json({ typing });
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
    if (uniq.length === 0)
      return new Map<string, ReturnType<typeof cfsUserCard>>();
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
    cfsUserCard({
      userId,
      displayName: "Unnamed",
      avatarUrl: "",
      membership: null,
    });

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
      coverIPFSHash: c.bannerUrl ?? "",
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
    const animUrl = n.animationUrl ?? "";
    const mediaType = n.mediaType ?? "image";
    const isVideo =
      mediaType === "video" || /\.(mp4|webm|mov)(\?|$)/i.test(animUrl || img);
    const isAudio = mediaType === "audio";
    return {
      id: n.id,
      collection: collectionId,
      createTime: n.createdAt
        ? n.createdAt.toISOString()
        : new Date(0).toISOString(),
      creator: creatorId,
      mintHash: "",
      ipfs: isVideo || isAudio ? animUrl || img : img,
      // Canonical vocabulary (marketplace-grill Q10): the detail page
      // branches on exactly these two values.
      saleState: (n.listed ? "Sale" : "NotForSale") as NFTSaleState,
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
        image: isVideo || isAudio ? animUrl || img : img,
        type: isVideo ? "video/mp4" : isAudio ? "audio/mpeg" : "image/png",
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
      .orderBy(order === "newest" ? desc(nfts.createdAt) : asc(nfts.createdAt))
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
      return mapCfsNft(
        n,
        n.collectionId,
        coll?.creatorId ?? "",
        ownerCard,
        creatorCard
      );
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
          mapCfsCollection(
            r,
            cards.get(r.creatorId) ?? fallbackCard(r.creatorId)
          )
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
    const collByCreator = new Map(
      collCounts.map((r) => [r.creatorId, r.collCount])
    );
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
    // QA-fix: compute real collection stats from the backend (the old UI
    // read these from the dead TheGraph subgraph and showed 0 placeholders).
    const [stats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        listed: sql<number>`count(*) filter (where ${nfts.listed})::int`,
        floorPrice: sql<
          string | null
        >`min(${nfts.price}) filter (where ${nfts.listed})`,
      })
      .from(nfts)
      .where(eq(nfts.collectionId, address));
    const [vol] = await db
      .select({
        totalVolume: sql<
          string | null
        >`coalesce(sum(${nftPurchases.priceBnb}), 0)`,
      })
      .from(nftPurchases)
      .innerJoin(nfts, eq(nftPurchases.nftId, nfts.id))
      .where(eq(nfts.collectionId, address));
    const total = stats?.total ?? 0;
    const listed = stats?.listed ?? 0;
    const mapped = mapCfsCollection(
      row!,
      cards.get(row!.creatorId) ?? fallbackCard(row!.creatorId)
    );
    return c.json({
      ...mapped,
      totalSupply: String(total),
      tradingVolumn: String(vol?.totalVolume ?? "0"),
      stats: {
        items: total,
        listed,
        listedPercent: total > 0 ? ((listed / total) * 100).toFixed(1) : "0",
        floorPrice: stats?.floorPrice ?? "0",
        totalVolume: String(vol?.totalVolume ?? "0"),
      },
    });
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
    const list = await loadNfts(
      eq(nfts.ownerId, owner),
      "newest",
      limit + 1,
      offset
    );
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

  /**
   * Phase 13: NFT trading — persistent buy/bid/purchase records.
   * Registered BEFORE the parametric `:collection` routes (Hono matches in
   * registration order).
   */

  const requireUserId = (c: {
    get: (key: "userId") => string | null;
  }): string => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);
    return userId as string;
  };

  const uuidParam = z.string().uuid();

  // Raw row shapes returned by the atomic trade statements below
  // (db.execute over neon-http: numeric → string, timestamps → ISO
  // strings). Same defensive normalization as the chat list's rowsOf.
  type TradePurchaseRow = {
    id: string;
    nft_id: string;
    buyer_id: string;
    seller_id: string;
    price_bnb: string;
    tx_hash: string | null;
    purchased_at: string | null;
  };
  type TradeBidRow = {
    id: string;
    nft_id: string;
    bidder_id: string;
    amount_bnb: string;
    status: string;
    created_at: string | null;
    expires_at: string | null;
  };
  const tradeRowsOf = <T>(raw: unknown): T[] => {
    if (Array.isArray(raw)) return raw as T[];
    if (raw && typeof raw === "object" && Array.isArray((raw as any).rows))
      return (raw as any).rows as T[];
    return [];
  };
  // Buy and accept claim rows in opposite orders (nft→bids vs bid→nft),
  // so a simultaneous buy+accept on the same NFT can deadlock; Postgres
  // aborts one statement (40P01/40001). Translate that into the readable
  // 409 the loser would have gotten anyway — never a raw 500.
  const execTrade = async (stmt: ReturnType<typeof sql>) => {
    try {
      return await db.execute(stmt);
    } catch (err: any) {
      const code = err?.code ?? err?.cause?.code;
      if (code === "40P01" || code === "40001")
        apiError(
          "This item changed hands at the same moment — please try again",
          "TRADE_CONFLICT",
          409
        );
      throw err;
    }
  };
  const mapPurchaseRaw = (r: TradePurchaseRow) => ({
    id: r.id,
    nftId: r.nft_id,
    buyerId: r.buyer_id,
    sellerId: r.seller_id,
    priceBnb: r.price_bnb,
    txHash: r.tx_hash,
    purchasedAt: r.purchased_at ? new Date(r.purchased_at).toISOString() : null,
  });
  const mapBidRaw = (r: TradeBidRow) => ({
    id: r.id,
    nftId: r.nft_id,
    bidderId: r.bidder_id,
    amountBnb: r.amount_bnb,
    status: r.status,
    createdAt: r.created_at ? new Date(r.created_at).toISOString() : null,
    expiresAt: r.expires_at ? new Date(r.expires_at).toISOString() : null,
  });

  const mapBidRow = (b: typeof nftBids.$inferSelect) => ({
    id: b.id,
    nftId: b.nftId,
    bidderId: b.bidderId,
    amountBnb: b.amountBnb,
    status: b.status,
    createdAt: b.createdAt ? b.createdAt.toISOString() : null,
    expiresAt: b.expiresAt ? b.expiresAt.toISOString() : null,
  });

  const mapPurchaseRow = (p: typeof nftPurchases.$inferSelect) => ({
    id: p.id,
    nftId: p.nftId,
    buyerId: p.buyerId,
    sellerId: p.sellerId,
    priceBnb: p.priceBnb,
    txHash: p.txHash,
    purchasedAt: p.purchasedAt ? p.purchasedAt.toISOString() : null,
  });

  const nftRowById = async (id: string) => {
    const [row] = await db.select().from(nfts).where(eq(nfts.id, id)).limit(1);
    return row ?? null;
  };

  // Buy a listed NFT at its fixed price: records the purchase, transfers
  // ownership, unlists, and marks active bids outbid.
  //
  // Marketplace-grill Q4 (was "KNOWN LIMITATION, logged not fixed"): the
  // old flow was check-then-act across three awaits — two concurrent buys
  // could both pass the `listed` check and both record purchases, and a
  // crash between steps left a purchase record for a sale that never
  // completed. The trade now runs as ONE statement: the conditional
  // UPDATE claims the NFT only while it is still listed (the row lock +
  // WHERE re-evaluation serialize concurrent buyers — exactly one claim
  // wins), and the purchase insert + bid sweep are gated on the claim's
  // RETURNING, so a trade either fully lands or not at all. (neon-http
  // has no interactive transactions; a single statement is the atomic
  // unit, and every write below is chained on the previous RETURNING.)
  app.post("/marketplace/nfts/:id/buy", async (c) => {
    const buyerId = requireUserId(c);
    const nftId = uuidParam.parse(c.req.param("id"));
    const body = z
      .object({ txHash: z.string().max(128).optional() })
      .parse(await c.req.json().catch(() => ({})));
    const nft = await nftRowById(nftId);
    if (!nft) apiError("NFT not found", "NOT_FOUND", 404);
    if (!nft!.listed) apiError("NFT is not listed for sale", "NOT_LISTED", 400);
    if (nft!.ownerId === buyerId)
      apiError("You already own this NFT", "SELF_BUY", 400);
    const rows = tradeRowsOf<TradePurchaseRow>(
      await execTrade(sql`
        WITH claim AS (
          UPDATE "nfts"
          SET "owner_id" = ${buyerId}, "listed" = false
          WHERE "id" = ${nftId} AND "listed" = true
            AND "owner_id" = ${nft!.ownerId}
          RETURNING "id", "price"
        ),
        purchase AS (
          INSERT INTO "nft_purchases"
            ("nft_id", "buyer_id", "seller_id", "price_bnb", "tx_hash")
          SELECT "id", ${buyerId}, ${nft!.ownerId}, "price", ${
        body.txHash ?? null
      }
          FROM claim
          RETURNING "id", "nft_id", "buyer_id", "seller_id", "price_bnb",
            "tx_hash", "purchased_at"
        ),
        swept AS (
          UPDATE "nft_bids" SET "status" = 'outbid'
          WHERE "nft_id" IN (SELECT "id" FROM claim) AND "status" = 'active'
          RETURNING "id"
        )
        SELECT p.*, (SELECT count(*)::int FROM swept) AS "swept_count"
        FROM purchase p
      `)
    );
    if (rows.length === 0) {
      // Lost the race between the pre-checks and the claim — re-read so
      // the loser gets the precise, readable reason.
      const now = await nftRowById(nftId);
      if (now && now.ownerId === buyerId)
        apiError("You already own this NFT", "SELF_BUY", 409);
      apiError(
        "This item was just sold — someone else completed the purchase first",
        "ALREADY_SOLD",
        409
      );
    }
    return c.json({ purchase: mapPurchaseRaw(rows[0]) }, 201);
  });

  // Place a bid. Must exceed the current highest active bid (or be > 0 when
  // there are none). Lower active bids are marked outbid.
  //
  // DECISION (Judge F5): bids are allowed on UNLISTED NFTs as "make an
  // offer" — no `listed` check here. Rationale: the trade panel already
  // shows the bid form to non-owners regardless of listing state, and
  // offers-on-unlisted is standard marketplace behavior (owner can still
  // accept via /bids/:bidId/accept, which transfers ownership). A stricter
  // listed-only rule would orphan legitimate offers and the seeded bid
  // book on unlisted NFTs.
  app.post("/marketplace/nfts/:id/bids", async (c) => {
    const bidderId = requireUserId(c);
    const nftId = uuidParam.parse(c.req.param("id"));
    const body = z
      .object({ amountBnb: z.union([z.string(), z.number()]) })
      .parse(await c.req.json());
    // Marketplace-grill Q7: exact decimal handling (lib/marketplace/
    // bnb-amount). The old path validated the float, then stored
    // `amount.toFixed(4)` — a 0.00001 BNB bid rounded to "0.0000" yet
    // still wiped the real top bid, and huge amounts overflowed the
    // numeric(18,4) column into a raw 500. Now the amount is parsed
    // exactly (wei-scale BigInt), stored unrounded at numeric(38,18),
    // and a bid whose stored value would be zero is rejected up front.
    const parsed = parseBnbAmount(body.amountBnb);
    if (!parsed.ok) apiError(parsed.error, "INVALID_AMOUNT", 400);
    // apiError always throws; the cast is the narrowing (same reason
    // this file is full of `nft!` after apiError guards).
    const bidAmount = (parsed as { ok: true; value: ParsedBnbAmount }).value;
    if (bidAmount.scaled <= 0n)
      apiError("Bid amount must be more than 0 BNB", "INVALID_AMOUNT", 400);
    const nft = await nftRowById(nftId);
    if (!nft) apiError("NFT not found", "NOT_FOUND", 404);
    if (nft!.ownerId === bidderId)
      apiError("Owner cannot bid on their own NFT", "SELF_BID", 400);
    const [top] = await db
      .select()
      .from(nftBids)
      .where(and(eq(nftBids.nftId, nftId), eq(nftBids.status, "active")))
      .orderBy(desc(nftBids.amountBnb))
      .limit(1);
    // Exact comparison against the *stored* top bid — never floats.
    if (top && bidAmount.scaled <= storedBnbToScaled(top.amountBnb))
      apiError(
        `Bid must exceed the current highest bid of ${top.amountBnb} BNB`,
        "BID_TOO_LOW",
        400
      );
    // One statement: the insert only lands if the amount still beats the
    // stored top bid at execution time, and the sweep only marks bids
    // the new bid actually outbids — a bid can never displace a higher
    // (or equal) top bid, even when two bids land concurrently (Q3/Q5).
    const rows = tradeRowsOf<TradeBidRow>(
      await execTrade(sql`
        WITH placed AS (
          INSERT INTO "nft_bids" ("nft_id", "bidder_id", "amount_bnb", "status")
          SELECT ${nftId}, ${bidderId}, ${bidAmount.canonical}, 'active'
          WHERE ${bidAmount.canonical}::numeric > COALESCE(
            (SELECT MAX("amount_bnb") FROM "nft_bids"
             WHERE "nft_id" = ${nftId} AND "status" = 'active'),
            0
          )
          RETURNING "id", "nft_id", "bidder_id", "amount_bnb", "status",
            "created_at", "expires_at"
        ),
        swept AS (
          UPDATE "nft_bids" SET "status" = 'outbid'
          WHERE "nft_id" = ${nftId} AND "status" = 'active'
            AND "id" NOT IN (SELECT "id" FROM placed)
            AND EXISTS (SELECT 1 FROM placed)
            AND "amount_bnb" < (SELECT "amount_bnb" FROM placed)
          RETURNING "id"
        )
        SELECT p.*, (SELECT count(*)::int FROM swept) AS "swept_count"
        FROM placed p
      `)
    );
    if (rows.length === 0)
      apiError(
        "Bid must exceed the current highest bid — it was just raised",
        "BID_TOO_LOW",
        409
      );
    return c.json({ bid: mapBidRaw(rows[0]) }, 201);
  });

  // Bid history for an NFT, newest first, with bidder cards.
  app.get("/marketplace/nfts/:id/bids", async (c) => {
    requireUserId(c);
    const nftId = uuidParam.parse(c.req.param("id"));
    const rows = await db
      .select()
      .from(nftBids)
      .where(eq(nftBids.nftId, nftId))
      .orderBy(desc(nftBids.createdAt));
    const cards = await fetchCfsUserCards(rows.map((r) => r.bidderId));
    return c.json({
      bids: rows.map((r) => ({
        ...mapBidRow(r),
        bidder: cards.get(r.bidderId) ?? fallbackCard(r.bidderId),
      })),
    });
  });

  // Owner accepts an active bid: creates the purchase record, transfers
  // ownership, unlists, marks the bid accepted and the rest outbid.
  //
  // Marketplace-grill Q5: same atomic pattern as buy. The bid is claimed
  // conditionally (`status = 'active'` — a bid withdrawn a millisecond
  // earlier can no longer settle), the NFT transfer is gated on the bid
  // claim AND still being the owner, and the purchase (at the bid's
  // actual stored amount — Q3: volume stats sum these rows, so the price
  // recorded is the price that settles) is gated on the transfer.
  app.post("/marketplace/bids/:bidId/accept", async (c) => {
    const userId = requireUserId(c);
    const bidId = uuidParam.parse(c.req.param("bidId"));
    const [bid] = await db
      .select()
      .from(nftBids)
      .where(eq(nftBids.id, bidId))
      .limit(1);
    if (!bid) apiError("Bid not found", "NOT_FOUND", 404);
    if (bid!.status !== "active")
      apiError("Bid is no longer active", "BID_INACTIVE", 400);
    const nft = await nftRowById(bid!.nftId);
    if (!nft) apiError("NFT not found", "NOT_FOUND", 404);
    if (nft!.ownerId !== userId)
      apiError("Only the owner can accept bids", "FORBIDDEN", 403);
    if (bid!.bidderId === userId)
      apiError("Owner cannot accept their own bid", "SELF_BID", 400);
    const rows = tradeRowsOf<TradePurchaseRow>(
      await execTrade(sql`
        WITH bid_claim AS (
          UPDATE "nft_bids" SET "status" = 'accepted'
          WHERE "id" = ${bidId} AND "status" = 'active'
            AND EXISTS (
              SELECT 1 FROM "nfts"
              WHERE "id" = ${bid!.nftId} AND "owner_id" = ${userId}
            )
          RETURNING "id", "nft_id", "bidder_id", "amount_bnb"
        ),
        nft_claim AS (
          UPDATE "nfts"
          SET "owner_id" = (SELECT "bidder_id" FROM bid_claim),
              "listed" = false
          WHERE "id" IN (SELECT "nft_id" FROM bid_claim)
            AND "owner_id" = ${userId}
          RETURNING "id"
        ),
        purchase AS (
          INSERT INTO "nft_purchases"
            ("nft_id", "buyer_id", "seller_id", "price_bnb", "tx_hash")
          SELECT "id", (SELECT "bidder_id" FROM bid_claim), ${userId},
                 (SELECT "amount_bnb" FROM bid_claim), NULL
          FROM nft_claim
          RETURNING "id", "nft_id", "buyer_id", "seller_id", "price_bnb",
            "tx_hash", "purchased_at"
        ),
        swept AS (
          UPDATE "nft_bids" SET "status" = 'outbid'
          WHERE "nft_id" IN (SELECT "id" FROM nft_claim)
            AND "status" = 'active'
          RETURNING "id"
        )
        SELECT p.*, (SELECT count(*)::int FROM swept) AS "swept_count"
        FROM purchase p
      `)
    );
    if (rows.length === 0) {
      // The claim chain broke: the bid was withdrawn/accepted in the same
      // instant, or the NFT changed hands first. If the bid claim fired
      // but the transfer didn't, the bid is parked in 'accepted' with no
      // sale behind it — hand it back to 'active', but only when the NFT
      // did NOT end up with the bidder (i.e. no sale actually happened).
      await db.execute(sql`
        UPDATE "nft_bids" SET "status" = 'active'
        WHERE "id" = ${bidId} AND "status" = 'accepted'
          AND NOT EXISTS (
            SELECT 1 FROM "nfts"
            WHERE "id" = ${bid!.nftId} AND "owner_id" = ${bid!.bidderId}
          )
      `);
      const [fresh] = await db
        .select()
        .from(nftBids)
        .where(eq(nftBids.id, bidId))
        .limit(1);
      if (fresh && fresh.status === "withdrawn")
        apiError(
          "This bid was just withdrawn by the bidder",
          "BID_INACTIVE",
          409
        );
      if (fresh && fresh.status !== "active")
        apiError("Bid is no longer active", "BID_INACTIVE", 409);
      apiError(
        "This sale could not be completed — the item changed hands at the same moment",
        "TRADE_CONFLICT",
        409
      );
    }
    return c.json({ purchase: mapPurchaseRaw(rows[0]) });
  });

  // Owner rejects an active bid. Marketplace-grill Q5: the status flip is
  // a conditional update — if the bid left 'active' between the checks
  // and the write (accepted/withdrawn race), the loser gets a 409, not a
  // silent overwrite.
  app.post("/marketplace/bids/:bidId/reject", async (c) => {
    const userId = requireUserId(c);
    const bidId = uuidParam.parse(c.req.param("bidId"));
    const [bid] = await db
      .select()
      .from(nftBids)
      .where(eq(nftBids.id, bidId))
      .limit(1);
    if (!bid) apiError("Bid not found", "NOT_FOUND", 404);
    if (bid!.status !== "active")
      apiError("Bid is no longer active", "BID_INACTIVE", 400);
    const nft = await nftRowById(bid!.nftId);
    if (!nft) apiError("NFT not found", "NOT_FOUND", 404);
    if (nft!.ownerId !== userId)
      apiError("Only the owner can reject bids", "FORBIDDEN", 403);
    const updated = await db
      .update(nftBids)
      .set({ status: "rejected" })
      .where(and(eq(nftBids.id, bid!.id), eq(nftBids.status, "active")))
      .returning();
    if (updated.length === 0)
      apiError("This bid was just accepted or withdrawn", "BID_INACTIVE", 409);
    return c.json({ bid: mapBidRow(updated[0]) });
  });

  // Bidder withdraws their own active bid. Marketplace-grill Q5: the
  // conditional update is what guarantees a withdrawn bid can never
  // settle — accept claims the bid with the same `status = 'active'`
  // condition, so exactly one of the two transitions wins the row.
  app.post("/marketplace/bids/:bidId/withdraw", async (c) => {
    const userId = requireUserId(c);
    const bidId = uuidParam.parse(c.req.param("bidId"));
    const [bid] = await db
      .select()
      .from(nftBids)
      .where(eq(nftBids.id, bidId))
      .limit(1);
    if (!bid) apiError("Bid not found", "NOT_FOUND", 404);
    if (bid!.bidderId !== userId)
      apiError("Only the bidder can withdraw this bid", "FORBIDDEN", 403);
    if (bid!.status !== "active")
      apiError("Bid is no longer active", "BID_INACTIVE", 400);
    const updated = await db
      .update(nftBids)
      .set({ status: "withdrawn" })
      .where(
        and(
          eq(nftBids.id, bid!.id),
          eq(nftBids.bidderId, userId),
          eq(nftBids.status, "active")
        )
      )
      .returning();
    if (updated.length === 0)
      apiError(
        "This bid was just accepted — it can no longer be withdrawn",
        "BID_INACTIVE",
        409
      );
    return c.json({ bid: mapBidRow(updated[0]) });
  });

  // Purchase history for a user (bought + sold). Users can only view their
  // own history; omit userId to use the session user.
  app.get("/marketplace/purchases", async (c) => {
    const me = requireUserId(c);
    const q = z.object({ userId: z.string().optional() }).parse(c.req.query());
    const target = q.userId ?? me;
    if (target !== me) apiError("Forbidden", "FORBIDDEN", 403);
    const bought = await db
      .select()
      .from(nftPurchases)
      .where(eq(nftPurchases.buyerId, target))
      .orderBy(desc(nftPurchases.purchasedAt));
    const sold = await db
      .select()
      .from(nftPurchases)
      .where(eq(nftPurchases.sellerId, target))
      .orderBy(desc(nftPurchases.purchasedAt));
    const nftIds = [...new Set([...bought, ...sold].map((p) => p.nftId))];
    const nftRows =
      nftIds.length > 0
        ? await db.select().from(nfts).where(inArray(nfts.id, nftIds))
        : [];
    const nftMap = new Map(
      nftRows.map((n) => [
        n.id,
        {
          id: n.id,
          name: n.name,
          imageUrl: n.imageUrl,
          collectionId: n.collectionId,
        },
      ])
    );
    const partyIds = [
      ...new Set([...bought, ...sold].flatMap((p) => [p.buyerId, p.sellerId])),
    ];
    const cards = await fetchCfsUserCards(partyIds);
    const withContext = (p: typeof nftPurchases.$inferSelect) => ({
      ...mapPurchaseRow(p),
      nft: nftMap.get(p.nftId) ?? null,
      buyer: cards.get(p.buyerId) ?? fallbackCard(p.buyerId),
      seller: cards.get(p.sellerId) ?? fallbackCard(p.sellerId),
    });
    return c.json({
      bought: bought.map(withContext),
      sold: sold.map(withContext),
    });
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
    let where: ReturnType<typeof eq> | ReturnType<typeof and> | undefined = eq(
      nfts.collectionId,
      collection
    );
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
    const cards = await fetchCfsUserCards([
      row!.ownerId,
      coll?.creatorId ?? "",
    ]);
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
    // Phase 13: real on-platform sale history (newest first).
    const saleRows = await db
      .select()
      .from(nftPurchases)
      .where(eq(nftPurchases.nftId, row!.id))
      .orderBy(desc(nftPurchases.purchasedAt));
    const saleCards = await fetchCfsUserCards(
      saleRows.flatMap((s) => [s.buyerId, s.sellerId])
    );
    const marketplaceSaleHistory = saleRows.map((s) => ({
      id: s.id,
      // "BuyItem" (not "Sale"): the single-NFT UI union
      // (lib/get-single-nft-page-data/types.ts) only renders known types and
      // returns null for unknown ones — "Sale" made purchases invisible.
      type: "BuyItem",
      txTime: s.purchasedAt
        ? Math.floor(+s.purchasedAt / 1000).toString()
        : "0",
      seller: s.sellerId,
      price: s.priceBnb ?? "0",
      buyer: s.buyerId,
      buyer_data: saleCards.get(s.buyerId) ?? fallbackCard(s.buyerId),
      seller_data: saleCards.get(s.sellerId) ?? fallbackCard(s.sellerId),
    }));
    return c.json({
      ...nft,
      marketplaceSaleHistory,
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
