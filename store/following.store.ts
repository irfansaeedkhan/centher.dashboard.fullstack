import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { axiosApi369x } from "@/utils/axios";
import type { IUserWithFollow } from "@/components/user.with.follow/types";
import { LoadingState } from "@/models/common";

type Following = IUserWithFollow;

export interface FollowingStore {
  loading: LoadingState;

  offset: number;
  updateOffset: () => void;

  following: IUserWithFollow[];
  fetchFollowing: () => Promise<void>;
  resetFollowing: (loading?: LoadingState) => void;
}

export const useFollowingStore = create<FollowingStore>()(
  devtools(
    (set, get) => ({
      loading: "idle",

      offset: 0,
      updateOffset: () => set((state) => ({ offset: state.following.length })),

      following: [],
      fetchFollowing: async () => {
        try {
          set({ loading: "loading" });

          const offset = get().offset;
          const limit = 10;

          const url = `/api/socials/users/my-following?offset=${offset}&limit=${limit}`;

          const { data } = await axiosApi369x.get(url);

          set((state) => {
            const filteredFollowing = state.following.filter(
              (stateFollowing) =>
                !data.following.some(
                  (following: Following) => stateFollowing._id === following._id
                )
            );

            return {
              following: [
                ...filteredFollowing,
                ...data.following,
              ] as Following[],
              loading: "loaded",
            };
          });
        } catch (error) {
          set({ loading: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },
      resetFollowing: (loading = "idle") => {
        set({
          loading,
          following: [],
          offset: 0,
        });
      },
    }),
    {
      name: "FollowingStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);
