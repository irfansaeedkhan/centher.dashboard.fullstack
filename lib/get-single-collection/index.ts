import { CFSCollection } from "@/models/nft";
import { axiosCFS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import {
  getOldName,
  isOld,
} from "@/web3/blockchain/helpers/native.collection.helper";

export const getSingleCollection = async (
  collection_address: string
): Promise<CFSCollection> => {
  try {
    const response = await axiosCFS.get<CFSCollection>(
      `/nfts/collections/${collection_address}`
    );

    if (isOld(response.data.collection)) {
      response.data.name = getOldName();
    }

    return response.data;
  } catch (error: any) {
    throw new AppError(error, "Can not load Collection", "getSingleCollection");
  }
};
