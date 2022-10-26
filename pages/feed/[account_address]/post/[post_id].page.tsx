// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import {
  MessagesCard,
  RecentActivitiesCard,
  SinglePost,
  LeftSidebarStickyContainer,
} from "@/components/feed.components";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import SinglePostTextCardSkeleton from "@/components/loading.skeletons/single.post.text";
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
    <div className={postsContainer}>
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

          {/* TODO: Waqar - create part according to design for deleted post */}
          {post?.status === "deleted" && (
            <NoPostMessage message="The post was deleted by author." />
          )}

          {!post && <NoPostMessage message="The post does not exist." />}
        </div>
      )}

      {loadingState === "loading" && (
        <>
          <SinglePostCardSkeleton />
          <SinglePostTextCardSkeleton />
          <SinglePostCardSkeleton />
        </>
      )}

      {loadingState === "failed" && (
        <div className={postsMainContainer}>
          <BackButton post={post} />
          <NoPostMessage message="Something went wrong!" />
        </div>
      )}
    </div>
  );
};

SinglePostPage.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Feed">
      <div className={dashboardContentContainer}>
        <div className={feedContainer}>
          <LeftSidebarStickyContainer />

          {page}

          <div className={rightSidebar}>
            <MessagesCard />
            <RecentActivitiesCard />
          </div>
        </div>
      </div>
    </AllPagesWrapper>
  );
};

export default SinglePostPage;

// styling
const dashboardContentContainer = ctl(`
 bg-black-shade-3 w-full flex flex-start min-h-screen font-monto max-w-[544px] lg:max-w-[835px] mx-auto
`);

const feedContainer = ctl(`
flex flex-col lg:flex-row  gap-5 lg:items-start
`);

const rightSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden xl:flex
`);
const postsContainer = ctl(`
w-full max-w-[544px] flex flex-col gap-3 pb-24 lg:mt-[1.3rem]
`);

const postsMainContainer = ctl(`
flex flex-col gap-3
`);
