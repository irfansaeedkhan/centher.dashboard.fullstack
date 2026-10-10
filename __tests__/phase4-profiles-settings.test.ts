/**
 * @jest-environment node
 *
 * Phase 4 route-registration test.
 *
 * Profile/settings/orgs/media add PATCH /users/me, cookie-consent,
 * mention-permission, avatar presets, and the org/invite endpoints to the
 * Hono app. This test proves they are registered (not swallowed by the
 * Phase-1 honest-501 catch-all) without needing a live database: it
 * inspects `app.routes` directly.
 *
 * DATABASE_URL is stubbed because `@/db` throws on import without it; no
 * query is ever issued, so nothing connects.
 */
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://user:pass@localhost:5432/db";

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
  // Profile / settings
  ["PATCH", "/api/users/me"],
  ["PATCH", "/api/users/cookies-consent"],
  ["GET", "/api/users/mention-permission"],
  ["PATCH", "/api/users/mention-permission"],
  // Media (presets real, uploads honest 501)
  ["GET", "/api/avatars"],
  ["GET", "/api/users/image-upload-url"],
  ["PATCH", "/api/users/image"],
  // Orgs / team
  ["GET", "/api/orgs/members/invites/received"],
  ["GET", "/api/orgs/members/invites/sent"],
  ["POST", "/api/orgs/members/invites"],
  ["POST", "/api/orgs/members/invites/:inviteId/accept"],
  ["POST", "/api/orgs/members/invites/:inviteId/reject"],
  ["DELETE", "/api/orgs/members/invites/:inviteId"],
  ["GET", "/api/orgs/members/:orgId"],
  ["PATCH", "/api/orgs/members/:userId"],
  ["DELETE", "/api/orgs/members/:userId"],
  ["DELETE", "/api/orgs/leave"],
];

describe("Phase 4: profile/settings/org/media routes are registered", () => {
  const app = createHonoApp();
  const registered = new Set(
    app.routes.map(
      (r: { method: string; path: string }) => `${r.method} ${r.path}`
    )
  );

  test.each(EXPECTED)("%s %s is registered", (method, path) => {
    expect(registered.has(`${method} ${path}`)).toBe(true);
  });

  test("static /users/* paths win over /users/:userId (registered before it)", () => {
    const paths = app.routes
      .filter((r: { method: string }) => r.method === "GET")
      .map((r: { path: string }) => r.path);
    const paramIdx = paths.indexOf("/api/users/:userId");
    expect(paramIdx).toBeGreaterThanOrEqual(0);
    for (const p of [
      "/api/users/me",
      "/api/users/mention-permission",
      "/api/users/image-upload-url",
      "/api/users",
    ]) {
      const idx = paths.indexOf(p);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(paramIdx);
    }
  });

  test("static /orgs/members/invites/* paths win over /orgs/members/:orgId", () => {
    const paths = app.routes
      .filter((r: { method: string }) => r.method === "GET")
      .map((r: { path: string }) => r.path);
    const paramIdx = paths.indexOf("/api/orgs/members/:orgId");
    expect(paramIdx).toBeGreaterThanOrEqual(0);
    for (const p of [
      "/api/orgs/members/invites/received",
      "/api/orgs/members/invites/sent",
    ]) {
      const idx = paths.indexOf(p);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(paramIdx);
    }
  });
});

// Module scope: without this, top-level consts collide with the other route
// tests' identically-named consts under tsc (all are scripts otherwise).
export {};
