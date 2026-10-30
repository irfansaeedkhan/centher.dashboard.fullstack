/**
 * Phase 15: chat completeness seed — 100+ conversations with mixed message kinds.
 *
 * Idempotent: conversations are keyed by title (skipped if a conversation with
 * the same title exists); messages by (conversationId, senderId, body).
 * Deterministic PRNG (mulberry32) so re-runs generate identical content.
 *
 * Mix: 1-on-1s + groups, text/image/video/audio/file/voice kinds, reply
 * chains, reactions, varied read statuses, 14-day timestamp spread.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import { readFileSync } from "fs";
import {
  chatAttachments,
  conversationMembers,
  conversations,
  messageReactions,
  messages,
  user,
} from "../db/schema";

const url = readFileSync(
  process.env.HOME + "/.neon-centher-db-url",
  "utf8"
).trim();
const db = drizzle(neon(url));

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@centher.io";

// Deterministic PRNG
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pic = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;
const VIDEOS = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
  "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4",
];
const AUDIOS = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
];
const FILES: { name: string; mime: string; size: number }[] = [
  { name: "tokenomics-v2.pdf", mime: "application/pdf", size: 245000 },
  { name: "roadmap-2026.md", mime: "text/markdown", size: 8400 },
  { name: "presale-terms.txt", mime: "text/plain", size: 3200 },
  { name: "portfolio.csv", mime: "text/csv", size: 12400 },
];

const TEXT_POOL = [
  "gm everyone ☀️",
  "Anyone watching the BNB chart right now?",
  "Just aped into the new launchpad, fingers crossed 🤞",
  "Floor price is holding nicely",
  "Did you see the staking APY update?",
  "Sending the deck in a bit",
  "This collection is going to moon, mark my words",
  "Gas fees are brutal today",
  "Who's going to the AMA tonight?",
  "Just claimed my rewards 💰",
  "Check the new trait reveal!",
  "HODL gang where you at",
  "That dip was a gift, bought more",
  "New proposal is up for voting",
  "The art on this drop is unreal",
  "Bridge is down again smh",
  "Liquidity looking healthy",
  "wen moon? 🌙",
  "Just listed my genesis piece",
  "Community call in 30 mins, don't miss it",
  "Took profits, no regrets",
  "Diamond hands only 💎🙌",
  "The team is cooking something big",
  "Testnet is live, go break things",
  "My bid got outbid, going higher",
  "This thread is gold",
  " NFA but I'm bullish",
  "Volume picking up nicely",
  "Snapshot tomorrow, get your tokens ready",
  "The UI update looks clean",
];

const GROUP_TOPICS = [
  "Trading Signals",
  "NFT Collectors",
  "Staking Support",
  "DeFi Alpha",
  "Launchpad Hunters",
  "Market Talk",
  "Whale Watch",
  "Airdrop Alerts",
  "DAO Governance",
  "Meme Coin Degens",
];

async function getUserIdByEmail(email: string): Promise<string | null> {
  const rows = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  return rows[0]?.id ?? null;
}

async function ensureAttachment(opts: {
  uploaderId: string;
  kind: "image" | "video" | "audio" | "file";
  url: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  durationSec?: number;
}): Promise<string> {
  const [row] = await db
    .insert(chatAttachments)
    .values({
      uploaderId: opts.uploaderId,
      kind: opts.kind,
      mimeType: opts.mimeType,
      fileName: opts.fileName,
      fileSize: opts.fileSize,
      url: opts.url,
      durationSec: opts.durationSec ?? null,
    })
    .returning({ id: chatAttachments.id });
  return row.id;
}

async function main() {
  const demoId = await getUserIdByEmail(DEMO_EMAIL);
  if (!demoId) throw new Error("Demo user not found");

  const personaEmails = [
    "leo.park@centher.io",
    "nina.ross@centher.io",
    "omar.hassan@centher.io",
    "sofia.blake@centher.io",
    "kai.mendez@centher.io",
    "maya.chen@centher.io",
    "aisha.khan@centher.io",
  ];
  const personaIds: { id: string; name: string }[] = [];
  for (const email of personaEmails) {
    const id = await getUserIdByEmail(email);
    if (id) personaIds.push({ id, name: email.split("@")[0] });
  }
  if (personaIds.length === 0) throw new Error("No persona users found");
  const allIds = [demoId, ...personaIds.map((p) => p.id)];

  let convoCount = 0;
  let msgCount = 0;
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  // Build 110 conversation specs: 40 1-on-1s + 70 groups.
  const specs: { title: string; members: string[] }[] = [];
  // 1-on-1s: demo + each persona, several threads each.
  let dmIdx = 0;
  for (let round = 0; round < 6; round++) {
    for (const p of personaIds) {
      if (specs.length >= 40) break;
      dmIdx++;
      specs.push({
        // Title = other party name (matches UI fallback for DMs).
        title: `DM ${p.name} #${round + 1}`,
        members: [demoId, p.id],
      });
    }
  }
  // Groups: topic-based, 3-6 members.
  const rand = mulberry32(15042);
  for (let i = 0; i < 70; i++) {
    const topic = GROUP_TOPICS[i % GROUP_TOPICS.length];
    const size = 3 + Math.floor(rand() * 4); // 3-6
    const shuffled = [...allIds].sort(() => rand() - 0.5);
    const members = shuffled.slice(0, size);
    if (!members.includes(demoId)) members[0] = demoId;
    specs.push({
      title: `${topic} #${Math.floor(i / GROUP_TOPICS.length) + 1}`,
      members: [...new Set(members)],
    });
  }

  for (let ci = 0; ci < specs.length; ci++) {
    const spec = specs[ci];
    const crand = mulberry32(9000 + ci);

    // Idempotency: skip if a conversation with this title exists.
    const existing = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(eq(conversations.title, spec.title))
      .limit(1);
    let convoId: string;
    if (existing[0]) {
      convoId = existing[0].id;
    } else {
      const [row] = await db
        .insert(conversations)
        .values({ title: spec.title })
        .returning({ id: conversations.id });
      convoId = row.id;
      convoCount++;
    }

    // Members (idempotent).
    for (const mid of spec.members) {
      const mem = await db
        .select({ conversationId: conversationMembers.conversationId })
        .from(conversationMembers)
        .where(
          and(
            eq(conversationMembers.conversationId, convoId),
            eq(conversationMembers.userId, mid)
          )
        )
        .limit(1);
      if (!mem[0]) {
        await db
          .insert(conversationMembers)
          .values({ conversationId: convoId, userId: mid });
      }
    }

    // Messages: 10-18 per conversation.
    const msgTotal = 10 + Math.floor(crand() * 9);
    const baseTime = now - Math.floor(crand() * 14 * DAY);
    const createdIds: string[] = [];

    for (let mi = 0; mi < msgTotal; mi++) {
      const sender = spec.members[Math.floor(crand() * spec.members.length)];
      const roll = crand();
      let kind: "text" | "image" | "video" | "audio" | "file" | "voice" =
        "text";
      if (roll > 0.95) kind = "voice";
      else if (roll > 0.9) kind = "file";
      else if (roll > 0.85) kind = "audio";
      else if (roll > 0.8) kind = "video";
      else if (roll > 0.7) kind = "image";

      const body =
        kind === "text"
          ? TEXT_POOL[Math.floor(crand() * TEXT_POOL.length)]
          : kind === "image"
          ? "Check this out 📸"
          : kind === "video"
          ? "This video is wild 🎬"
          : kind === "audio"
          ? "Listen to this 🎵"
          : kind === "voice"
          ? ""
          : "Sharing the doc 📎";

      // Idempotency: (conversationId, senderId, body).
      const em = await db
        .select({ id: messages.id })
        .from(messages)
        .where(
          and(
            eq(messages.conversationId, convoId),
            eq(messages.senderId, sender),
            eq(messages.body, body)
          )
        )
        .limit(1);
      if (em[0]) {
        createdIds.push(em[0].id);
        continue;
      }

      let attachmentId: string | null = null;
      if (kind === "image") {
        attachmentId = await ensureAttachment({
          uploaderId: sender,
          kind: "image",
          url: pic(`p15-c${ci}-m${mi}`),
          fileName: `photo-${ci}-${mi}.jpg`,
          mimeType: "image/jpeg",
          fileSize: 180000 + Math.floor(crand() * 400000),
        });
      } else if (kind === "video") {
        attachmentId = await ensureAttachment({
          uploaderId: sender,
          kind: "video",
          url: VIDEOS[Math.floor(crand() * VIDEOS.length)],
          fileName: `clip-${ci}-${mi}.mp4`,
          mimeType: "video/mp4",
          fileSize: 900000 + Math.floor(crand() * 2000000),
        });
      } else if (kind === "audio") {
        attachmentId = await ensureAttachment({
          uploaderId: sender,
          kind: "audio",
          url: AUDIOS[Math.floor(crand() * AUDIOS.length)],
          fileName: `track-${ci}-${mi}.mp3`,
          mimeType: "audio/mpeg",
          fileSize: 3000000 + Math.floor(crand() * 2000000),
          durationSec: 180 + Math.floor(crand() * 120),
        });
      } else if (kind === "voice") {
        attachmentId = await ensureAttachment({
          uploaderId: sender,
          kind: "audio",
          url: AUDIOS[Math.floor(crand() * AUDIOS.length)],
          fileName: `voice-${Date.now()}-${mi}.webm`,
          mimeType: "audio/webm",
          fileSize: 40000 + Math.floor(crand() * 120000),
          durationSec: 5 + Math.floor(crand() * 55),
        });
      } else if (kind === "file") {
        const f = FILES[Math.floor(crand() * FILES.length)];
        attachmentId = await ensureAttachment({
          uploaderId: sender,
          kind: "file",
          url: `https://picsum.photos/seed/p15-file-${ci}-${mi}/100/100`,
          fileName: f.name,
          mimeType: f.mime,
          fileSize: f.size,
        });
      }

      // Reply chain: ~15% reply to a previous message in this convo.
      let replyToId: string | null = null;
      if (createdIds.length > 2 && crand() < 0.15) {
        replyToId = createdIds[Math.floor(crand() * createdIds.length)];
      }

      // Read status: vary (sender's own messages stay "sent").
      let status = "sent";
      if (sender !== demoId) {
        const sr = crand();
        status = sr < 0.6 ? "read" : sr < 0.85 ? "delivered" : "sent";
      }

      const createdAt = new Date(baseTime + mi * 60 * 1000);
      const [ins] = await db
        .insert(messages)
        .values({
          conversationId: convoId,
          senderId: sender,
          body,
          kind,
          attachmentId,
          replyToId,
          status,
          createdAt,
        })
        .returning({ id: messages.id });
      createdIds.push(ins.id);
      msgCount++;

      // Reactions on ~20%.
      if (crand() < 0.2) {
        const emojis = ["👍", "❤️", "😂", "🔥"];
        const reactor = spec.members[Math.floor(crand() * spec.members.length)];
        await db
          .insert(messageReactions)
          .values({
            messageId: ins.id,
            userId: reactor,
            emoji: emojis[Math.floor(crand() * emojis.length)],
          })
          .onConflictDoNothing();
      }
    }
  }

  console.log(
    `Phase 15 seed: ${convoCount} new conversations, ${msgCount} new messages`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
