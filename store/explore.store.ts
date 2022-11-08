// React, Next, NPM Packages
import create from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";

// App imports
import { axiosNodeApi } from "@/utils/axios";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  allNFTsQuery,
  collectionsQuery,
  hotNFTsQuery,
} from "@/subgraph/querys";
import { LoadingState } from "@/models/common";

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
  loadingHotNFTs: LoadingState;
  loadingCollections: LoadingState;
  loadingAllNFTs: LoadingState;
}

export const useExploreStore = create<ExploreStore>()(
  devtools(
    (set) => ({
      hotNFTs: [],
      collections: [],
      allNFTs: [],
      allNFTsOffset: 0,
      limit: 10,
      loadingHotNFTs: "idle",
      loadingCollections: "idle",
      loadingAllNFTs: "idle",
      updateOffset: () =>
        set((state) => ({
          allNFTsOffset: state.allNFTs.length,
        })),

      fetchHotNFTs: async (offset, limit) => {
        try {
          set({ loadingHotNFTs: "loading" });
          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _hotNFTs: NFT[] = [];
          const {
            data: result,
            error,
          } = await client.query({
            query: gql(hotNFTsQuery),
            variables: {
              first: limit,
              skip: offset,
            },
            fetchPolicy: "cache-first",
          });
          if (result && !error) {
            _hotNFTs = result.nfts.map((item: any) => {
              let _endTime = 0;
              if (item.saleState === "Auction") {
                _endTime = item.auctionInfo.endTime;
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
                owner: item.owner,
                endTime: _endTime,
              };
            });
          }

          set((state) => {
            return {
              hotNFTs: _hotNFTs,
              loadingHotNFTs: "loaded",
            };
          });
        } catch (error) {
          set({ loadingHotNFTs: "failed" });
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },

      fetchCollections: async (offset, limit) => {
        try {
          set({ loadingCollections: "loading" });
          const client = new ApolloClient({
            uri: `${process.env.NEXT_PUBLIC_THEGRAPH_URL}`,
            cache: new InMemoryCache(),
          });

          let _collections: Collection[] = [];
          const {
            data: result,
            error,
          } = await client.query({
            query: gql(collectionsQuery),
            variables: {
              first: limit,
              skip: offset,
            },
            fetchPolicy: "cache-first",
          });

          if (result && !error) {
            _collections = result.collections;
          }

          set((state) => {
            return {
              collections: _collections,
              loadingCollections: "loaded",
            };
          });
        } catch (error) {
          set({ loadingCollections: "failed" });
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },

      fetchAllNFTs: async (offset, limit) => {
        try {
          set({ loadingAllNFTs: "loading" });
          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _allNFTs: NFT[] = [];
          const {
            data: result,
            error,
          } = await client.query({
            query: gql(allNFTsQuery),
            variables: {
              first: limit,
              skip: offset,
            },
            fetchPolicy: "cache-first",
          });
          if (result && !error) {
            _allNFTs = result.nfts.map((item: any) => {
              let _endTime = 0;
              if (item.saleState === "Auction") {
                _endTime = item.auctionInfo.endTime;
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
                owner: item.owner,
                endTime: _endTime,
              };
            });
          }

          set((state) => {
            // Filter out all nfts that are already in the store
            const filteredAllNFTs = state.allNFTs.filter(
              (stateNFTs) =>
                !_allNFTs.some((nfts: NFT) => stateNFTs.id === nfts.id)
            );

            return {
              allNFTs: [..._allNFTs, ...filteredAllNFTs],
              loadingAllNFTs: "loaded",
            };
          });
        } catch (error) {
          set({ loadingCollections: "failed" });
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
