// React, Next, NPM Packages
import { useEffect, useState } from "react";
import { NextPage } from "next";
import ctl from "@netlify/classnames-template-literals";
import { toast } from "react-hot-toast";

// App imports
import useUser from "@/hooks/use.user";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { Post } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";

// Current page imports
import {
  ProfileDetailCard,
  DiscoverCard,
  MessagesCard,
  RecentActivitiesCard,
  PostCard,
  SinglePost,
} from "@/pages.components/feed";

const Feed: NextPage = () => {
  const { user: loggedInUser, isLoading: isLoggedInUserLoading } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchFeedsData();
  }, []);

  const fetchFeedsData = async () => {
    try {
      const { data } = await axiosNodeApi.get("/api/socials/posts");
      setPosts(data.posts);
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
            {!isLoggedInUserLoading && loggedInUser ? (
              <ProfileDetailCard user={loggedInUser} isLoggedInUser={true} />
            ) : (
              <>Loading...</>
            )}
            <DiscoverCard />
          </div>
          <div className={postsContainer}>
            <PostCard />
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
stakingpack bg-black-shade-3 w-full min-h-screen font-monto
`);
const title = ctl(`
textGradient  font-semibold leading-[42px]  pb-6 animationTextHeading text-34px
`);
const feedContainer = ctl(`
flex justify-center gap-5
`);
const leftSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden lg:flex
`);
const rightSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden xl:flex
`);
const postsContainer = ctl(`
w-full lg:w-[544px] flex flex-col gap-3 overflow-y-scroll h-[calc(100vh-60px)]
`);
