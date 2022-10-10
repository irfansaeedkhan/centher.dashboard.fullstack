// React, Next, NPM Packages
import { useCallback, useEffect, useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import { toast } from "react-hot-toast";

// App imports
import { NextPageWithLayout } from "@/pages/_app";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { Post } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";

// Current page imports
import {
  MessagesCard,
  RecentActivitiesCard,
  PostCardNew,
  SinglePost,
  LeftSidebarStickyContainer,
} from "@/pages.components/feed";

const Feed: NextPageWithLayout = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [skip, setSkip] = useState(0);

  const fetchFeedsData = useCallback(async () => {
    try {
      const { data } = await axiosNodeApi.get(
        `/api/socials/posts?off_set=${skip}`
      );

      const _posts = data.posts;

      setPosts((prev) => {
        const filteredPosts = _posts.filter((post: Post) => {
          return prev.every((prevPost) => prevPost._id !== post._id);
        });
        return [...prev, ...filteredPosts];
      });
    } catch (error: any) {
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  }, [skip]);

  useEffect(() => {
    fetchFeedsData();
  }, [fetchFeedsData]);

  const handleScroll = (event: any): void => {
    const { offsetHeight, scrollTop, scrollHeight } = event.target;

    if (offsetHeight + scrollTop >= scrollHeight) {
      setSkip(posts?.length);
    }
  };

  return (
    <div className={postsContainer} onScroll={handleScroll}>
      <PostCardNew
        onPostCreated={(post) => {
          setPosts((prev) => [post, ...prev]);
        }}
      />
      {posts.map((post) => (
        <SinglePost
          key={post._id}
          post={post}
          onDelete={(post_id) => {
            setPosts(posts.filter((p) => p._id !== post_id));
          }}
        />
      ))}
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
const title = ctl(`
textGradient  font-semibold leading-[42px]  pb-6 animationTextHeading text-34px
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
w-full max-w-[544px] flex flex-col gap-3 overflow-y-scroll  pb-12 lg:mt-[4.125rem]
`);
const leftSidebarStickyContainer = ctl(`
lg:sticky  lg:top-0
`);
