import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { likePost } from "@/components/feed.components";
import { CompletedPost } from "@/models/post";
import { LoadingState } from "@/models/common";
import { axiosNodeApi } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";

export interface RepliesStore {
  loading: LoadingState;
  userId: string;

  posts: CompletedPost[];
  fetchPosts: () => Promise<void>;
  resetPosts: (userId: string, loading?: LoadingState) => void;

  removePost: (postId: string) => void;
  incrementPostRepliesCount: (postId?: string) => void;
  updatePostLikesCount: (
    actionType: "increment" | "decrement",
    postId?: string
  ) => void;

  likePostAPI: (postId: string, actionType: "like" | "unlike") => Promise<void>;

  offset: number;
  updateOffset: () => void;

  createPostViewInStore: (postId: string) => void;
}

export const useMyRepliesStore = create<RepliesStore>()(
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

      likePostAPI: async (postId, actionType) => {
        try {
          get().updatePostLikesCount(
            actionType === "like" ? "increment" : "decrement",
            postId
          );

          await likePost(postId, actionType);
        } catch (error: any) {
          get().updatePostLikesCount(
            actionType === "like" ? "decrement" : "increment",
            postId
          );
          customLog(error, ["development"]);
        }
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
          loading,
          userId,
          posts: [],
          offset: 0,
        });
      },

      createPostViewInStore: (postId) => {
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post._id === postId) {
              return {
                ...post,
                viewed_by_loggedin_user: true,
              };
            }
            return post;
          }),
        }));
      },
    }),
    { name: "RepliesStore" }
  )
);
