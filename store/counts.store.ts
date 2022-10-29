import create from "zustand";
import { devtools } from "zustand/middleware";

import { LoadingState } from "@/models/common";
import { axiosNodeApi } from "@/utils/axios";

export type CountType = "notifications" | "chats" | "none";

export type CountsObject = Record<CountType, number>;

export interface CountsStore {
  loading: LoadingState;
  counts: CountsObject;
  fetchCounts: () => Promise<void>;
  resetCounts: (loading?: LoadingState) => void;
}

const initialCounts: CountsObject = {
  notifications: 0,
  chats: 0,
  none: 0,
};

export const useCountsStore = create<CountsStore>()(
  devtools(
    (set) => ({
      loading: "idle",

      counts: initialCounts,

      fetchCounts: async () => {
        try {
          set({ loading: "loading" });

          const { data } = await axiosNodeApi.get(`/api/users/counts`);

          set({
            counts: (data.counts as CountsObject) ?? initialCounts,
            loading: "loaded",
          });
        } catch (error) {
          set({ loading: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      resetCounts: (loading = "idle") => {
        set({
          loading,
          counts: initialCounts,
        });
      },
    }),
    { name: "CountsStore" }
  )
);
