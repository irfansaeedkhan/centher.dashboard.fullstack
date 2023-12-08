import { CFSCollection } from "@/models/nft";
import { CollectionCardData } from "@/components/collection.card";
import { AppError } from "@/utils/app-error";

export const getCollectionCardData = (
  collection: CFSCollection
): CollectionCardData => {
  try {
    return {
      address: collection.id,
      name: collection.name,
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
