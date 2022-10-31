import { IProperty } from "@/pages/nfts/_components/create.nft.form";
import { nftQuery, saleQuery } from "@/subgraph/querys";
import useRefresh from "@/web3/hooks/use.refresh";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
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
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const fetchNFTData = async (collection: string, tokenId: number) => {
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
        cache: new InMemoryCache(),
      });
      const { data: nftResult } = await client.query({
        query: gql(nftQuery),
        variables: {
          collection: collection,
          tokenId: tokenId,
        },
        fetchPolicy: "cache-first",
      });

      const { data: listResult } = await client.query({
        query: gql(saleQuery),
        variables: {
          collection: collection,
          tokenId: tokenId,
        },
        fetchPolicy: "cache-first",
      });

      const _priceHistories = listResult.marketplaceSaleHistories.filter(
        (item: any) => {
          return (
            item.type === "BuyItem" ||
            item.type === "AcceptBid" ||
            item.type === "EndAuction"
          );
        }
      );
      if (nftResult.nfts && nftResult.nfts.length > 0) {
        const metadata = await axios.get(nftResult.nfts[0].ipfs);
        const _nftData: INFTDetailData = {
          name: metadata.data.name,
          image: metadata.data.image,
          nftId: nftResult.nfts[0].tokenId,
          mintTx: nftResult.nfts[0].mintHash,
          collection: nftResult.nfts[0].collection,
          attributes: metadata.data.attributes,
          creator: nftResult.nfts[0].creator,
          owner: nftResult.nfts[0].creator,
          collectionName: metadata.data.collectionName,
          saleState: nftResult.nfts[0].saleState,
          description: metadata.data.description,
          listInfo: nftResult.nfts[0].listInfo,
          auctionInfo: nftResult.nfts[0].auctionInfo,
          listingHistory: listResult.marketplaceSaleHistories,
          priceHistory: _priceHistories,
        };
        setNftData(_nftData);
      }
    };

    if ((collection as string) && tokenId) {
      fetchNFTData(collection as string, Number(tokenId as string));
    }
  }, [collection, tokenId, fastRefresh, reload]);
  return nftData;
};
