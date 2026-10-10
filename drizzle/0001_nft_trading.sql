-- Phase 13: NFT buy/bid/purchase tracking (additive, idempotent).
-- New tables only; no existing tables are altered.

CREATE TABLE IF NOT EXISTS "nft_purchases" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "nft_id" uuid NOT NULL REFERENCES "nfts"("id") ON DELETE CASCADE,
  "buyer_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "seller_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "price_bnb" numeric(18, 4) NOT NULL,
  "tx_hash" text,
  "purchased_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "nft_bids" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "nft_id" uuid NOT NULL REFERENCES "nfts"("id") ON DELETE CASCADE,
  "bidder_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "amount_bnb" numeric(18, 4) NOT NULL,
  "status" text NOT NULL DEFAULT 'active',
  "created_at" timestamp NOT NULL DEFAULT now(),
  "expires_at" timestamp
);

CREATE INDEX IF NOT EXISTS "nft_purchases_nft_id_idx" ON "nft_purchases" ("nft_id");
CREATE INDEX IF NOT EXISTS "nft_purchases_buyer_id_idx" ON "nft_purchases" ("buyer_id");
CREATE INDEX IF NOT EXISTS "nft_purchases_seller_id_idx" ON "nft_purchases" ("seller_id");
CREATE INDEX IF NOT EXISTS "nft_bids_nft_id_idx" ON "nft_bids" ("nft_id");
CREATE INDEX IF NOT EXISTS "nft_bids_bidder_id_idx" ON "nft_bids" ("bidder_id");
