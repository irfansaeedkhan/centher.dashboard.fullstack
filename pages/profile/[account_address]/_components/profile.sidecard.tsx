// React, Next, NPM Packages
import React from "react";
import { useRouter } from "next/router";

// App imports
import useGetUser from "@/hooks/use.get.user";
import {
  PromotionCard1,
  PromotionCard2,
} from "@/components/feed.components/promotion.cards";
import { ProfileDetailCard } from "@/components/feed.components";
import ProfileDetailCardSkeleton from "@/components/loading.skeletons/profile.detail.card";

const ProfileSideCard: React.FC = () => {
  const router = useRouter();
  const { user, loading: userLoading } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );

  return (
    <div className={`w-full max-w-[272px] flex-col gap-3 hidden lg:flex`}>
      <div className={`flex flex-col`}>
        {userLoading === "loaded" && user ? (
          <>
            <ProfileDetailCard user={user} />
          </>
        ) : (
          <ProfileDetailCardSkeleton />
        )}
      </div>
      <div className={`lg:sticky lg:top-0 flex flex-col gap-4`}>
        {userLoading === "loaded" && user ? (
          <>
            <PromotionCard1 />
            <PromotionCard2 />
          </>
        ) : (
          <ProfileDetailCardSkeleton />
        )}
        {/* <DiscoverCard /> */}
      </div>
    </div>
  );
};

export default ProfileSideCard;
