import { CFSNFT, Collection, NFT } from "@/models/nft";

interface CFSNFTBid {
  bidder: string;
  price: string;
  txTime: string;
  bidder_data: CFSNFT["owner_data"];
}

interface MarketplaceSaleHistory {
  id: string;
  collection: Collection["id"];
  tokenId: NFT["tokenId"];
  type:
    | "AcceptBid"
    | "BuyItem"
    | "CancelAuction"
    | "CancelForSale"
    | "CreateAuction"
    | "EditForSale"
    | "EndAuction"
    | "ListForSale"
    | "TransferOwnerShip";
  price: string;
  seller: string;
  buyer: string;
  txTime: string;
}

export interface CFSNFTForPage extends CFSNFT {
  listInfo: CFSNFT["listInfo"] & {
    bids: CFSNFTBid[];
  };
  auctionInfo: CFSNFT["auctionInfo"] & {
    bids: CFSNFTBid[];
  };
  marketplaceSaleHistory: {
    id: MarketplaceSaleHistory["id"];
    type: MarketplaceSaleHistory["type"];
    txTime: MarketplaceSaleHistory["txTime"];
    seller: MarketplaceSaleHistory["seller"];
    price: MarketplaceSaleHistory["price"];
    buyer: MarketplaceSaleHistory["buyer"];
    buyer_data: CFSNFT["owner_data"];
    seller_data: CFSNFT["owner_data"];
  }[];
  collectionInfo: {
    totalSupply: Collection["totalSupply"];
  };
}
