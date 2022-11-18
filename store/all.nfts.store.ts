// React, Next, NPM Packages
import create from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";

// App imports
import { axiosNodeApi } from "@/utils/axios";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { allNFTsQuery } from "@/subgraph/querys";
import { LoadingState } from "@/models/common";
import { Collection, NFT } from "@/models/nft";

export interface AllNFTsStore {
  allNFTs: NFT[];
  fetchAllNFTs: (offset?: number, limit?: number) => Promise<void>;
  offset: number;
  updateOffset: () => void;
  limit: number;
  loading: LoadingState;
}

export const useAllNFTsStore = create<AllNFTsStore>()(
  devtools(
    (set) => ({
      allNFTs: [],
      offset: 0,
      limit: 10,
      loading: "idle",
      updateOffset: () =>
        set((state) => ({
          offset: state.allNFTs.length,
        })),

      fetchAllNFTs: async (offset, limit) => {
        try {
          set({ loading: "loading" });
          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _allNFTs: NFT[] = [];
          const { data: result, error } = await client.query({
            query: gql(allNFTsQuery),
            variables: {
              first: limit,
              skip: offset,
            },
            fetchPolicy: "cache-first",
          });
          console.log("@@", result);
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
          set({ loading: "failed" });
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },
    }),
    { name: "ExploreStore" }
  )
);
