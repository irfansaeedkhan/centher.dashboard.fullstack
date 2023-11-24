import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { getCollections } from "@/lib/get-collections";
import { getCollectionCardData } from "@/lib/get-collection-card-data";
import { AppError } from "@/utils/app-error";
import { LoadingState } from "@/models/common";
import { CollectionCardData } from "@/components/collection.card/collection-card-v2";

export interface AllCollectionsStore {
  collections: CollectionCardData[];
  fetchCollections: () => Promise<void>;
  offset: number;
  updateOffset: () => void;
  limit: number;
  loading: LoadingState;
}

export const useAllCollectionsStore = create<AllCollectionsStore>()(
  devtools(
    (set, get) => ({
      collections: [],
      offset: 0,
      limit: 10,
      loading: "idle",
      updateOffset: () =>
        set((state) => ({
          offset: state.collections.length,
        })),

      fetchCollections: async () => {
        try {
          set({ loading: "loading" });

          let _collections = await getCollections({
            limit: get().limit,
            skip: get().offset,
          });

          const collectionCardData = _collections.map((col) =>
            getCollectionCardData(col)
          );

          // Remove collections that are already in the store
          const filteredCollections = collectionCardData.filter(
            (col) =>
              !get().collections.some(
                (stateCollection) => stateCollection.address === col.address
              )
          );

          set((state) => ({
            ...state,
            collections: [...state.collections, ...filteredCollections],
            loading: "loaded",
          }));
        } catch (error: any) {
          set({ loading: "failed" });
          const appError = new AppError(
            error,
            "Can not load Collections",
            "useAllCollectionsStore"
          );
          appError.log();
        }
      },
    }),
    { name: "AllCollectionsStore" }
  )
);
