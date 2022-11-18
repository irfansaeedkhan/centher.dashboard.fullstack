export interface NFT {
  id: string;
  collection: string;
  tokenId: number;
  creator: string;
  createTime: number;
  ipfs: string;
  saleState: string;
  price: number;
  owner: string;
  endTime: number;
}

export interface Collection {
  id: string;
  collection: string;
  name: string;
  symbol: string;
  maxSupply: number;
  totalSupply: number;
  creator: string;
  ipfs: string;
  txTime: number;
}

export interface CollectionInfo {
  txTime: number;
  tradingVolumn: number;
  totalSupply: number;
  symbol: string;
  name: string;
  maxSupply: number;
  ipfs: string;
  creator: string;
  createHash: string;
  collection: string;
}

export const categories = [
  "all",
  "premium",
  "arts",
  "music",
  "sport",
  "entertainment",
  "gaming",
  "collectibles",
  "e-sport",
  "utility",
];
