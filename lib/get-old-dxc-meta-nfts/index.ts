import { CFSNFT } from "@/models/nft";
import { axiosCFS } from "@/utils/axios";
import { AppError } from "@/utils/app-error";

export interface OldDXCMetaNFT {
  id: CFSNFT["id"];
  tokenId: CFSNFT["tokenId"];
  collection: CFSNFT["collection"];
  owner: CFSNFT["owner"];
  ipfs: CFSNFT["ipfs"];
  ipfs_metadata: CFSNFT["ipfs_metadata"] | null;
}

export const getOldDXCMetaNFTs = async (): Promise<OldDXCMetaNFT[]> => {
  try {
    const { data } = await axiosCFS.get<{
      nfts: OldDXCMetaNFT[];
    }>(`/api/marketplace/nfts/old-dxc-meta-nfts`);
    return data.nfts ?? [];
  } catch (error: any) {
    const errorMessage = "Failed to fetch old DXC meta NFTs";
    if (error.response?.status === 500) {
      throw new AppError(error, errorMessage, "getOldDXCMetaNFTs");
    } else {
      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "getOldDXCMetaNFTs"
      );
    }
  }
};
