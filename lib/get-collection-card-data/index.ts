import axios from "axios";

import { Collection } from "@/models/nft";
import { CollectionCardData } from "@/components/collection.card/collection-card-v2";
import { formatIPFSUrl } from "@/utils/format.address";
import { AppError } from "@/utils/app-error";

import { getCollectionCreatorData } from "../get-collection-creator-data";

export const getCollectionCardData = async (
  collection: Collection
): Promise<CollectionCardData> => {
  try {
    const nftCreatorDataPromise = getCollectionCreatorData(collection.creator);
    const formattedUrl = formatIPFSUrl(collection.ipfs);
    const metadataPromise = axios.get(formattedUrl);
    const [nftCreatorData, metadata] = await Promise.all([
      nftCreatorDataPromise,
      metadataPromise,
    ]);

    const profileImage = formatIPFSUrl(metadata.data.profileIPFSHash);
    const coverImage = formatIPFSUrl(metadata.data.coverIPFSHash);

    return {
      address: collection.id,
      name: collection.name,
      profileImage,
      coverImage,
      description: metadata.data.description,
      creator: nftCreatorData,
    };
  } catch (error: any) {
    throw new AppError(
      error,
      "Can not load Collection Card Data",
      "getCollectionCardData"
    );
  }
};
