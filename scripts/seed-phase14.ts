/**
 * Phase 14: Rich NFT demo seed — every NFT state for full functionality testing.
 *
 * - Fixes "Centher Genesis" collections with generated images
 * - ~20 NFTs: video, audio, listed (buyable), with active bids, unlisted,
 *   owned-by-demo (listed)
 * - Seeds bids into nft_bids when the Phase 13 table exists
 *
 * Idempotent: keyed on (collectionId, name) for NFTs; skips existing rows.
 * Run: npx tsx scripts/seed-phase14.ts
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and, like } from "drizzle-orm";
import { collections, nfts, user } from "../db/schema";

const url = readFileSync(
  process.env.HOME + "/.neon-centher-db-url",
  "utf8",
).trim();
const db = drizzle(neon(url));

const pic = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;

// Public sample media (verified 200/206, video/mp4)
const VIDEOS = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
  "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4",
  "https://filesamples.com/samples/video/mp4/sample_640x360.mp4",
];
const AUDIOS = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
];

async function getUserId(email: string): Promise<string | null> {
  const rows = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  return rows[0]?.id ?? null;
}

async function ensureNft(opts: {
  collectionId: string;
  name: string;
  description: string;
  imageUrl: string;
  ownerId: string;
  price: string;
  listed?: boolean;
  mediaType?: string;
  animationUrl?: string | null;
}): Promise<string> {
  const existing = await db
    .select({ id: nfts.id })
    .from(nfts)
    .where(
      and(eq(nfts.collectionId, opts.collectionId), eq(nfts.name, opts.name)),
    )
    .limit(1);
  if (existing[0]) return existing[0].id;
  const [row] = await db
    .insert(nfts)
    .values({
      collectionId: opts.collectionId,
      name: opts.name,
      description: opts.description,
      imageUrl: opts.imageUrl,
      ownerId: opts.ownerId,
      price: opts.price,
      listed: opts.listed ?? true,
      mediaType: opts.mediaType ?? "image",
      animationUrl: opts.animationUrl ?? null,
    })
    .returning({ id: nfts.id });
  return row.id;
}

async function tableExists(name: string): Promise<boolean> {
  const sql = neon(url);
  const r = await sql.query(
    `SELECT 1 FROM information_schema.tables WHERE table_name='${name}' LIMIT 1`,
  );
  return (r as unknown[]).length > 0;
}

async function ensureBid(
  nftId: string,
  bidderId: string,
  amount: string,
): Promise<void> {
  const sql = neon(url);
  const existing = await sql.query(
    "SELECT id FROM nft_bids WHERE nft_id=$1 AND bidder_id=$2 AND amount_bnb=$3 LIMIT 1",
    [nftId, bidderId, amount],
  );
  if ((existing as unknown[]).length > 0) return;
  await sql.query(
    "INSERT INTO nft_bids (nft_id, bidder_id, amount_bnb, status) VALUES ($1,$2,$3,'active')",
    [nftId, bidderId, amount],
  );
}

async function main() {
  const demoId = await getUserId("demo@centher.io");
  if (!demoId) throw new Error("demo user not found");

  // Get some other users for ownership variety
  const others = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .limit(10);
  const otherIds = others.map((u) => u.id).filter((id) => id !== demoId);
  if (otherIds.length < 3) throw new Error("need at least 3 other users");
  const [leo, nina, omar, sofia, kai] = otherIds;

  // --- 1. Fix Centher Genesis collections with generated images ---
  const genesisCols = await db
    .select({ id: collections.id })
    .from(collections)
    .where(eq(collections.name, "Centher Genesis"));
  for (const gc of genesisCols) {
    await db
      .update(collections)
      .set({
        imageUrl: "/images/collections/genesis-avatar.webp",
        bannerUrl: "/images/collections/genesis-banner.jpg",
      })
      .where(eq(collections.id, gc.id));
  }
  console.log(`Fixed ${genesisCols.length} Centher Genesis collections`);

  // Get collection IDs
  const getCol = async (name: string) => {
    const r = await db
      .select({ id: collections.id })
      .from(collections)
      .where(eq(collections.name, name))
      .limit(1);
    return r[0]?.id ?? null;
  };
  const genesisId = await getCol("Centher Genesis");
  const neonId = await getCol("Neon Dreams");
  const pixelId = await getCol("Pixel Pioneers");
  const badgesId = await getCol("Centher Staking Badges");
  if (!genesisId || !neonId || !pixelId || !badgesId) {
    throw new Error("collections missing — run seed-phase12 first");
  }

  let touched = 0;
  const track = async (p: Promise<string>) => {
    await p;
    touched++;
  };

  // --- 2. VIDEO NFTs (4) ---
  // One-time cleanup: drop rows seeded with the dead gtv-videos-bucket URLs
  // (renamed in the URL fix, so name-based dedupe won't catch them).
  await db.delete(nfts).where(like(nfts.animationUrl, "%gtv-videos-bucket%"));
  const videoDefs = [
    [
      "Bloom in Motion",
      "A flower blooms in vivid detail — nature loop.",
      VIDEOS[0],
      "centher-video-bloom",
    ],
    [
      "Big Buck Bunny",
      "A giant rabbit takes revenge — animated classic.",
      VIDEOS[1],
      "centher-video-bbb",
    ],
    [
      "Jellyfish Drift",
      "Graceful jellyfish drifting through deep blue.",
      VIDEOS[2],
      "centher-video-jelly",
    ],
    [
      "Sample Reel",
      "Demo video NFT — motion and color study.",
      VIDEOS[3],
      "centher-video-sample",
    ],
  ];
  for (const [name, desc, videoUrl, seed] of videoDefs) {
    await track(
      ensureNft({
        collectionId: neonId,
        name: `Video: ${name}`,
        description: desc,
        imageUrl: pic(seed),
        ownerId: nina,
        price: "1.5000",
        mediaType: "video",
        animationUrl: videoUrl,
      }),
    );
  }

  // --- 3. AUDIO NFTs (3) ---
  const audioDefs = [
    ["SoundHelix One", "Generative audio piece #1 — ambient waves.", AUDIOS[0]],
    ["SoundHelix Two", "Generative audio piece #2 — deep pulses.", AUDIOS[1]],
    [
      "SoundHelix Three",
      "Generative audio piece #3 — ethereal tones.",
      AUDIOS[2],
    ],
  ];
  for (const [name, desc, audioUrl] of audioDefs) {
    await track(
      ensureNft({
        collectionId: neonId,
        name: `Audio: ${name}`,
        description: desc,
        imageUrl: pic(`centher-audio-${name}`),
        ownerId: leo,
        price: "0.7500",
        mediaType: "audio",
        animationUrl: audioUrl,
      }),
    );
  }

  // --- 4. LISTED by others (buyable by demo, 6) ---
  const buyableDefs: [string, string, string, string, string, string][] = [
    [
      genesisId,
      "Genesis Ape #1",
      "Rare genesis ape — gold fur.",
      pic("centher-buy-ape1"),
      omar,
      "2.0000",
    ],
    [
      genesisId,
      "Genesis Punk #7",
      "Pixel punk with laser eyes.",
      pic("centher-buy-punk7"),
      sofia,
      "1.2500",
    ],
    [
      pixelId,
      "Pixel Hero #42",
      "8-bit hero, max stats.",
      pic("centher-buy-hero42"),
      kai,
      "0.8000",
    ],
    [
      pixelId,
      "Pixel Villain #13",
      "Unlucky number, lucky traits.",
      pic("centher-buy-villain13"),
      leo,
      "0.6500",
    ],
    [
      badgesId,
      "Gold Staker Badge",
      "Awarded for 1 year of staking.",
      pic("centher-buy-goldbadge"),
      nina,
      "0.4000",
    ],
    [
      neonId,
      "Neon Cityscape",
      "Midnight metropolis in neon.",
      pic("centher-buy-cityscape"),
      omar,
      "0.9500",
    ],
  ];
  const buyableIds: string[] = [];
  for (const [col, name, desc, img, owner, price] of buyableDefs) {
    const id = await ensureNft({
      collectionId: col,
      name,
      description: desc,
      imageUrl: img,
      ownerId: owner,
      price,
    });
    buyableIds.push(id);
    touched++;
  }

  // --- 5. With ACTIVE BIDS (3) ---
  const biddableDefs: [string, string, string, string, string, string][] = [
    [
      genesisId,
      "Genesis Crown #1",
      "The crown jewel — 1 of 1.",
      pic("centher-bid-crown"),
      sofia,
      "5.0000",
    ],
    [
      neonId,
      "Neon Phantom",
      "Ghost in the neon machine.",
      pic("centher-bid-phantom"),
      leo,
      "2.5000",
    ],
    [
      pixelId,
      "Pixel Dragon",
      "Legendary fire-breathing sprite.",
      pic("centher-bid-dragon"),
      nina,
      "3.2000",
    ],
  ];
  const hasBids = await tableExists("nft_bids");
  for (const [col, name, desc, img, owner, price] of biddableDefs) {
    const id = await ensureNft({
      collectionId: col,
      name,
      description: desc,
      imageUrl: img,
      ownerId: owner,
      price,
    });
    touched++;
    if (hasBids) {
      // Multiple bidders, escalating amounts
      await ensureBid(id, demoId, (parseFloat(price) * 0.8).toFixed(4));
      await ensureBid(id, omar, (parseFloat(price) * 0.9).toFixed(4));
      await ensureBid(id, kai, (parseFloat(price) * 0.95).toFixed(4));
    }
  }

  // --- 6. UNLISTED (3) — "Not for sale" state ---
  const unlistedDefs: [string, string, string, string, string, string][] = [
    [
      badgesId,
      "Founder Badge",
      "Soulbound — never for sale.",
      pic("centher-unlisted-founder"),
      demoId,
      "0.0000",
    ],
    [
      genesisId,
      "Genesis Vault #99",
      "Locked in the vault.",
      pic("centher-unlisted-vault"),
      leo,
      "10.0000",
    ],
    [
      pixelId,
      "Pixel Ghost (Burned)",
      "Delisted forever.",
      pic("centher-unlisted-ghost"),
      nina,
      "0.0000",
    ],
  ];
  for (const [col, name, desc, img, owner, price] of unlistedDefs) {
    await track(
      ensureNft({
        collectionId: col,
        name,
        description: desc,
        imageUrl: img,
        ownerId: owner,
        price,
        listed: false,
      }),
    );
  }

  // --- 7. OWNED BY DEMO + LISTED (2) — demo can accept bids ---
  const demoListedDefs: [string, string, string, string, string][] = [
    [
      genesisId,
      "Demo's Genesis Star",
      "My prized genesis piece — open to offers.",
      pic("centher-demo-star"),
      "1.8000",
    ],
    [
      neonId,
      "Demo's Neon Wave",
      "Catch the wave — listed for sale.",
      pic("centher-demo-wave"),
      "0.6000",
    ],
  ];
  for (const [col, name, desc, img, price] of demoListedDefs) {
    const id = await ensureNft({
      collectionId: col,
      name,
      description: desc,
      imageUrl: img,
      ownerId: demoId,
      price,
    });
    touched++;
    if (hasBids) {
      await ensureBid(id, leo, (parseFloat(price) * 0.7).toFixed(4));
      await ensureBid(id, sofia, (parseFloat(price) * 0.85).toFixed(4));
    }
  }

  console.log(
    `Phase 14 seed done. NFTs touched: ${touched}. Bids table: ${
      hasBids ? "seeded" : "skipped (no table)"
    }`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
