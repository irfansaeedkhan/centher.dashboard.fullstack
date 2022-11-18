import create from "zustand";
import { devtools } from "zustand/middleware";

import { CompletedPost } from "@/models/post";
import { LoadingState } from "@/models/common";
import { axiosNodeApi } from "@/utils/axios";

export interface MyPostStore {
  posts: CompletedPost[];
  fetchPosts: () => Promise<void>;
  userId: string;

  addNewPost: (post: CompletedPost) => void;
  removePost: (postId: string) => void;
  incrementPostRepliesCount: (postId?: string) => void;
  updatePostLikesCount: (
    actionType: "increment" | "decrement",
    postId?: string
  ) => void;

  resetPosts: (userId: string, loading?: LoadingState) => void;

  offset: number;
  updateOffset: () => void;

  loading: LoadingState;
}

export const useMyPostStore = create<MyPostStore>()(
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
          const limit = 15;

          const url = `/api/socials/posts/user/${userId}?offset=${offset}&limit=${limit}`;
          const { data } = await axiosNodeApi.get(url);
          set((state) => {
            const filteredPosts = state.posts.filter(
              (statePost) =>
                !data.posts.some(
                  (post: CompletedPost) => statePost._id === post._id
                )
            );

            return {
              posts: [...filteredPosts, ...data.posts] as CompletedPost[],
              loading: "loaded",
            };
          });
        } catch (error) {
          set({ loading: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
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

      updatePostLikesCount: (actionType, postId) => {
        if (!postId) return;

        set((state) => ({
          posts: state.posts.map((post) => {
            if (post._id === postId) {
              return {
                ...post,
                likes_count:
                  actionType === "increment"
                    ? post.likes_count + 1
                    : post.likes_count - 1,
                liked_by_loggedin_user: actionType === "increment",
              };
            }
            return post;
          }),
        }));
      },

      resetPosts: (userId, loading = "idle") => {
        set({
          userId,
          loading,
          posts: [],
          offset: 0,
        });
      },
    }),
    { name: "MyPostStore" }
  )
);
