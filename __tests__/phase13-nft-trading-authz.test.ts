/**
 * @jest-environment node
 *
 * Phase 13 Judge F7: authZ matrix + F1 sale-history shape, against a mocked
 * DB. Proves:
 *   - unauthenticated trading calls → 401
 *   - accept-bid as non-owner / withdraw as non-bidder / purchases for
 *     another user → 403
 *   - buy on unlisted NFT / own NFT → 400 (NOT_LISTED / SELF_BUY)
 *   - page-data marketplaceSaleHistory emits type "BuyItem" (Judge F1 —
 *     the UI returns null for unknown types, so "Sale" hid purchases)
 */
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";

import { collections, nftBids, nftPurchases, nfts } from "@/db/schema";

const chain = (rows: any[]) => {
  const c: any = {};
  c.where = () => c;
  c.orderBy = () => c;
  c.limit = () => c;
  // Drizzle query builders are thenable — await resolves the rows.
  c.then = (resolve: (v: any) => void) => resolve(rows);
  return c;
};

// Route .from(table) → canned rows per table identity.
const rowsFor = jest.fn((_table: any): any[] => []);

jest.mock("@/db", () => ({
  db: {
    select: (..._args: any[]) => ({ from: (t: any) => chain(rowsFor(t)) }),
  },
}));
jest.mock("@/lib/auth/better-auth", () => ({
  auth: { api: { getSession: jest.fn() }, handler: jest.fn() },
}));

// require (not import): ES imports hoist above the env assignment and the
// jest.mock calls above.
const { createHonoApp } = require("@/server/hono/app");
const { auth } = require("@/lib/auth/better-auth");

const BUYER = "user-buyer-1";
const OWNER = "user-owner-9";
const NFT_ID = "11111111-1111-4111-8111-111111111111";
const COLL_ID = "22222222-2222-4222-8222-222222222222";
const BID_ID = "33333333-3333-4333-8333-333333333333";

const nftRow = (over: Record<string, any> = {}) => ({
  id: NFT_ID,
  collectionId: COLL_ID,
  ownerId: OWNER,
  name: "Seed Ape",
  imageUrl: "https://picsum.photos/seed/ape/400",
  price: "1.5000",
  listed: true,
  description: "demo",
  createdAt: new Date("2026-01-01T00:00:00Z"),
  ...over,
});
const collRow = () => ({ id: COLL_ID, creatorId: OWNER });
const bidRow = (over: Record<string, any> = {}) => ({
  id: BID_ID,
  nftId: NFT_ID,
  bidderId: BUYER,
  amountBnb: "2.0000",
  status: "active",
  createdAt: new Date("2026-01-02T00:00:00Z"),
  expiresAt: null,
  ...over,
});
const purchaseRow = () => ({
  id: "44444444-4444-4444-8444-444444444444",
  nftId: NFT_ID,
  buyerId: BUYER,
  sellerId: OWNER,
  priceBnb: "1.5000",
  txHash: null,
  purchasedAt: new Date("2026-01-03T00:00:00Z"),
});

const asUser = (id: string | null) =>
  (auth.api.getSession as jest.Mock).mockResolvedValue(
    id ? { user: { id } } : null
  );

const tableFor = (t: any) => {
  if (t === nfts) return "nfts";
  if (t === nftBids) return "nftBids";
  if (t === nftPurchases) return "nftPurchases";
  if (t === collections) return "collections";
  return "other";
};

const codeOf = async (res: Response) =>
  (await res.json().catch(() => ({}))).code;

describe("Phase 13 authZ matrix (mocked DB)", () => {
  const app = createHonoApp();

  beforeEach(() => {
    rowsFor.mockReset();
    (auth.api.getSession as jest.Mock).mockReset();
  });

  test("POST buy unauthenticated → 401", async () => {
    asUser(null);
    const res = await app.request(`/api/marketplace/nfts/${NFT_ID}/buy`, {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(401);
    expect(await codeOf(res)).toBe("UNAUTHORIZED");
  });

  test("POST buy on unlisted NFT → 400 NOT_LISTED", async () => {
    asUser(BUYER);
    rowsFor.mockImplementation((t: any) =>
      tableFor(t) === "nfts" ? [nftRow({ listed: false })] : []
    );
    const res = await app.request(`/api/marketplace/nfts/${NFT_ID}/buy`, {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(400);
    expect(await codeOf(res)).toBe("NOT_LISTED");
  });

  test("POST buy own NFT → 400 SELF_BUY", async () => {
    asUser(OWNER);
    rowsFor.mockImplementation((t: any) =>
      tableFor(t) === "nfts" ? [nftRow()] : []
    );
    const res = await app.request(`/api/marketplace/nfts/${NFT_ID}/buy`, {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(400);
    expect(await codeOf(res)).toBe("SELF_BUY");
  });

  test("POST accept as non-owner → 403", async () => {
    asUser("user-stranger");
    rowsFor.mockImplementation((t: any) =>
      tableFor(t) === "nftBids"
        ? [bidRow()]
        : tableFor(t) === "nfts"
        ? [nftRow()]
        : []
    );
    const res = await app.request(`/api/marketplace/bids/${BID_ID}/accept`, {
      method: "POST",
    });
    expect(res.status).toBe(403);
    expect(await codeOf(res)).toBe("FORBIDDEN");
  });

  test("POST withdraw as non-bidder → 403", async () => {
    asUser("user-stranger");
    rowsFor.mockImplementation((t: any) =>
      tableFor(t) === "nftBids" ? [bidRow()] : []
    );
    const res = await app.request(`/api/marketplace/bids/${BID_ID}/withdraw`, {
      method: "POST",
    });
    expect(res.status).toBe(403);
    expect(await codeOf(res)).toBe("FORBIDDEN");
  });

  test("GET purchases for another user → 403", async () => {
    asUser(BUYER);
    const res = await app.request(
      `/api/marketplace/purchases?userId=${OWNER}`,
      { method: "GET" }
    );
    expect(res.status).toBe(403);
    expect(await codeOf(res)).toBe("FORBIDDEN");
  });

  test("Judge F1: page-data sale history emits type BuyItem", async () => {
    asUser(BUYER);
    rowsFor.mockImplementation((t: any) => {
      const k = tableFor(t);
      if (k === "nfts") return [nftRow()];
      if (k === "collections") return [collRow()];
      if (k === "nftPurchases") return [purchaseRow()];
      return [];
    });
    const res = await app.request(
      `/api/marketplace/nfts/${COLL_ID}/${NFT_ID}/page-data`,
      { method: "GET" }
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.marketplaceSaleHistory).toHaveLength(1);
    expect(body.marketplaceSaleHistory[0].type).toBe("BuyItem");
    expect(body.marketplaceSaleHistory[0].buyer).toBe(BUYER);
    expect(body.marketplaceSaleHistory[0].seller).toBe(OWNER);
  });
});

export {};
