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
      `/nfts/collections?first=${limit}&skip=${skip}`
    );
    return response.data.collections.map((collection) => {
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
      `/nfts/hot-collections?first=${limit}&skip=${skip}`
    );
    return response.data.collections.map((collection) => {
      if (isOld(collection.collection)) {
        collection.name = getOldName();
      }
      return collection;
    });
  } catch (error: any) {
    throw new AppError(error, "Can not load Collections", "getHotCollections");
  }
};
