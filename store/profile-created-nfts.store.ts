import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { LoadingState } from "@/models/common";
import { NFTImageCardData } from "@/components/nft.image.card/types";
import { customLog } from "@/utils/custom.log";
import { getNFTListOfSingleCreatorFromAnyCollection } from "@/lib/get-nft-list-of-single-creator-from-any-collection";
import { getNFTImageCardData } from "@/lib/get-nft-card-data";

export interface ProfileCreatedNftsStore {
  creatorId: string;
  createdNfts: NFTImageCardData[];
  loading: LoadingState;
  offset: number;

  actions: {
    fetchCreatedNFTs: () => Promise<void>;
    updateOffset: () => void;
    resetCreatedNfts: (creatorId: string, loading?: LoadingState) => void;
  };
}

export const useProfileCreatedNftsStore = create<ProfileCreatedNftsStore>()(
  devtools(
    (set, get) => ({
      creatorId: "",
      createdNfts: [],
      loading: "idle",
      offset: 0,

      actions: {
        fetchCreatedNFTs: async () => {
          try {
            set({ loading: "loading" });
            const creatorId = get().creatorId;
            const offset = get().offset;
            const limit = 20;

            const createdNfts =
              await getNFTListOfSingleCreatorFromAnyCollection({
                creator_address: creatorId,
                limit,
                skip: offset,
              });

            const nftImageCardDataList: NFTImageCardData[] = createdNfts.map(
              (item) => getNFTImageCardData(item)
            );

            set((state) => {
              const filteredNfts = nftImageCardDataList.filter(
                (nft) =>
                  !state.createdNfts.some((stateNft) => stateNft.id === nft.id)
              );

              return {
                createdNfts: [...state.createdNfts, ...filteredNfts],
                loading: "loaded",
              };
            });
          } catch (error) {
            set({ loading: "failed" });
            customLog(["development", "staging"], error);
          }
        },

        updateOffset: () => {
          set((state) => ({ offset: state.createdNfts.length }));
        },

        resetCreatedNfts: (
          creatorId: string,
          loading: LoadingState = "idle"
        ) => {
          set({
            creatorId: creatorId.toLowerCase(),
            createdNfts: [],
            loading,
            offset: 0,
          });
        },
      },
    }),
    {
      name: "ProfileCreatedNftsStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);
