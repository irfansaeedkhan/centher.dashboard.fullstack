import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { User } from "@/models/user";
import { AppRoutes } from "@/constants/app.routes";

import ProfileDetailCardSkeleton from "../loading.skeletons/profile.detail.card";
import { ProfileDetailCard } from "./profile.detail.card";
import PromotionCard from "./promotion.card";
import PromotionCard2nd from "./promotion.card.2nd";

export const LeftSidebarStickyContainer = () => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { user } = useGetUser(router.query.account_address?.toString());
  const [profileCardUser, setProfileCardUser] = useState<User | null>(null);

  useEffect(() => {
    if (loggedInUser && router.pathname === "/feed") {
      setProfileCardUser(loggedInUser);
    } else if (
      user &&
      router.pathname === AppRoutes.feed.single_post &&
      user.account_address ===
        router.query.account_address?.toString().toLowerCase()
    ) {
      setProfileCardUser(user);
    } else {
      setProfileCardUser(null);
    }

    return () => {
      setProfileCardUser(null);
    };
  }, [router, user, loggedInUser]);

  return (
    <div className={`lg:sticky  lg:top-0`}>
      <h1
        className={`textGradient  font-semibold leading-[42px]  pb-6 animationTextHeading lg:text-[34px] sm:text-2xl`}
      >
        My Feed
      </h1>
      <div className={`w-[272px]  flex-col gap-3 hidden lg:flex`}>
        {profileCardUser ? (
          <>
            <ProfileDetailCard user={profileCardUser} />
            <PromotionCard />
            <PromotionCard2nd />
          </>
        ) : (
          <ProfileDetailCardSkeleton />
        )}

        {/* <DiscoverCard /> */}
      </div>
    </div>
  );
};
