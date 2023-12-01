import { axiosCFS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { CFSNFTForPage } from "./types";

export const getSingleNFTPageData = async ({
  collection_address,
  token_id,
}: {
  collection_address: string;
  token_id: string;
}): Promise<CFSNFTForPage> => {
  try {
    const response = await axiosCFS.get<CFSNFTForPage>(
      `/nfts/${collection_address}/${token_id}/page-data`
    );

    return response.data;
  } catch (error: any) {
    throw new AppError(error, "Can not load NFT", "getSingleNFTPageData");
  }
};
