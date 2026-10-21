-- Feed-grill fixes (2026-10-21): view-count dedup ledger + keyset
-- pagination indexes. Additive / non-destructive only. Idempotent
-- (IF NOT EXISTS everywhere), mirroring 0006_chat_grill.sql style.

-- Q18: post_views ledger — one counted view per user per post per day.
-- The post-views handler inserts here with ON CONFLICT DO NOTHING and
-- only increments posts.view_count when a row was actually created, so
-- scripted loops can no longer inflate view counts.
CREATE TABLE IF NOT EXISTS "post_views" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "post_id" uuid NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "view_date" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "post_views_post_user_day_idx"
  ON "post_views" ("post_id", "user_id", "view_date");

-- Q10: keyset pagination indexes for (created_at, id) tuple cursors —
-- feed list scans posts newest-first; reply lists scan one post's
-- comments newest-first. Same shape as the chat keyset index in 0006.
CREATE INDEX IF NOT EXISTS "posts_created_id_idx"
  ON "posts" ("created_at" DESC, "id" DESC);

CREATE INDEX IF NOT EXISTS "comments_post_created_id_idx"
  ON "comments" ("post_id", "created_at" DESC, "id" DESC);
