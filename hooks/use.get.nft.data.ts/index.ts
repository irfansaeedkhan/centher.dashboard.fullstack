import { IProperty } from "@/pages/marketplace/_components/create.nft.form";
import { formatIPFSUrl } from "@/utils/format.address";
import { BlockchainRead } from "@/web3/blockchain";
import axios from "axios";
import { useEffect, useState } from "react";

export interface IListHistory {
  type:
    | "ListForSale"
    | "EditForSale"
    | "CancelForSale"
    | "CreateAuction"
    | "CancelAuction"
    | "BuyItem"
    | "AcceptBid"
    | "EndAuction";
  txTime: number;
  seller: string;
  buyer: string;
  price: number;
}
export interface IBid {
  price: number;
  bidder: string;
  txTime: number;
}
export interface IAuctionInfo {
  bidSize: number;
  endTime: number;
  highestBidAddress: string;
  highestBidPrice: number;
  startPrice: number;
  bids: IBid[];
}
export interface IListInfo {
  bidSize: number;
  price: number;
  bids: IBid[];
}

export interface INFTDetailData {
  name: string;
  image: string;
  nftId: number;
  type: string;
  mintTx: string;
  collection: string;
  attributes: IProperty[];
  creator: string;
  owner: string;
  collectionName: string;
  saleState: "Auction" | "List" | "NON";
  description: string;
  listInfo: IListInfo;
  auctionInfo: IAuctionInfo;
  listingHistory: IListHistory[];
  priceHistory: IListHistory[];
}
export const useGetNftData = (
  collection: string | string[] | undefined,
  tokenId: string | string[] | undefined,
  reload: boolean
) => {
  const [nftData, setNftData] = useState<INFTDetailData>();

  useEffect(() => {
    const fetchNFTData = async (collection: string, tokenId: number) => {
      const nftResult = await BlockchainRead.getNft(collection, tokenId);
      const listResult = await BlockchainRead.getSaleHistory(
        collection,
        tokenId
      );

      const _priceHistories = listResult.filter((item: any) => {
        return (
          item.type === "BuyItem" ||
          item.type === "AcceptBid" ||
          item.type === "EndAuction"
        );
      });
      if (nftResult) {
        const metadata = await axios.get(formatIPFSUrl(nftResult.ipfs));
        const _nftData: INFTDetailData = {
          name: metadata.data.name,
          image: formatIPFSUrl(metadata.data.image),
          nftId: nftResult.tokenId,
          type: metadata.data.type,
          mintTx: nftResult.mintHash,
          collection: nftResult.collection,
          attributes: metadata.data.attributes,
          creator: nftResult.creator,
          owner: nftResult.owner,
          collectionName: metadata.data.collectionName,
          saleState: nftResult.saleState,
          description: metadata.data.description,
          listInfo: nftResult.listInfo,
          auctionInfo: nftResult.auctionInfo,
          listingHistory: listResult,
          priceHistory: _priceHistories,
        };
        setNftData(_nftData);
      }
    };

    if ((collection as string) && tokenId) {
      fetchNFTData(collection as string, Number(tokenId as string));
    }
  }, [collection, tokenId, reload]);
  return nftData;
};
