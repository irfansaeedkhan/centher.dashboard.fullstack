import { CFSCollection } from "@/models/nft";
import { axiosCFS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import {
  getOldName,
  isOld,
} from "@/web3/blockchain/helpers/native.collection.helper";

export const getCollectionListOfSingleCreator = async ({
  creator_address,
  limit = 15,
  skip = 0,
}: {
  creator_address: string;
  limit?: number;
  skip?: number;
}): Promise<CFSCollection[]> => {
  try {
    const response = await axiosCFS.get<{ collections: CFSCollection[] }>(
      `/marketplace/collections/creator/${creator_address}`,
      {
        params: {
          first: limit,
          skip,
        },
      }
    );
    return response.data.collections.map((collection) => {
      if (isOld(collection.collection)) {
        collection.name = getOldName();
      }
      return collection;
    });
  } catch (error: any) {
    throw new AppError(
      error,
      "Can not load Collections",
      "getCollectionListOfSingleCreator"
    );
  }
};
