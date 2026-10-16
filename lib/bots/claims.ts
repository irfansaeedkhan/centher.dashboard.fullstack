/**
 * Chat-grill Q5: atomic reply claims for the team-bot responder.
 *
 * The responder runs on the Neon HTTP driver, which has no multi-statement
 * transactions — so pg_advisory_xact_lock cannot span the check+insert gap.
 * Instead a single `INSERT … ON CONFLICT DO NOTHING` on bot_reply_claims is
 * the lock: exactly one overlapping run gets the row and replies. The row is
 * kept as the "already replied" record; on reply failure it is released so
 * a later run can retry. Stale claims (crashed runs) older than 10 minutes —
 * far longer than any healthy run holds one — are reclaimed.
 */

export type SqlQuery = (stmt: string, params?: any[]) => Promise<any[]>;

export type ClaimResult = "claimed" | "lost" | "no-table";

const CLAIM_SQL = `INSERT INTO bot_reply_claims (conversation_id, message_id)
   VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING conversation_id`;

const STALE_RECLAIM_SQL = `DELETE FROM bot_reply_claims
    WHERE conversation_id = $1 AND message_id = $2
      AND claimed_at < NOW() - INTERVAL '10 minutes'
    RETURNING conversation_id`;

export async function claimReply(
  query: SqlQuery,
  conversationId: string,
  messageId: string,
  onMissingTable?: () => void
): Promise<ClaimResult> {
  try {
    const rows = await query(CLAIM_SQL, [conversationId, messageId]);
    if (rows.length > 0) return "claimed";
    // Lost the race — or a stale claim from a crashed run. Reclaim the
    // stale ones, then try once more.
    const reclaimed = await query(STALE_RECLAIM_SQL, [
      conversationId,
      messageId,
    ]);
    if (reclaimed.length === 0) return "lost";
    const retry = await query(CLAIM_SQL, [conversationId, messageId]);
    return retry.length > 0 ? "claimed" : "lost";
  } catch (err: any) {
    if (/relation "bot_reply_claims" does not exist/.test(err?.message ?? "")) {
      // Migration 0006 not applied yet: degrade loudly to the old behavior
      // instead of crashing the loop.
      onMissingTable?.();
      return "no-table";
    }
    throw err;
  }
}

export async function releaseClaim(
  query: SqlQuery,
  conversationId: string,
  messageId: string
): Promise<void> {
  await query(
    "DELETE FROM bot_reply_claims WHERE conversation_id = $1 AND message_id = $2",
    [conversationId, messageId]
  );
}
