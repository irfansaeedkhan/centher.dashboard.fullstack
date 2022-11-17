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

  deleteReply: (replyId: string) => Promise<void>;

  updatePost: (post: Partial<Post>) => void;

  addNewReply: (reply: CompletedPost) => void;

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

      deleteReply: async (replyId) => {
        try {
          await axiosNodeApi.delete(`/api/socials/posts/${replyId}`);

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
        } catch (error) {
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.error(error);
        }
      },

      updatePost: (post) => {
        set((state) => ({ post: { ...state.post, ...(post as Post) } }));
      },

      addNewReply: (reply) => {
        set((state) => ({
          replies: [reply, ...state.replies],
        }));
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
