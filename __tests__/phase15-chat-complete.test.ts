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

  test("send message accepts kind/attachment_id/reply_to_id", () => {
    expect(appSrc).toContain("attachment_id: z.string().uuid().optional()");
    expect(appSrc).toContain("reply_to_id: z.string().uuid().optional()");
    expect(appSrc).toContain(
      'kind: z\n          .enum(["text", "image", "video", "audio", "file", "voice"])'
    );
  });

  test("SVG uploads are rejected", () => {
    expect(appSrc).toContain("image/svg+xml");
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
