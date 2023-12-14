import { CFSNFT } from "@/models/nft";
import { axiosCFS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export const getListedNFTListOfSingleOwnerFromAnyCollection = async ({
  owner_address,
  limit = 50,
  skip = 0,
}: {
  owner_address: string;
  limit?: number;
  skip?: number;
}): Promise<CFSNFT[]> => {
  try {
    const { data } = await axiosCFS.get<{ nfts: CFSNFT[] }>(
      `/marketplace/nfts/owner/${owner_address}/listed`,
      {
        params: {
          first: limit,
          skip,
        },
      }
    );
    return data.nfts;
  } catch (error: any) {
    throw new AppError(
      error,
      "Can not load NFTs",
      "getListedNFTListOfSingleOwnerFromAnyCollection"
    );
  }
};
