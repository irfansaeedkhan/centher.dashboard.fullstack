import axios from "axios";

import { NFT } from "@/models/nft";
import { NFTCardData } from "@/components/nft.card/nft.card.v2";
import { formatIPFSUrl } from "@/utils/format.address";
import { AppError } from "@/utils/app-error";
import { ZeroAddress } from "@/web3/constants/common";

import { getNFTOwnerData } from "../get-nft-owner-data";

export const getNFTCardData = async (nft: NFT): Promise<NFTCardData> => {
  try {
    const user = nft.owner !== ZeroAddress ? nft.owner : nft.creator;
    const nftOwnerDataPromise = getNFTOwnerData(user);
    const formattedUrl = formatIPFSUrl(nft.ipfs);
    const metadataPromise = axios.get(formattedUrl);
    const [nftOwnerData, metadata] = await Promise.all([
      nftOwnerDataPromise,
      metadataPromise,
    ]);

    const imageUrl = formatIPFSUrl(metadata.data.image);

    return {
      id: nft.id,
      collection: metadata.data.collection,
      tokenId: nft.tokenId,
      imageUrl,
      name: metadata.data.name,
      price: nft.price,
      owner: nftOwnerData,
      type: metadata.data.type,
    };
  } catch (error: any) {
    throw new AppError(error, "Can not load NFT Card Data", "getNFTCardData");
  }
};
