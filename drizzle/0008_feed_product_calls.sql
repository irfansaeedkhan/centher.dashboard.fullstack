-- Feed product calls (Irfan approved 2026-10-21): post/reply edit window
-- + "edited" mark, tombstone deletes, @mention notifications support.
-- Additive / non-destructive only. Idempotent (IF NOT EXISTS), mirroring
-- 0006/0007 style.

-- Post edit window (15 min, same rule as chat) + "edited" mark.
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "edited_at" timestamp;

-- Post tombstone: DELETE sets deleted_at; body/media are redacted at
-- read time and replies survive under a "This post was deleted" stub
-- instead of being cascade-wiped.
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp;

-- Replies get the same treatment: 15-min edit window + "edited" mark,
-- and soft delete so thread structure survives.
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "edited_at" timestamp;
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp;
