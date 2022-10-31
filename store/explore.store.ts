// React, Next, NPM Packages
import create from "zustand";
import { devtools } from "zustand/middleware";

// App imports
import { axiosNodeApi } from "@/utils/axios";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  allNFTsQuery,
  collectionsQuery,
  hotNFTsQuery,
} from "@/subgraph/querys";
import axios from "axios";

export interface ExploreStore {
  hotNFTs: NFT[];
  collections: Collection[];
  allNFTs: NFT[];
  fetchHotNFTs: (offset?: number, limit?: number) => Promise<void>;
  fetchCollections: (offset?: number, limit?: number) => Promise<void>;
  fetchAllNFTs: (offset?: number, limit?: number) => Promise<void>;
  allNFTsOffset: number;
  updateOffset: () => void;
  limit: number;
}

export const useExploreStore = create<ExploreStore>()(
  devtools(
    (set) => ({
      hotNFTs: [],
      collections: [],
      allNFTs: [],
      allNFTsOffset: 0,
      limit: 10,
      updateOffset: () =>
        set((state) => ({
          allNFTsOffset: state.allNFTs.length,
        })),

      fetchHotNFTs: async (offset, limit) => {
        try {
          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _hotNFTs: NFT[] = [];
          const {
            data: result,
            error,
            loading,
          } = await client.query({
            query: gql(hotNFTsQuery),
            variables: {
              first: limit,
              skip: offset,
            },
            fetchPolicy: "cache-first",
          });
          if (!loading) {
            if (result && !error) {
              _hotNFTs = result.nfts.map((item: any) => {
                let _price = 0,
                  _endTime = 0;
                if (item.saleState === "Auction") {
                  _price =
                    Number(item.auctionInfo.highestBidPrice) === 0
                      ? item.auctionInfo.startPrice
                      : item.auctionInfo.highestBidPrice;
                  _endTime = item.auctionInfo.endTime;
                } else {
                  _price = item.listInfo.price;
                }
                return {
                  id: item.id,
                  collection: item.collection,
                  tokenId: item.tokenId,
                  creator: item.creator,
                  createTime: item.createTime,
                  ipfs: item.ipfs,
                  saleState: item.saleState,
                  price: _price,
                  endTime: _endTime,
                };
              });
            }
          }

          set((state) => {
            return {
              hotNFTs: _hotNFTs,
            };
          });
        } catch (error) {
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },

      fetchCollections: async (offset, limit) => {
        try {
          const client = new ApolloClient({
            uri: `${process.env.NEXT_PUBLIC_THEGRAPH_URL}`,
            cache: new InMemoryCache(),
          });

          let _collections: Collection[] = [];
          const {
            data: result,
            error,
            loading,
          } = await client.query({
            query: gql(collectionsQuery),
            variables: {
              first: limit,
              skip: offset,
            },
            fetchPolicy: "cache-first",
          });

          if (!loading) {
            if (result && !error) {
              _collections = result.collections;
            }
          }

          set((state) => {
            return {
              collections: _collections,
            };
          });
        } catch (error) {
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },

      fetchAllNFTs: async (offset, limit) => {
        try {
          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _allNFTs: NFT[] = [];
          const {
            data: result,
            error,
            loading,
          } = await client.query({
            query: gql(allNFTsQuery),
            variables: {
              first: limit,
              skip: offset,
            },
            fetchPolicy: "cache-first",
          });
          if (!loading) {
            if (result && !error) {
              _allNFTs = result.nfts.map((item: any) => {
                let _price = 0,
                  _endTime = 0;
                if (item.saleState === "Auction") {
                  _price =
                    Number(item.auctionInfo.highestBidPrice) === 0
                      ? item.auctionInfo.startPrice
                      : item.auctionInfo.highestBidPrice;
                  _endTime = item.auctionInfo.endTime;
                } else {
                  _price = item.listInfo.price;
                }
                return {
                  id: item.id,
                  collection: item.collection,
                  tokenId: item.tokenId,
                  creator: item.creator,
                  createTime: item.createTime,
                  ipfs: item.ipfs,
                  saleState: item.saleState,
                  price: item.price,
                  endTime: _endTime,
                };
              });
            }
          }

          set((state) => {
            // Filter out all nfts that are already in the store
            const filteredAllNFTs = state.allNFTs.filter(
              (stateNFTs) =>
                !_allNFTs.some((nfts: NFT) => stateNFTs.id === nfts.id)
            );

            return {
              allNFTs: [..._allNFTs, ...filteredAllNFTs],
            };
          });
        } catch (error) {
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },
    }),
    { name: "ExploreStore" }
  )
);

export interface NFT {
  id: string;
  collection: string;
  tokenId: number;
  creator: string;
  createTime: number;
  ipfs: string;
  saleState: string;
  price: number;
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
