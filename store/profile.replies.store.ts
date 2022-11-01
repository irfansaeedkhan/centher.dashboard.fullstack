import create from "zustand";
import { devtools } from "zustand/middleware";

import { CompletedPost } from "@/models/post";
import { LoadingState } from "@/models/common";
import { axiosNodeApi } from "@/utils/axios";

export interface RepliesStore {
  loading: LoadingState;
  userId: string;

  posts: CompletedPost[];
  fetchPosts: () => Promise<void>;
  resetPosts: (userId: string, loading?: LoadingState) => void;

  deletePost: (postId: string) => void;
  incrementPostRepliesCount: (postId?: string) => void;

  offset: number;
  updateOffset: () => void;
}

export const useRepliesStore = create<RepliesStore>()(
  devtools(
    (set, get) => ({
      loading: "idle",
      userId: "",

      offset: 0,

      updateOffset: () => set((state) => ({ offset: state.posts.length })),

      posts: [],

      fetchPosts: async () => {
        try {
          set({ loading: "loading" });

          const userId = get().userId;
          const offset = get().offset;
          const limit = 10;

          const url = `/api/socials/posts/user/replies/${userId}?offset=${offset}&limit=${limit}`;
          const { data } = await axiosNodeApi.get(url);
          set((state) => {
            const filteredPosts = state.posts.filter(
              (statePost) =>
                !data.postsReplies.some(
                  (post: CompletedPost) => statePost._id === post._id
                )
            );

            return {
              posts: [
                ...filteredPosts,
                ...data.postsReplies,
              ] as CompletedPost[],
              loading: "loaded",
            };
          });
        } catch (error) {
          set({ loading: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      deletePost: (postId) => {
        set((state) => ({
          posts: state.posts.filter((post) => post._id !== postId),
        }));
      },

      incrementPostRepliesCount: (postId) => {
        if (!postId) return;

        set((state) => ({
          posts: state.posts.map((post) => {
            if (post._id === postId) {
              return {
                ...post,
                replies_count: post.replies_count + 1,
              };
            }
            return post;
          }),
        }));
      },
      resetPosts: (userId, loading = "idle") => {
        set({
          loading,
          userId,
          posts: [],
          offset: 0,
        });
      },
    }),
    { name: "RepliesStore" }
  )
);
