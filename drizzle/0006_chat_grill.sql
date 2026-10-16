-- Chat-grill fixes (2026-10-16): tombstone-on-user-delete, edit window,
-- quote snapshots, DM dedup key, bot-responder claim flag, keyset index.
-- Additive / non-destructive only. Idempotent (IF NOT EXISTS + guards).

-- Q2: messages.sender_id -> nullable + ON DELETE SET NULL (tombstone, not
-- cascade-wipe). The existing FK was created by drizzle-kit push, so drop it
-- by looked-up name instead of assuming one.
DO $$
DECLARE cname text;
BEGIN
  SELECT con.conname INTO cname
  FROM pg_constraint con
  JOIN pg_attribute att
    ON att.attrelid = con.conrelid AND att.attname = 'sender_id'
  WHERE con.conrelid = 'messages'::regclass
    AND con.contype = 'f'
    AND att.attnum = ANY (con.conkey);
  IF cname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE "messages" DROP CONSTRAINT %I', cname);
  END IF;
END $$;

ALTER TABLE "messages" ALTER COLUMN "sender_id" DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'messages_sender_id_setnull_fkey'
  ) THEN
    ALTER TABLE "messages"
      ADD CONSTRAINT "messages_sender_id_setnull_fkey"
      FOREIGN KEY ("sender_id") REFERENCES "user"("id")
      ON DELETE SET NULL;
  END IF;
END $$;

-- Q14: edit marker + frozen quote snapshot.
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "edited_at" timestamp;
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "reply_snapshot" jsonb;

-- Q5: atomic claim flag for the team-bots auto-responder (see column docs).
ALTER TABLE "messages"
  ADD COLUMN IF NOT EXISTS "bot_replied" boolean NOT NULL DEFAULT false;

-- Q3: dedup key for 1-on-1 conversations. NULL for groups (Postgres UNIQUE
-- allows multiple NULLs).
ALTER TABLE "conversations" ADD COLUMN IF NOT EXISTS "dm_pair_key" text;

-- Backfill: exactly one 2-member conversation per pair gets the key (the
-- oldest); pre-existing duplicate DM threads keep NULL and stay reachable.
WITH pairs AS (
  SELECT c."id" AS cid,
         'dm:' || string_agg(cm."user_id", ':' ORDER BY cm."user_id") AS pair_key,
         ROW_NUMBER() OVER (
           PARTITION BY string_agg(cm."user_id", ':' ORDER BY cm."user_id")
           ORDER BY c."created_at", c."id"
         ) AS rn
  FROM "conversations" c
  JOIN "conversation_members" cm ON cm."conversation_id" = c."id"
  GROUP BY c."id", c."created_at"
  HAVING COUNT(*) = 2
)
UPDATE "conversations" conv
SET "dm_pair_key" = pairs.pair_key
FROM pairs
WHERE conv."id" = pairs.cid
  AND pairs.rn = 1
  AND conv."dm_pair_key" IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'conversations_dm_pair_key_unique'
  ) THEN
    ALTER TABLE "conversations"
      ADD CONSTRAINT "conversations_dm_pair_key_unique" UNIQUE ("dm_pair_key");
  END IF;
END $$;

-- Q12: keyset pagination index for (conversation_id, created_at, id).
CREATE INDEX IF NOT EXISTS "messages_conversation_keyset_idx"
  ON "messages" ("conversation_id", "created_at" DESC, "id" DESC);
