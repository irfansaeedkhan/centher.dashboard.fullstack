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

export interface CollectionStore {
  info: CollectionInfo | undefined;
  fetchCollectionInfo: (collection: string) => Promise<void>;
  nfts: NFT[];
  fetchNFTs: (
    collection: string,
    saleState: string,
    orderDir: string,
    offset?: number,
    limit?: number,
    reload?: boolean
  ) => Promise<void>;
  offset: number;
  updateOffset: () => void;
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
      limit: 20,
      loadingCollectionInfo: "idle",
      loadingNFTs: "idle",
      updateOffset: () =>
        set((state) => ({
          offset: state.nfts.length,
        })),

      fetchCollectionInfo: async (collection) => {
        try {
          set({ loadingCollectionInfo: "loading" });
          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
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
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },

      fetchNFTs: async (
        collection,
        saleState,
        orderDir,
        offset,
        limit,
        reload
      ) => {
        try {
          set({ loadingNFTs: "loading" });
          const client = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
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
            if (reload) {
              return {
                nfts: _nfts,
                loadingNFTs: "loaded",
              };
            } else {
              return {
                nfts: [..._nfts, ...filteredNFTs],
                loadingNFTs: "loaded",
              };
            }
          });
        } catch (error) {
          set({ loadingNFTs: "failed" });
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

export interface CollectionInfo {
  txTime: number;
  tradingVolumn: number;
  totalSupply: number;
  symbol: string;
  name: string;
  maxSupply: number;
  ipfs: string;
  creator: string;
  createHash: string;
  collection: string;
}
