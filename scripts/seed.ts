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

const DUMMY_USERS = [
  {
    email: "maya.chen@centher.io",
    name: "Maya Chen",
    username: "maya_chen",
    bio: "Builder · SocialFi early adopter",
    membership: "citizen",
  },
  {
    email: "leo.park@centher.io",
    name: "Leo Park",
    username: "leo_park",
    bio: "Trader hanging out in VoiSpace",
    membership: "verified",
  },
  {
    email: "nina.ross@centher.io",
    name: "Nina Ross",
    username: "nina_ross",
    bio: "NFT curator on Centher Marketplace",
    membership: "citizen",
  },
  {
    email: "omar.hassan@centher.io",
    name: "Omar Hassan",
    username: "omar_hassan",
    bio: "Staking maxi · Prospera enjoyer",
    membership: "citizen",
  },
  {
    email: "sofia.blake@centher.io",
    name: "Sofia Blake",
    username: "sofia_blake",
    bio: "Launchpad hunter",
    membership: "verified",
  },
  {
    email: "kai.mendez@centher.io",
    name: "Kai Mendez",
    username: "kai_mendez",
    bio: "Community mod · mention me anytime",
    membership: "citizen",
  },
  {
    email: "aisha.khan@centher.io",
    name: "Aisha Khan",
    username: "aisha_khan",
    bio: "Product designer at Centher",
    membership: "citizen",
  },
  {
    email: "diego.santos@centher.io",
    name: "Diego Santos",
    username: "diego_santos",
    bio: "Voice room host",
    membership: "none",
  },
] as const;

async function ensureAuthUser(email: string, name: string, password: string) {
  const existing = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  if (!result?.user?.id) {
    throw new Error(`Failed to create user ${email}`);
  }

  return result.user;
}

async function ensureDemoUser() {
  return ensureAuthUser(DEMO_EMAIL, "Centher Demo", DEMO_PASSWORD);
}

async function ensureDummyUsers() {
  const created: { id: string; username: string; name: string }[] = [];

  for (const dummy of DUMMY_USERS) {
    const authUser = await ensureAuthUser(
      dummy.email,
      dummy.name,
      DEMO_PASSWORD
    );
    await db
      .insert(profiles)
      .values({
        userId: authUser.id,
        displayName: dummy.name,
        username: dummy.username,
        bio: dummy.bio,
        membership: dummy.membership,
        avatarUrl: "/images/centher.logo.favicon.png",
      })
      .onConflictDoNothing();

    created.push({
      id: authUser.id,
      username: dummy.username,
      name: dummy.name,
    });
  }

  return created;
}

async function main() {
  console.error("Seeding Centher demo data…");

  const demo = await ensureDemoUser();
  const demoId = demo.id;
  const dummyUsers = await ensureDummyUsers();

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

  const existingPosts = await db.select({ id: posts.id }).from(posts).limit(1);
  if (existingPosts.length === 0) {
    const authors = [demoId, ...dummyUsers.map((u) => u.id)];
    const postBodies = Array.from({ length: 14 }, (_, i) => ({
      authorId: authors[i % authors.length],
      body: `Centher demo post #${
        i + 1
      } — SocialFi feed sample with yellow brand vibes.`,
      likeCount: (i * 3) % 17,
      commentCount: i % 5,
    }));
    await db.insert(posts).values(postBodies);
  }

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
  console.error(
    `Mentionable users: ${[
      "centher_demo",
      ...DUMMY_USERS.map((u) => u.username),
    ].join(", ")}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
