/**
 * @jest-environment node
 *
 * Phase 2 route-registration test.
 *
 * The social write layer adds 13 endpoints to the Hono app. This test proves
 * they are registered (not swallowed by the Phase-1 honest-501 catch-all)
 * without needing a live database: it inspects `app.routes` directly.
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
  ["GET", "/api/socials/posts/archived"],
  ["GET", "/api/socials/posts/user/replies"],
  ["GET", "/api/socials/posts/user/:userId"],
  ["GET", "/api/socials/posts/user/:userId/with-auth"],
  ["GET", "/api/socials/posts/:id"],
  ["GET", "/api/socials/posts/:id/with-auth"],
  ["GET", "/api/socials/posts/:id/replies"],
  ["GET", "/api/socials/posts/:id/replies/with-auth"],
  ["PATCH", "/api/socials/posts/:id"],
  ["PATCH", "/api/socials/posts/:id/archive"],
  ["PATCH", "/api/socials/posts/:id/unarchive"],
  ["DELETE", "/api/socials/posts/:id"],
  ["POST", "/api/socials/analytics/likes"],
  ["POST", "/api/socials/analytics/post-views"],
];

describe("Phase 2: social write layer routes are registered", () => {
  const app = createHonoApp();
  // Hono mounts the app at /api/* via pages/api/[[...route]]; the route
  // table carries the paths as registered in server/hono/app.ts.
  const registered = new Set(
    app.routes.map(
      (r: { method: string; path: string }) => `${r.method} ${r.path}`
    )
  );

  test.each(EXPECTED)("%s %s is registered", (method, path) => {
    expect(registered.has(`${method} ${path}`)).toBe(true);
  });

  test("static post paths win over :id (registered before it)", () => {
    const paths = app.routes
      .filter((r: { path: string }) => r.path.startsWith("/api/socials/posts/"))
      .map((r: { path: string }) => r.path);
    const idIndex = paths.indexOf("/api/socials/posts/:id");
    expect(idIndex).toBeGreaterThan(-1);
    for (const p of [
      "/api/socials/posts/archived",
      "/api/socials/posts/user/replies",
      "/api/socials/posts/user/:userId",
      "/api/socials/posts/mention",
    ]) {
      expect(paths.indexOf(p)).toBeLessThan(idIndex);
    }
  });

  test("catch-all 501 is the last route", () => {
    const last = app.routes[app.routes.length - 1];
    expect(last.path).toBe("/api/*");
  });
});
