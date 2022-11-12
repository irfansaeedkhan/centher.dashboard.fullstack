import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { NextPageWithLayout } from "@/pages/_app.page";
import { SinglePost, FeedPagesWrapper } from "@/components/feed.components";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import { Post } from "@/models/post";
import { LoadingState } from "@/models/common";
import { axiosNodeApi } from "@/utils/axios";
import { AppRoutes } from "@/constants/app.routes";

import { BackButton, NoPostMessage } from "./_components";

const SinglePostPage: NextPageWithLayout = () => {
  const [post, setPost] = useState<Post>();
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchSinglePostData = async () => {
      setLoadingState("loading");
      try {
        // Get Single Post By ID
        const { data } = await axiosNodeApi.get(`/api/socials/posts/${postId}`);

        setPost(data.post);
        setLoadingState("loaded");
      } catch (error: any) {
        if (error.response?.status === 404) {
          setLoadingState("loaded");
          return;
        }
        setLoadingState("failed");
      }
    };

    const accountAddress = router?.query?.account_address
      ?.toString()
      ?.toLowerCase();
    const postId = router?.query?.post_id?.toString();

    if (accountAddress && postId) {
      fetchSinglePostData();
    }
  }, [router]);

  return (
    <>
      {loadingState === "loaded" && (
        <div className={postsMainContainer}>
          <BackButton post={post} />

          {post?.status === "complete" && (
            <SinglePost
              post={post}
              onDelete={() => {
                router.replace(AppRoutes.feed.index);
              }}
            />
          )}

          {post?.status === "deleted" && (
            <NoPostMessage message="The post was deleted by author." />
          )}

          {!post && <NoPostMessage message="The post does not exist." />}
        </div>
      )}

      {(loadingState === "loading" || loadingState === "idle") && (
        <div className="mt-9">
          <SinglePostCardSkeleton />
        </div>
      )}

      {loadingState === "failed" && (
        <div className={postsMainContainer}>
          <BackButton post={post} />
          <NoPostMessage message="Something went wrong!" />
        </div>
      )}
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
