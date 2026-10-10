/**
 * @jest-environment node
 *
 * Phase 8 route-registration test.
 *
 * Proves the admin endpoints are registered (not swallowed by the
 * honest-501 catch-all). AuthZ (401/403) is proven by live curl, not here.
 *
 * DATABASE_URL is stubbed because `@/db` throws on import without it; no
 * query is ever issued, so nothing connects.
 */
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";

jest.mock("@/db", () => ({ db: {} }));
jest.mock("@/lib/auth/better-auth", () => ({
  auth: { api: { getSession: jest.fn() }, handler: jest.fn() },
}));

// require (not import): ES imports hoist above the env assignment and the
// jest.mock calls above.
const { createHonoApp } = require("@/server/hono/app");

const EXPECTED: Array<[string, string]> = [
  ["GET", "/api/admin/users"],
  ["POST", "/api/admin/staking-pools"],
  ["PATCH", "/api/admin/staking-pools/:id"],
  ["DELETE", "/api/admin/staking-pools/:id"],
];

describe("Phase 8: admin routes are registered", () => {
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
      .filter((k: string) => k !== "ALL /api/*");
    const dupes = keys.filter((k: string, i: number) => keys.indexOf(k) !== i);
    expect(dupes).toEqual([]);
  });
});

export {};
