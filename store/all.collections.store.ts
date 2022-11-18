// React, Next, NPM Packages
import create from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";

// App imports
import { axiosNodeApi } from "@/utils/axios";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { collectionsQuery } from "@/subgraph/querys";
import { LoadingState } from "@/models/common";
import { Collection } from "@/models/nft";

export interface AllCollectionsStore {
  collections: Collection[];
  fetchCollections: (
    offset?: number,
    limit?: number,
    category?: string
  ) => Promise<void>;
  category: string;
  offset: number;
  updateOffset: () => void;
  updateCategory: (category: string) => void;
  limit: number;
  loading: LoadingState;
}

export const useAllCollectionsStore = create<AllCollectionsStore>()(
  devtools(
    (set) => ({
      collections: [],
      category: "all",
      offset: 0,
      limit: 10,
      loading: "idle",
      updateOffset: () =>
        set((state) => ({
          offset: state.collections.length,
        })),

      updateCategory: async (category) =>
        set((state) => ({
          category: category,
          offset: 0,
          collections: [],
        })),

      fetchCollections: async (offset, limit, category) => {
        try {
          set({ loading: "loading" });

          const client = new ApolloClient({
            uri: `${process.env.NEXT_PUBLIC_THEGRAPH_URL}`,
            cache: new InMemoryCache(),
          });

          let _collections: Collection[] = [];
          const { data: result, error } = await client.query({
            query: gql(collectionsQuery),
            variables: {
              first: limit,
              skip: offset,
              category: category,
            },
            fetchPolicy: "cache-first",
          });

          if (result && !error) {
            _collections = result.collections;
          }

          set((state) => {
            return {
              collections: _collections,
              loadingCollections: "loaded",
            };
          });
        } catch (error) {
          set({ loading: "failed" });
          process.env.APP_ENV !== "production" && console.error(error);
        }
      },
    }),
    { name: "ExploreStore" }
  )
);
