/**
 * @jest-environment node
 *
 * Phase 5 route-registration test.
 *
 * Chat moves from the dead ProductLive/Hasura adapter to the same-origin
 * Hono REST API (`/api/chat/*`), user-scoped via `conversation_members`.
 * This test proves the endpoints are registered (not swallowed by the
 * Phase-1 honest-501 catch-all) without needing a live database: it
 * inspects `app.routes` directly.
 *
 * DATABASE_URL is stubbed because `@/db` throws on import without it; no
 * query is ever issued, so nothing connects.
 */
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";

// The Hono app pulls in @/db (throws without DATABASE_URL, needs node
// globals) and better-auth (ESM-only, jest can't import it). We only inspect
// the route table, so both are mocked — no query is ever issued.
jest.mock("@/db", () => ({ db: {} }));
jest.mock("@/lib/auth/better-auth", () => ({
  auth: { api: { getSession: jest.fn() }, handler: jest.fn() },
}));

// require (not import): ES imports hoist above the env assignment and the
// jest.mock calls above.
const { createHonoApp } = require("@/server/hono/app");

const EXPECTED: Array<[string, string]> = [
  // Conversations (user-scoped)
  ["GET", "/api/chat/conversations"],
  ["POST", "/api/chat/conversations"],
  ["DELETE", "/api/chat/conversations/:id"],
  ["POST", "/api/chat/conversations/:id/pin"],
  ["POST", "/api/chat/conversations/:id/unpin"],
  ["POST", "/api/chat/conversations/:id/read"],
  // Messages (member-scoped; edit/delete sender-scoped)
  ["GET", "/api/chat/conversations/:id/messages"],
  ["POST", "/api/chat/conversations/:id/messages"],
  ["PATCH", "/api/chat/messages/:id"],
  ["DELETE", "/api/chat/messages/:id"],
  ["POST", "/api/chat/messages/:id/reactions"],
];

describe("Phase 5: chat REST routes are registered", () => {
  const app = createHonoApp();
  const registered = new Set(
    app.routes.map(
      (r: { method: string; path: string }) => `${r.method} ${r.path}`
    )
  );

  test.each(EXPECTED)("%s %s is registered", (method, path) => {
    expect(registered.has(`${method} ${path}`)).toBe(true);
  });

  test("no duplicate registrations for the same method+path", () => {
    const keys = app.routes
      .map((r: { method: string; path: string }) => `${r.method} ${r.path}`)
      // The Phase-1 honest-501 catch-all intentionally registers ALL /api/*.
      .filter((k: string) => k !== "ALL /api/*");
    const dupes = keys.filter((k: string, i: number) => keys.indexOf(k) !== i);
    expect(dupes).toEqual([]);
  });
});

// Module scope: without this, top-level consts collide with the other route
// tests' identically-named consts under tsc (all are scripts otherwise).
export {};
