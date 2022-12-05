import React from "react";
import clsx from "clsx";

import { MessagesCard } from "@/components/feed.components";

import ProfileHeader from "./profile.header";
import { ProfileTabs } from "./profile.tabs";
import { CardsContainerLeft } from "./cards.container.left";
import { useRouter } from "next/router";

interface AllPagesWrapperProps {
  children: React.ReactNode;
  currentTab: "nft-profile" | "social-profile";
}

export const ProfilePageWrapper: React.FC<AllPagesWrapperProps> = (props) => {
  const router = useRouter();
  return (
    <>
      <div className="w-full max-w-[1136px] mx-auto">
        <ProfileTabs />

        <div
          className={clsx(
            `grid justify-center gap-4 flg:gap-6 grid-cols-[1fr_minmax(0,544px)_1fr] flg:grid-cols-[1fr_minmax(0,272px)_minmax(0,544px)_1fr] f2xl:grid-cols-[minmax(0,272px)_minmax(0,544px)_minmax(0,272px)] grid-rows-[auto_1fr]`
          )}
        >
          <ProfileHeader
            param_account_address={router.query.account_address?.toString()}
            className="row-start-1 row-end-2 col-span-full f2xl:col-start-2 overflow-auto"
          />

          <CardsContainerLeft className="flg:row-start-2 flg:col-start-2 flg:col-span-1 f2xl:col-start-1 f2xl:row-start-1 f2xl:row-end-3" />

          <div
            className={clsx(
              `row-start-2 col-span-full fsm:col-start-2 fsm:col-span-1 flg:col-start-3 f2xl:col-start-2`,
              props.currentTab === "social-profile" && `f2xl:col-span-1`,
              props.currentTab === "nft-profile" && `f2xl:col-span-full`
            )}
          >
            {props.children}
          </div>

          {props.currentTab === "social-profile" && (
            <div className={`hidden f2xl:block space-y-3 f2xl:col-start-3`}>
              <MessagesCard className="sticky top-[84px]" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
