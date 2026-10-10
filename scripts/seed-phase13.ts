/**
 * Phase 13: NFT buy/bid/purchase demo seed (idempotent).
 *
 * Seeds a few purchases and bids on the seeded NFTs so the bid-history,
 * sale-history, and trading-activity views are not empty.
 *
 * IDEMPOTENCY: purchases keyed on (nftId, buyerId, sellerId, priceBnb);
 * bids keyed on (nftId, bidderId, amountBnb). Safe to re-run — no duplicates.
 * The NFT selection itself is ORDER BY id (see getNftIds) so positional
 * picks are stable across runs despite the ownership UPDATEs.
 *
 * Run: npx tsx scripts/seed-phase13.ts (requires DATABASE_URL / .env.local)
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { and, asc, eq } from "drizzle-orm";
import { db } from "../db";
import { nftBids, nftPurchases, nfts, user } from "../db/schema";

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@centher.io";

async function getUserIdByEmail(email: string): Promise<string | null> {
  const rows = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  return rows[0]?.id ?? null;
}

async function getNftIds(limit: number): Promise<string[]> {
  // ORDER BY id: the seed picks NFTs positionally ([nftA, nftB, nftC]), so
  // the selection must be stable across runs. A bare LIMIT without ORDER BY
  // returns physical row order, which the ownership UPDATEs below reshuffle
  // (Postgres creates new row versions) — the second run then picks
  // different NFTs and idempotency silently breaks. (Caught 2026-10-10:
  // two runs produced 3→5 purchases, 9→14 bids.)
  const rows = await db
    .select({ id: nfts.id })
    .from(nfts)
    .orderBy(asc(nfts.id))
    .limit(limit);
  return rows.map((r) => r.id);
}

// Idempotency keyed on (nftId, buyerId, sellerId, priceBnb).
async function ensurePurchase(
  nftId: string,
  buyerId: string,
  sellerId: string,
  priceBnb: string
): Promise<void> {
  const existing = await db
    .select({ id: nftPurchases.id })
    .from(nftPurchases)
    .where(
      and(
        eq(nftPurchases.nftId, nftId),
        eq(nftPurchases.buyerId, buyerId),
        eq(nftPurchases.sellerId, sellerId),
        eq(nftPurchases.priceBnb, priceBnb)
      )
    )
    .limit(1);
  if (existing[0]) return;
  await db.insert(nftPurchases).values({ nftId, buyerId, sellerId, priceBnb });
}

// Idempotency keyed on (nftId, bidderId, amountBnb, status).
async function ensureBid(
  nftId: string,
  bidderId: string,
  amountBnb: string,
  status: string
): Promise<void> {
  const existing = await db
    .select({ id: nftBids.id })
    .from(nftBids)
    .where(
      and(
        eq(nftBids.nftId, nftId),
        eq(nftBids.bidderId, bidderId),
        eq(nftBids.amountBnb, amountBnb),
        eq(nftBids.status, status)
      )
    )
    .limit(1);
  if (existing[0]) return;
  await db.insert(nftBids).values({ nftId, bidderId, amountBnb, status });
}

async function main() {
  console.error("Seeding Phase 13 NFT trading demo data…");

  const demoId = await getUserIdByEmail(DEMO_EMAIL);
  if (!demoId)
    throw new Error(`Demo user ${DEMO_EMAIL} not found — run seed.ts first`);

  const ids: Record<string, string> = { demo: demoId };
  for (const email of [
    "leo.park@centher.io",
    "nina.ross@centher.io",
    "omar.hassan@centher.io",
    "sofia.blake@centher.io",
    "kai.mendez@centher.io",
  ]) {
    const id = await getUserIdByEmail(email);
    if (id) ids[email.split("@")[0].replace(".", "_")] = id;
  }
  const leo = ids["leo_park"];
  const nina = ids["nina_ross"];
  const omar = ids["omar_hassan"];
  const sofia = ids["sofia_blake"];
  const kai = ids["kai_mendez"];
  if (!leo || !nina || !omar || !sofia || !kai)
    throw new Error("Seeded users missing — run seed-phase12.ts first");

  const nftIds = await getNftIds(6);
  if (nftIds.length < 3)
    throw new Error("Seeded NFTs missing — run seed-phase12.ts first");
  const [nftA, nftB, nftC] = nftIds;

  // Purchases: demo bought nftA from leo; demo sold nftB to nina.
  await ensurePurchase(nftA, demoId, leo, "1.5000");
  await ensurePurchase(nftB, nina, demoId, "0.7500");

  // Keep the NFTs' ownership/listing state consistent with the history
  // above (Judge F3): a recorded purchase must be reflected on the NFT row,
  // otherwise the detail page would show the wrong owner / "Buy Now".
  await db
    .update(nfts)
    .set({ ownerId: demoId, listed: false })
    .where(eq(nfts.id, nftA));
  await db
    .update(nfts)
    .set({ ownerId: nina, listed: false })
    .where(eq(nfts.id, nftB));

  // Bids on nftC: a small bid book with mixed statuses.
  await ensureBid(nftC, demoId, "0.4000", "outbid");
  await ensureBid(nftC, omar, "0.6000", "active");
  await ensureBid(nftC, sofia, "0.4500", "withdrawn");
  await ensureBid(nftC, kai, "0.3000", "rejected");

  // One active bid on nftA for the demo account to accept/withdraw in tests.
  await ensureBid(nftA, nina, "2.0000", "active");

  const purchaseCount = await db
    .select({ id: nftPurchases.id })
    .from(nftPurchases);
  const bidCount = await db.select({ id: nftBids.id }).from(nftBids);
  console.error(
    `Phase 13 seed done: purchases=${purchaseCount.length} bids=${bidCount.length}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
