// React, Next, NPM Packages
import create from "zustand";
import { devtools } from "zustand/middleware";

// App imports
import { axiosNodeApi } from "@/utils/axios";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  nftsQuery,
  nftsBySaleStateQuery,
  collectionQuery,
} from "@/subgraph/querys";
import { LoadingState } from "@/models/common";
import { CollectionInfo, NFT } from "@/models/nft";
import { SUBGRAPH_URL } from "@/web3/constants/common";

export type Filter = "All" | "List" | "Auction";

export interface CollectionStore {
  info: CollectionInfo | undefined;
  fetchCollectionInfo: (collection: string) => Promise<void>;
  nfts: NFT[];
  fetchNFTs: (
    collection: string,
    saleState: string,
    orderDir: string,
    offset?: number,
    limit?: number
  ) => Promise<void>;
  offset: number;
  updateOffset: () => void;
  filter: Filter;
  updateFilter: (filter: Filter) => void;
  limit: number;
  loadingCollectionInfo: LoadingState;
  loadingNFTs: LoadingState;
}

enum OrderBy {
  createTime,
  tradingVolumn,
}

export const useCollectionStore = create<CollectionStore>()(
  devtools(
    (set) => ({
      info: undefined,
      nfts: [],
      offset: 0,
      filter: "All",
      limit: 20,
      loadingCollectionInfo: "idle",
      loadingNFTs: "idle",
      updateOffset: () =>
        set((state) => ({
          offset: state.nfts.length,
        })),

      updateFilter: (filter) =>
        set((state) => ({
          filter: filter,
          offset: 0,
          nfts: [],
        })),

      fetchCollectionInfo: async (collection) => {
        try {
          set({ loadingCollectionInfo: "loading" });
          const client = new ApolloClient({
            uri: SUBGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _collection: CollectionInfo;
          const {
            data: result,
            error,
            loading,
          } = await client.query({
            query: gql(collectionQuery),
            variables: {
              collection: collection,
            },
            fetchPolicy: "cache-first",
          });
          if (!loading) {
            if (result && !error) {
              _collection = result.collections[0];
            }
          }

          set((state) => {
            return {
              info: _collection,
              loadingCollectionInfo: "loaded",
            };
          });
        } catch (error) {
          set({ loadingCollectionInfo: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      fetchNFTs: async (collection, saleState, orderDir, offset, limit) => {
        try {
          set({ loadingNFTs: "loading" });
          const client = new ApolloClient({
            uri: SUBGRAPH_URL,
            cache: new InMemoryCache(),
          });
          let _nfts: NFT[] = [];
          let result;
          if (saleState === "All") {
            const {
              data: result1,
              error,
              loading,
            } = await client.query({
              query: gql(nftsQuery),
              variables: {
                collection: collection,
                orderDirection: orderDir,
                first: limit,
                skip: offset,
              },
              fetchPolicy: "cache-first",
            });
            result = result1;
          } else {
            const {
              data: result2,
              error,
              loading,
            } = await client.query({
              query: gql(nftsBySaleStateQuery),
              variables: {
                collection: collection,
                orderDirection: orderDir,
                saleState: saleState,
                first: limit,
                skip: offset,
              },
              fetchPolicy: "cache-first",
            });
            result = result2;
          }

          if (result) {
            _nfts = result.nfts.map((item: any) => {
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
            const filteredNFTs = state.nfts.filter(
              (stateNFTs) =>
                !_nfts.some((nfts: NFT) => stateNFTs.id === nfts.id)
            );
            return {
              nfts: [..._nfts, ...filteredNFTs],
              loadingNFTs: "loaded",
            };
          });
        } catch (error) {
          set({ loadingNFTs: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },
    }),
    { name: "ExploreStore" }
  )
);
