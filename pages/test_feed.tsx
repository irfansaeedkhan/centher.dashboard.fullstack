// React, Next, NPM Packages
import { useEffect, useState } from "react";
import { NextPage } from "next";
import ctl from "@netlify/classnames-template-literals";
import { toast } from "react-hot-toast";

// App imports
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { Post } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";

// Current page imports
import {
  ProfileDetailCard,
  DiscoverCard,
  MessagesCard,
  RecentActivitiesCard,
  //PostCard,
  PostCardNew,
  SinglePost,
  posts as dummyPosts,
} from "@/pages.components/feed";

const Feed: NextPage = () => {
  // states
  const [posts, setPosts] = useState<Post[]>(dummyPosts);

  useEffect(() => {
    fetchFeedsData();
  }, []);

  const fetchFeedsData = async () => {
    try {
      // Create a user with registration_pending state in database
      const { data } = await axiosNodeApi.get("/api/socials/posts");
      setPosts(data.postData);
    } catch (error: any) {
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  };

  return (
    <AllPagesWrapper pageTitle="Feed">
      <div className={dashboardContentContainer}>
        <h1 className={title}>My Feed</h1>
        <div className={feedContainer}>
          <div className={leftSidebar}>
            <ProfileDetailCard />
            <DiscoverCard />
          </div>
          <div className={postsContainer}>
            <PostCardNew />
            {posts
              ?.filter((p) => !p.parent_post)
              .map((post) => (
                <SinglePost key={post._id} post={post} />
              ))}
          </div>
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
stakingpack bg-black-shade-3 w-full min-h-screen font-monto max-w-[544px] lg:max-w-[835px] mx-auto
`);
const title = ctl(`
textGradient  font-semibold leading-[42px]  pb-6 animationTextHeading text-34px
`);
const feedContainer = ctl(`
flex  gap-5
`);
const leftSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden lg:flex
`);
const rightSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden xl:flex
`);
const postsContainer = ctl(`
w-full max-w-[544px] flex flex-col gap-3 overflow-y-scroll h-[calc(100vh-60px)]
`);
