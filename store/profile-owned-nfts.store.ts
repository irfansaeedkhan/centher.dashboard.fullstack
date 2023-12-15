import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { LoadingState } from "@/models/common";
import { NFTImageCardData } from "@/components/nft.image.card/types";
import { customLog } from "@/utils/custom.log";
import { getNFTListOfSingleOwnerFromAnyCollection } from "@/lib/get-nft-list-of-single-owner-from-any-collection";
import { getNFTImageCardData } from "@/lib/get-nft-card-data";

export interface ProfileOwnedNftsStore {
  ownerId: string;
  ownedNfts: NFTImageCardData[];
  loading: LoadingState;
  cursor: string | null;

  actions: {
    fetchOwnedNFTs: () => Promise<void>;
    resetOwnedNfts: (ownerId: string, loading?: LoadingState) => void;
  };
}

export const useProfileOwnedNftsStore = create<ProfileOwnedNftsStore>()(
  devtools(
    (set, get) => ({
      ownerId: "",
      ownedNfts: [],
      loading: "idle",
      cursor: null,

      actions: {
        fetchOwnedNFTs: async () => {
          try {
            set({ loading: "loading" });
            const ownerId = get().ownerId;
            const cursor = get().cursor;
            const limit = 20;

            const ownedNfts = await getNFTListOfSingleOwnerFromAnyCollection({
              owner_address: ownerId,
              limit,
              cursor,
            });

            set((state) => {
              const filteredNfts = ownedNfts.nfts.filter(
                (nft) =>
                  !state.ownedNfts.some((stateNft) => stateNft.id === nft.id)
              );

              return {
                ownedNfts: [...state.ownedNfts, ...filteredNfts],
                cursor: ownedNfts.cursor,
                loading: "loaded",
              };
            });
          } catch (error) {
            set({ loading: "failed" });
            customLog(["development", "staging"], error);
          }
        },

        resetOwnedNfts: (ownerId: string, loading: LoadingState = "idle") => {
          set({
            ownerId: ownerId.toLowerCase(),
            ownedNfts: [],
            loading,
            cursor: null,
          });
        },
      },
    }),
    {
      name: "ProfileOwnedNftsStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);
