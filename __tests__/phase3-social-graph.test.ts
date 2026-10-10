/**
 * @jest-environment node
 *
 * Phase 3 route-registration test.
 *
 * The social graph adds follow/counts/search/notification/profile-view
 * endpoints to the Hono app. This test proves they are registered (not
 * swallowed by the Phase-1 honest-501 catch-all) without needing a live
 * database: it inspects `app.routes` directly.
 *
 * DATABASE_URL is stubbed because `@/db` throws on import without it; no
 * query is ever issued, so nothing connects.
 */
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/test";

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
  ["GET", "/api/users"],
  ["POST", "/api/socials/analytics/profile-views"],
  ["POST", "/api/socials/followers"],
  ["GET", "/api/socials/followers/is-followed/:id"],
  ["GET", "/api/socials/followers/is-followed/:id/with-auth"],
  ["GET", "/api/socials/users/my-followers"],
  ["GET", "/api/socials/users/my-following"],
  ["GET", "/api/socials/users/counts"],
  ["GET", "/api/socials/users/:userId/mutual-followers"],
  ["GET", "/api/search"],
  ["GET", "/api/search/recent"],
  ["POST", "/api/search/recent"],
  ["DELETE", "/api/search/recent"],
  ["DELETE", "/api/search/recent/:searchId"],
  ["GET", "/api/notifications"],
  ["PATCH", "/api/notifications/:id"],
  ["PATCH", "/api/notifications"],
];

describe("Phase 3: social graph routes are registered", () => {
  const app = createHonoApp();
  const registered = new Set(
    app.routes.map(
      (r: { method: string; path: string }) => `${r.method} ${r.path}`
    )
  );

  test.each(EXPECTED)("%s %s is registered", (method, path) => {
    expect(registered.has(`${method} ${path}`)).toBe(true);
  });

  test("static /users wins over /users/:userId (registered before it)", () => {
    const paths = app.routes
      .filter((r: { method: string }) => r.method === "GET")
      .map((r: { path: string }) => r.path);
    const batchIdx = paths.indexOf("/api/users");
    const paramIdx = paths.indexOf("/api/users/:userId");
    expect(batchIdx).toBeGreaterThanOrEqual(0);
    expect(paramIdx).toBeGreaterThanOrEqual(0);
    expect(batchIdx).toBeLessThan(paramIdx);
  });

  test("static socials/users paths win over :userId/mutual-followers", () => {
    const paths = app.routes
      .filter((r: { method: string }) => r.method === "GET")
      .map((r: { path: string }) => r.path);
    const paramIdx = paths.indexOf(
      "/api/socials/users/:userId/mutual-followers"
    );
    for (const p of [
      "/api/socials/users/my-followers",
      "/api/socials/users/my-following",
      "/api/socials/users/counts",
    ]) {
      const idx = paths.indexOf(p);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(paramIdx);
    }
  });

  test("profile-card with-auth variant shares the single handler (no duplicate)", () => {
    const cardRoutes = app.routes.filter(
      (r: { method: string; path: string }) =>
        r.method === "GET" &&
        r.path.startsWith("/api/socials/analytics/profile-card/")
    );
    expect(cardRoutes.map((r: { path: string }) => r.path).sort()).toEqual([
      "/api/socials/analytics/profile-card/:userId",
      "/api/socials/analytics/profile-card/:userId/with-auth",
    ]);
  });
});

// Module scope: without this, top-level consts collide with the Phase 2
// route test's identically-named consts under tsc (both are scripts).
export {};
