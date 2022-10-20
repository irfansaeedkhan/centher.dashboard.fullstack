// React, Next, NPM Packages
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ctl from "@netlify/classnames-template-literals";
import { toast } from "react-hot-toast";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { Post } from "@/models/post";
import { LoadingState } from "@/models/common";
import { axiosNodeApi } from "@/utils/axios";
import { AppRoutes } from "@/constants/app.routes";

// Current page imports
import {
  MessagesCard,
  RecentActivitiesCard,
  SinglePost,
  LeftSidebarStickyContainer,
} from "@/components/feed.components";

const SinglePostPage: NextPageWithLayout = () => {
  const [post, setPost] = useState<Post>();
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const router = useRouter();

  useEffect(() => {
    const fetchSinglePostData = async () => {
      setLoadingState("loading");
      try {
        // Get Single Post By ID
        const { data } = await axiosNodeApi.get(`/api/socials/posts/${postId}`);

        setPost(data.post);
        setLoadingState("loaded");
      } catch (error: any) {
        setLoadingState("failed");
        toast.error(
          error.response.data?.message_description || "Something went wrong"
        );
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
      {loadingState === "loaded" && post && (
        <div className={postsMainContainer}>
          {post.parent_post ? (
            <Link
              href={{
                pathname: AppRoutes.feed.single_post,
                query: {
                  account_address: post.parent_post.user.account_address,
                  post_id: post.parent_post._id,
                },
              }}
            >
              <a className={backBtn}>Back</a>
            </Link>
          ) : (
            <Link
              href={{
                pathname: AppRoutes.feed.index,
              }}
            >
              <a className={backBtn}>Back</a>
            </Link>
          )}
          <SinglePost
            post={post}
            onDelete={() => {
              router.replace(AppRoutes.feed.index);
            }}
          />
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
const title = ctl(`
textGradient  font-semibold leading-[42px]  pb-6 animationTextHeading lg:text-[34px] sm:text-2xl
`);
const feedContainer = ctl(`
flex flex-col lg:flex-row  gap-5 lg:items-start
`);
const leftSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden lg:flex
`);
const rightSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden xl:flex
`);
const postsContainer = ctl(`
w-full max-w-[544px] flex flex-col gap-3 pb-24 lg:mt-[1.3rem]
`);
const backBtn = ctl(`
text-brand-primary text-[11px] px-4 py-2 bg-brand-primary/10 rounded-full hover:bg-brand-primary hover:text-black-shade-2 transition font-medium w-fit 
`);
const postsMainContainer = ctl(`
flex flex-col gap-3
`);
const leftSidebarStickyContainer = ctl(`
lg:sticky  lg:top-0
`);
