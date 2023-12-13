import { CFSNFT } from "@/models/nft";
import { NFTCardData } from "@/components/nft.card";
import { NFTImageCardData } from "@/components/nft.image.card/types";

export const getNFTCardData = (nft: CFSNFT): NFTCardData => {
  return {
    id: nft.id,
    collection: nft.ipfs_metadata.collection,
    tokenId: nft.tokenId,
    imageUrl: nft.ipfs_metadata.image,
    videoThumbnail: nft.ipfs_metadata.videoThumbnail,
    name: nft.ipfs_metadata.name,
    description: nft.ipfs_metadata.description,
    price: nft.price,
    owner: nft.owner,
    creator: nft.creator,
    mintHash: nft.mintHash,
    type: nft.ipfs_metadata.type,
    unlock: nft.unlock,
    endTime: nft.saleState === "Auction" ? nft.auctionInfo.endTime : "0",
    creator_data: nft.creator_data,
    owner_data: nft.owner_data,
    ipfs_metadata: nft.ipfs_metadata,
  };
};

export const getNFTImageCardData = (nft: CFSNFT): NFTImageCardData => {
  return {
    id: nft.id,
    collection: nft.collection,
    tokenId: nft.tokenId,
    creator: nft.creator,
    createTime: nft.createTime,
    ipfs: nft.ipfs,
    saleState: nft.saleState,
    owner: nft.owner,
    endTime: nft.saleState === "Auction" ? nft.auctionInfo.endTime : "0",
    unlock: nft.unlock,
    mintHash: nft.mintHash,
    owner_data: nft.owner_data,
    creator_data: nft.creator_data,
    ipfs_metadata: nft.ipfs_metadata,
    external: false,
  };
};
