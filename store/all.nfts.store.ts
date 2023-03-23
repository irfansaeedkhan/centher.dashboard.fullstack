import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { getNFTs } from "@/lib/get-nfts";
import { getNFTCardData } from "@/lib/get-nft-card-data";
import { AppError } from "@/utils/app-error";
import { LoadingState } from "@/models/common";
import { NFTCardData } from "@/components/nft.card/nft.card.v2";

export interface AllNFTsStore {
  nfts: NFTCardData[];
  fetchNFTs: () => Promise<void>;
  updateOffset: () => void;
  limit: number;
  offset: number;
  loading: LoadingState;
}

export const useAllNFTsStore = create<AllNFTsStore>()(
  devtools(
    (set, get) => ({
      nfts: [],
      offset: 0,
      limit: 15,
      loading: "idle",

      updateOffset: () =>
        set((state) => ({
          offset: state.nfts.length,
        })),

      fetchNFTs: async () => {
        try {
          set({ loading: "loading" });

          let _nfts = await getNFTs({
            limit: get().limit,
            skip: get().offset,
          });

          const nftCardDataPromises = _nfts.map((nft) => getNFTCardData(nft));

          const nftCardDataResults = (
            await Promise.allSettled(nftCardDataPromises)
          ).filter(
            (nft) => nft.status === "fulfilled"
          ) as PromiseFulfilledResult<NFTCardData>[];

          // Remove nfts that are already in the store
          const filteredNFTs = nftCardDataResults.filter(
            (nft) =>
              !get().nfts.some((stateNFT) => stateNFT.id === nft.value.id)
          );

          set((state) => ({
            ...state,
            nfts: [...state.nfts, ...filteredNFTs.map((nft) => nft.value)],
            loading: "loaded",
          }));
        } catch (error: any) {
          set({ loading: "failed" });
          const appError = new AppError(
            error,
            "Can not load NFTs",
            "useAllNFTsStore"
          );
          appError.log();
        }
      },
    }),
    { name: "AllNFTsStore" }
  )
);
