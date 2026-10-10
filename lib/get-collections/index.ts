import { CFSCollection } from "@/models/nft";
import { axiosCFS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import {
  getOldName,
  isOld,
} from "@/web3/blockchain/helpers/native.collection.helper";

export const getCollections = async ({
  limit = 15,
  skip = 0,
}: {
  limit?: number;
  skip?: number;
}): Promise<CFSCollection[]> => {
  try {
    const response = await axiosCFS.get<{ collections: CFSCollection[] }>(
      `/api/marketplace/collections`,
      {
        params: {
          first: limit,
          skip,
        },
      }
    );
    return (response.data.collections ?? []).map((collection) => {
      if (isOld(collection.collection)) {
        collection.name = getOldName();
      }
      return collection;
    });
  } catch (error: any) {
    throw new AppError(error, "Can not load Collections", "getCollections");
  }
};

export const getHotCollections = async ({
  limit = 15,
  skip = 0,
}: {
  limit?: number;
  skip?: number;
}): Promise<CFSCollection[]> => {
  try {
    const response = await axiosCFS.get<{ collections: CFSCollection[] }>(
      `/api/marketplace/collections/hot-collections`,
      {
        params: {
          first: limit,
          skip,
        },
      }
    );
    return (response.data.collections ?? []).map((collection) => {
      if (isOld(collection.collection)) {
        collection.name = getOldName();
      }
      return collection;
    });
  } catch (error: any) {
    throw new AppError(error, "Can not load Collections", "getHotCollections");
  }
};
