/**
 * Team-bots auto-responder runner (2026-10-16).
 *
 * Scans 1-on-1 DMs with bot-flagged team members and posts a reply when the
 * human's message is the latest and is older than REPLY_DELAY_SEC.
 *
 * Safety:
 * - DMs only (exactly 2 members, exactly one bot). Group chats are never
 *   touched.
 * - Loop-safe: if the latest message is already from the bot, the
 *   conversation is skipped — re-runs insert zero new messages.
 * - Natural pause: messages newer than 60s are left for a later run.
 *
 * Run every 2 minutes, e.g.:
 *   npx tsx scripts/bot-responder.ts
 *
 * The Neon URL is read from ~/.neon-sociaket-db-url (0600) and never printed.
 */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";
import {
  generateBotReply,
  roleFromBio,
  type BotRole,
} from "../lib/bots/responder";
import { claimReply, releaseClaim, type SqlQuery } from "../lib/bots/claims";

const REPLY_DELAY_SEC = 60;

function dbUrl(): string {
  const p = join(homedir(), ".neon-sociaket-db-url");
  const url = readFileSync(p, "utf8").trim();
  if (!url) throw new Error("Empty DB URL file");
  return url;
}

interface Bot {
  user_id: string;
  display_name: string | null;
  bio: string | null;
  bot_role: string | null;
}

async function main() {
  const sql = neon(dbUrl());

  const bots = (await sql.query(
    // Chat-grill Q20: role comes from the explicit bot_role column, frozen
    // at seed time; NULL (pre-migration rows) falls back to roleFromBio.
    "SELECT user_id, display_name, bio, bot_role FROM profiles WHERE is_bot = true"
  )) as Bot[];
  if (bots.length === 0) {
    console.error("bot-responder: no bots flagged, nothing to do.");
    return;
  }
  const botById = new Map(bots.map((b) => [b.user_id, b]));

  // Chat-grill Q21: LEFT JOIN so a DM is not invisible when a member has no
  // profiles row; the predicate says exactly what it means — 2 members,
  // exactly one bot. Two-bot DMs and profile-less members are logged, not
  // silently skipped.
  const scanned = (await sql.query(
    `SELECT cm.conversation_id AS id,
            COUNT(*) FILTER (WHERE p.is_bot) AS bot_count,
            COUNT(*) FILTER (WHERE p.user_id IS NULL) AS missing_profiles
       FROM conversation_members cm
       LEFT JOIN profiles p ON p.user_id = cm.user_id
      GROUP BY cm.conversation_id
     HAVING COUNT(*) = 2`
  )) as { id: string; bot_count: string; missing_profiles: string }[];
  const dms: { id: string }[] = [];
  for (const row of scanned) {
    const botCount = Number(row.bot_count);
    if (botCount === 1) {
      if (Number(row.missing_profiles) > 0) {
        console.error(
          `bot-responder: DM ${row.id} has a member without a profiles row — treating as the human.`
        );
      }
      dms.push({ id: row.id });
    } else if (botCount === 2) {
      console.error(
        `bot-responder: skipping two-bot DM ${row.id} (no human to reply to).`
      );
    }
    // botCount === 0: ordinary human DM — nothing to do, stay quiet.
  }

  let replied = 0;
  let skippedFresh = 0;
  let skippedBotLast = 0;
  let skippedClaim = 0;

  // Chat-grill Q5: claim the reply atomically before inserting — an
  // overlapping run loses the race here and moves on. The Neon HTTP
  // client's query method matches the lib's SqlQuery signature.
  const query: SqlQuery = (stmt, params) => sql.query(stmt, params);
  for (const dm of dms) {
    // Who are the two members?
    const members = (await sql.query(
      "SELECT user_id FROM conversation_members WHERE conversation_id = $1",
      [dm.id]
    )) as { user_id: string }[];
    const botMember = members.find((m) => botById.has(m.user_id));
    const humanMember = members.find((m) => !botById.has(m.user_id));
    if (!botMember || !humanMember) continue; // paranoia: not a human+bot DM

    const bot = botById.get(botMember.user_id)!;

    const latest = (await sql.query(
      `SELECT id, sender_id, body, created_at
         FROM messages
        WHERE conversation_id = $1 AND is_deleted = false
        ORDER BY created_at DESC
        LIMIT 1`,
      [dm.id]
    )) as { id: string; sender_id: string; body: string; created_at: string }[];
    if (latest.length === 0) continue;
    const msg = latest[0];

    // Loop safety: never reply to our own (or another bot's) message.
    if (botById.has(msg.sender_id)) {
      skippedBotLast++;
      continue;
    }

    // Natural pause: let the human finish typing / allow follow-ups.
    const ageSec = (Date.now() - new Date(msg.created_at).getTime()) / 1000;
    if (ageSec < REPLY_DELAY_SEC) {
      skippedFresh++;
      continue;
    }

    // Recent bot bodies for no-repeat variety.
    const recent = (await sql.query(
      `SELECT body FROM messages
        WHERE conversation_id = $1 AND sender_id = $2 AND is_deleted = false
        ORDER BY created_at DESC LIMIT 3`,
      [dm.id, botMember.user_id]
    )) as { body: string }[];

    const human = (await sql.query(
      "SELECT display_name FROM profiles WHERE user_id = $1",
      [humanMember.user_id]
    )) as { display_name: string | null }[];

    // Chat-grill Q5: claim the reply atomically before inserting — an
    // overlapping run loses the race here and moves on.
    const claim = await claimReply(query, dm.id, msg.id, () =>
      console.error(
        "bot-responder: bot_reply_claims missing — replying WITHOUT the " +
          "double-reply guard. Apply migration 0006_chat_grill.sql."
      )
    );
    if (claim === "lost") {
      skippedClaim++;
      continue;
    }

    // Chat-grill Q23: rotation = number of bot replies already in the convo,
    // so a repeated human message can't get the identical reply twice in a row.
    const countRows = (await sql.query(
      `SELECT COUNT(*)::int AS n FROM messages
        WHERE conversation_id = $1 AND sender_id = $2 AND is_deleted = false`,
      [dm.id, botMember.user_id]
    )) as { n: number }[];

    const reply = generateBotReply({
      role: (bot.bot_role as BotRole | null) ?? roleFromBio(bot.bio ?? ""),
      botName: bot.display_name ?? "Teammate",
      humanName: human[0]?.display_name ?? "there",
      humanMessage: msg.body,
      recentBotBodies: recent.map((r) => r.body),
      rotation: countRows[0]?.n ?? 0,
    });

    try {
      await sql.query(
        `INSERT INTO messages (conversation_id, sender_id, body, kind, status)
         VALUES ($1, $2, $3, 'text', 'sent')`,
        [dm.id, botMember.user_id, reply]
      );
      // Mark the human's message as read by the bot.
      await sql.query(
        `UPDATE conversation_members
            SET last_read_at = NOW()
          WHERE conversation_id = $1 AND user_id = $2`,
        [dm.id, botMember.user_id]
      );
    } catch (err) {
      // Reply failed after claiming — release the claim so a later run can
      // retry instead of the conversation going silent forever.
      if (claim === "claimed") await releaseClaim(query, dm.id, msg.id);
      throw err;
    }
    replied++;
  }

  console.error(
    `bot-responder done: dms=${dms.length} replied=${replied} ` +
      `skipped_fresh=${skippedFresh} skipped_bot_last=${skippedBotLast} ` +
      `skipped_claim=${skippedClaim}`
  );
}

main().catch((err) => {
  console.error("bot-responder failed:", err?.message ?? err);
  process.exit(1);
});
