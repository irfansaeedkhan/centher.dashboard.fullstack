/**
 * @jest-environment node
 *
 * Phase 6 route-registration test.
 *
 * Proves the marketplace read-layer endpoints are registered (not swallowed
 * by the honest-501 catch-all) and that specific routes come BEFORE
 * parametric ones (Hono matches in registration order — the Phase 4 Judge
 * caught this class of bug).
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
  ["GET", "/api/marketplace/collections"],
  ["GET", "/api/marketplace/collections/hot-collections"],
  ["GET", "/api/marketplace/collections/top-creators"],
  ["GET", "/api/marketplace/collections/creator/:creator"],
  ["GET", "/api/marketplace/collections/:address"],
  ["GET", "/api/marketplace/nfts/hot-nfts"],
  ["GET", "/api/marketplace/nfts/old-dxc-meta-nfts"],
  ["GET", "/api/marketplace/nfts/creator/:creator"],
  ["GET", "/api/marketplace/nfts/owner/:owner"],
  ["GET", "/api/marketplace/nfts/owner/:owner/listed"],
  ["GET", "/api/marketplace/nfts/:collection"],
  ["GET", "/api/marketplace/nfts/:collection/:tokenId/page-data"],
  ["POST", "/api/ipfs/upload/file"],
  ["POST", "/api/ipfs/upload/metadata"],
];

describe("Phase 6: marketplace routes are registered", () => {
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

  test("specific routes are registered before parametric ones", () => {
    const idx = (k: string) => routes.indexOf(k);
    // collections
    expect(idx("GET /api/marketplace/collections/hot-collections")).toBeLessThan(
      idx("GET /api/marketplace/collections/:address")
    );
    expect(idx("GET /api/marketplace/collections/top-creators")).toBeLessThan(
      idx("GET /api/marketplace/collections/:address")
    );
    expect(
      idx("GET /api/marketplace/collections/creator/:creator")
    ).toBeLessThan(idx("GET /api/marketplace/collections/:address"));
    // nfts
    expect(idx("GET /api/marketplace/nfts/hot-nfts")).toBeLessThan(
      idx("GET /api/marketplace/nfts/:collection")
    );
    expect(idx("GET /api/marketplace/nfts/old-dxc-meta-nfts")).toBeLessThan(
      idx("GET /api/marketplace/nfts/:collection")
    );
    expect(idx("GET /api/marketplace/nfts/creator/:creator")).toBeLessThan(
      idx("GET /api/marketplace/nfts/:collection")
    );
    expect(idx("GET /api/marketplace/nfts/owner/:owner")).toBeLessThan(
      idx("GET /api/marketplace/nfts/:collection")
    );
    expect(idx("GET /api/marketplace/nfts/owner/:owner/listed")).toBeLessThan(
      idx("GET /api/marketplace/nfts/:collection")
    );
    expect(idx("GET /api/marketplace/nfts/:collection")).toBeLessThan(
      idx("GET /api/marketplace/nfts/:collection/:tokenId/page-data")
    );
  });
});

// Module scope: without this, top-level consts collide with the other route
// tests' identically-named consts under tsc (all are scripts otherwise).
export {};
