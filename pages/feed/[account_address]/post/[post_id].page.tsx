import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { useSinglePostStore } from "@/store/single.post.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { SinglePost, FeedPagesWrapper } from "@/components/feed.components";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import { CreatePostModal } from "@/components/feed.components/create.post/create.post.modal";
import { AppRoutes } from "@/constants/app.routes";

import { BackButton, NoPostMessage } from "./_components";

const SinglePostPage: NextPageWithLayout = () => {
  const router = useRouter();
  const {
    post,
    fetchPost,
    resetStore,
    postLoading,
    repliesOffset,
    fetchReplies,
  } = useSinglePostStore();

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

  return (
    <>
      {postLoading === "loaded" && (
        <div className={postsMainContainer}>
          <BackButton />

          {post?.status === "complete" && (
            <SinglePost
              post={post}
              onDelete={() => {
                router.replace(AppRoutes.feed.index);
              }}
              placement="single-post-page"
            />
          )}

          {post?.status === "deleted" && (
            <NoPostMessage message="The post was deleted by author." />
          )}

          {!post && <NoPostMessage message="The post does not exist." />}
        </div>
      )}

      {(postLoading === "loading" || postLoading === "idle") && (
        <div className="mt-9">
          <SinglePostCardSkeleton />
        </div>
      )}

      {postLoading === "failed" && (
        <div className={postsMainContainer}>
          <BackButton />
          <NoPostMessage message="Something went wrong!" />
        </div>
      )}

      <CreatePostModal modalTitle="Reply" />
    </>
  );
};

SinglePostPage.getLayout = (page) => {
  return (
    <FeedPagesWrapper>
      <div className={`w-full mx-auto space-y-3`}>{page}</div>
    </FeedPagesWrapper>
  );
};

export default SinglePostPage;

const postsMainContainer = `flex flex-col gap-3`;
