import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { getCollections } from "@/lib/get-collections";
import { getCollectionCardData } from "@/lib/get-collection-card-data";
import { AppError } from "@/utils/app-error";
import { collectionsQuery } from "@/subgraph/querys";
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
            query: collectionsQuery,
            limit: get().limit,
            skip: get().offset,
          });

          const collectionCardDataPromises = _collections.map((col) =>
            getCollectionCardData(col)
          );

          const collectionCardDataResults = (
            await Promise.allSettled(collectionCardDataPromises)
          ).filter(
            (col) => col.status === "fulfilled"
          ) as PromiseFulfilledResult<CollectionCardData>[];

          // Remove nfts that are already in the store
          const filteredCollections = collectionCardDataResults.filter(
            (col) =>
              !get().collections.some(
                (stateCollection) =>
                  stateCollection.address === col.value.address
              )
          );

          set((state) => ({
            ...state,
            collections: [
              ...state.collections,
              ...filteredCollections.map((col) => col.value),
            ],
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
