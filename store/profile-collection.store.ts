import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { LoadingState } from "@/models/common";
import { CFSCollection } from "@/models/nft";
import { getCollectionListOfSingleCreator } from "@/lib/get-collection-list-of-single-creator";
import { customLog } from "@/utils/custom.log";

export interface ProfileCollectionStore {
  creatorId: string;
  collections: CFSCollection[];
  loading: LoadingState;
  offset: number;

  actions: {
    fetchCollections: () => Promise<void>;
    updateOffset: () => void;
    resetCollections: (creatorId: string, loading?: LoadingState) => void;
  };
}

export const useProfileCollectionStore = create<ProfileCollectionStore>()(
  devtools(
    (set, get) => ({
      creatorId: "",
      collections: [],
      loading: "idle",
      offset: 0,

      actions: {
        fetchCollections: async () => {
          try {
            set({ loading: "loading" });
            const creatorId = get().creatorId;
            const offset = get().offset;
            const limit = 20;
            const collections = await getCollectionListOfSingleCreator({
              creator_address: creatorId,
              limit,
              skip: offset,
            });

            set((state) => {
              const filteredCollections = collections.filter(
                (collection) =>
                  !state.collections.some(
                    (stateCollection) => stateCollection.id === collection.id
                  )
              );

              return {
                collections: [...state.collections, ...filteredCollections],
                loading: "loaded",
              };
            });
          } catch (error) {
            set({ loading: "failed" });
            customLog(["development", "staging"], error);
          }
        },

        updateOffset: () => {
          set((state) => ({ offset: state.collections.length }));
        },

        resetCollections: (
          creatorId: string,
          loading: LoadingState = "idle"
        ) => {
          set({
            creatorId: creatorId.toLowerCase(),
            collections: [],
            loading,
            offset: 0,
          });
        },
      },
    }),
    {
      name: "ProfileCollectionStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);
