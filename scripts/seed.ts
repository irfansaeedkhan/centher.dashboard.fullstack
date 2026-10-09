import { config } from "dotenv";
config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import { auth } from "../lib/auth/better-auth";
import { db } from "../db";
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
} from "../db/schema";

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@centher.io";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "Demo1234!";

async function ensureDemoUser() {
  const existing = await db
    .select()
    .from(user)
    .where(eq(user.email, DEMO_EMAIL))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const result = await auth.api.signUpEmail({
    body: {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      name: "Centher Demo",
    },
  });

  if (!result?.user?.id) {
    throw new Error("Failed to create demo user via Better Auth");
  }

  return result.user;
}

async function main() {
  console.error("Seeding Centher demo data…");

  const demo = await ensureDemoUser();
  const demoId = demo.id;

  await db
    .insert(profiles)
    .values({
      userId: demoId,
      displayName: "Centher Demo",
      username: "centher_demo",
      bio: "Demo citizen exploring Centher SocialFi",
      membership: "citizen",
      avatarUrl: "/images/centher.logo.favicon.png",
    })
    .onConflictDoNothing();

  await db
    .insert(citizenships)
    .values({
      userId: demoId,
      status: "active",
      tier: "standard",
    })
    .onConflictDoNothing();

  const postBodies = Array.from({ length: 14 }, (_, i) => ({
    authorId: demoId,
    body: `Centher demo post #${
      i + 1
    } — SocialFi feed sample with yellow brand vibes.`,
    likeCount: (i * 3) % 17,
    commentCount: i % 5,
  }));
  await db.insert(posts).values(postBodies);

  const [convo] = await db
    .insert(conversations)
    .values({ title: "Centher Welcome Chat" })
    .returning();
  const [convo2] = await db
    .insert(conversations)
    .values({ title: "Marketplace Lounge" })
    .returning();

  await db.insert(messages).values([
    {
      conversationId: convo.id,
      senderId: demoId,
      body: "Welcome to Centher chat demo!",
    },
    {
      conversationId: convo.id,
      senderId: demoId,
      body: "Voice rooms and feed are seeded for walkthroughs.",
    },
    {
      conversationId: convo2.id,
      senderId: demoId,
      body: "NFT explore uses dummy Neon listings.",
    },
  ]);

  const [live] = await db
    .insert(channels)
    .values({
      name: "Centher Live Desk",
      description: "Demo live/voice channel",
      kind: "live",
      hostId: demoId,
      isLive: true,
      memberCount: 12,
    })
    .returning();
  const [ama] = await db
    .insert(channels)
    .values({
      name: "AMA with Centher",
      description: "Ask anything (demo)",
      kind: "ama",
      hostId: demoId,
      isLive: false,
      memberCount: 4,
    })
    .returning();

  await db.insert(channelMessages).values([
    {
      channelId: live.id,
      senderId: demoId,
      body: "Stream room is in demo mode — join and chat!",
    },
    {
      channelId: ama.id,
      senderId: demoId,
      body: "AMA channel seeded for voice UI walkthrough.",
    },
  ]);

  const [collection] = await db
    .insert(collections)
    .values({
      name: "Centher Genesis",
      description: "Demo NFT collection",
      imageUrl: "/images/centher.logo.png",
      creatorId: demoId,
    })
    .returning();

  const nftRows = Array.from({ length: 14 }, (_, i) => ({
    collectionId: collection.id,
    name: `Centher NFT #${i + 1}`,
    description: `Demo listing ${i + 1}`,
    imageUrl: "/images/centher.logo.favicon.png",
    ownerId: demoId,
    price: ((i + 1) * 0.15).toFixed(4),
    listed: true,
  }));
  await db.insert(nfts).values(nftRows);

  await db.insert(stakingPools).values([
    {
      name: "Centher Flex Stake",
      apy: "12.50",
      tvl: "125000.00",
      status: "active",
    },
    {
      name: "Centher Locked 90d",
      apy: "18.00",
      tvl: "84000.00",
      status: "active",
    },
    {
      name: "Citizen Bonus Pool",
      apy: "9.25",
      tvl: "42000.00",
      status: "active",
    },
  ]);

  await db.insert(launchpads).values([
    {
      name: "Centher Pad Alpha",
      symbol: "CPA",
      status: "live",
      raised: "320000.00",
      softCap: "500000.00",
    },
    {
      name: "SocialFi Beta",
      symbol: "SFB",
      status: "upcoming",
      raised: "0.00",
      softCap: "250000.00",
    },
  ]);

  console.error("Seed complete.");
  console.error(`Demo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
