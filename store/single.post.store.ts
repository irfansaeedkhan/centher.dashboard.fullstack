import create from "zustand";
import { devtools } from "zustand/middleware";

import { customLog } from "@/utils/custom.log";
import { axiosNodeApi } from "@/utils/axios";
import type { CompletedPost, Post } from "@/models/post";
import type { LoadingState } from "@/models/common";
import { useFeedStore } from "./feed.store";

export interface SinglePostStore {
  postLoading: LoadingState;
  postId: string;
  post: Post | null;

  replies: CompletedPost[];
  repliesLoading: LoadingState;

  repliesOffset: number;
  updateRepliesOffset: () => void;

  fetchPost: () => Promise<void>;
  fetchReplies: () => Promise<void>;

  removeReply: (replyId: string) => Promise<void>;

  addNewReply: (reply: CompletedPost) => void;

  updatePost: (post: Partial<Post>) => void;

  updatePostLikesCount: (
    actionType: "increment" | "decrement",
    postId?: string
  ) => void;

  resetStore: (postId: string, loading?: LoadingState) => void;
}

export const useSinglePostStore = create<SinglePostStore>()(
  devtools(
    (set, get) => ({
      repliesLoading: "idle",
      postLoading: "idle",
      postId: "",

      repliesOffset: 0,
      updateRepliesOffset: () =>
        set((state) => ({ repliesOffset: state.replies.length })),

      post: null,
      replies: [],

      fetchPost: async () => {
        try {
          set({ postLoading: "loading", repliesLoading: "loading" });

          const postId = get().postId;
          const postUrl = `/api/socials/posts/${postId}`;
          const repliesUrl = `/api/socials/posts/${postId}/replies`;

          const promises = [
            axiosNodeApi.get(postUrl),
            axiosNodeApi.get(repliesUrl),
          ];

          const [postRes, repliesRes] = await Promise.all(promises);

          set({
            post: postRes.data.post as Post,
            postLoading: "loaded",
            replies: repliesRes.data.posts,
            repliesLoading: "loaded",
          });
        } catch (error: any) {
          if (error.response?.status === 404) {
            set({
              post: null,
              postLoading: "loaded",
              replies: [],
              repliesLoading: "loaded",
            });
          } else {
            set({ postLoading: "failed", repliesLoading: "failed" });
          }

          customLog(error, ["development"]);
        }
      },

      fetchReplies: async () => {
        try {
          set({ repliesLoading: "loading" });

          const postId = get().postId;
          const repliesOffset = get().repliesOffset;
          const repliesLimit = 10;
          const repliesUrl = `/api/socials/posts/${postId}/replies?offset=${repliesOffset}&limit=${repliesLimit}`;

          const { data } = await axiosNodeApi.get(repliesUrl);

          const _replies = data.posts;

          const filteredStateReplies = get().replies.filter(
            (stateReply) =>
              !_replies.some(
                (reply: CompletedPost) => stateReply._id === reply._id
              )
          );

          set({
            replies: [...filteredStateReplies, ..._replies] as CompletedPost[],
            repliesLoading: "loaded",
          });
        } catch (error) {
          set({ repliesLoading: "failed" });
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      removeReply: async (replyId) => {
        try {
          // Update replies count in post
          const { decrementPostRepliesCount } = useFeedStore.getState();
          decrementPostRepliesCount(get().post?._id);

          set((state) => ({
            post: {
              ...state.post,
              replies_count: (state.post?.replies_count ?? 1) - 1,
            } as Post,
            replies: state.replies.filter((reply) => reply._id !== replyId),
          }));
        } catch (error: any) {
          customLog(error, ["development"]);
        }
      },

      addNewReply: (reply) => {
        set((state) => ({
          replies: [reply, ...state.replies],
        }));
      },

      updatePost: (post) => {
        set((state) => ({ post: { ...state.post, ...(post as Post) } }));
      },

      updatePostLikesCount: (actionType, postId) => {
        if (!postId) return;

        set((state) => {
          if (
            !state.post ||
            postId.toLowerCase() !== state.post._id.toLowerCase()
          ) {
            return state;
          }

          return {
            ...state,
            post: {
              ...state.post,
              likes_count:
                actionType === "increment"
                  ? state.post.likes_count + 1
                  : state.post.likes_count - 1,
              liked_by_loggedin_user: actionType === "increment",
            },
          };
        });
      },

      resetStore: (postId, loading = "idle") => {
        set({
          postId,
          post: null,
          postLoading: loading,
          replies: [],
          repliesLoading: loading,
          repliesOffset: 0,
        });
      },
    }),
    { name: "SinglePostStore" }
  )
);
