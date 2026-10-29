import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { likePost } from "@/components/feed.components";
import { CompletedPost } from "@/models/post";
import { LoadingState } from "@/models/common";
import { axiosApi369x } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";

export interface FeedStore {
  posts: CompletedPost[];
  fetchPosts: (isAuthenticated?: boolean) => Promise<void>;

  // Feed-grill Q10: keyset cursor (last post id of the previous page) —
  // replaces offset-based paging, which silently skipped posts.
  cursor: string | null;
  hasMore: boolean;
  fetchedWithAuth: boolean;

  addNewPost: (post: CompletedPost) => void;
  removePost: (postId: string) => void;
  incrementPostRepliesCount: (postId?: string) => void;
  decrementPostRepliesCount: (postId: string | undefined) => void;

  likePostAPI: (postId: string, actionType: "like" | "unlike") => Promise<void>;
  updatePostLikesCount: (
    actionType: "increment" | "decrement",
    postId?: string
  ) => void;

  createPostViewInStore: (postId: string) => void;

  replaceEditedPost: (post: CompletedPost) => void;

  removeUnfollowedUserPosts: (userId: string) => void;

  offset: number;
  updateOffset: () => void;

  loading: LoadingState;
}

export const useFeedStore = create<FeedStore>()(
  devtools(
    (set, get) => ({
      loading: "idle",

      // `offset` is now only the page's load-more trigger counter (the
      // feed page refetches when it changes); paging itself is keyset —
      // see `cursor` below.
      offset: 0,

      updateOffset: () => set((state) => ({ offset: state.offset + 1 })),

      cursor: null,
      hasMore: true,
      fetchedWithAuth: false,

      posts: [],

      removeUnfollowedUserPosts: (userId) => {
        set((state) => ({
          posts: state.posts.filter((post) => post.user._id !== userId),
        }));
      },

      fetchPosts: async (isAuthenticated = false) => {
        try {
          // Feed-grill Q19: logged-in users read the /with-auth variant
          // so like buttons render their real state (same pattern as the
          // other stores). If the auth mode flips after pages were
          // loaded anonymously, restart from page 1 in the new mode so
          // liked state is correct instead of mixed.
          const useAuth =
            isAuthenticated &&
            process.env.NEXT_PUBLIC_APP_ENV !== "development";

          let { cursor, hasMore } = get();
          if (get().posts.length > 0 && get().fetchedWithAuth !== useAuth) {
            cursor = null;
            hasMore = true;
            set({ posts: [], cursor: null, hasMore: true });
          }
          set({ fetchedWithAuth: useAuth });

          // No cursor + posts already loaded means the last page said
          // there is nothing more — don't refetch page 1 on scroll.
          if (cursor === null && get().posts.length > 0) {
            set({ loading: "loaded" });
            return;
          }
          if (!hasMore && cursor !== null) {
            set({ loading: "loaded" });
            return;
          }

          set({ loading: "loading" });

          const limit = 10;
          const url =
            `/api/socials/posts${useAuth ? "/with-auth" : ""}?limit=${limit}` +
            (cursor ? `&cursor=${encodeURIComponent(cursor)}` : "");

          const { data } = await axiosApi369x.get(url);

          // Round 2 (deleted placeholders, first-load hardening): the
          // feed page already filters status "deleted" at render, but
          // that leaves the invariant to one render path. Filter at
          // ingest too, so no consumer of this store can ever render
          // a deleted top-level post. Reply tombstones are unaffected:
          // they live in the single-post / my-post stores, never here.
          const incoming = (data.posts ?? []).filter(
            (post: CompletedPost) => (post.status as string) !== "deleted"
          );
          set((state) => {
            const filteredPosts = incoming.filter(
              (post: CompletedPost) =>
                !state.posts.some((statePost) => statePost._id === post._id)
            );
            return {
              posts: [...state.posts, ...filteredPosts] as CompletedPost[],
              loading: "loaded",
              cursor: data.next_cursor ?? null,
              hasMore: data.has_more ?? data.next_cursor != null,
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

      decrementPostRepliesCount: (postId) => {
        if (!postId) return;

        set((state) => ({
          posts: state.posts.map((post) => {
            if (post._id === postId) {
              return {
                ...post,
                replies_count: post.replies_count - 1,
              };
            }
            return post;
          }),
        }));
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

      replaceEditedPost: (post) => {
        set((state) => ({
          posts: state.posts.map((statePost) => {
            if (statePost._id === post._id) return post;
            return statePost;
          }),
        }));
      },
    }),
    {
      name: "FeedStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);
