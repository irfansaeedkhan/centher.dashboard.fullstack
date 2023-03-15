// React, Next, NPM Packages
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// App imports
import { LoadingState } from "@/models/common";
import { CollectionInfo, NFT } from "@/models/nft";
import { BlockchainRead } from "@/web3/blockchain";

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
          const _collection: CollectionInfo =
            await BlockchainRead.getCollection(collection);

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

      fetchNFTs: async (
        collection,
        saleState,
        orderDir,
        offset = 0,
        limit = 20
      ) => {
        try {
          set({ loadingNFTs: "loading" });

          let _nfts: NFT[] = [];
          let result;
          if (saleState === "All") {
            result = await BlockchainRead.getCollectionNfts(
              collection,
              orderDir,
              limit,
              offset
            );
          } else {
            result = await BlockchainRead.getNftsBySaleState(
              collection,
              orderDir,
              saleState,
              limit,
              offset
            );
          }

          if (result?.length) {
            _nfts = result.map((item: any) => {
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
