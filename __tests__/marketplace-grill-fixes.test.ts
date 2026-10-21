/**
 * @jest-environment node
 *
 * Marketplace-grill FIXER regression tests (2026-10-21).
 *
 * Q4/Q5 (atomic trading mutations), Q3/Q7 (bid integrity / exact BNB
 * decimals), Q10 (saleState vocabulary), Q13 (committed RPC key).
 *
 * Pure helpers are unit-tested directly; route behavior goes through the
 * real Hono app with a recording mock DB (feed-grill pattern: mock @/db +
 * better-auth, then app.request). True-concurrency proofs against real
 * Postgres live in marketplace-grill-integration.test.ts (Neon-gated).
 */
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  parseBnbAmount,
  storedBnbToScaled,
} from "@/lib/marketplace/bnb-amount";
import { nftDetailPanelFor } from "@/lib/marketplace/panel-state";
import { nfts, nftBids, nftPurchases } from "@/db/schema";

// ---------------------------------------------------------------------------
// Recording mock DB. Selects/updates resolve programmed rows per table;
// `execute` captures the raw SQL (text + params) of the atomic trade
// statements and returns programmed rows.
// ---------------------------------------------------------------------------
const tableKey = (t: any): string => {
  if (t === nfts) return "nfts";
  if (t === nftBids) return "nftBids";
  if (t === nftPurchases) return "nftPurchases";
  return "other";
};

type SqlCapture = { text: string; params: any[] };
const executeCalls: SqlCapture[] = [];
const chainCalls: { op: string; method?: string; table: string }[] = [];

let selectImpl: (table: string) => any[] = () => [];
let updateImpl: (table: string) => any[] = () => [];
let executeImpl: (call: SqlCapture, callIndex: number) => any[] = () => [];

const captureSql = (arg: any): SqlCapture => {
  const params: any[] = [];
  const walk = (chunk: any): string => {
    if (chunk == null) return "";
    // Interpolated values sit in queryChunks as bare primitives.
    if (
      typeof chunk === "string" ||
      typeof chunk === "number" ||
      typeof chunk === "bigint" ||
      typeof chunk === "boolean" ||
      chunk instanceof Date
    ) {
      params.push(chunk);
      return "?";
    }
    if (Array.isArray(chunk)) return chunk.map(walk).join("");
    if (typeof chunk === "object") {
      if (Array.isArray(chunk.queryChunks))
        return chunk.queryChunks.map(walk).join("");
      if ("value" in chunk) {
        const v = chunk.value;
        // StringChunk: value is the static text segments — join as-is
        // (do NOT walk them: bare strings elsewhere are params).
        if (Array.isArray(v)) return v.join("");
        params.push(v);
        return "?";
      }
    }
    return "";
  };
  return { text: walk(arg), params };
};

const makeChain = (op: string) => {
  let table = "none";
  const q: any = new Proxy(() => {}, {
    get(_t, prop) {
      if (prop === "then")
        return (res: any) =>
          res(op === "update" ? updateImpl(table) : selectImpl(table));
      return (...args: any[]) => {
        if (String(prop) === "from" && args[0]) table = tableKey(args[0]);
        chainCalls.push({ op, method: String(prop), table });
        return q;
      };
    },
    apply() {
      return q;
    },
  });
  return q;
};

const mockDb: any = {
  select: () => makeChain("select"),
  insert: (t: any) => {
    chainCalls.push({ op: "insert", table: tableKey(t) });
    return makeChain("insert");
  },
  update: (t: any) => {
    chainCalls.push({ op: "update", table: tableKey(t) });
    return makeChain("update");
  },
  delete: (t: any) => {
    chainCalls.push({ op: "delete", table: tableKey(t) });
    return makeChain("delete");
  },
  execute: async (arg: any) => {
    const call = captureSql(arg);
    executeCalls.push(call);
    return executeImpl(call, executeCalls.length - 1);
  },
};

jest.mock("@/db", () => ({ db: mockDb }));
jest.mock("@/lib/auth/better-auth", () => ({
  auth: { api: { getSession: jest.fn() }, handler: jest.fn() },
}));

// require (not import): ES imports hoist above the jest.mock calls.
const { createHonoApp } = require("@/server/hono/app");
const { auth } = require("@/lib/auth/better-auth");

const app = createHonoApp();
const asUser = (id: string | null) =>
  (auth.api.getSession as jest.Mock).mockResolvedValue(
    id ? { user: { id } } : null
  );

const SELLER = "seller-1";
const BUYER = "buyer-1";
const NFT_ID = "11111111-1111-4111-8111-111111111111";
const BID_ID = "22222222-2222-4222-8222-222222222222";

const nftRow = (over: Record<string, any> = {}) => ({
  id: NFT_ID,
  collectionId: "33333333-3333-4333-8333-333333333333",
  name: "Grill NFT",
  description: "",
  imageUrl: "",
  ownerId: SELLER,
  price: "1.5000",
  listed: true,
  mediaType: "image",
  animationUrl: null,
  createdAt: new Date(),
  ...over,
});
const bidRow = (over: Record<string, any> = {}) => ({
  id: BID_ID,
  nftId: NFT_ID,
  bidderId: BUYER,
  amountBnb: "0.5",
  status: "active",
  createdAt: new Date(),
  expiresAt: null,
  ...over,
});
const purchaseRaw = (over: Record<string, any> = {}) => ({
  id: "44444444-4444-4444-8444-444444444444",
  nft_id: NFT_ID,
  buyer_id: BUYER,
  seller_id: SELLER,
  price_bnb: "1.5000",
  tx_hash: null,
  purchased_at: "2026-10-21T00:00:00.000Z",
  swept_count: 1,
  ...over,
});

const post = (path: string, body?: any) =>
  app.request(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

beforeEach(() => {
  executeCalls.length = 0;
  chainCalls.length = 0;
  selectImpl = () => [];
  updateImpl = () => [];
  executeImpl = () => [];
  asUser(BUYER);
});

// ---------------------------------------------------------------------------
// Q7/Q3 — exact BNB decimal handling (unit)
// ---------------------------------------------------------------------------
describe("Q7/Q3 parseBnbAmount", () => {
  test("dust amount 0.00001 parses exactly — never rounds to zero", () => {
    const r = parseBnbAmount("0.00001");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.canonical).toBe("0.00001");
    expect(r.value.scaled).toBe(10n ** 13n);
    expect(r.value.scaled > 0n).toBe(true);
  });

  test("canonical form trims trailing zeros; stored values round-trip", () => {
    const r = parseBnbAmount("1.5000");
    expect(r.ok && r.value.canonical).toBe("1.5");
    expect(storedBnbToScaled("1.5000")).toBe(15n * 10n ** 17n);
    // numeric(38,18) zero-padded storage strings parse exactly too.
    expect(storedBnbToScaled("0.000010000000000000")).toBe(10n ** 13n);
    expect(storedBnbToScaled("2")).toBe(2n * 10n ** 18n);
  });

  test("zero parses exactly as 0 wei (the route rejects it); empty is invalid", () => {
    for (const v of ["0", "0.0", "0.000000000000000000"]) {
      const r = parseBnbAmount(v);
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.value.scaled).toBe(0n);
    }
    expect(parseBnbAmount("").ok).toBe(false);
    // The smallest representable unit is exactly 1 wei.
    const dust = parseBnbAmount("0.000000000000000001");
    expect(dust.ok && dust.value.scaled).toBe(1n);
  });

  test("too-precise and too-large amounts are rejected, not mangled", () => {
    const precise = parseBnbAmount("0.0000000000000000001"); // 19 dp
    expect(precise.ok).toBe(false);
    if (!precise.ok) expect(precise.error).toMatch(/smallest unit/);
    const huge = parseBnbAmount("1000000000000000000000"); // 21 int digits
    expect(huge.ok).toBe(false);
    if (!huge.ok) expect(huge.error).toMatch(/too large/);
    // The old float path 500'd on this via numeric overflow.
    const maxOk = parseBnbAmount("99999999999999999999.999999999999999999");
    expect(maxOk.ok).toBe(true);
  });

  test("number inputs: plain decimals work, exponent forms are rejected", () => {
    const r = parseBnbAmount(0.00001);
    expect(r.ok && r.value.scaled).toBe(10n ** 13n);
    expect(parseBnbAmount(1e21).ok).toBe(false);
    expect(parseBnbAmount(1e-7).ok).toBe(false);
    expect(parseBnbAmount(-5).ok).toBe(false);
    expect(parseBnbAmount("abc").ok).toBe(false);
    expect(parseBnbAmount("1.5.2").ok).toBe(false);
  });

  test("exact comparison: 0.00002 > 0.00001 > stored 0.000009 at 4dp", () => {
    const a = parseBnbAmount("0.00002");
    const b = parseBnbAmount("0.00001");
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok) expect(a.value.scaled > b.value.scaled).toBe(true);
    // A legacy 4dp-stored top bid of 0.0000 (the old corruption) is zero:
    expect(storedBnbToScaled("0.0000")).toBe(0n);
  });
});

// ---------------------------------------------------------------------------
// Q4 — buy is one atomic statement
// ---------------------------------------------------------------------------
describe("Q4 buy", () => {
  test("happy path: single conditional-claim statement, no split writes", async () => {
    selectImpl = (t) => (t === "nfts" ? [nftRow()] : []);
    executeImpl = () => [purchaseRaw()];
    const res = await post(`/api/marketplace/nfts/${NFT_ID}/buy`, {});
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.purchase.buyerId).toBe(BUYER);
    expect(body.purchase.sellerId).toBe(SELLER);
    expect(body.purchase.priceBnb).toBe("1.5000");
    expect(body.purchase.purchasedAt).toBe("2026-10-21T00:00:00.000Z");
    // Exactly one statement, and it is the gated claim chain.
    expect(executeCalls).toHaveLength(1);
    const sqlText = executeCalls[0].text;
    expect(sqlText).toMatch(/UPDATE "nfts"/);
    expect(sqlText).toMatch(/"listed" = true/);
    expect(sqlText).toMatch(/INSERT INTO "nft_purchases"/);
    expect(sqlText).toMatch(/UPDATE "nft_bids"/);
    // No check-then-act split writes remain on the trade path.
    expect(
      chainCalls.filter(
        (c) =>
          (c.op === "insert" && c.table === "nftPurchases") ||
          (c.op === "update" && c.table === "nfts")
      )
    ).toEqual([]);
  });

  test("lost race: claim returns nothing → 409 'just sold', no purchase", async () => {
    // Pre-checks pass (still listed, owned by the seller)…
    selectImpl = (t) => (t === "nfts" ? [nftRow()] : []);
    // …but the claim lands 0 rows, and the re-read shows someone else
    // now owns it.
    let selects = 0;
    selectImpl = (t) => {
      if (t !== "nfts") return [];
      selects += 1;
      return [nftRow(selects > 1 ? { ownerId: "buyer-2", listed: false } : {})];
    };
    executeImpl = () => [];
    const res = await post(`/api/marketplace/nfts/${NFT_ID}/buy`, {});
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.code).toBe("ALREADY_SOLD");
    expect(body.message).toMatch(/just sold/);
  });

  test("guards: unlisted → 400, self-buy → 400, missing → 404, anon → 401", async () => {
    selectImpl = (t) => (t === "nfts" ? [nftRow({ listed: false })] : []);
    expect((await post(`/api/marketplace/nfts/${NFT_ID}/buy`, {})).status).toBe(
      400
    );

    selectImpl = (t) => (t === "nfts" ? [nftRow({ ownerId: BUYER })] : []);
    const self = await post(`/api/marketplace/nfts/${NFT_ID}/buy`, {});
    expect(self.status).toBe(400);
    expect((await self.json()).code).toBe("SELF_BUY");

    selectImpl = () => [];
    expect((await post(`/api/marketplace/nfts/${NFT_ID}/buy`, {})).status).toBe(
      404
    );

    asUser(null);
    selectImpl = (t) => (t === "nfts" ? [nftRow()] : []);
    expect((await post(`/api/marketplace/nfts/${NFT_ID}/buy`, {})).status).toBe(
      401
    );
    expect(executeCalls).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Q3/Q7 — bid placement integrity (route level)
// ---------------------------------------------------------------------------
describe("Q3/Q7 place bid", () => {
  const bid = (amount: any) =>
    post(`/api/marketplace/nfts/${NFT_ID}/bids`, { amountBnb: amount });

  test("dust bid 0.00001 is stored exactly (never '0.0000')", async () => {
    selectImpl = (t) => (t === "nfts" ? [nftRow()] : []);
    executeImpl = () => [
      {
        id: BID_ID,
        nft_id: NFT_ID,
        bidder_id: BUYER,
        amount_bnb: "0.000010000000000000",
        status: "active",
        created_at: "2026-10-21T00:00:00.000Z",
        expires_at: null,
        swept_count: 0,
      },
    ];
    const res = await bid("0.00001");
    expect(res.status).toBe(201);
    expect(executeCalls).toHaveLength(1);
    // The value sent to the DB is the exact canonical amount.
    expect(executeCalls[0].params).toContain("0.00001");
    expect(executeCalls[0].params).not.toContain("0.0000");
    const body = await res.json();
    expect(storedBnbToScaled(body.bid.amountBnb)).toBe(10n ** 13n);
  });

  test("zero / too-precise / overflowing amounts → readable 400, never 500", async () => {
    selectImpl = (t) => (t === "nfts" ? [nftRow()] : []);
    for (const [amount, pattern] of [
      ["0", /more than 0/],
      ["0.0000000000000000001", /smallest unit/],
      ["1000000000000000000000", /too large/],
      ["not-a-number", /positive number/],
    ] as const) {
      const res = await bid(amount);
      expect(res.status).toBe(400);
      expect((await res.json()).message).toMatch(pattern);
    }
    expect(executeCalls).toHaveLength(0);
  });

  test("bid must exceed the stored top bid — equal is not enough", async () => {
    selectImpl = (t) => {
      if (t === "nfts") return [nftRow()];
      if (t === "nftBids") return [bidRow({ amountBnb: "2.5000" })];
      return [];
    };
    const res = await bid("2.5");
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("BID_TOO_LOW");
    expect(body.message).toMatch(/2\.5000/);
    expect(executeCalls).toHaveLength(0);
  });

  test("race: top bid raised between check and insert → 409, book uncorrupted", async () => {
    selectImpl = (t) => (t === "nfts" ? [nftRow()] : []);
    executeImpl = () => []; // the statement's own floor check rejected it
    const res = await bid("3");
    expect(res.status).toBe(409);
    expect((await res.json()).code).toBe("BID_TOO_LOW");
    // The single statement carries the floor condition + guarded sweep.
    const sqlText = executeCalls[0].text;
    expect(sqlText).toMatch(/MAX\("amount_bnb"\)/);
    expect(sqlText).toMatch(/"amount_bnb" </);
  });

  test("self-bid is blocked", async () => {
    selectImpl = (t) => (t === "nfts" ? [nftRow({ ownerId: BUYER })] : []);
    const res = await bid("1");
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("SELF_BID");
  });
});

// ---------------------------------------------------------------------------
// Q5 — accept / withdraw / reject conditional transitions
// ---------------------------------------------------------------------------
describe("Q5 accept bid", () => {
  test("happy path: one gated statement settles at the bid's stored amount", async () => {
    asUser(SELLER);
    selectImpl = (t) => {
      if (t === "nftBids") return [bidRow({ amountBnb: "0.00002" })];
      if (t === "nfts") return [nftRow()];
      return [];
    };
    executeImpl = () => [purchaseRaw({ price_bnb: "0.00002" })];
    const res = await post(`/api/marketplace/bids/${BID_ID}/accept`, {});
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.purchase.priceBnb).toBe("0.00002");
    expect(body.purchase.buyerId).toBe(BUYER);
    expect(executeCalls).toHaveLength(1);
    const sqlText = executeCalls[0].text;
    expect(sqlText).toMatch(/UPDATE "nft_bids" SET "status" = 'accepted'/);
    expect(sqlText).toMatch(/"status" = 'active'/);
    expect(sqlText).toMatch(/INSERT INTO "nft_purchases"/);
  });

  test("withdrawn in the same instant → 409 'just withdrawn'", async () => {
    asUser(SELLER);
    let bidSelects = 0;
    selectImpl = (t) => {
      if (t === "nftBids") {
        bidSelects += 1;
        return [bidRow(bidSelects > 1 ? { status: "withdrawn" } : {})];
      }
      if (t === "nfts") return [nftRow()];
      return [];
    };
    executeImpl = () => []; // claim chain produced no purchase
    const res = await post(`/api/marketplace/bids/${BID_ID}/accept`, {});
    expect(res.status).toBe(409);
    expect((await res.json()).message).toMatch(/just withdrawn/);
  });

  test("non-owner cannot accept → 403 and no statement runs", async () => {
    asUser("intruder-1");
    selectImpl = (t) => {
      if (t === "nftBids") return [bidRow()];
      if (t === "nfts") return [nftRow()];
      return [];
    };
    const res = await post(`/api/marketplace/bids/${BID_ID}/accept`, {});
    expect(res.status).toBe(403);
    expect(executeCalls).toHaveLength(0);
  });
});

describe("Q5 withdraw + reject", () => {
  test("withdraw happy path flips via the conditional update", async () => {
    selectImpl = (t) => (t === "nftBids" ? [bidRow()] : []);
    updateImpl = () => [bidRow({ status: "withdrawn" })];
    const res = await post(`/api/marketplace/bids/${BID_ID}/withdraw`, {});
    expect(res.status).toBe(200);
    expect((await res.json()).bid.status).toBe("withdrawn");
  });

  test("withdraw loses the race to accept → readable 409", async () => {
    selectImpl = (t) => (t === "nftBids" ? [bidRow()] : []);
    updateImpl = () => []; // conditional update matched 0 rows
    const res = await post(`/api/marketplace/bids/${BID_ID}/withdraw`, {});
    expect(res.status).toBe(409);
    expect((await res.json()).message).toMatch(/just accepted/);
  });

  test("reject loses its race → readable 409", async () => {
    asUser(SELLER);
    selectImpl = (t) => {
      if (t === "nftBids") return [bidRow()];
      if (t === "nfts") return [nftRow()];
      return [];
    };
    updateImpl = () => [];
    const res = await post(`/api/marketplace/bids/${BID_ID}/reject`, {});
    expect(res.status).toBe(409);
  });

  test("someone else's bid cannot be withdrawn → 403", async () => {
    asUser("intruder-1");
    selectImpl = (t) => (t === "nftBids" ? [bidRow()] : []);
    const res = await post(`/api/marketplace/bids/${BID_ID}/withdraw`, {});
    expect(res.status).toBe(403);
  });
});

// ---------------------------------------------------------------------------
// Q10 — saleState vocabulary + panel selection
// ---------------------------------------------------------------------------
describe("Q10 saleState alignment", () => {
  test("panel selection covers all four real combinations", () => {
    expect(nftDetailPanelFor("Sale", "owner-1", "owner-1")).toBe(
      "fixedPriceNFT"
    );
    expect(nftDetailPanelFor("Sale", "owner-1", "buyer-1")).toBe(
      "fixedPriceNFTBuyer"
    );
    expect(nftDetailPanelFor("NotForSale", "owner-1", "owner-1")).toBe(
      "nonNFT"
    );
    expect(nftDetailPanelFor("NotForSale", "owner-1", "buyer-1")).toBe(
      "nonNFTBuyer"
    );
    // Logged-out / unknown viewer is always a buyer-side panel.
    expect(nftDetailPanelFor("Sale", "owner-1", null)).toBe(
      "fixedPriceNFTBuyer"
    );
    expect(nftDetailPanelFor("NotForSale", "owner-1", undefined)).toBe(
      "nonNFTBuyer"
    );
  });

  test("detail page + panels use only the canonical vocabulary and gates", () => {
    const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");
    const rightside = read("pages/marketplace/_components/nft.rightside.tsx");
    expect(rightside).not.toMatch(/auctionNFTBuyer/);
    expect(rightside).not.toMatch(/saleState === "Auction"/);
    expect(rightside).not.toMatch(/saleState === "List"/);
    expect(rightside).not.toMatch(/saleState === "NON"/);

    // The legacy chain entry points stay gated with a readable reason.
    const buyerPanel = read(
      "pages/marketplace/_components/fixed.price.nftbuyer.description.tsx"
    );
    expect(buyerPanel).toMatch(/isn't available for this item/);
    expect(buyerPanel).not.toMatch(/isCurrentMarketplaceOwner/);
    const ownerPanel = read(
      "pages/marketplace/_components/fixed.price.nft.description.tsx"
    );
    expect(ownerPanel).toMatch(/available for\s+marketplace\s+items yet/);
    expect(ownerPanel).not.toMatch(/isCurrentMarketplaceOwner/);
    expect(ownerPanel).not.toMatch(/Migrate NFT/);
    const nonOwner = read(
      "pages/marketplace/_components/non.nft.description.tsx"
    );
    expect(nonOwner).toMatch(/available for\s+marketplace\s+items/);
    expect(nonOwner).not.toMatch(/useGetApprovedForAll/);
    const nonBuyer = read(
      "pages/marketplace/_components/non.nftbuyer.description.tsx"
    );
    expect(nonBuyer).toMatch(/listed for sale/);
    expect(nonBuyer).not.toMatch(/isCurrentMarketplaceOwner/);
    expect(nonBuyer).toMatch(/saleState === "NotForSale"/);

    const tradePanel = read(
      "pages/marketplace/_components/nft.trade.panel.tsx"
    );
    expect(tradePanel).toMatch(/saleState === "Sale"/);
    expect(tradePanel).not.toMatch(/saleState === "List"/);
  });
});

// ---------------------------------------------------------------------------
// Q13 — committed RPC key removed
// ---------------------------------------------------------------------------
describe("Q13 RPC key", () => {
  test("no keyed Chainstack URL remains in source; config reads the env var", () => {
    const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");
    for (const p of [
      "web3/blockchain/config.ts",
      "web3/context/web3-modal.tsx",
    ]) {
      const src = read(p);
      expect(src).not.toMatch(/core\.chainstack\.com\/[0-9a-f]{16,}/);
      expect(src).not.toContain("bfa8949f46986d75815e86ab166ce3ea");
    }
    const config = read("web3/blockchain/config.ts");
    expect(config).toMatch(/NEXT_PUBLIC_CHAINSTACK_RPC_URL/);
    // Keyless fallback so an unset env var can't crash unrelated pages.
    expect(config).toMatch(/rpc\.sepolia\.org/);
    const modal = read("web3/context/web3-modal.tsx");
    expect(modal).toMatch(/BlockchainConfig\.rpcProvider/);
  });
});

export {};
