// React, Next, NPM Packages
import create from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";

// App imports
import { axiosNodeApi } from "@/utils/axios";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { allNFTsByFilterQuery, allNFTsQuery } from "@/subgraph/querys";
import { LoadingState } from "@/models/common";
import {
  Category,
  Collection,
  NFT,
  OrderBy,
  OrderDirection,
} from "@/models/nft";

export interface AllNFTsStore {
  allNFTs: NFT[];
  category: Category;
  sortBy: OrderBy;
  sortDir: OrderDirection;
  fetchAllNFTs: (
    category: Category,
    sortBy: OrderBy,
    sortDir: OrderDirection
  ) => Promise<void>;
  updateOffset: () => void;
  updateCategory: (value: Category) => void;
  updateSortBy: (value: OrderBy, dir: OrderDirection) => void;
  limit: number;
  offset: number;
  loading: LoadingState;
}

export const useAllNFTsStore = create<AllNFTsStore>()(
  devtools(
    (set, get) => ({
      allNFTs: [],
      category: "all",
      sortBy: "tradingVolumn",
      sortDir: "desc",
      offset: 0,
      limit: 10,
      loading: "idle",
      updateOffset: () =>
        set((state) => ({
          offset: state.allNFTs.length,
        })),

      updateCategory: (value) =>
        set((state) => ({
          category: value,
          offset: 0,
          allNFTs: [],
        })),

      updateSortBy: (value, dir) =>
        set((state) => ({
          sortBy: value,
          sortDir: dir,
          offset: 0,
          allNFTs: [],
        })),

      fetchAllNFTs: async (category, sortBy, sortDir) => {
        try {
          set({ loading: "loading" });
          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _allNFTs: NFT[] = [];
          let result;
          let error;
          if (category.toLowerCase() === "all") {
            const { data: result1, error: error1 } = await client.query({
              query: gql(allNFTsQuery),
              variables: {
                first: get().limit,
                skip: get().offset,
                orderBy: sortBy,
                orderDirection: sortDir,
              },
              fetchPolicy: "cache-first",
            });
            result = result1;
            error = error1;
          } else {
            const { data: result2, error: error2 } = await client.query({
              query: gql(allNFTsByFilterQuery),
              variables: {
                first: get().limit,
                skip: get().offset,
                category: category.toLowerCase(),
                orderBy: sortBy,
                orderDirection: sortDir,
              },
              fetchPolicy: "cache-first",
            });
            result = result2;
            error = error2;
          }

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
              loading: "loaded",
            };
          });
        } catch (error) {
          set({ loading: "failed" });
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },
    }),
    { name: "ExploreStore" }
  )
);
