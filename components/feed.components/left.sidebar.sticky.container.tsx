import React from "react";
import ctl from "@netlify/classnames-template-literals";

import useUser from "@/hooks/use.user";

import { ProfileDetailCard } from "./profile.detail.card";
import { DiscoverCard } from "./discover.card";

export const LeftSidebarStickyContainer = () => {
  const { user: loggedInUser, isLoading: isLoggedInUserLoading } = useUser();

  return (
    <div className={leftSidebarStickyContainer}>
      <h1 className={title}>My Feed</h1>
      <div className={leftSidebar}>
        {!isLoggedInUserLoading && loggedInUser && (
          <ProfileDetailCard user={loggedInUser} isLoggedInUser={true} />
        )}
        <DiscoverCard />
      </div>
    </div>
  );
};

const leftSidebarStickyContainer = ctl(`
lg:sticky  lg:top-0
`);

const title = ctl(`
textGradient  font-semibold leading-[42px]  pb-6 animationTextHeading text-34px
`);

const leftSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden lg:flex
`);
