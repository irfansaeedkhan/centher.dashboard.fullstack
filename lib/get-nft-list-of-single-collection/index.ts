import { CFSNFT, NFTSaleStateFilter, OrderDirection } from "@/models/nft";
import { axiosCFS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export const getNFTListOfSingleCollection = async ({
  collection_address,
  orderDir = "desc",
  saleState = "All",
  limit = 15,
  skip = 0,
}: {
  collection_address: string;
  orderDir?: OrderDirection;
  saleState?: NFTSaleStateFilter;
  limit?: number;
  skip?: number;
}): Promise<CFSNFT[]> => {
  try {
    const { data } = await axiosCFS.get<{ nfts: CFSNFT[] }>(
      `/marketplace/nfts/${collection_address}`,
      {
        params: {
          first: limit,
          skip,
          orderDir,
          saleState,
        },
      }
    );
    return data.nfts;
  } catch (error: any) {
    throw new AppError(
      error,
      "Can not load NFTs",
      "getNFTListOfSingleCollection"
    );
  }
};
