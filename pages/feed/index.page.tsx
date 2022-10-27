// React, Next, NPM Packages
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ctl from "@netlify/classnames-template-literals";
import { toast } from "react-hot-toast";
import { Bars } from "react-loader-spinner";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { CompletedPost } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";

// Current page imports
import {
  MessagesCard,
  RecentActivitiesCard,
  PostCardNew,
  SinglePost,
  LeftSidebarStickyContainer,
} from "@/components/feed.components";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import SinglePostTextCardSkeleton from "@/components/loading.skeletons/single.post.text";

const Feed: NextPageWithLayout = () => {
  const [posts, setPosts] = useState<CompletedPost[]>([]);
  const [skip, setSkip] = useState(0);
  const [loader, setLoader] = useState(false);
  const [lastPostRef, lastPostInView, lastPostEntry] = useInView();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (lastPostInView) {
      setSkip(posts.length);
    }
  }, [posts, lastPostRef, lastPostInView, lastPostEntry]);

  const fetchFeedsData = useCallback(async () => {
    setLoader(true);
    try {
      const { data } = await axiosNodeApi.get(
        `/api/socials/posts?offset=${skip}`
      );

      const _posts = data.posts;

      setPosts((prev) => {
        const filteredPosts = _posts.filter((post: CompletedPost) => {
          return prev.every((prevPost) => prevPost._id !== post._id);
        });
        return [...prev, ...filteredPosts];
      });

      setLoader(false);
    } catch (error: any) {
      setLoader(false);
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  }, [skip]);

  useEffect(() => {
    fetchFeedsData();
  }, [fetchFeedsData]);

  return (
    <div className={postsContainer}>
      <PostCardNew
        onPostCreated={(post) => {
          setPosts((prev) => [post, ...prev]);
        }}
      />
      {posts.length > 0
        ? posts.map((post) => {
            if (post._id === posts[posts.length - 1]._id) {
              return (
                <SinglePost
                  ref={lastPostRef}
                  key={post._id}
                  post={post}
                  onDelete={(post_id) => {
                    setPosts(posts.filter((p) => p._id !== post_id));
                  }}
                />
              );
            }
            return (
              // <ScrollTrigger onEnter={()=>onEnterViewport(post._id)} onExit={onExitViewport} key={post._id}>
              <SinglePost
                key={post._id}
                post={post}
                onDelete={(post_id) => {
                  setPosts(posts.filter((p) => p._id !== post_id));
                }}
              />
              // </ScrollTrigger>
            );
          })
        : loader && (
            <>
              <SinglePostCardSkeleton />
              <SinglePostTextCardSkeleton />
              <SinglePostCardSkeleton />
            </>
          )}
    </div>
  );
};

Feed.getLayout = (page) => {
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

export default Feed;

// styling
const dashboardContentContainer = ctl(`
 bg-black-shade-3 w-full h-full font-monto max-w-[544px] lg:max-w-[835px] mx-auto relative
`);

const feedContainer = ctl(`
flex flex-col lg:flex-row  gap-5 lg:items-start 
`);

const rightSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden xl:flex
`);
const postsContainer = ctl(`
w-full max-w-[544px] flex flex-col gap-3 pb-24 lg:mt-[3.5rem]
`);
