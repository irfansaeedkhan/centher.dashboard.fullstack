-- Phase 14: NFT media expansion (additive, idempotent)
ALTER TABLE collections ADD COLUMN IF NOT EXISTS banner_url text;
ALTER TABLE nfts ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image';
ALTER TABLE nfts ADD COLUMN IF NOT EXISTS animation_url text;
