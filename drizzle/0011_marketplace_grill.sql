-- Marketplace-grill fixes (2026-10-21): exact BNB amounts.
--
-- Q7/Q3: bid/purchase/price columns were numeric(18,4), so a bid of
-- 0.00001 BNB was silently rounded to "0.0000" in storage while still
-- outbidding the real top bid, and >14-integer-digit amounts overflowed
-- into a raw 500. Widening to numeric(38,18) (20 integer digits, full
-- wei precision) is lossless for existing rows — Postgres casts numeric
-- values exactly — and lets the API store amounts without rounding.
-- Idempotent: each ALTER only runs while the column is still (18,4).

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nfts' AND column_name = 'price'
      AND (numeric_precision <> 38 OR numeric_scale <> 18)
  ) THEN
    ALTER TABLE "nfts" ALTER COLUMN "price" TYPE numeric(38, 18);
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nft_purchases' AND column_name = 'price_bnb'
      AND (numeric_precision <> 38 OR numeric_scale <> 18)
  ) THEN
    ALTER TABLE "nft_purchases" ALTER COLUMN "price_bnb" TYPE numeric(38, 18);
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nft_bids' AND column_name = 'amount_bnb'
      AND (numeric_precision <> 38 OR numeric_scale <> 18)
  ) THEN
    ALTER TABLE "nft_bids" ALTER COLUMN "amount_bnb" TYPE numeric(38, 18);
  END IF;
END $$;
