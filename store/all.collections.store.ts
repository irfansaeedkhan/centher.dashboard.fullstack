// React, Next, NPM Packages
import create from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";

// App imports
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  collectionsByCategoryQuery,
  collectionsQuery,
} from "@/subgraph/querys";
import { LoadingState } from "@/models/common";
import { Category, Collection, OrderBy, OrderDirection } from "@/models/nft";

export interface AllCollectionsStore {
  collections: Collection[];
  fetchCollections: (
    category: Category,
    sortBy: OrderBy,
    sortDir: OrderDirection
  ) => Promise<void>;
  category: Category;
  offset: number;
  updateOffset: () => void;
  updateCategory: (category: Category) => void;
  updateSortBy: (category: OrderBy, dir: OrderDirection) => void;
  limit: number;
  sortDir: OrderDirection;
  sortBy: OrderBy;
  loading: LoadingState;
}

export const useAllCollectionsStore = create<AllCollectionsStore>()(
  devtools(
    (set, get) => ({
      collections: [],
      category: "all",
      sortBy: "tradingVolumn",
      sortDir: "desc",
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

      updateSortBy: async (category, dir) =>
        set((state) => ({
          sortBy: category,
          sortDir: dir,
          offset: 0,
          collections: [],
        })),

      fetchCollections: async (category, sortBy, sortDir) => {
        try {
          set({ loading: "loading" });

          const client = new ApolloClient({
            uri: `${process.env.NEXT_PUBLIC_THEGRAPH_URL}`,
            cache: new InMemoryCache(),
          });

          let _collections: Collection[] = [];
          if (category?.toLowerCase() === "all") {
            const { data: result, error } = await client.query({
              query: gql(collectionsQuery),
              variables: {
                first: get().limit,
                skip: get().offset,
                orderBy: sortBy,
                orderDirection: sortDir,
              },
              fetchPolicy: "cache-first",
            });

            if (result && !error) {
              _collections = result.collections;
            }
          } else {
            const { data: result, error } = await client.query({
              query: gql(collectionsByCategoryQuery),
              variables: {
                first: get().limit,
                skip: get().offset,
                category: category?.toLowerCase(),
                orderBy: sortBy,
                orderDirection: sortDir,
              },
              fetchPolicy: "cache-first",
            });

            if (result && !error) {
              _collections = result.collections;
            }
          }

          set((state) => {
            return {
              collections: _collections,
              loading: "loaded",
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
