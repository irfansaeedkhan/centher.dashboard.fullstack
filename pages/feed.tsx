// React, Next, NPM Packages
import { NextPage } from "next";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Button from "@/components/button";

// Current page imports
import {
  ProfileDetailCard,
  DiscoverCard,
  MessagesCard,
  RecentActivitiesCard,
  PostCard,
} from "@/pages.components/feed";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

const Feed: NextPage = () => {
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
            <PostCard />
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
textGradient  font-semibold leading-[42px] font-medium pb-6 animationTextHeading text-34px
`);
const feedContainer = ctl(`
flex justify-between gap-5
`);
const leftSidebar = ctl(`
w-full max-w-[272px] flex flex-col gap-3
`);
const rightSidebar = ctl(`
w-full max-w-[272px] flex flex-col gap-3
`);
const postsContainer = ctl(`
w-full flex flex-col gap-3
`);
