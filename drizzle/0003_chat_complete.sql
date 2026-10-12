-- Phase 15: chat completeness — attachments + message kinds + replies + status.
-- Additive only. Idempotent (IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS "chat_attachments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "uploader_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "kind" text NOT NULL,
  "mime_type" text NOT NULL,
  "file_name" text NOT NULL,
  "file_size" integer NOT NULL,
  "url" text NOT NULL,
  "duration_sec" integer,
  "width" integer,
  "height" integer,
  "thumbnail_url" text,
  "created_at" timestamp NOT NULL DEFAULT now()
);

ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "kind" text NOT NULL DEFAULT 'text';
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "attachment_id" uuid;
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "reply_to_id" uuid;
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "status" text NOT NULL DEFAULT 'sent';
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "is_deleted" boolean NOT NULL DEFAULT false;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'messages_attachment_id_fkey'
  ) THEN
    ALTER TABLE "messages"
      ADD CONSTRAINT "messages_attachment_id_fkey"
      FOREIGN KEY ("attachment_id") REFERENCES "chat_attachments"("id")
      ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'messages_reply_to_id_fkey'
  ) THEN
    ALTER TABLE "messages"
      ADD CONSTRAINT "messages_reply_to_id_fkey"
      FOREIGN KEY ("reply_to_id") REFERENCES "messages"("id")
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "chat_attachments_uploader_idx"
  ON "chat_attachments" ("uploader_id");
CREATE INDEX IF NOT EXISTS "messages_conversation_kind_idx"
  ON "messages" ("conversation_id", "kind");
