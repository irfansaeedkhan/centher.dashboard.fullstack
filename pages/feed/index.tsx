// React, Next, NPM Packages
import { useState } from "react";
import { NextPage } from "next";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { Post } from "@/models/post";

// Current page imports
import {
  ProfileDetailCard,
  DiscoverCard,
  MessagesCard,
  RecentActivitiesCard,
  PostCard,
  SinglePost,
  posts as dummyPosts,
} from "@/pages.components/feed";

const Feed: NextPage = () => {
  // states

  const [posts, setPosts] = useState<Post[]>(dummyPosts);

  return (
    // <AllPagesWrapper pageTitle="Feed">
    <div className={dashboardContentContainer}>
      <h1 className={title}>My Feed</h1>
      <div className={feedContainer}>
        <div className={leftSidebar}>
          <ProfileDetailCard />
          <DiscoverCard />
        </div>
        <div className={postsContainer}>
          <PostCard />
          {posts
            .filter((p) => !p.parent_post)
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
    // </AllPagesWrapper>
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
w-full max-w-[272px] flex flex-col gap-3
`);
const rightSidebar = ctl(`
w-full max-w-[272px] flex flex-col gap-3
`);
const postsContainer = ctl(`
flex flex-col gap-3 overflow-y-scroll h-[calc(100vh-60px)]
`);
const backBtn = ctl(`
text-brand-primary text-[11px] px-3 py-2 bg-brand-primary/10 rounded-full hover:bg-brand-primary hover:text-black-shade-2 transition font-medium w-20
`);
// interfaces
type setLevelFunction = (levelVal: "level1" | "level2" | "level3") => void;
