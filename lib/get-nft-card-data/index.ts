import { CFSNFT } from "@/models/nft";
import { NFTCardData } from "@/components/nft.card";
import { AppError } from "@/utils/app-error";

export const getNFTCardData = (nft: CFSNFT): NFTCardData => {
  try {
    return {
      id: nft.id,
      collection: nft.ipfs_metadata.collection,
      tokenId: nft.tokenId,
      imageUrl: nft.ipfs_metadata.image,
      videoThumbnail: nft.ipfs_metadata.videoThumbnail,
      name: nft.ipfs_metadata.name,
      description: nft.ipfs_metadata.description,
      price: nft.price,
      owner: nft.owner_data,
      creator: nft.creator_data,
      mintHash: nft.mintHash,
      type: nft.ipfs_metadata.type,
      unlock: nft.unlock,
      endTime: nft.saleState === "Auction" ? nft.auctionInfo.endTime : "0",
    };
  } catch (error: any) {
    throw new AppError(error, "Can not load NFT Card Data", "getNFTCardData");
  }
};
