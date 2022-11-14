// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";
import { useRouter } from "next/router";

import useGetUser from "@/hooks/use.get.user";
import { MessagesCard } from "@/components/feed.components";

import ProfileHeader from "./profile.header";
import ProfileTabs from "./profile.tabs";
import ProfileSideCard from "./profile.sidecard";

interface AllPagesWrapperProps {
  children: React.ReactNode;
}

export const NFTProfilePageWrapper: React.FC<AllPagesWrapperProps> = (
  props
) => {
  const router = useRouter();
  const { user, loading: userLoading } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );

  return (
    <div className={componentWrapper}>
      <div className="w-full max-w-[1136px] mx-auto">
        <ProfileTabs />
        <div className="flex items-start gap-6">
          <div className="sidecards">
            <ProfileSideCard />
          </div>
          <div className="mainContent flex flex-col gap-6 w-full">
            <ProfileHeader />
            <div className={`flex gap-6`}>
              <div className="sm:w-full lg:w-[544px] flex-grow space-y-3">
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// styling
const componentWrapper = ctl(`
  flex flex-col bg-black-shade-3 w-full max-w-[1236px] mx-auto gap-6
`);
