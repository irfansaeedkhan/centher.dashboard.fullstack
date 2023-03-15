import { TopCreator } from "@/models/top-creator";
import { AppError } from "@/utils/app-error";
import { BlockchainRead } from "@/web3/blockchain";

const MAX_TOP_CREATORS = 10;

export const getTopCreators = async (): Promise<TopCreator[]> => {
  try {
    const result = await BlockchainRead.getTopCreator(MAX_TOP_CREATORS, 0);
    return result;
  } catch (error: any) {
    throw new AppError(error, "Can not load Top Creators", "getTopCreators");
  }
};
