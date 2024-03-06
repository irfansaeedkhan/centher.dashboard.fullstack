import { User } from "./user";

export interface CollectionAdditionalInfo {
  listedPercent: number;
  minPrice: number;
}

export interface CFSCollection {
  id: string;
  collection: string;
  name: string;
  symbol: string;
  maxSupply: string;
  totalSupply: string;
  creator: string;
  ipfs: string;
  txTime: string;
  createHash: string;
  tradingVolumn: string;
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
    profile_image: User["profile_image"];
    membership: User["membership"];
  };
}

export interface CFSNFT {
  collection: string;
  createTime: string;
  creator: string;
  mintHash: string;
  id: string;
  ipfs: string;
  saleState: string;
  tokenId: string;
  price: string;
  owner: string;
  unlock: string;
  listInfo: {
    price: string;
    bidSize: number;
  };
  auctionInfo: {
    endTime: string;
    highestBidPrice: string;
    highestBidAddress: string;
    bidSize: number;
    startPrice: string;
  };
  ipfs_metadata: {
    name: string;
    description: string;
    supply: number;
    image: string;
    type: string;
    collection: string;
    attributes: {
      Type: string;
      PropertyName: string;
    }[];
    videoThumbnail?: string | null;
  };
  creator_data: {
    _id: User["_id"];
    display_name: User["display_name"];
    profile_image: User["profile_image"];
    membership: User["membership"];
  };
  owner_data: {
    _id: User["_id"];
    display_name: User["display_name"];
    profile_image: User["profile_image"];
    membership: User["membership"];
    is_registered: boolean;
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

export const orderBy = ["createTime", "tradingVolumn", "price"];

export type OrderBy = "price" | "tradingVolumn" | "createTime";

export type OrderDirection = "desc" | "asc";

export type NFTSaleStateFilter = "All" | "List" | "Auction" | "NON";
