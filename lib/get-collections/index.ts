import { Collection } from "@/models/nft";
import { AppError } from "@/utils/app-error";
import { BlockchainRead } from "@/web3/blockchain";

export const getCollections = async ({
  limit = 15,
  skip = 0,
}: {
  limit?: number;
  skip?: number;
}): Promise<Collection[]> => {
  try {
    const result = await BlockchainRead.getAllCollections(limit, skip);
    return result;
  } catch (error: any) {
    throw new AppError(error, "Can not load Collections", "getCollections");
  }
};
