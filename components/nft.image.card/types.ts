import { CFSNFT } from "@/models/nft";

export interface NFTImageCardData {
  id: CFSNFT["id"];
  collection: CFSNFT["collection"];
  tokenId: CFSNFT["tokenId"];
  creator: CFSNFT["creator"];
  owner: CFSNFT["owner"];
  mintHash: CFSNFT["mintHash"] | undefined;
  createTime: CFSNFT["createTime"] | undefined;
  ipfs: CFSNFT["ipfs"];
  saleState: CFSNFT["saleState"];
  endTime: string;
  unlock: CFSNFT["unlock"];
  ipfs_metadata: Partial<CFSNFT["ipfs_metadata"]>;
  owner_data: CFSNFT["owner_data"];
  creator_data: CFSNFT["creator_data"];
  external?: boolean;
}
