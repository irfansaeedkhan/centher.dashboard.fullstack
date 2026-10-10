/**
 * Phase 12: Rich demo content seed (idempotent).
 *
 * Seeds posts with images, thread-style reply chains, NFTs/collections,
 * notifications, and chat conversations for the demo walkthrough.
 *
 * IDEMPOTENCY: every insert checks for existence by a stable natural key
 * (body text, name, title) before inserting. Safe to re-run — no duplicates.
 *
 * Run: npx tsx scripts/seed-phase12.ts (requires DATABASE_URL / .env.local)
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { and, eq } from "drizzle-orm";
import { db } from "../db";
import {
  collections,
  comments,
  conversationMembers,
  conversations,
  messages,
  nfts,
  notifications,
  posts,
  profiles,
  user,
} from "../db/schema";

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@centher.io";

const pic = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getUserIdByEmail(email: string): Promise<string | null> {
  const rows = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  return rows[0]?.id ?? null;
}

// Idempotency: keyed on (authorId, body). If a seeded post's text is edited,
// a re-run will insert a duplicate. Acceptable for demo seed data.
async function ensurePost(
  authorId: string,
  body: string,
  mediaUrls: string[] | null
): Promise<string> {
  const existing = await db
    .select({ id: posts.id })
    .from(posts)
    .where(and(eq(posts.authorId, authorId), eq(posts.body, body)))
    .limit(1);
  if (existing[0]) return existing[0].id;
  const [row] = await db
    .insert(posts)
    .values({ authorId, body, mediaUrls })
    .returning({ id: posts.id });
  return row.id;
}

async function ensureComment(
  postId: string,
  authorId: string,
  body: string
): Promise<string> {
  const existing = await db
    .select({ id: comments.id })
    .from(comments)
    .where(
      and(
        eq(comments.postId, postId),
        eq(comments.authorId, authorId),
        eq(comments.body, body)
      )
    )
    .limit(1);
  if (existing[0]) return existing[0].id;
  const [row] = await db
    .insert(comments)
    .values({ postId, authorId, body })
    .returning({ id: comments.id });
  return row.id;
}

async function ensureCollection(
  name: string,
  description: string,
  imageUrl: string,
  creatorId: string,
  bannerUrl?: string
): Promise<string> {
  const existing = await db
    .select({ id: collections.id })
    .from(collections)
    .where(eq(collections.name, name))
    .limit(1);
  if (existing[0]) {
    // Backfill banner on re-runs for existing collections.
    if (bannerUrl) {
      await db
        .update(collections)
        .set({ bannerUrl })
        .where(eq(collections.id, existing[0].id));
    }
    return existing[0].id;
  }
  const [row] = await db
    .insert(collections)
    .values({ name, description, imageUrl, creatorId, bannerUrl })
    .returning({ id: collections.id });
  return row.id;
}

async function ensureNft(
  collectionId: string,
  name: string,
  description: string,
  imageUrl: string,
  ownerId: string,
  price: string
): Promise<string> {
  const existing = await db
    .select({ id: nfts.id })
    .from(nfts)
    .where(and(eq(nfts.collectionId, collectionId), eq(nfts.name, name)))
    .limit(1);
  if (existing[0]) return existing[0].id;
  const [row] = await db
    .insert(nfts)
    .values({
      collectionId,
      name,
      description,
      imageUrl,
      ownerId,
      price,
      listed: true,
    })
    .returning({ id: nfts.id });
  return row.id;
}

async function ensureNotification(
  userId: string,
  type: string,
  actorId: string | null,
  postId: string | null
): Promise<void> {
  const conds = [
    eq(notifications.userId, userId),
    eq(notifications.type, type),
  ];
  if (actorId) conds.push(eq(notifications.actorId, actorId));
  if (postId) conds.push(eq(notifications.postId, postId));
  const existing = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(and(...conds))
    .limit(1);
  if (existing[0]) return;
  await db.insert(notifications).values({
    userId,
    type,
    actorId,
    postId,
    status: "unread",
  });
}

async function ensureConversation(
  title: string,
  memberIds: string[],
  msgs: { senderId: string; body: string }[]
): Promise<string> {
  const existing = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(eq(conversations.title, title))
    .limit(1);
  let convoId: string;
  if (existing[0]) {
    convoId = existing[0].id;
  } else {
    const [row] = await db
      .insert(conversations)
      .values({ title })
      .returning({ id: conversations.id });
    convoId = row.id;
  }
  for (const memberId of memberIds) {
    const mem = await db
      .select({ conversationId: conversationMembers.conversationId })
      .from(conversationMembers)
      .where(
        and(
          eq(conversationMembers.conversationId, convoId),
          eq(conversationMembers.userId, memberId)
        )
      )
      .limit(1);
    if (!mem[0]) {
      await db
        .insert(conversationMembers)
        .values({ conversationId: convoId, userId: memberId });
    }
  }
  for (const m of msgs) {
    const em = await db
      .select({ id: messages.id })
      .from(messages)
      .where(
        and(
          eq(messages.conversationId, convoId),
          eq(messages.senderId, m.senderId),
          eq(messages.body, m.body)
        )
      )
      .limit(1);
    if (!em[0]) {
      await db.insert(messages).values({
        conversationId: convoId,
        senderId: m.senderId,
        body: m.body,
      });
    }
  }
  return convoId;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.error("Seeding Phase 12 rich demo content…");

  const demoId = await getUserIdByEmail(DEMO_EMAIL);
  if (!demoId)
    throw new Error(`Demo user ${DEMO_EMAIL} not found — run seed.ts first`);

  const ids: Record<string, string> = { demo: demoId };
  for (const email of [
    "leo.park@centher.io",
    "nina.ross@centher.io",
    "omar.hassan@centher.io",
    "sofia.blake@centher.io",
    "kai.mendez@centher.io",
    "maya.chen@centher.io",
    "aisha.khan@centher.io",
  ]) {
    const id = await getUserIdByEmail(email);
    if (id) ids[email.split("@")[0].replace(".", "_")] = id;
  }
  const leo = ids["leo_park"]!;
  const nina = ids["nina_ross"]!;
  const omar = ids["omar_hassan"]!;
  const sofia = ids["sofia_blake"]!;
  const kai = ids["kai_mendez"]!;
  const maya = ids["maya_chen"]!;
  const aisha = ids["aisha_khan"]!;

  // --- 1. Posts with images -----------------------------------------------
  const seededPosts: string[] = [];
  seededPosts.push(
    await ensurePost(
      leo,
      "BTC breaking out of the 4h range — volume confirms. Targeting 98k by Friday. Who's positioned?",
      [pic("centher-trading-chart")]
    ),
    await ensurePost(
      leo,
      "VoiSpace AMA tonight was packed. Love this community's energy around SocialFi.",
      null
    ),
    await ensurePost(
      nina,
      "Just curated three new drops for the marketplace. This generative art collection is unreal — swipe through the previews.",
      [pic("centher-nft-drop-1"), pic("centher-nft-drop-2")]
    ),
    await ensurePost(
      nina,
      "Hot take: PFPs are dead, utility NFTs are the only thing worth collecting in 2026.",
      null
    ),
    await ensurePost(
      omar,
      "12.5% APY on the Flex pool while I sleep. Staking maxi life chose me.",
      [pic("centher-staking-dashboard")]
    ),
    await ensurePost(
      omar,
      "PSA: always check the lockup terms before aping into a new pool. Learned that the hard way last cycle.",
      null
    ),
    await ensurePost(
      sofia,
      "Launchpad Alpha filled its soft cap in 6 hours. The SocialFi narrative is real.",
      [pic("centher-launchpad")]
    ),
    await ensurePost(
      kai,
      "Reminder: be kind in the comments. We're building the friendliest corner of crypto here.",
      null
    ),
    await ensurePost(
      kai,
      "Weekend voice room schedule is live — trading talk Friday, NFT showcase Saturday. See you there!",
      [pic("centher-voice-room")]
    )
  );
  console.error(`Posts with images: ${seededPosts.length}`);

  // --- 2. Thread-style reply chains ----------------------------------------
  // Thread 1: NFT drop discussion
  const t1 = await ensurePost(
    nina,
    "Dropping my 'Neon Dreams' collection tomorrow — 50 pieces, 0.5 BNB mint. Who wants the allowlist?",
    [pic("centher-neon-dreams")]
  );
  await ensureComment(
    t1,
    leo,
    "Allowlist please! Been waiting for this since your last drop sold out."
  );
  await ensureComment(
    t1,
    nina,
    "You're on the list, Leo. Early supporters always get priority."
  );
  await ensureComment(t1, omar, "What's the utility? Or is this pure art?");
  await ensureComment(
    t1,
    nina,
    "Holders get access to my private curator channel + first dibs on all future drops."
  );

  // Thread 2: staking question
  const t2 = await ensurePost(
    omar,
    "Flex vs Locked 90d — which pool are you all in and why?",
    null
  );
  await ensureComment(
    t2,
    sofia,
    "Locked 90d for the higher APY. I don't need the liquidity anyway."
  );
  await ensureComment(
    t2,
    kai,
    "Flex for me — I like being able to move when a launchpad opportunity pops up."
  );
  await ensureComment(
    t2,
    omar,
    "Solid reasoning both ways. Diversification across both is the real answer."
  );

  // Thread 3: market take
  const t3 = await ensurePost(
    leo,
    "Unpopular opinion: the next 100x won't come from a token. It'll come from SocialFi reputation.",
    null
  );
  await ensureComment(
    t3,
    maya,
    "This. Your on-chain reputation is the only portfolio that compounds forever."
  );
  await ensureComment(
    t3,
    leo,
    "Exactly. That's why I'm building here instead of chasing the next meme."
  );
  await ensureComment(
    t3,
    nina,
    "Reputation + verifiable collections = the future of creator economies."
  );
  await ensureComment(
    t3,
    maya,
    "Someone should write this up as a proper thread. Oh wait…"
  );
  console.error("Thread chains: 3 (4 + 3 + 4 replies)");

  // --- 3. NFTs across collections -------------------------------------------
  const neonDreams = await ensureCollection(
    "Neon Dreams",
    "Generative neon art by Nina Ross — 50 pieces of midnight color.",
    "/images/collections/neon-avatar.webp",
    nina,
    "/images/collections/neon-banner.jpg"
  );
  const pixelPioneers = await ensureCollection(
    "Pixel Pioneers",
    "Retro pixel avatars with on-chain traits.",
    "/images/collections/pixel-avatar.webp",
    leo,
    "/images/collections/pixel-banner.jpg"
  );
  const stakingBadges = await ensureCollection(
    "Centher Staking Badges",
    "Soulbound badges for pool participants.",
    "/images/collections/badges-avatar.webp",
    demoId,
    "/images/collections/badges-banner.jpg"
  );

  const nftDefs: [string, string, string, string, string, string][] = [
    [
      neonDreams,
      "Neon Dream #001",
      "Midnight pulse — the genesis piece.",
      pic("centher-nft-nd1"),
      nina,
      "0.5000",
    ],
    [
      neonDreams,
      "Neon Dream #002",
      "Electric dusk over the grid.",
      pic("centher-nft-nd2"),
      nina,
      "0.4500",
    ],
    [
      neonDreams,
      "Neon Dream #003",
      "Static bloom in cyan.",
      pic("centher-nft-nd3"),
      leo,
      "0.6000",
    ],
    [
      neonDreams,
      "Neon Dream #004",
      "After-hours glow.",
      pic("centher-nft-nd4"),
      nina,
      "0.4000",
    ],
    [
      pixelPioneers,
      "Pioneer #101",
      "Laser eyes, diamond hands.",
      pic("centher-nft-pp1"),
      leo,
      "0.2500",
    ],
    [
      pixelPioneers,
      "Pioneer #102",
      "Cap and gown graduate.",
      pic("centher-nft-pp2"),
      maya,
      "0.2200",
    ],
    [
      pixelPioneers,
      "Pioneer #103",
      "Hoodie dev archetype.",
      pic("centher-nft-pp3"),
      leo,
      "0.3000",
    ],
    [
      stakingBadges,
      "Flex Staker Badge",
      "Awarded for 30 days in the Flex pool.",
      pic("centher-nft-sb1"),
      omar,
      "0.1000",
    ],
    [
      stakingBadges,
      "Diamond Hands Badge",
      "Never unstaked during volatility.",
      pic("centher-nft-sb2"),
      omar,
      "0.1500",
    ],
    [
      stakingBadges,
      "Genesis Citizen Badge",
      "Day-one Centher citizen.",
      pic("centher-nft-sb3"),
      demoId,
      "1.0000",
    ],
  ];
  for (const [c, name, desc, img, owner, price] of nftDefs) {
    await ensureNft(c, name, desc, img, owner, price);
  }
  console.error(`NFTs: ${nftDefs.length} across 3 collections`);

  // --- 4. Notifications for the demo user ------------------------------------
  // Use one of the demo user's posts for like/reply notifications
  const leoPostForNotif = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.authorId, demoId))
    .limit(1);
  const notifPostId = leoPostForNotif[0]?.id ?? null;

  await ensureNotification(demoId, "follow", leo, null);
  await ensureNotification(demoId, "follow", nina, null);
  await ensureNotification(demoId, "follow", aisha, null);
  // Skip post-type notifications if no post exists (avoid orphaned rows).
  if (notifPostId) {
    await ensureNotification(demoId, "post_like", omar, notifPostId);
    await ensureNotification(demoId, "post_like", sofia, notifPostId);
    await ensureNotification(demoId, "post_reply", kai, notifPostId);
    await ensureNotification(demoId, "post_reply", maya, notifPostId);
    await ensureNotification(demoId, "mention", kai, notifPostId);
  }
  console.error("Notifications: 8");

  // --- 5. Chat conversations --------------------------------------------------
  await ensureConversation(
    "Trading Signals",
    [demoId, leo],
    [
      { senderId: leo, body: "Morning! BTC looking strong above 95k." },
      { senderId: demoId, body: "Saw your post — are you long from here?" },
      {
        senderId: leo,
        body: "Scaled in at 94.2k, stop below 92k. Tight risk.",
      },
      { senderId: demoId, body: "Nice. What's your take on ETH/BTC ratio?" },
      {
        senderId: leo,
        body: "Ratio bottoming imo. Rotation trade setting up.",
      },
      {
        senderId: demoId,
        body: "Might join you on that. Thanks for the alpha.",
      },
      {
        senderId: leo,
        body: "Anytime. AMA tonight if you want the full breakdown.",
      },
      { senderId: demoId, body: "I'll be there." },
    ]
  );
  await ensureConversation(
    "NFT Collectors",
    [demoId, nina],
    [
      { senderId: nina, body: "Hey! Saw you liked the Neon Dreams preview." },
      { senderId: demoId, body: "It's gorgeous. When's the mint?" },
      { senderId: nina, body: "Tomorrow 6pm UTC. 0.5 BNB, 50 pieces." },
      { senderId: demoId, body: "Put me on the allowlist?" },
      { senderId: nina, body: "Done — check your mentions for the link." },
      { senderId: demoId, body: "Legend. Thank you!" },
    ]
  );
  await ensureConversation(
    "Staking Support",
    [demoId, omar],
    [
      { senderId: demoId, body: "Quick q — Flex pool vs Locked 90d?" },
      {
        senderId: omar,
        body: "Depends if you need liquidity. APY diff is ~5.5%.",
      },
      { senderId: demoId, body: "I might need it for a launchpad next month." },
      {
        senderId: omar,
        body: "Then Flex, no question. Don't lock what you'll need.",
      },
      { senderId: demoId, body: "Appreciate it, going Flex." },
    ]
  );
  console.error("Conversations: 3 (8 + 6 + 5 messages)");

  // Keep demo profile fresh
  await db
    .select({ userId: profiles.userId })
    .from(profiles)
    .where(eq(profiles.userId, demoId))
    .limit(1);

  console.error("Phase 12 seed complete — idempotent, safe to re-run.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
