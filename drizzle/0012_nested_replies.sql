-- Nested replies + real reply likes (post-grill follow-up, Irfan
-- approved 2026-10-21; design:
-- goals/centher-dashboard-app-to-full-working-state/research/nested-replies-and-likes-design.md).
-- X-style model: comments keep their TRUE direct parent
-- (parent_comment_id) at any depth; depth is a rendering rule, never a
-- storage cap. Reply likes get a real table mirroring post_likes.
-- Additive / non-destructive only. Idempotent (IF NOT EXISTS + guards),
-- mirroring 0006-0011 style. (Numbered 0012 — 0011 was marketplace.)

-- Direct parent of a reply. NULL = top-level reply to the post itself,
-- which is already true for every pre-existing comment — no backfill.
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "parent_comment_id" uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'comments_parent_comment_id_fkey'
  ) THEN
    ALTER TABLE "comments"
      ADD CONSTRAINT "comments_parent_comment_id_fkey"
      FOREIGN KEY ("parent_comment_id") REFERENCES "comments"("id")
      ON DELETE SET NULL;
  END IF;
END $$;

-- Denormalized counters, maintained like posts.like_count /
-- posts.comment_count: like_count is recounted from comment_likes in
-- the like endpoint (self-healing); reply_count is increment-maintained
-- on nested insert and counts DIRECT children only. Zero is the true
-- value for every pre-existing comment.
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "like_count" integer NOT NULL DEFAULT 0;
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "reply_count" integer NOT NULL DEFAULT 0;

-- Child lookups (count recomputation, tree assembly debugging). The hot
-- read path stays post_id-based (flat stream + client tree build).
CREATE INDEX IF NOT EXISTS "comments_parent_idx" ON "comments" ("parent_comment_id");

-- comment_likes: exact mirror of post_likes.
CREATE TABLE IF NOT EXISTS "comment_likes" (
  "comment_id" uuid NOT NULL REFERENCES "comments"("id") ON DELETE CASCADE,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "created_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("comment_id", "user_id")
);
