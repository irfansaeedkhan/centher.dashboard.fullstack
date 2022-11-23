import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";

import { useFeedStore } from "@/store/feed.store";
import { useNewPostStore } from "@/store/new.post.store";
import { useSinglePostStore } from "@/store/single.post.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import {
  FeedPagesWrapper,
  SinglePostV2,
  archivePost,
  deletePost,
} from "@/components/feed.components";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import { CreatePostModal } from "@/components/feed.components/create.post/create.post.modal";
import { customLog } from "@/utils/custom.log";
import { AppRoutes } from "@/constants/app.routes";

import { BackButton, NoPostMessage } from "./_components";

const SinglePostPage: NextPageWithLayout = () => {
  const router = useRouter();
  const {
    post,
    fetchPost,
    resetStore,
    postLoading,
    replies,
    repliesOffset,
    fetchReplies,
    likePostAPI,
    updateRepliesOffset,
    removeReply,
  } = useSinglePostStore();

  const feedStore = useFeedStore((state) => ({
    removePost: state.removePost,
  }));

  const newPostStore = useNewPostStore((state) => ({
    openModal: state.openModal,
  }));

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
    postType: "main" | "reply",
    actionFunction: (postId: string) => Promise<void>
  ) => {
    try {
      await actionFunction(postId);

      if (postType === "reply") {
        removeReply(postId);
      } else {
        feedStore.removePost(postId);
        router.replace(AppRoutes.feed.index);
      }
    } catch (error: any) {
      customLog(error, ["development"]);
    }
  };

  return (
    <>
      <BackButton className="mb-3" />

      {postLoading === "loaded" && (
        <>
          {post?.status === "complete" && (
            <SinglePostV2
              key={post._id}
              post={post}
              postType={"main"}
              placement={"single-post-page"}
              onClickLike={async () => {
                await likePostAPI(
                  post._id,
                  post.liked_by_loggedin_user ? "unlike" : "like",
                  "main"
                );
              }}
              onClickReply={() => {
                newPostStore.openModal({
                  modalType: "reply",
                  parentPostId: post._id,
                });
              }}
              onClickArchive={() => handleAction(post._id, "main", archivePost)}
              onClickDelete={() => handleAction(post._id, "main", deletePost)}
            />
          )}

          {post?.status === "deleted" && (
            <NoPostMessage
              message="The main post was deleted by author."
              className={clsx(post.replies_count > 0 && "rounded-b-none")}
            />
          )}

          {replies.map((reply) => {
            if (reply._id === replies[replies.length - 1]._id) {
              return (
                <div ref={lastReplyRef} key={reply._id}>
                  <SinglePostV2
                    post={reply}
                    postType={"reply"}
                    placement={"single-post-page"}
                    onClickLike={async () => {
                      await likePostAPI(
                        reply._id,
                        reply.liked_by_loggedin_user ? "unlike" : "like",
                        "reply"
                      );
                    }}
                    onClickReply={() => {
                      router.push({
                        pathname: AppRoutes.feed.single_post,
                        query: {
                          account_address: reply.user.account_address,
                          post_id: reply._id,
                        },
                      });
                    }}
                    onClickArchive={() =>
                      handleAction(reply._id, "reply", archivePost)
                    }
                    onClickDelete={() =>
                      handleAction(reply._id, "reply", deletePost)
                    }
                  />
                </div>
              );
            }
            return (
              <SinglePostV2
                key={reply._id}
                post={reply}
                postType={"reply"}
                placement={"single-post-page"}
                onClickLike={async () => {
                  await likePostAPI(
                    reply._id,
                    reply.liked_by_loggedin_user ? "unlike" : "like",
                    "reply"
                  );
                }}
                onClickReply={() => {
                  router.push({
                    pathname: AppRoutes.feed.single_post,
                    query: {
                      account_address: reply.user.account_address,
                      post_id: reply._id,
                    },
                  });
                }}
                onClickArchive={() =>
                  handleAction(reply._id, "reply", archivePost)
                }
                onClickDelete={() =>
                  handleAction(reply._id, "reply", deletePost)
                }
              />
            );
          })}

          {!post && <NoPostMessage message="The post does not exist." />}
        </>
      )}

      {(postLoading === "loading" || postLoading === "idle") && (
        <SinglePostCardSkeleton />
      )}

      {postLoading === "failed" && (
        <NoPostMessage message="Something went wrong!" />
      )}

      <CreatePostModal modalTitle="Reply" />
    </>
  );
};

SinglePostPage.getLayout = (page) => {
  return (
    <FeedPagesWrapper>
      <div className={`w-full mx-auto`}>{page}</div>
    </FeedPagesWrapper>
  );
};

export default SinglePostPage;
