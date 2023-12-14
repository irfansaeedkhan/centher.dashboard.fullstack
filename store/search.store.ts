import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { LoadingState } from "@/models/common";
import { axiosApiCenther } from "@/utils/axios";
import { IUserWithFollow } from "@/components/user.with.follow/types";

export interface SearchResult extends IUserWithFollow {}

export interface SearchStore {
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  searchOffset: number;
  updateSearchOffset: () => void;

  searchLoadingState: LoadingState;

  searchResults: SearchResult[];
  fetchSearchResults: () => Promise<void>;
  resetSearchResults: (loading?: LoadingState) => void;
}

export const useSearchStore = create<SearchStore>()(
  devtools(
    (set, get) => ({
      searchQuery: "",
      setSearchQuery: (q: string) => set({ searchQuery: q }),

      searchOffset: 0,
      updateSearchOffset: () => {
        set((state) => ({ searchOffset: state.searchResults.length }));
      },

      searchLoadingState: "idle",

      searchResults: [],
      fetchSearchResults: async () => {
        try {
          set(() => ({ searchLoadingState: "loading" }));

          const q = get().searchQuery;
          const searchOffset = get().searchOffset;
          const searchLimit = 15;

          if (q.trim() === "") {
            set(() => ({
              searchResults: [],
              searchLoadingState: "loaded",
              searchOffset: 0,
            }));
            return;
          }

          const url = `/api/search?q=${q}&limit=${searchLimit}&offset=${searchOffset}`;

          const { data } = await axiosApiCenther.get(url);

          set((state) => {
            const filteredResults = state.searchResults.filter(
              (stateResult) =>
                !data.search_results.some(
                  (result: SearchResult) => stateResult._id === result._id
                )
            );

            return {
              searchLoadingState: "loaded",
              searchResults: [
                ...filteredResults,
                ...data.search_results,
              ] as SearchResult[],
            };
          });
        } catch (error) {
          set(() => ({ searchLoadingState: "failed" }));
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },
      resetSearchResults: (loading) => {
        set({
          searchResults: [],
          searchLoadingState: loading ?? "idle",
          searchOffset: 0,
        });
      },
    }),
    {
      name: "SearchStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);
