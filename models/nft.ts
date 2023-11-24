import { User } from "./user";

export interface NFT {
  id: string;
  collection: string;
  tokenId: number;
  creator: string;
  owner: string;
  mintHash: string;
  createTime: number;
  ipfs: string;
  saleState: string;
  price: number;
  endTime: number;
  unlock: number;
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

export interface CollectionAdditionalInfo {
  listedPercent: number;
  minPrice: number;
  ownerIncome: number;
}

export interface CFSCollection {
  id: string;
  collection: string;
  name: string;
  symbol: string;
  maxSupply: number;
  totalSupply: number;
  creator: string;
  ipfs: string;
  txTime: number;
  ipfs_metadata: {
    name: string;
    symbol: string;
    description: string;
    totalsupply: {
      type: "BigNumber";
      hex: string;
    };
    url: string;
    category: Category;
    yoursite: string;
    facebook: string;
    twitter: string;
    profileIPFSHash: string;
    coverIPFSHash: string;
  };
  creator_data: {
    _id: User["_id"];
    display_name: User["display_name"];
    membership: User["membership"];
  };
}

export const categories = [
  "All",
  "Premium",
  "Arts",
  "Music",
  "Sport",
  "Entertainment",
  "Gaming",
  "Collectibles",
  "E-sport",
  "Metaverse",
  "Utility",
];

export type Category =
  | "all"
  | "premium"
  | "arts"
  | "music"
  | "sport"
  | "entertainment"
  | "gaming"
  | "collectibles"
  | "e-sport"
  | "metaverse"
  | "utility";

export const sortBy = [
  "recently created",
  "volume high to low",
  "volume low to high",
  "price high to low",
  "price low to high",
];

export type SortBy =
  | "recently created"
  | "volume high to low"
  | "volume low to high"
  | "price high to low"
  | "price low to high";

export type OrderDirection = "desc" | "asc";

export const orderBy = ["createTime", "tradingVolumn", "price"];

export type OrderBy = "price" | "tradingVolumn" | "createTime";
