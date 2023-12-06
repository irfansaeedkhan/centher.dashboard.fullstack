import { CFSNFT } from "@/models/nft";

export interface NFTImageCardData {
  id: CFSNFT["id"];
  collection: CFSNFT["collection"];
  tokenId: CFSNFT["tokenId"];
  creator: CFSNFT["creator"];
  owner: CFSNFT["owner"];
  mintHash: CFSNFT["mintHash"];
  createTime: CFSNFT["createTime"];
  ipfs: CFSNFT["ipfs"];
  saleState: CFSNFT["saleState"];
  price: CFSNFT["price"];
  endTime: string;
  unlock: CFSNFT["unlock"];
  ipfs_metadata: CFSNFT["ipfs_metadata"];
  owner_data: CFSNFT["owner_data"];
  creator_data: CFSNFT["creator_data"];
  external?: boolean;
}
