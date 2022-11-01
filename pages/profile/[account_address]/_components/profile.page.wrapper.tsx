// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";
import { useRouter } from "next/router";

// Directory Import
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import {
  MessagesCard,
  ProfileDetailCard,
  RecentActivitiesCard,
} from "@/components/feed.components";
import ProfileDetailCardSkeleton from "@/components/loading.skeletons/profile.detail.card";

import ProfileHeader from "./profile.header";

interface AllPagesWrapperProps {
  children: React.ReactNode;
}

export const ProfilePageWrapper: React.FC<AllPagesWrapperProps> = (props) => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { user, loading: userLoading } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );

  return (
    <div className={componentWrapper}>
      <ProfileHeader />
      <div>
        <div>
          <div className={`flex gap-5`}>
            <div
              className={`w-full max-w-[272px]  flex-col gap-3 hidden lg:flex`}
            >
              <div className={`lg:sticky lg:top-0 flex flex-col gap-4`}>
                {userLoading === "loaded" && user ? (
                  <ProfileDetailCard
                    user={user}
                    isLoggedInUser={
                      user.account_address === loggedInUser?.account_address
                    }
                  />
                ) : (
                  <ProfileDetailCardSkeleton />
                )}
                {/* <DiscoverCard /> */}
              </div>
            </div>

            <div className="sm:w-full lg:w-[544px] space-y-3">
              {props.children}
            </div>

            <div
              className={`w-full max-w-[272px] flex-col gap-3 hidden xl:flex`}
            >
              <MessagesCard />
              <RecentActivitiesCard />
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
