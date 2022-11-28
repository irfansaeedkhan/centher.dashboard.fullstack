import create from "zustand";
import { devtools } from "zustand/middleware";

import { ArchivedPost } from "@/models/post";
import { LoadingState } from "@/models/common";
import { axiosNodeApi } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";

export interface ArchivedPostsStore {
  posts: ArchivedPost[];
  fetchPosts: () => Promise<void>;

  addNewPost: (post: ArchivedPost) => void;
  removePost: (postId: string) => void;

  offset: number;
  updateOffset: () => void;

  loading: LoadingState;
}

export const useArchivedPostsStore = create<ArchivedPostsStore>()(
  devtools(
    (set, get) => ({
      loading: "idle",

      offset: 0,

      updateOffset: () => set((state) => ({ offset: state.posts.length })),

      posts: [],

      fetchPosts: async () => {
        try {
          set({ loading: "loading" });

          const offset = get().offset;
          const limit = 10;

          const url = `/api/socials/posts/archived?offset=${offset}&limit=${limit}`;

          const { data } = await axiosNodeApi.get(url);

          set((state) => {
            const filteredPosts = state.posts.filter(
              (statePost) =>
                !data.posts.some(
                  (post: ArchivedPost) => statePost._id === post._id
                )
            );

            return {
              posts: [...filteredPosts, ...data.posts] as ArchivedPost[],
              loading: "loaded",
            };
          });
        } catch (error: any) {
          set({ loading: "failed" });
          customLog(error, ["development"]);
        }
      },

      addNewPost: (post) => {
        set((state) => ({
          posts: [post, ...state.posts],
        }));
      },

      removePost: (postId) => {
        set((state) => ({
          posts: state.posts.filter((post) => post._id !== postId),
        }));
      },
    }),
    { name: "ArchivedPostsStore" }
  )
);
