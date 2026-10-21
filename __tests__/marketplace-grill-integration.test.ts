/**
 * @jest-environment node
 *
 * Marketplace-grill integration tests against real Postgres (Neon demo
 * DB). These prove the Q4/Q5 atomicity claims under TRUE concurrency —
 * two requests in flight at once — which a mock DB cannot do.
 *
 * Gated on CENTHER_TEST_DB_URL (same convention as chat-grill-bots);
 * the whole suite skips when it is unset. `@/db` is NOT mocked here;
 * only better-auth is, with the session user taken from an
 * `x-test-user-id` header so concurrent requests can act as different
 * users. All seeded rows are grill-scoped and cleaned up.
 */
process.env.DATABASE_URL =
  process.env.CENTHER_TEST_DB_URL ||
  "postgresql://dummy:dummy@localhost:5432/dummy";

jest.mock("@/lib/auth/better-auth", () => ({
  auth: {
    api: {
      getSession: jest.fn(async ({ headers }: any) => {
        const id =
          headers && typeof headers.get === "function"
            ? headers.get("x-test-user-id")
            : null;
        return id ? { user: { id } } : null;
      }),
    },
    handler: jest.fn(),
  },
}));

// require (not import): ES imports hoist above the jest.mock call.
const { createHonoApp } = require("@/server/hono/app");
const { storedBnbToScaled } = require("@/lib/marketplace/bnb-amount");

const dbUrl = process.env.CENTHER_TEST_DB_URL;
const describeOrSkip = dbUrl ? describe : describe.skip;

jest.setTimeout(60_000);

describeOrSkip("marketplace-grill (Neon integration)", () => {
  const { neon } = require("@neondatabase/serverless");
  const sql = neon(dbUrl!);
  const q = (stmt: string, params?: any[]) =>
    sql.query(stmt, params) as Promise<any[]>;

  const app = createHonoApp();
  const run = Math.random().toString(36).slice(2, 8);
  const seller = `grill-seller-${run}`;
  const buyerA = `grill-buyer-a-${run}`;
  const buyerB = `grill-buyer-b-${run}`;
  const collectionId = crypto.randomUUID();
  const nftIds: string[] = [];

  const postAs = (userId: string, path: string, body?: any) =>
    app.request(path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-test-user-id": userId,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

  const seedNft = async (price = "2.5") => {
    const id = crypto.randomUUID();
    nftIds.push(id);
    await q(
      `INSERT INTO nfts (id, collection_id, name, owner_id, price, listed)
       VALUES ($1, $2, 'Grill NFT', $3, $4, true)`,
      [id, collectionId, seller, price]
    );
    return id;
  };

  beforeAll(async () => {
    for (const [id, name] of [
      [seller, "Grill Seller"],
      [buyerA, "Grill Buyer A"],
      [buyerB, "Grill Buyer B"],
    ] as const) {
      await q(`INSERT INTO "user" (id, name, email) VALUES ($1, $2, $3)`, [
        id,
        name,
        `${id}@grill.test`,
      ]);
    }
    await q(
      `INSERT INTO collections (id, name, creator_id) VALUES ($1, 'Grill Collection', $2)`,
      [collectionId, seller]
    );
  });

  afterAll(async () => {
    for (const id of nftIds) {
      await q(`DELETE FROM nft_purchases WHERE nft_id = $1`, [id]);
      await q(`DELETE FROM nft_bids WHERE nft_id = $1`, [id]);
      await q(`DELETE FROM nfts WHERE id = $1`, [id]);
    }
    await q(`DELETE FROM collections WHERE id = $1`, [collectionId]);
    for (const id of [seller, buyerA, buyerB]) {
      await q(`DELETE FROM "user" WHERE id = $1`, [id]);
    }
  });

  test("Q4 double-buy: two simultaneous buys → exactly one owner + one sale record", async () => {
    const nftId = await seedNft();
    const [r1, r2] = await Promise.all([
      postAs(buyerA, `/api/marketplace/nfts/${nftId}/buy`, {}),
      postAs(buyerB, `/api/marketplace/nfts/${nftId}/buy`, {}),
    ]);
    // Exactly one winner. The loser's readable error depends on the
    // interleaving: 409 ALREADY_SOLD if it reached the atomic claim,
    // 400 NOT_LISTED if its pre-read landed after the winner committed.
    // The mock-DB suite pins the 409 path deterministically.
    const statuses = [r1.status, r2.status].sort();
    expect(statuses[0]).toBe(201);
    expect([400, 409]).toContain(statuses[1]);

    const winnerRes = r1.status === 201 ? r1 : r2;
    const winnerBody = await winnerRes.json();
    const loserBody = await (r1.status === 201 ? r2 : r1).json();
    if (loserBody.code === "ALREADY_SOLD") {
      expect(loserBody.message).toMatch(/just sold/);
    } else {
      expect(loserBody.code).toBe("NOT_LISTED");
      expect(loserBody.message).toMatch(/not listed/);
    }

    const purchases = await q(
      `SELECT buyer_id, price_bnb::text AS price FROM nft_purchases WHERE nft_id = $1`,
      [nftId]
    );
    expect(purchases).toHaveLength(1);
    expect(purchases[0].buyer_id).toBe(winnerBody.purchase.buyerId);
    expect(storedBnbToScaled(purchases[0].price)).toBe(
      storedBnbToScaled("2.5")
    );

    const [nft] = await q(`SELECT owner_id, listed FROM nfts WHERE id = $1`, [
      nftId,
    ]);
    expect(nft.owner_id).toBe(winnerBody.purchase.buyerId);
    expect(nft.listed).toBe(false);
  });

  test("Q5 accept vs withdraw race: exactly one transition wins", async () => {
    const nftId = await seedNft();
    const bidId = crypto.randomUUID();
    await q(
      `INSERT INTO nft_bids (id, nft_id, bidder_id, amount_bnb, status)
       VALUES ($1, $2, $3, '0.75', 'active')`,
      [bidId, nftId, buyerA]
    );
    const [acceptRes, withdrawRes] = await Promise.all([
      postAs(seller, `/api/marketplace/bids/${bidId}/accept`, {}),
      postAs(buyerA, `/api/marketplace/bids/${bidId}/withdraw`, {}),
    ]);
    const statuses = [acceptRes.status, withdrawRes.status].sort();
    expect(statuses).toEqual([200, 409]);

    const [bid] = await q(`SELECT status FROM nft_bids WHERE id = $1`, [bidId]);
    const purchases = await q(
      `SELECT id FROM nft_purchases WHERE nft_id = $1`,
      [nftId]
    );
    const [nft] = await q(`SELECT owner_id FROM nfts WHERE id = $1`, [nftId]);
    if (acceptRes.status === 200) {
      // Accept won: sale settled, bid accepted, ownership moved.
      expect(bid.status).toBe("accepted");
      expect(purchases).toHaveLength(1);
      expect(nft.owner_id).toBe(buyerA);
    } else {
      // Withdraw won: no sale, no purchase, ownership untouched, and
      // the withdrawn bid did NOT settle.
      expect(bid.status).toBe("withdrawn");
      expect(purchases).toHaveLength(0);
      expect(nft.owner_id).toBe(seller);
    }
  });

  test("Q5 double-accept of the same bid → one sale, one 409", async () => {
    const nftId = await seedNft();
    const bidId = crypto.randomUUID();
    await q(
      `INSERT INTO nft_bids (id, nft_id, bidder_id, amount_bnb, status)
       VALUES ($1, $2, $3, '0.75', 'active')`,
      [bidId, nftId, buyerA]
    );
    const [r1, r2] = await Promise.all([
      postAs(seller, `/api/marketplace/bids/${bidId}/accept`, {}),
      postAs(seller, `/api/marketplace/bids/${bidId}/accept`, {}),
    ]);
    expect([r1.status, r2.status].sort()).toEqual([200, 409]);
    const purchases = await q(
      `SELECT id FROM nft_purchases WHERE nft_id = $1`,
      [nftId]
    );
    expect(purchases).toHaveLength(1);
  });

  test("Q3/Q7 dust bids end-to-end: exact storage, exact floor, exact settle price", async () => {
    const nftId = await seedNft();
    // Dust bid that the old code stored as 0.0000 while wiping the book.
    const dust = await postAs(buyerA, `/api/marketplace/nfts/${nftId}/bids`, {
      amountBnb: "0.00001",
    });
    expect(dust.status).toBe(201);
    const [dustRow] = await q(
      `SELECT amount_bnb::text AS amount, status FROM nft_bids WHERE nft_id = $1`,
      [nftId]
    );
    expect(storedBnbToScaled(dustRow.amount)).toBe(10n ** 13n);
    expect(dustRow.status).toBe("active");

    // A genuinely higher dust bid outbids it; a lower one is rejected.
    const higher = await postAs(buyerB, `/api/marketplace/nfts/${nftId}/bids`, {
      amountBnb: "0.00002",
    });
    expect(higher.status).toBe(201);
    const lower = await postAs(buyerA, `/api/marketplace/nfts/${nftId}/bids`, {
      amountBnb: "0.000015",
    });
    expect(lower.status).toBe(400);
    expect((await lower.json()).code).toBe("BID_TOO_LOW");

    const bids = await q(
      `SELECT bidder_id, amount_bnb::text AS amount, status FROM nft_bids
       WHERE nft_id = $1 ORDER BY amount_bnb DESC`,
      [nftId]
    );
    expect(bids).toHaveLength(2);
    expect(bids[0].status).toBe("active");
    expect(bids[0].bidder_id).toBe(buyerB);
    expect(bids[1].status).toBe("outbid");

    // Accepting settles at the actual stored amount — the value that
    // lands in the purchases ledger (and therefore in volume stats).
    const topBidId = (
      await postAs(buyerB, `/api/marketplace/nfts/${nftId}/bids`, {
        amountBnb: "0.00003",
      }).then((r: any) => r.json())
    ).bid.id;
    const accept = await postAs(
      seller,
      `/api/marketplace/bids/${topBidId}/accept`,
      {}
    );
    expect(accept.status).toBe(200);
    const [purchase] = await q(
      `SELECT price_bnb::text AS price FROM nft_purchases WHERE nft_id = $1`,
      [nftId]
    );
    expect(storedBnbToScaled(purchase.price)).toBe(3n * 10n ** 13n);
  });
});

export {};
