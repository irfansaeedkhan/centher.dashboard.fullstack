// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";
import { Bars } from "react-loader-spinner";

// app imports
import useUser from "@/hooks/use.user";

// same directory imports
import { ProfileDetailCard } from "./profile.detail.card";
import { DiscoverCard } from "./discover.card";
import ProfileDetailCardSkeleton from "../loading.skeletons/profile.detail.card";

export const LeftSidebarStickyContainer = () => {
  const { user: loggedInUser, isLoading: isLoggedInUserLoading } = useUser();

  return (
    <div className={leftSidebarStickyContainer}>
      <h1 className={title}>My Feed</h1>
      <div className={leftSidebar}>
        {!isLoggedInUserLoading && loggedInUser ? (
          <ProfileDetailCard user={loggedInUser} isLoggedInUser={true} />
        ) : (
          <ProfileDetailCardSkeleton />
        )}
        {/* <DiscoverCard /> */}
      </div>
    </div>
  );
};

const leftSidebarStickyContainer = ctl(`
lg:sticky  lg:top-0
`);

const title = ctl(`
textGradient  font-semibold leading-[42px]  pb-6 animationTextHeading lg:text-[34px] sm:text-2xl
`);

const leftSidebar = ctl(`
w-[272px]  flex-col gap-3 hidden lg:flex
`);

const componentLoader = ctl(`componentLoaderContainer min-h-[272px]`);
