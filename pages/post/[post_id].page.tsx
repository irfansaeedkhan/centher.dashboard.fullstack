import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";

import { useProfileCardStore } from "@/store/profile.card.store";
import { useFeedStore } from "@/store/feed.store";
import { useNewPostStore } from "@/store/new.post.store";
import { useSinglePostStore } from "@/store/single.post.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import {
  FeedPagesWrapper,
  SinglePostV2,
  archivePost,
  deletePost,
  createPostView,
} from "@/components/feed.components";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import { PostModal } from "@/components/feed.components/create.post/post.modal";
import { ArchivedPost, CompletedPost, Post } from "@/models/post";
import { customLog } from "@/utils/custom.log";
import { AppRoutes } from "@/constants/app.routes";

import { BackButton, NoPostMessage } from "./_components";

const SinglePostPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const {
    posts,
    fetchPost,
    resetStore,
    postLoading,
    replies,
    repliesOffset,
    fetchReplies,
    likePostAPI,
    updateRepliesOffset,
    removePost,
    createPostViewInStore,
  } = useSinglePostStore();

  const feedStore = useFeedStore((state) => ({
    removePost: state.removePost,
  }));

  const { firstPost, threadPosts } = useMemo(() => {
    if (!!posts.length) {
      const firstPostIndex = posts.findIndex(
        (p) => p._id === router.query.post_id
      );

      if (firstPostIndex === -1) {
        return { firstPost: null, threadPosts: [] };
      }

      return {
        firstPost: posts[firstPostIndex] as Post,
        threadPosts: [
          ...posts
            .filter((p) => p.status !== "deleted")
            .slice(firstPostIndex + 1),
        ] as (CompletedPost | ArchivedPost)[],
      };
    }

    return { firstPost: null, threadPosts: [] };
  }, [posts, router.query.post_id]);

  const openPostModal = useNewPostStore((state) => state.openModal);

  const [lastReplyRef, _lastReplyInView, lastReplyEntry] = useInView();

  useEffect(() => {
    if (lastReplyEntry?.isIntersecting) {
      updateRepliesOffset();
    }
  }, [lastReplyRef, lastReplyEntry, updateRepliesOffset]);

  useEffect(() => {
    if (repliesOffset > 0) {
      fetchReplies();
    }
  }, [fetchReplies, repliesOffset]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (router.query.post_id) {
      resetStore(router.query.post_id.toString().toLowerCase(), "loading");
      fetchPost();
    }

    return () => {
      resetStore("", "idle");
    };
  }, [router.query.post_id, resetStore, fetchPost]);

  const handleAction = async (
    postId: string,
    postType: "main" | "reply" | "thread-post",
    actionFunction: (postId: string) => Promise<void>
  ) => {
    try {
      await actionFunction(postId);
      if (postType === "reply" || postType === "thread-post") {
        removePost(postId, postType);
      } else {
        feedStore.removePost(postId);

        // Decrement post count on profile card
        useProfileCardStore.getState().decrementPostsCount();

        router.replace(AppRoutes.feed.index);
      }
    } catch (error: any) {
      customLog(error, ["development"]);
    }
  };

  const handleCreatePostView = async (postId: string) => {
    try {
      await createPostView(postId);
      createPostViewInStore(postId);
    } catch (error: any) {
      customLog(error, ["development"]);
    }
  };

  return (
    <>
      <BackButton className="mb-3" />

      {postLoading === "loaded" && (
        <>
          {firstPost?.status === "complete" && (
            <SinglePostV2
              key={firstPost._id}
              post={firstPost}
              parentPost={
                firstPost.parent_post
                  ? firstPost.parent_post
                  : firstPost.thread_index && firstPost.thread_index > 0
                  ? posts[0]
                  : undefined
              }
              postType={
                firstPost.parent_post
                  ? "reply-w-parent-header"
                  : !!firstPost.thread_index // means if thread_index is not undefined or greater than 0
                  ? "thread-post-w-parent-header"
                  : "main"
              }
              placement={"single-post-page"}
              borderRadius={{
                top: true,
                bottom:
                  threadPosts.length > 0 || replies.length > 0 ? false : true,
              }}
              onClickLike={async () => {
                await likePostAPI(
                  firstPost._id,
                  firstPost.liked_by_loggedin_user ? "unlike" : "like",
                  "main"
                );
              }}
              onClickReply={() => {
                setIsReplyModalOpen(true);
                openPostModal({
                  modalType: "reply",
                  parentPostId: firstPost._id,
                  onCloseModal: () => setIsReplyModalOpen(false),
                  shouldAddNewPost: true,
                });
              }}
              onClickArchive={() =>
                handleAction(firstPost._id, "main", archivePost)
              }
              onClickDelete={() =>
                handleAction(firstPost._id, "main", deletePost)
              }
              onPostInViewport={() => handleCreatePostView(firstPost._id)}
            />
          )}

          {firstPost?.status === "deleted" && (
            <NoPostMessage
              message="The post was deleted by author."
              className={clsx(firstPost.replies_count > 0 && "rounded-b-none")}
            />
          )}

          {threadPosts.map((post) => {
            return (
              <div
                key={post._id}
                onClick={() => {
                  router.push({
                    pathname: AppRoutes.feed.single_post,
                    query: {
                      post_id: post._id,
                    },
                  });
                }}
              >
                <SinglePostV2
                  post={post}
                  parentPost={undefined}
                  postType={"thread-post"}
                  placement={"single-post-page"}
                  borderRadius={{
                    top: false,
                    bottom:
                      // if it is last post in threadPosts and there are no replies
                      threadPosts[threadPosts.length - 1]._id === post._id &&
                      replies.length === 0
                        ? true
                        : false,
                  }}
                  onClickLike={async () => {
                    await likePostAPI(
                      post._id,
                      post.liked_by_loggedin_user ? "unlike" : "like",
                      "thread-post"
                    );
                  }}
                  onClickReply={() => {
                    setIsReplyModalOpen(true);
                    openPostModal({
                      modalType: "reply-of-thread-post",
                      parentPostId: post._id,
                      onCloseModal: () => setIsReplyModalOpen(false),
                      shouldAddNewPost: true,
                    });
                  }}
                  onClickArchive={() =>
                    handleAction(post._id, "thread-post", archivePost)
                  }
                  onClickDelete={() =>
                    handleAction(post._id, "thread-post", deletePost)
                  }
                  onPostInViewport={() => handleCreatePostView(post._id)}
                />
              </div>
            );
          })}

          {replies.map((reply) => {
            return (
              <div
                key={reply._id}
                onClick={() => {
                  router.push({
                    pathname: AppRoutes.feed.single_post,
                    query: {
                      post_id: reply._id,
                    },
                  });
                }}
              >
                <SinglePostV2
                  post={reply}
                  postType={"reply"}
                  placement={"single-post-page"}
                  parentPost={reply.parent_post}
                  borderRadius={{
                    top: false,
                    bottom:
                      // if it is last post in replies and there are no more replies to fetch
                      replies[replies.length - 1]._id === reply._id
                        ? true
                        : false,
                  }}
                  onClickLike={async () => {
                    await likePostAPI(
                      reply._id,
                      reply.liked_by_loggedin_user ? "unlike" : "like",
                      "reply"
                    );
                  }}
                  onClickReply={() => {
                    setIsReplyModalOpen(true);
                    openPostModal({
                      modalType: "reply-of-reply",
                      parentPostId: reply._id,
                      onCloseModal: () => setIsReplyModalOpen(false),
                      shouldAddNewPost: true,
                    });
                  }}
                  onClickArchive={() =>
                    handleAction(reply._id, "reply", archivePost)
                  }
                  onClickDelete={() =>
                    handleAction(reply._id, "reply", deletePost)
                  }
                  onPostInViewport={() => handleCreatePostView(reply._id)}
                />
              </div>
            );
          })}

          {/* For fetch on scroll */}
          {!!replies.length && <div ref={lastReplyRef} />}

          {(!posts || !posts.length) && (
            <NoPostMessage message="The post does not exist." />
          )}
        </>
      )}

      {(postLoading === "loading" || postLoading === "idle") && (
        <SinglePostCardSkeleton />
      )}

      {postLoading === "failed" && (
        <NoPostMessage message="Something went wrong!" />
      )}

      {isReplyModalOpen && <PostModal modalTitle="Reply" />}
    </>
  );
};

SinglePostPage.getLayout = (page) => {
  return (
    <FeedPagesWrapper>
      <div className={`mx-auto w-full`}>{page}</div>
    </FeedPagesWrapper>
  );
};

export default SinglePostPage;
