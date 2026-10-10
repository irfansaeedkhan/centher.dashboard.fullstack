import { CFSNFT } from "@/models/nft";
import { AppError } from "@/utils/app-error";
import { axiosCFS } from "@/utils/axios";

export const getHotNFTs = async ({
  limit = 15,
  skip = 0,
}: {
  limit?: number;
  skip?: number;
}): Promise<CFSNFT[]> => {
  try {
    const { data } = await axiosCFS.get<{
      nfts: CFSNFT[];
    }>(`/api/marketplace/nfts/hot-nfts`, {
      params: {
        first: limit,
        skip,
      },
    });

    return data.nfts ?? [];
  } catch (error: any) {
    throw new AppError(error, "Can not load NFTs", "getHotNFTs");
  }
};
