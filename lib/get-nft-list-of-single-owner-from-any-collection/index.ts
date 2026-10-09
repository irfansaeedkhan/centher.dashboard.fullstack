import { axiosCFS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";
import { NFTImageCardData } from "@/components/nft.image.card/types";

export interface GetNFTListOfSingleOwnerFromAnyCollectionResponse {
  nfts: NFTImageCardData[];
  cursor: string;
}

export const getNFTListOfSingleOwnerFromAnyCollection = async ({
  owner_address,
  limit = 50,
  cursor,
}: {
  owner_address: string;
  limit?: number;
  cursor?: string | null;
}): Promise<GetNFTListOfSingleOwnerFromAnyCollectionResponse> => {
  try {
    const { data } =
      await axiosCFS.get<GetNFTListOfSingleOwnerFromAnyCollectionResponse>(
        `/api/marketplace/nfts/owner/${owner_address}`,
        {
          params: {
            limit,
            cursor,
          },
        }
      );
    return data;
  } catch (error: any) {
    throw new AppError(
      error,
      "Can not load NFTs",
      "getNFTListOfSingleOwnerFromAnyCollection"
    );
  }
};
