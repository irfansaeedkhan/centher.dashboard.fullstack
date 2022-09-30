// React, Next, NPM Packages
import { useState } from "react";
import { NextPage } from "next";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current page imports
import {
  ProfileDetailCard,
  DiscoverCard,
  MessagesCard,
  RecentActivitiesCard,
  PostCard,
  FeedCardLevel1,
  FeedCardLevel2,
  FeedCardLevel3,
} from "@/pages.components/feed";

const Feed: NextPage = () => {
  // states
  const [postLevel, setPostLevel] = useState<"level1" | "level2" | "level3">(
    "level1"
  );

  // set level functions
  const setLevelFunc: setLevelFunction = (levelVal) => {
    switch (levelVal) {
      case "level1":
        setPostLevel("level1");
        break;
      case "level2":
        setPostLevel("level2");
        break;
      case "level3":
        setPostLevel("level3");
        break;
      default:
        setPostLevel("level1");
        break;
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
          {postLevel === "level1" && (
            <div className={postsContainer}>
              <PostCard />
              <FeedCardLevel1 setLevelFunc={setLevelFunc} />
              <FeedCardLevel1 setLevelFunc={setLevelFunc} />
              <FeedCardLevel1 setLevelFunc={setLevelFunc} />
            </div>
          )}
          {postLevel === "level2" && (
            <div className={postsContainer}>
              <button
                onClick={() => {
                  setLevelFunc("level1");
                }}
                className={backBtn}
              >
                Back
              </button>
              <FeedCardLevel2 setLevelFunc={setLevelFunc} />
            </div>
          )}
          {postLevel === "level3" && (
            <div className={postsContainer}>
              <button
                onClick={() => {
                  setLevelFunc("level2");
                }}
                className={backBtn}
              >
                Back
              </button>
              <FeedCardLevel3 setLevelFunc={setLevelFunc} />
            </div>
          )}
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
flex justify-between gap-5
`);
const leftSidebar = ctl(`
w-full max-w-[272px] flex flex-col gap-3
`);
const rightSidebar = ctl(`
w-full max-w-[272px] flex flex-col gap-3
`);
const postsContainer = ctl(`
w-full flex flex-col gap-3 overflow-y-scroll h-[calc(100vh-60px)]
`);
const backBtn = ctl(`
text-brand-primary text-[11px] px-3 py-2 bg-brand-primary/10 rounded-full hover:bg-brand-primary hover:text-black-shade-2 transition font-medium w-20
`);
// interfaces
type setLevelFunction = (levelVal: "level1" | "level2" | "level3") => void;
