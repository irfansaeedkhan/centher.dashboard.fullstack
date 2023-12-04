import { CFSNFT, NFTSaleStateFilter } from "@/models/nft";
import { axiosCFS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export const getNFTListOfSingleOwnerFromAnyCollection = async ({
  owner_address,
  saleState = "All",
  limit = 15,
  skip = 0,
}: {
  owner_address: string;
  saleState?: NFTSaleStateFilter;
  limit?: number;
  skip?: number;
}): Promise<CFSNFT[]> => {
  try {
    const { data } = await axiosCFS.get<{ nfts: CFSNFT[] }>(
      `/nfts/owner/${owner_address}`,
      {
        params: {
          first: limit,
          skip,
          saleState,
        },
      }
    );
    return data.nfts;
  } catch (error: any) {
    throw new AppError(
      error,
      "Can not load NFTs",
      "getNFTListOfSingleOwnerFromAnyCollection"
    );
  }
};
