import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { SuggestedCard } from "@/components/feed.components";
import { PromotionCard3 } from "@/components/feed.components/promotion.cards/card-3";
import UserProfileHeaderSkeleton from "@/components/loading.skeletons/user.profile.header";
import { PromotionCard6 } from "@/components/feed.components/promotion.cards/card-6";
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { axiosApi369x } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";
import { MutualFollowersData } from "@/models/user";
import ProfileHeader from "./profile.header";
import { CardsContainerLeft } from "./cards.container.left";
import { UserNotFound } from "./user.not.found";
import { PromotionCard8 } from "@/components/feed.components/promotion.cards";

interface AllPagesWrapperProps {
  children: React.ReactNode;
  currentTab: "nft-profile" | "social-profile";
  messageBox?: boolean;
}

export const ProfilePageWrapper: React.FC<AllPagesWrapperProps> = ({
  children,
  currentTab,
  messageBox = true,
}) => {
  const router = useRouter();

  const { user: loggedInUser } = useUser();
  // Phase 3: do NOT lowercase the id — Better Auth user ids are
  // case-sensitive (e.g. `X2adS8HrUUOnYbdoO26TCcNlw6SHLdak`); lowercasing
  // made every profile page 404 with "User not found".
  const { user, loading: loadingGetUser } = useGetUser(
    router.query.user_id?.toString()
  );

  const [mutualFollowersData, setMutualFollowersData] =
    useState<MutualFollowersData | null>(null);

  useEffect(() => {
    if (router.query.user_id === undefined) return;
    axiosApi369x
      .get(`/api/socials/users/${router.query.user_id}/mutual-followers`)
      .then((res) => {
        setMutualFollowersData(res.data.mutual_followers);
      })
      .catch((err) => {
        customLog(["development"], err);
      });
  }, [router.query.user_id]);

  if (user === null && loadingGetUser === "failed") {
    return <UserNotFound />;
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1136px]">
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
                user={user}
                loggedInUser={loggedInUser}
                mutualFollowersData={mutualFollowersData}
              />
            ) : (
              <UserProfileHeaderSkeleton />
            )}
          </div>

          <CardsContainerLeft
            user={user}
            loggedInUser={loggedInUser ?? null}
            className="flg:col-span-1 flg:col-start-2 flg:row-start-2 f2xl:col-start-1 f2xl:row-start-1 f2xl:row-end-3"
          />

          <div
            className={clsx(
              `col-span-full row-start-2 fsm:col-span-1 fsm:col-start-2 flg:col-start-3 f2xl:col-start-2`,
              currentTab === "social-profile" && `f2xl:col-span-1`,
              currentTab === "nft-profile" && `f2xl:col-span-full`
            )}
          >
            {children}
          </div>

          {currentTab === "social-profile" && messageBox && (
            <div className={`hidden space-y-3 f2xl:col-start-3 f2xl:block`}>
              {loggedInUser && <SuggestedCard />}
              <PromotionCard6 />
              <PromotionCard3 />
              <PromotionCard8 className="sticky top-[84px]" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
