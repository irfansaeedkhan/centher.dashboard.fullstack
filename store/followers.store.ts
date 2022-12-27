import create from "zustand";
import { devtools } from "zustand/middleware";

import { axiosNodeApi } from "@/utils/axios";
import type { IUserWithFollow } from "@/components/user.with.follow/types";
import { LoadingState } from "@/models/common";

type Followers = IUserWithFollow;

export interface FollowersStore {
  loading: LoadingState;
  accountAddress: string;

  offset: number;
  updateOffset: () => void;

  followers: IUserWithFollow[];
  fetchFollowers: () => Promise<void>;
  resetFollowers: (accountAddress: string, loading?: LoadingState) => void;
}

export const useFollowersStore = create<FollowersStore>()(
  devtools(
    (set, get) => ({
      loading: "idle",
      accountAddress: "",

      offset: 0,
      updateOffset: () => set((state) => ({ offset: state.followers.length })),

      followers: [],
      fetchFollowers: async () => {
        try {
          set({ loading: "loading" });

          const accountAddress = get().accountAddress;
          const offset = get().offset;
          const limit = 10;

          const url = `/api/users/${accountAddress}/followers?offset=${offset}&limit=${limit}`;

          const { data } = await axiosNodeApi.get(url);

          set((state) => {
            const filteredFollowers = state.followers.filter(
              (stateFollowers) =>
                !data.followers.some(
                  (followers: Followers) => stateFollowers._id === followers._id
                )
            );

            return {
              followers: [
                ...filteredFollowers,
                ...data.followers,
              ] as Followers[],
              loading: "loaded",
            };
          });
        } catch (error) {
          set({ loading: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },
      resetFollowers: (accountAddress, loading = "idle") => {
        set({
          accountAddress,
          loading,
          followers: [],
          offset: 0,
        });
      },
    }),
    { name: "FollowersStore" }
  )
);
