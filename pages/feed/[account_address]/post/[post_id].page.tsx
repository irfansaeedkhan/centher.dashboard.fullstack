// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import {
  MessagesCard,
  SinglePost,
  LeftSidebarStickyContainer,
} from "@/components/feed.components";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import { Post } from "@/models/post";
import { LoadingState } from "@/models/common";
import { axiosNodeApi } from "@/utils/axios";
import { AppRoutes } from "@/constants/app.routes";

// Current page imports
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
    <AllPagesWrapper pageTitle="Feed">
      <div className={`max-w-[848px] f2xl:max-w-[1136px] mx-auto relative`}>
        <div
          className={`flex flex-col lg:flex-row lg:items-start lg:gap-8 f2xl:gap-6`}
        >
          <div
            className={`w-full max-w-[272px] lg:sticky lg:top-0 hidden lg:block`}
          >
            <LeftSidebarStickyContainer />
          </div>

          <div className={`w-full max-w-[544px] mx-auto space-y-3 flex-grow`}>
            {page}
          </div>

          <div
            className={`w-full max-w-[272px] hidden f2xl:flex flex-col gap-3 sticky top-0`}
          >
            <MessagesCard />
          </div>
        </div>
      </div>
    </AllPagesWrapper>
  );
};

export default SinglePostPage;

const postsMainContainer = `flex flex-col gap-3`;
