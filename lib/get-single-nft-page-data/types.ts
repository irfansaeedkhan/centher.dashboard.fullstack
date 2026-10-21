import { CFSCollection, CFSNFT, NFTSaleState } from "@/models/nft";

interface CFSNFTBid {
  bidder: string;
  price: string;
  txTime: string;
  bidder_data: CFSNFT["owner_data"];
}

interface MarketplaceSaleHistory {
  id: string;
  collection: CFSCollection["id"];
  tokenId: CFSNFT["tokenId"];
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

export interface CFSNFTForPage extends Omit<CFSNFT, "saleState"> {
  /** Canonical DB-marketplace vocabulary (marketplace-grill Q10). */
  saleState: NFTSaleState;
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
    totalSupply: CFSCollection["totalSupply"];
  };
}
