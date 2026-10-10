-- Phase 15 fix (Judge F2): DB-backed typing indicators.
-- In-memory Maps don't survive across Vercel serverless instances.
-- Additive only. Idempotent (IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS "chat_typing" (
  "conversation_id" uuid NOT NULL REFERENCES "conversations"("id") ON DELETE CASCADE,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "updated_at" timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY ("conversation_id", "user_id")
);

CREATE INDEX IF NOT EXISTS "chat_typing_updated_idx"
  ON "chat_typing" ("updated_at");
