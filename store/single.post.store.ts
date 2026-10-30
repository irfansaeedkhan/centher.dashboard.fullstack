import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { CompletedPost, Post } from "@/models/post";
import type { LoadingState } from "@/models/common";
import { likePost } from "@/components/feed.components";
import { axiosApi } from "@/utils/axios";
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

  // Feed-grill Q10: keyset cursor for reply paging (last reply id of
  // the previous page); repliesOffset is only the load-more trigger.
  repliesCursor: string | null;
  repliesHasMore: boolean;

  fetchPost: (isAuthenticated: boolean) => Promise<void>;
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
        set((state) => ({ repliesOffset: state.repliesOffset + 1 })),

      repliesCursor: null,
      repliesHasMore: true,

      posts: [],
      replies: [],

      fetchPost: async (isAuthenticated: boolean) => {
        // Post-grill Q6: capture the post this fetch is FOR. Responses
        // that land after the user navigated to another post (or the
        // store was reset) are discarded — a slow load for post A must
        // never overwrite or contaminate post B's thread.
        const requestedPostId = get().postId;
        if (!requestedPostId) return;

        // Soft refresh (Q7): if we already hold content, don't blank
        // the page back to a skeleton — just swap the data in when it
        // arrives (e.g. the anon → with-auth upgrade fetch).
        if (get().posts.length === 0) {
          set({ postLoading: "loading", repliesLoading: "loading" });
        }

        let postUrl = `/api/socials/posts/${requestedPostId}`;
        let repliesUrl = `/api/socials/posts/${requestedPostId}/replies`;
        if (
          isAuthenticated &&
          process.env.NEXT_PUBLIC_APP_ENV !== "development"
        ) {
          postUrl += "/with-auth";
          repliesUrl += "/with-auth";
        }

        // Post-grill Q9: the two loads are decoupled — a replies
        // failure no longer takes the whole post page down with it.
        const [postResult, repliesResult] = await Promise.allSettled([
          axiosApi.get(postUrl),
          axiosApi.get(repliesUrl),
        ]);

        if (get().postId !== requestedPostId) return; // Q6: stale

        if (postResult.status === "rejected") {
          const status = postResult.reason?.response?.status;
          // Post-grill Q19: a malformed id is a 400 from the server's
          // uuid parse — that's a bad address, not a server fire. It
          // resolves to the same "does not exist" state as a 404.
          if (status === 404 || status === 400) {
            set({
              posts: [],
              postLoading: "loaded",
              replies: [],
              repliesLoading: "loaded",
              repliesCursor: null,
              repliesHasMore: false,
            });
          } else {
            set({ postLoading: "failed" });
            customLog(["development"], postResult.reason);
          }
          return;
        }

        set({
          posts: postResult.value.data.posts as Post[],
          postLoading: "loaded",
        });

        if (repliesResult.status === "fulfilled") {
          const repliesRes = repliesResult.value;
          set({
            replies: repliesRes.data.posts,
            repliesLoading: "loaded",
            repliesCursor: repliesRes.data.next_cursor ?? null,
            repliesHasMore:
              repliesRes.data.has_more ?? repliesRes.data.next_cursor != null,
          });
        } else {
          // The post renders; the page shows a replies error row with
          // its own retry (Q9).
          set({ repliesLoading: "failed" });
          customLog(["development"], repliesResult.reason);
        }
      },

      fetchReplies: async () => {
        const postId = get().postId;
        const cursor = get().repliesCursor;

        if (!postId) return;

        // Post-grill Q9: with no cursor and no replies held, this is
        // the retry path for a failed FIRST page (fetchPost's replies
        // leg) — load page 1 and replace. With replies already held
        // and no cursor, there is no next page.
        const isFirstPageRetry = !cursor && get().replies.length === 0;
        if (!isFirstPageRetry && (!cursor || !get().repliesHasMore)) {
          set({ repliesLoading: "loaded" });
          return;
        }

        set({ repliesLoading: "loading" });

        try {
          const repliesLimit = 10;
          const repliesUrl = isFirstPageRetry
            ? `/api/socials/posts/${postId}/replies?limit=${repliesLimit}`
            : `/api/socials/posts/${postId}/replies?cursor=${encodeURIComponent(
                cursor!
              )}&limit=${repliesLimit}`;

          const { data } = await axiosApi.get(repliesUrl);

          // Q6: discard if the store moved on, or if a newer first
          // page landed while this page was in flight.
          if (get().postId !== postId) return;
          if (!isFirstPageRetry && get().repliesCursor !== cursor) return;

          const _replies = data.posts as CompletedPost[];

          if (isFirstPageRetry) {
            set({
              replies: _replies,
              repliesLoading: "loaded",
              repliesCursor: data.next_cursor ?? null,
              repliesHasMore: data.has_more ?? data.next_cursor != null,
            });
            return;
          }

          const filteredStateReplies = get().replies.filter(
            (stateReply) =>
              !_replies.some(
                (reply: CompletedPost) => stateReply._id === reply._id
              )
          );

          set({
            replies: [...filteredStateReplies, ..._replies] as CompletedPost[],
            repliesLoading: "loaded",
            repliesCursor: data.next_cursor ?? null,
            repliesHasMore: data.has_more ?? data.next_cursor != null,
          });
        } catch (error) {
          if (get().postId === postId) {
            set({ repliesLoading: "failed" });
          }
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
          customLog(["development"], error);
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
          customLog(["development"], error);
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
          repliesCursor: null,
          repliesHasMore: true,
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
    {
      name: "SinglePostStore",
      enabled: process.env.NEXT_PUBLIC_APP_ENV !== "production",
    }
  )
);
