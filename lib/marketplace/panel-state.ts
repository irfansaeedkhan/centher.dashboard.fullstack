import { eqAddress } from "@/lib/chat/utils";
import type { NFTSaleState } from "@/models/nft";

/** Description panels on the NFT detail page (marketplace-grill Q10). */
export type NftDetailPanel =
  | "fixedPriceNFT"
  | "fixedPriceNFTBuyer"
  | "nonNFT"
  | "nonNFTBuyer";

/**
 * Which description panel the NFT detail page shows. The DB marketplace
 * has exactly two sale states (canonical `NFTSaleState`), so the result
 * is always one of the four real panels — the old page branched on the
 * legacy "List"/"Auction"/"NON" vocabulary the API never emitted, and
 * its initial state matched no render branch at all.
 */
export function nftDetailPanelFor(
  saleState: NFTSaleState,
  ownerId: string,
  viewerId: string | null | undefined
): NftDetailPanel {
  const isOwner = Boolean(viewerId && eqAddress(viewerId, ownerId));
  if (saleState === "Sale")
    return isOwner ? "fixedPriceNFT" : "fixedPriceNFTBuyer";
  return isOwner ? "nonNFT" : "nonNFTBuyer";
}
