import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { CompletedPost, Post } from "@/models/post";
import type { LoadingState } from "@/models/common";
import { likePost } from "@/components/feed.components";
import { axiosNodeApi } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";

import { useFeedStore } from "./feed.store";

type PostType = "main" | "thread-post" | "reply";

export interface SinglePostStore {
  postLoading: LoadingState;
  postId: string;
  posts: Post[];

  replies: CompletedPost[];
  repliesLoading: LoadingState;

  repliesOffset: number;
  updateRepliesOffset: () => void;

  fetchPost: () => Promise<void>;
  fetchReplies: () => Promise<void>;

  likePostAPI: (
    postId: string,
    actionType: "like" | "unlike",
    postType: PostType
  ) => Promise<void>;

  removePost: (postId: string, postType: PostType) => Promise<void>;

  addNewReply: (reply: CompletedPost) => void;

  updatePost: (
    postId: string,
    postUpdater: (post: Post) => Partial<Post>
  ) => void;

  updatePostLikesCount: (
    actionType: "increment" | "decrement",
    postType: PostType,
    postId?: string
  ) => void;

  createPostViewInStore: (postId: string) => void;

  replaceEditedPost: (post: CompletedPost) => void;

  updateRepliesCountForReply: (
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

      posts: [],
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
            posts: postRes.data.posts as Post[],
            postLoading: "loaded",
            replies: repliesRes.data.posts,
            repliesLoading: "loaded",
          });
        } catch (error: any) {
          if (error.response?.status === 404) {
            set({
              posts: [],
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

      likePostAPI: async (postId, actionType, postType) => {
        try {
          get().updatePostLikesCount(
            actionType === "like" ? "increment" : "decrement",
            postType,
            postId
          );

          await likePost(postId, actionType);

          if (postType === "main") {
            // Also update the feed store
            useFeedStore
              .getState()
              .updatePostLikesCount(
                actionType === "like" ? "increment" : "decrement",
                postId
              );
          }
        } catch (error: any) {
          get().updatePostLikesCount(
            actionType === "like" ? "decrement" : "increment",
            postType,
            postId
          );
          customLog(error, ["development"]);
        }
      },

      updatePostLikesCount: (actionType, postType, postId) => {
        if (!postId) return;

        if (postType === "main" || postType === "thread-post") {
          set((state) => {
            if (
              !state.posts ||
              state.posts.length === 0 ||
              state.posts.find((post) => post._id === postId) === undefined
            ) {
              return state;
            }

            return {
              ...state,
              posts: state.posts.map((post) => {
                if (post._id !== postId) {
                  return post;
                }

                return {
                  ...post,
                  likes_count:
                    actionType === "increment"
                      ? post.likes_count + 1
                      : post.likes_count - 1,
                  liked_by_loggedin_user: actionType === "increment",
                };
              }),
            };
          });
        } else if (postType === "reply") {
          set((state) => {
            const replies = state.replies.map((reply) => {
              if (reply._id !== postId) {
                return reply;
              }

              return {
                ...reply,
                likes_count:
                  actionType === "increment"
                    ? reply.likes_count + 1
                    : reply.likes_count - 1,
                liked_by_loggedin_user: actionType === "increment",
              };
            });

            return {
              ...state,
              replies,
            };
          });
        }
      },

      removePost: async (postId, postType) => {
        try {
          if (postType === "reply") {
            // Update replies count in post
            const { decrementPostRepliesCount } = useFeedStore.getState();
            decrementPostRepliesCount(get().postId);
          }
          set((state) => ({
            posts:
              postType === "reply"
                ? state.posts.map((post) => {
                    if (post._id === get().postId) {
                      return {
                        ...post,
                        replies_count: post.replies_count - 1,
                      };
                    }
                    return post;
                  })
                : state.posts.filter((post) => post._id !== postId),
            replies: state.replies.filter((reply) => reply._id !== postId),
          }));
        } catch (error: any) {
          customLog(error, ["development"]);
        }
      },

      addNewReply: (reply) => {
        // Filter out the post if it already exists in the store
        if (get().replies.some((stateReply) => stateReply._id === reply._id))
          return;

        set((state) => ({
          replies: [reply, ...state.replies],
        }));
      },

      updatePost: (postId, postUpdater) => {
        set((state) => ({
          posts: state.posts.map((statePost) => {
            if (statePost._id === postId) {
              return {
                ...statePost,
                ...(postUpdater(statePost) as Post),
              };
            }
            return statePost;
          }),
        }));
      },

      resetStore: (postId, loading = "idle") => {
        set({
          postId,
          posts: [],
          postLoading: loading,
          replies: [],
          repliesLoading: loading,
          repliesOffset: 0,
        });
      },

      replaceEditedPost: (post) => {
        set((state) => ({
          posts: state.posts.map((statePost) => {
            if (statePost._id === post._id) {
              return post;
            }
            return statePost;
          }),
          replies: state.replies.map((reply) => {
            if (reply._id === post._id) {
              return post;
            }
            return reply;
          }),
        }));
      },

      createPostViewInStore: (postId) => {
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post._id === postId) {
              return { ...post, viewed_by_loggedin_user: true };
            }
            return post;
          }),
          replies: state.replies.map((reply) => {
            if (reply._id === postId) {
              return { ...reply, viewed_by_loggedin_user: true };
            }
            return reply;
          }),
        }));
      },

      updateRepliesCountForReply: (actionType, postId) => {
        if (!postId) return;

        set((state) => {
          const replies = state.replies.map((reply) => {
            if (reply._id !== postId) {
              return reply;
            }

            return {
              ...reply,
              replies_count:
                actionType === "increment"
                  ? reply.replies_count + 1
                  : reply.replies_count - 1,
            };
          });

          return {
            ...state,
            replies,
          };
        });
      },
    }),
    { name: "SinglePostStore" }
  )
);
