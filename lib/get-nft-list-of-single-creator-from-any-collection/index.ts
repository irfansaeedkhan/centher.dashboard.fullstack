import { CFSNFT } from "@/models/nft";
import { axiosCFS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export const getNFTListOfSingleCreatorFromAnyCollection = async ({
  creator_address,
  limit = 50,
  skip = 0,
}: {
  creator_address: string;
  limit?: number;
  skip?: number;
}): Promise<CFSNFT[]> => {
  try {
    const { data } = await axiosCFS.get<{ nfts: CFSNFT[] }>(
      `/api/marketplace/nfts/creator/${creator_address}`,
      {
        params: {
          first: limit,
          skip,
        },
      }
    );
    return data.nfts ?? [];
  } catch (error: any) {
    throw new AppError(
      error,
      "Can not load NFTs",
      "getNFTListOfSingleCreatorFromAnyCollection"
    );
  }
};
