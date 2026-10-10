/**
 * @jest-environment node
 *
 * Phase 13 route-registration test.
 *
 * Proves the NFT trading endpoints are registered (not swallowed by the
 * honest-501 catch-all) and that the trading routes come BEFORE the
 * parametric `:collection` routes (Hono matches in registration order —
 * the Phase 4 Judge caught this class of bug).
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
  ["POST", "/api/marketplace/nfts/:id/buy"],
  ["POST", "/api/marketplace/nfts/:id/bids"],
  ["GET", "/api/marketplace/nfts/:id/bids"],
  ["POST", "/api/marketplace/bids/:bidId/accept"],
  ["POST", "/api/marketplace/bids/:bidId/reject"],
  ["POST", "/api/marketplace/bids/:bidId/withdraw"],
  ["GET", "/api/marketplace/purchases"],
];

describe("Phase 13: NFT trading routes are registered", () => {
  const app = createHonoApp();
  const routes = app.routes.map(
    (r: { method: string; path: string }) => `${r.method} ${r.path}`
  );
  const registered = new Set(routes);

  test.each(EXPECTED)("%s %s is registered", (method, path) => {
    expect(registered.has(`${method} ${path}`)).toBe(true);
  });

  test("no duplicate registrations for the same method+path", () => {
    const keys = routes.filter((k: string) => k !== "ALL /api/*");
    const dupes = keys.filter((k: string, i: number) => keys.indexOf(k) !== i);
    expect(dupes).toEqual([]);
  });

  test("trading routes are registered before parametric :collection routes", () => {
    const idx = (k: string) => routes.indexOf(k);
    const parametric = idx("GET /api/marketplace/nfts/:collection");
    for (const [method, path] of EXPECTED) {
      if (path.startsWith("/api/marketplace/nfts/:id")) {
        expect(idx(`${method} ${path}`)).toBeLessThan(parametric);
      }
    }
  });
});

export {};
