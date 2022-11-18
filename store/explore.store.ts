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
  topCreators,
} from "@/subgraph/querys";
import { LoadingState } from "@/models/common";
import { Collection, NFT } from "@/models/nft";

export interface ExploreStore {
  hotNFTs: NFT[];
  collections: Collection[];
  topCreators: string[];
  fetchHotNFTs: () => Promise<void>;
  fetchCollections: () => Promise<void>;
  fetchTopCreators: () => Promise<void>;
  loadingHotNFTs: LoadingState;
  loadingCollections: LoadingState;
  loadingTopCreators: LoadingState;
}

const MAX_TOP_CREATORS = 10;
const MAX_HOT_NFTS = 10;
const MAX_COLLECTIONS = 10;
export const useExploreStore = create<ExploreStore>()(
  devtools(
    (set) => ({
      hotNFTs: [],
      collections: [],
      topCreators: [],
      allNFTsOffset: 0,
      limit: 10,
      loadingHotNFTs: "idle",
      loadingCollections: "idle",
      loadingTopCreators: "idle",
      
      fetchHotNFTs: async () => {
        try {
          set({ loadingHotNFTs: "loading" });
          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _hotNFTs: NFT[] = [];
          const { data: result, error } = await client.query({
            query: gql(hotNFTsQuery),
            variables: {
              first: MAX_HOT_NFTS,
              skip: 0,
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

      fetchCollections: async () => {
        try {
          set({ loadingCollections: "loading" });
          const client = new ApolloClient({
            uri: `${process.env.NEXT_PUBLIC_THEGRAPH_URL}`,
            cache: new InMemoryCache(),
          });

          let _collections: Collection[] = [];
          const { data: result, error } = await client.query({
            query: gql(collectionsQuery),
            variables: {
              first: MAX_COLLECTIONS,
              skip: 0,
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

      fetchTopCreators: async () => {
        try {
          set({ loadingTopCreators: "loading" });
          const client = new ApolloClient({
            uri: `${process.env.NEXT_PUBLIC_THEGRAPH_URL}`,
            cache: new InMemoryCache(),
          });
          let _topCreators: string[] = [];
          const { data: result, error } = await client.query({
            query: gql(topCreators),
            variables: {
              first: MAX_TOP_CREATORS,
              skip: 0,
            },
            fetchPolicy: "cache-first",
          });
          if (result && !error) {
            _topCreators = result.users.map((item: any) => {
              return item.publicKey;
            });
          }

          set((state) => {
            return {
              topCreators: _topCreators,
              loadingTopCreators: "loaded",
            };
          });
        } catch (error) {
          set({ loadingTopCreators: "failed" });
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },

    }),
    { name: "ExploreStore" }
  )
);
