// React, Next, NPM Packages
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// App imports
import { LoadingState } from "@/models/common";
import { Collection, NFT } from "@/models/nft";
import { BlockchainRead } from "@/web3/blockchain";

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
          let _hotNFTs: NFT[] = [];
          const result = await BlockchainRead.getHotNFT(MAX_HOT_NFTS, 0);
          if (result?.length) {
            _hotNFTs = result.map((item: any) => {
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
                unlock: item.unlock,
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
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      fetchCollections: async () => {
        try {
          set({ loadingCollections: "loading" });
          const _collections: Collection[] =
            await BlockchainRead.getAllCollections(MAX_COLLECTIONS, 0);

          set((state) => {
            return {
              collections: _collections,
              loadingCollections: "loaded",
            };
          });
        } catch (error) {
          set({ loadingCollections: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      fetchTopCreators: async () => {
        try {
          set({ loadingTopCreators: "loading" });

          let _topCreators: string[] = [];

          const result = await BlockchainRead.getTopCreator(
            MAX_TOP_CREATORS,
            0
          );
          if (result?.length) {
            _topCreators = result.map((item: any) => {
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
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },
    }),
    { name: "ExploreStore" }
  )
);
