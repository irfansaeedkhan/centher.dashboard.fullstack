-- Chat completeness (chat-grill Q24 + Q26, Irfan approved 2026-10-21):
-- presence, DM notifications, group lifecycle.
-- Additive / non-destructive only. Idempotent (IF NOT EXISTS + guards),
-- mirroring 0006-0009 style.

-- Q24 presence: heartbeat timestamp on the profile. Written only by
-- POST /api/chat/presence (server-throttled to ~1 write/user/60s).
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "last_seen_at" timestamp;

-- Q26 group lifecycle: conversation creator. Only the creator may remove
-- other members; succession (longest-standing remaining member) is applied
-- by the API at removal time.
ALTER TABLE "conversations" ADD COLUMN IF NOT EXISTS "created_by" text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'conversations_created_by_fkey'
  ) THEN
    ALTER TABLE "conversations"
      ADD CONSTRAINT "conversations_created_by_fkey"
      FOREIGN KEY ("created_by") REFERENCES "user"("id")
      ON DELETE SET NULL;
  END IF;
END $$;

-- Backfill: the creator of a pre-existing conversation is its
-- longest-standing member (earliest joined_at; user_id breaks ties so the
-- choice is deterministic). Conversations with no members stay NULL —
-- succession assigns an owner on the next member removal.
UPDATE "conversations" c
SET "created_by" = (
  SELECT cm."user_id"
  FROM "conversation_members" cm
  WHERE cm."conversation_id" = c."id"
  ORDER BY cm."joined_at" ASC, cm."user_id" ASC
  LIMIT 1
)
WHERE c."created_by" IS NULL;

-- Q24 DM notifications: chat notifications deep-link to the conversation.
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "conversation_id" uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'notifications_conversation_id_fkey'
  ) THEN
    ALTER TABLE "notifications"
      ADD CONSTRAINT "notifications_conversation_id_fkey"
      FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id")
      ON DELETE CASCADE;
  END IF;
END $$;
