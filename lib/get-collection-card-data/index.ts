import { CFSCollection } from "@/models/nft";
import { CollectionCardData } from "@/components/collection.card/collection-card-v2";
import { AppError } from "@/utils/app-error";
import {
  getOldName,
  isOld,
} from "@/web3/blockchain/helpers/native.collection.helper";

export const getCollectionCardData = (
  collection: CFSCollection
): CollectionCardData => {
  try {
    const name = isOld(collection.collection) ? getOldName() : collection.name;

    return {
      address: collection.id,
      name,
      profileImage: collection.ipfs_metadata.profileIPFSHash,
      coverImage: collection.ipfs_metadata.coverIPFSHash,
      description: collection.ipfs_metadata.description,
      creator: collection.creator_data,
    };
  } catch (error: any) {
    throw new AppError(
      error,
      "Can not load Collection Card Data",
      "getCollectionCardData"
    );
  }
};
