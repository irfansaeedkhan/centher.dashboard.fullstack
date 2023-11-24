import { CFSCollection, Collection } from "@/models/nft";
import { axiosCFS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

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
    return response.data.collections;
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
    return response.data.collections;
  } catch (error: any) {
    throw new AppError(error, "Can not load Collections", "getHotCollections");
  }
};
