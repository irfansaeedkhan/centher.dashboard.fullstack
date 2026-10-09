import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  channels,
  channelMessages,
  citizenships,
  collections,
  conversations,
  launchpads,
  messages,
  nfts,
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
      cookies_consent: undefined,
      email: authUser?.email,
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
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const mapped = rows.map((row) => ({
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
      liked_by_loggedin_user: false,
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
      post_editor_state: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: row.body,
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
      },
      media: [],
    }));

    return c.json({
      posts: mapped,
      data: mapped,
      offset,
      limit,
    });
  });

  app.post("/socials/posts", async (c) => {
    const userId = c.get("userId");
    if (!userId) apiError("Unauthorized", "UNAUTHORIZED", 401);

    const body = z
      .object({ body: z.string().min(1).max(2000) })
      .parse(await c.req.json());

    const [created] = await db
      .insert(posts)
      .values({ authorId: userId!, body: body.body })
      .returning();

    return c.json({ data: created }, 201);
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

  /** Catch-all stub so unmatched demo calls do not hang the UI */
  app.all("*", (c) =>
    c.json({
      data: [],
      message: "Demo stub — endpoint not fully mapped yet",
      code: "STUB",
      path: c.req.path,
    })
  );

  return app;
};

export type HonoApp = ReturnType<typeof createHonoApp>;
