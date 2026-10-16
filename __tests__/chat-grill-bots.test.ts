/**
 * @jest-environment node
 *
 * Chat-grill bot fixes (Q5, Q20, Q22, Q23).
 *
 * - Q20: bot_role is frozen at seed time (roleFromBio becomes the fallback,
 *   not the source of truth).
 * - Q22: trigger misfires — "hey, this broke" must hit BUG (not GREETING);
 *   "make money fast" must NOT hit WORK.
 * - Q23: rotation makes repeated human messages get different replies.
 * - Q5: the atomic claim protocol (lib/bots/claims.ts) — unit-tested with a
 *   fake query fn; the true concurrency proof is the integration test at the
 *   bottom, which runs against Neon when CENTHER_TEST_DB_URL is set.
 */
import {
  generateBotReply,
  roleFromBio,
  type BotRole,
} from "@/lib/bots/responder";
import { claimReply, releaseClaim } from "@/lib/bots/claims";

const ask = (
  role: BotRole,
  message: string,
  extra: Record<string, unknown> = {}
) =>
  generateBotReply({
    role,
    botName: "Alex Novak",
    humanName: "Sam Rivera",
    humanMessage: message,
    ...extra,
  });

// ---------------------------------------------------------------------------
// Q20 — explicit bot role
// ---------------------------------------------------------------------------
describe("Q20 explicit bot role", () => {
  test("roleFromBio still resolves the canonical seed bios (fallback contract)", () => {
    expect(roleFromBio("Tech Lead · Full-stack")).toBe("tech_lead");
    expect(roleFromBio("Project Manager · Agile delivery")).toBe("pm");
    expect(roleFromBio("Product Owner · Roadmap & backlog")).toBe("po");
    expect(roleFromBio("Scrum Master · Team flow")).toBe("scrum_master");
    expect(roleFromBio("Frontend Developer · React/Next.js")).toBe("frontend");
    expect(roleFromBio("QA Engineer · Automation")).toBe("qa");
  });

  test("seed stores the role explicitly on profiles (schema has bot_role)", () => {
    const { profiles } = require("@/db/schema") as typeof import("@/db/schema");
    expect((profiles as any).botRole).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Q22 — trigger misfires
// ---------------------------------------------------------------------------
describe("Q22 trigger misfires", () => {
  test('"hey, this broke" hits BUG, not GREETING', () => {
    const reply = ask("frontend", "hey, this broke");
    expect(reply).not.toMatch(/hey|hello|👋/i);
    expect(reply).toMatch(/repro|look|state|steps/i);
  });

  test('"the build breaks on main" hits BUG', () => {
    expect(ask("backend", "the build breaks on main")).toMatch(
      /repro|look|trace|steps|logs|endpoint/i
    );
  });

  test('"make money fast" does NOT get a work acknowledgment', () => {
    // Falls through to the neutral fallback instead of confidently
    // misunderstanding ("On it — I'll get that built.").
    const reply = ask("pm", "make money fast");
    expect([
      "Got it — can you give me a bit more context so I prioritize it right?",
      "Noted! What's the timeline looking like on this?",
    ]).toContain(reply);
  });

  test("genuine work requests still hit WORK", () => {
    expect(ask("tech_lead", "can you fix the login redirect?")).toMatch(
      /on it|got it|scope/i
    );
    expect(ask("frontend", "hey can you fix this")).toMatch(
      /on it|got it|scope/i
    );
    expect(ask("backend", "fix the login page")).toMatch(/on it|got it|scope/i);
    expect(ask("devops", "please deploy the staging build")).toMatch(
      /on it|got it|deploy|noted/i
    );
    expect(ask("qa", "i need you to test the checkout flow")).toMatch(
      /regression|test|suite/i
    );
  });
});

// ---------------------------------------------------------------------------
// Q23 — rotation defeats repeats
// ---------------------------------------------------------------------------
describe("Q23 rotation", () => {
  test("same message with advancing rotation never repeats back-to-back", () => {
    const seen = new Set<string>();
    let prev = "";
    for (let rotation = 0; rotation < 12; rotation++) {
      const reply = ask("frontend", "hi", { rotation });
      expect(reply).not.toBe(prev);
      prev = reply;
      seen.add(reply);
    }
    // With 12 rotations over small pools, some reuse is fine — but never
    // adjacent, and we should have seen real variety.
    expect(seen.size).toBeGreaterThan(1);
  });

  test("same rotation is deterministic", () => {
    expect(ask("frontend", "hi", { rotation: 3 })).toBe(
      ask("frontend", "hi", { rotation: 3 })
    );
  });

  test("omitted rotation keeps the old hash-only behavior", () => {
    expect(ask("frontend", "hi")).toBe(ask("frontend", "hi"));
  });
});

// ---------------------------------------------------------------------------
// Q5 — claim protocol, unit level (fake query fn)
// ---------------------------------------------------------------------------
describe("Q5 claim protocol (unit)", () => {
  test("second claimant loses the race", async () => {
    const taken = new Set<string>();
    const query = async (stmt: string, params?: any[]) => {
      if (stmt.startsWith("INSERT INTO bot_reply_claims")) {
        const key = `${params![0]}|${params![1]}`;
        if (taken.has(key)) return [];
        taken.add(key);
        return [{ conversation_id: params![0] }];
      }
      return [];
    };
    expect(await claimReply(query, "c1", "m1")).toBe("claimed");
    expect(await claimReply(query, "c1", "m1")).toBe("lost");
    // A different message in the same conversation is still claimable.
    expect(await claimReply(query, "c1", "m2")).toBe("claimed");
  });

  test("stale claims (crashed runs) are reclaimed after 10 minutes", async () => {
    const query = async (stmt: string, _params?: any[]) => {
      if (stmt.startsWith("INSERT INTO bot_reply_claims")) return [];
      if (stmt.startsWith("DELETE FROM bot_reply_claims")) {
        // First reclaim attempt finds the stale row; the retry then wins.
        return [{ conversation_id: "c1" }];
      }
      return [];
    };
    let calls = 0;
    const counting = async (stmt: string, params?: any[]) => {
      calls++;
      if (stmt.startsWith("INSERT INTO bot_reply_claims") && calls > 2)
        return [{ conversation_id: params![0] }];
      return query(stmt, params);
    };
    expect(await claimReply(counting, "c1", "m9")).toBe("claimed");
  });

  test("missing table degrades loudly instead of crashing", async () => {
    const query = async () => {
      throw new Error('relation "bot_reply_claims" does not exist');
    };
    const warned: string[] = [];
    const orig = console.error;
    console.error = (m: string) => warned.push(m);
    try {
      expect(
        await claimReply(query, "c1", "m1", () =>
          console.error("TABLE MISSING")
        )
      ).toBe("no-table");
    } finally {
      console.error = orig;
    }
    expect(warned).toContain("TABLE MISSING");
  });

  test("releaseClaim deletes the claim row", async () => {
    const seen: string[] = [];
    await releaseClaim(
      async (stmt: string) => {
        seen.push(stmt);
        return [];
      },
      "c1",
      "m1"
    );
    expect(seen[0]).toMatch(/DELETE FROM bot_reply_claims/);
  });
});

// ---------------------------------------------------------------------------
// Q5 — claim protocol, true concurrency against Neon (integration).
// Runs only when CENTHER_TEST_DB_URL is set; creates a temp conversation +
// message, fires two concurrent claims (the real overlapping-run scenario),
// asserts exactly one winner and exactly one reply, then cleans up.
// ---------------------------------------------------------------------------
describe("Q5 claim protocol (Neon integration)", () => {
  const dbUrl = process.env.CENTHER_TEST_DB_URL;
  const itOrSkip = dbUrl ? it : it.skip;

  itOrSkip(
    "two concurrent claims → exactly one reply",
    async () => {
      const { neon } = require("@neondatabase/serverless");
      const sql = neon(dbUrl!);
      const query = (stmt: string, params?: any[]) => sql.query(stmt, params);

      const users = (await query('SELECT id FROM "user" LIMIT 2')) as {
        id: string;
      }[];
      expect(users.length).toBe(2);

      const convoId = crypto.randomUUID();
      const msgId = crypto.randomUUID();
      try {
        await query("INSERT INTO conversations (id, title) VALUES ($1, $2)", [
          convoId,
          "grill-test",
        ]);
        await query(
          "INSERT INTO conversation_members (conversation_id, user_id) VALUES ($1, $2), ($1, $3)",
          [convoId, users[0].id, users[1].id]
        );
        await query(
          "INSERT INTO messages (id, conversation_id, sender_id, body, kind, status) VALUES ($1, $2, $3, 'grill ping', 'text', 'sent')",
          [msgId, convoId, users[0].id]
        );

        // The overlapping-run scenario: two claims fire concurrently.
        const [a, b] = await Promise.all([
          claimReply(query, convoId, msgId),
          claimReply(query, convoId, msgId),
        ]);
        const winners = [a, b].filter((r) => r === "claimed");
        expect(winners).toHaveLength(1);

        // Only the winner replies.
        for (const r of [a, b]) {
          if (r !== "claimed") continue;
          await query(
            "INSERT INTO messages (conversation_id, sender_id, body, kind, status) VALUES ($1, $2, 'grill reply', 'text', 'sent')",
            [convoId, users[1].id]
          );
        }
        const replies = (await query(
          "SELECT id FROM messages WHERE conversation_id = $1 AND body = 'grill reply'",
          [convoId]
        )) as { id: string }[];
        expect(replies).toHaveLength(1);
      } finally {
        await query("DELETE FROM conversations WHERE id = $1", [convoId]);
      }
    },
    60000
  );
});
