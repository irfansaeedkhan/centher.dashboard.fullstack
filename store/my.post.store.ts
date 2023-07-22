import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { CompletedPost } from "@/models/post";
import { LoadingState } from "@/models/common";
import { likePost } from "@/components/feed.components";
import { axiosApiCenther } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";

import { useFeedStore } from "./feed.store";

export interface MyPostStore {
  posts: CompletedPost[];
  fetchPosts: (isAuthenticated: boolean) => Promise<void>;
  userId: string;

  addNewPost: (post: CompletedPost) => void;
  removePost: (postId: string) => void;
  incrementPostRepliesCount: (postId?: string) => void;
  likePostAPI: (postId: string, actionType: "like" | "unlike") => Promise<void>;
  updatePostLikesCount: (
    actionType: "increment" | "decrement",
    postId?: string
  ) => void;

  resetPosts: (userId: string, loading?: LoadingState) => void;

  offset: number;
  updateOffset: () => void;

  loading: LoadingState;

  createPostViewInStore: (postId: string) => void;

  replaceEditedPost: (post: CompletedPost) => void;
}

export const useMyPostStore = create<MyPostStore>()(
  devtools(
    (set, get) => ({
      loading: "idle",
      userId: "",

      offset: 0,

      updateOffset: () => set((state) => ({ offset: state.posts.length })),

      posts: [],

      fetchPosts: async (isAuthenticated: boolean) => {
        try {
          set({ loading: "loading" });

          const userId = get().userId;
          const offset = get().offset;
          const limit = 15;

          let url = `/api/socials/posts/user/${userId}`;
          if (
            isAuthenticated &&
            process.env.NEXT_PUBLIC_APP_ENV !== "development"
          ) {
            url += "/with-auth";
          }
          url = `${url}?offset=${offset}&limit=${limit}`;
          const { data } = await axiosApiCenther.get(url);

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
        // Filter out the post if it already exists in the store
        if (get().posts.some((statePost) => statePost._id === post._id)) return;

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

      likePostAPI: async (postId, actionType) => {
        try {
          get().updatePostLikesCount(
            actionType === "like" ? "increment" : "decrement",
            postId
          );

          await likePost(postId, actionType);

          // Also update the feed store
          useFeedStore
            .getState()
            .updatePostLikesCount(
              actionType === "like" ? "increment" : "decrement",
              postId
            );
        } catch (error: any) {
          get().updatePostLikesCount(
            actionType === "like" ? "decrement" : "increment",
            postId
          );
          customLog(["development"], error);
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
          userId,
          loading,
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

      replaceEditedPost: (post) => {
        set((state) => ({
          posts: state.posts.map((statePost) =>
            statePost._id === post._id ? post : statePost
          ),
        }));
      },
    }),
    { name: "MyPostStore" }
  )
);
