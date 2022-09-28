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
} from "@/pages.components/feed";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

const Feed: NextPage = () => {
  return (
    <AllPagesWrapper pageTitle="Feed">
      <div className={dashboardContentContainer}>
        <h1 className={title}>Feed</h1>
        <div className="feedContainer flex justify-between">
          <div className="left flex flex-col gap-3">
            <ProfileDetailCard />
            <DiscoverCard />
          </div>
          <div className="center"></div>
          <div className="right flex flex-col gap-3">
            <MessagesCard />
            <MessagesCard />
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
