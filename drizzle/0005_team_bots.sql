-- Team bots (2026-10-16): flag demo team-member accounts as bots so the
-- auto-responder can find them. Additive only. Idempotent.
ALTER TABLE "profiles"
  ADD COLUMN IF NOT EXISTS "is_bot" boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "profiles_is_bot_idx"
  ON "profiles" ("is_bot");
