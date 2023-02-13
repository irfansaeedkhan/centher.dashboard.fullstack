import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";

import { MessagesCard } from "@/components/feed.components";
import UserProfileHeaderSkeleton from "@/components/loading.skeletons/user.profile.header";
import useGetUser from "@/hooks/use.get.user";
import { axiosNodeApi } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";
import { MutualFollowersData } from "@/models/user";

import ProfileHeader from "./profile.header";
import { CardsContainerLeft } from "./cards.container.left";
import { UserNotFound } from "./user.not.found";
import { ProfileTabs } from "./profile.tabs";

interface AllPagesWrapperProps {
  children: React.ReactNode;
  currentTab: "nft-profile" | "social-profile";
}

export const ProfilePageWrapper: React.FC<AllPagesWrapperProps> = (props) => {
  const router = useRouter();

  const {
    user,
    mutateUser,
    loading: loadingGetUser,
  } = useGetUser(router.query.account_address?.toString()?.toLowerCase());

  const [mutualFollowersData, setMutualFollowersData] =
    useState<MutualFollowersData | null>(null);

  useEffect(() => {
    if (router.query.account_address === undefined) return;
    axiosNodeApi
      .get(`/api/users/${router.query.account_address}/mutual-followers`)
      .then((res) => {
        setMutualFollowersData(res.data.mutual_followers);
      })
      .catch((err) => {
        customLog(err, ["development"]);
      });
  }, [router.query.account_address]);

  if (user === null && loadingGetUser === "failed") {
    return <UserNotFound />;
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1136px]">
        <ProfileTabs />

        <div
          className={clsx(
            `grid grid-cols-[1fr_minmax(0,544px)_1fr] grid-rows-[auto_1fr] justify-center gap-4 flg:grid-cols-[1fr_minmax(0,272px)_minmax(0,544px)_1fr] flg:gap-6 f2xl:grid-cols-[minmax(0,272px)_minmax(0,544px)_minmax(0,272px)]`
          )}
        >
          <div
            className={clsx(
              `col-span-full row-start-1 row-end-2 overflow-auto f2xl:col-start-2`
            )}
          >
            {user ? (
              <ProfileHeader
                mutateUser={mutateUser}
                user={user}
                mutualFollowersData={mutualFollowersData}
              />
            ) : (
              <UserProfileHeaderSkeleton />
            )}
          </div>

          <CardsContainerLeft className="flg:col-span-1 flg:col-start-2 flg:row-start-2 f2xl:col-start-1 f2xl:row-start-1 f2xl:row-end-3" />

          <div
            className={clsx(
              `col-span-full row-start-2 fsm:col-span-1 fsm:col-start-2 flg:col-start-3 f2xl:col-start-2`,
              props.currentTab === "social-profile" && `f2xl:col-span-1`,
              props.currentTab === "nft-profile" && `f2xl:col-span-full`
            )}
          >
            {props.children}
          </div>

          {props.currentTab === "social-profile" && (
            <div className={`hidden space-y-3 f2xl:col-start-3 f2xl:block`}>
              <MessagesCard className="sticky top-[84px]" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
