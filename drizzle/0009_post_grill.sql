-- Post-grill (sweep scope #3): reply deep-link anchors.
-- Additive / non-destructive only. Idempotent (IF NOT EXISTS), mirroring
-- 0006-0008 style.
--
-- Notifications about a specific reply (mention inside a comment, the
-- post_reply ping for one) now carry the comment id, so the client can
-- deep-link to /post/<parent>?reply=<comment_id> and the post page can
-- scroll to + highlight that reply. It also scopes the @mention
-- edit-dedupe per comment (post-grill Q12) instead of per post.
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "comment_id" uuid REFERENCES "comments"("id") ON DELETE SET NULL;
