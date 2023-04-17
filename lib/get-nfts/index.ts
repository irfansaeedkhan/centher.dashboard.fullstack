import { NFT } from "@/models/nft";
import { AppError } from "@/utils/app-error";
import { BlockchainRead } from "@/web3/blockchain";

export const getNFTs = async ({
  limit = 15,
  skip = 0,
}: {
  limit?: number;
  skip?: number;
}): Promise<NFT[]> => {
  try {
    let nfts: NFT[] = [];
    const result = await BlockchainRead.getHotNFT(limit, skip);
    if (result?.length) {
      nfts = result.map((item: any): NFT => {
        let _endTime = 0;
        if (item.saleState === "Auction") {
          _endTime = item.auctionInfo.endTime;
        }
        return {
          id: item.id,
          collection: item.collection,
          tokenId: item.tokenId,
          creator: item.creator,
          mintHash: item.mintHash,
          createTime: item.createTime,
          ipfs: item.ipfs,
          saleState: item.saleState,
          price: item.price,
          owner: item.owner,
          endTime: _endTime,
          unlock: item.unlock,
        };
      });
      return nfts;
    } else {
      return [];
    }
  } catch (error: any) {
    throw new AppError(error, "Can not load NFTs", "getNFTs");
  }
};
