import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { LoadingState } from "@/models/common";
import { NFTImageCardData } from "@/components/nft.image.card/types";
import { customLog } from "@/utils/custom.log";
import { getNFTListOfSingleOwnerFromAnyCollection } from "@/lib/get-nft-list-of-single-owner-from-any-collection";
import { getNFTImageCardData } from "@/lib/get-nft-card-data";

export interface ProfileListedNftsStore {
  ownerId: string;
  listedNfts: NFTImageCardData[];
  loading: LoadingState;
  offset: number;

  actions: {
    fetchListedNFTs: () => Promise<void>;
    updateOffset: () => void;
    resetListedNfts: (ownerId: string, loading?: LoadingState) => void;
  };
}

export const useProfileListedNftsStore = create<ProfileListedNftsStore>()(
  devtools(
    (set, get) => ({
      ownerId: "",
      listedNfts: [],
      loading: "idle",
      offset: 0,

      actions: {
        fetchListedNFTs: async () => {
          try {
            set({ loading: "loading" });
            const ownerId = get().ownerId;
            const offset = get().offset;
            const limit = 20;

            const listedNfts = await getNFTListOfSingleOwnerFromAnyCollection({
              owner_address: ownerId,
              saleState: "List",
              limit,
              skip: offset,
            });

            const nftImageCardDataList: NFTImageCardData[] = listedNfts.map(
              (item) => getNFTImageCardData(item)
            );

            set((state) => {
              const filteredNfts = nftImageCardDataList.filter(
                (nft) =>
                  !state.listedNfts.some((stateNft) => stateNft.id === nft.id)
              );

              return {
                listedNfts: [...state.listedNfts, ...filteredNfts],
                loading: "loaded",
              };
            });
          } catch (error) {
            set({ loading: "failed" });
            customLog(["development", "staging"], error);
          }
        },

        updateOffset: () => {
          set((state) => ({ offset: state.listedNfts.length }));
        },

        resetListedNfts: (ownerId: string, loading: LoadingState = "idle") => {
          set({
            ownerId: ownerId.toLowerCase(),
            listedNfts: [],
            loading,
            offset: 0,
          });
        },
      },
    }),
    {
      name: "ProfileListedNftsStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);
