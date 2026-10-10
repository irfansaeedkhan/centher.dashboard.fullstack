/**
 * Phase 15: chat completeness — route registration + validation shape tests.
 * Verifies the new endpoints exist and are registered before parametric routes.
 */
import { readFileSync } from "fs";
import { join } from "path";

const appSrc = readFileSync(
  join(__dirname, "..", "server", "hono", "app.ts"),
  "utf8"
);

describe("phase15 chat completeness routes", () => {
  test("attachment registration endpoint exists", () => {
    expect(appSrc).toContain('app.post("/chat/attachments"');
  });

  test("per-message read receipt endpoint exists", () => {
    expect(appSrc).toContain('app.post("/chat/messages/:id/read"');
  });

  test("typing indicator endpoints exist", () => {
    expect(appSrc).toContain('app.post("/chat/conversations/:id/typing"');
    expect(appSrc).toContain('app.get("/chat/conversations/:id/typing"');
  });

  test("typing indicators are DB-backed (F2), not in-memory", () => {
    // No in-memory Map keyed by string-split keys.
    expect(appSrc).not.toContain("typingMap");
    expect(appSrc).toContain("chatTyping");
    expect(appSrc).toContain("onConflictDoUpdate");
    const schema = readFileSync(
      join(__dirname, "..", "db", "schema.ts"),
      "utf8"
    );
    expect(schema).toContain('"chat_typing"');
    expect(schema).toContain("export const chatTyping");
    const migration = readFileSync(
      join(__dirname, "..", "drizzle", "0004_chat_typing.sql"),
      "utf8"
    );
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS");
    expect(migration).toContain('"chat_typing"');
  });

  test("bulk read endpoint marks messages read up to a message ID (N2)", () => {
    expect(appSrc).toContain("up_to_message_id");
    expect(appSrc).toContain('app.post("/chat/conversations/:id/read"');
    expect(appSrc).toContain('ne(messages.status, "read")');
  });

  test("send message accepts kind/attachment_id/reply_to_id", () => {
    expect(appSrc).toContain("attachment_id: z.string().uuid().optional()");
    expect(appSrc).toContain("reply_to_id: z.string().uuid().optional()");
    expect(appSrc).toContain(
      'kind: z\n          .enum(["text", "image", "video", "audio", "file", "voice"])'
    );
  });

  test("SVG uploads are rejected", () => {
    // Enforced via the per-kind server allowlist (F3): image/svg+xml is not
    // in CHAT_IMAGE_MIMES, so it 400s.
    expect(appSrc).toContain("CHAT_MIME_ALLOWLIST");
    expect(appSrc).toContain("is not allowed for");
  });

  test("MIME allowlist mirrors client classifyChatFile sets", () => {
    const cloudSrc = readFileSync("lib/media/cloudinary.ts", "utf8");
    for (const name of [
      "CHAT_IMAGE_MIMES",
      "CHAT_VIDEO_MIMES",
      "CHAT_AUDIO_MIMES",
      "CHAT_FILE_MIMES",
    ]) {
      expect(cloudSrc).toContain(`export const ${name}`);
      expect(appSrc).toContain(name);
    }
    // SVG must not be in the image set.
    expect(cloudSrc).not.toMatch(
      /CHAT_IMAGE_MIMES = new Set\(\[[\s\S]*?image\/svg/
    );
  });

  test("buildMessage includes attachment + reply + status", () => {
    expect(appSrc).toContain("attachment,");
    expect(appSrc).toContain("reply_to: replyTo,");
    expect(appSrc).toContain('status: msg!.status ?? "sent"');
  });

  test("schema has chat_attachments table + message columns", () => {
    const schema = readFileSync(
      join(__dirname, "..", "db", "schema.ts"),
      "utf8"
    );
    expect(schema).toContain('pgTable("chat_attachments"');
    expect(schema).toContain('kind: text("kind").notNull().default("text")');
    expect(schema).toContain('attachmentId: uuid("attachment_id")');
    expect(schema).toContain('replyToId: uuid("reply_to_id")');
    expect(schema).toContain(
      'status: text("status").notNull().default("sent")'
    );
    expect(schema).toContain(
      'isDeleted: boolean("is_deleted").notNull().default(false)'
    );
  });

  test("migration 0003 is idempotent", () => {
    const sql = readFileSync(
      join(__dirname, "..", "drizzle", "0003_chat_complete.sql"),
      "utf8"
    );
    expect(sql).toContain("IF NOT EXISTS");
  });
});
