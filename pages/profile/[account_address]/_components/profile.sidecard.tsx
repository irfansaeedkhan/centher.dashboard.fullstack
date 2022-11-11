// React, Next, NPM Packages
import React from "react";
import { useRouter } from "next/router";
import ctl from "@netlify/classnames-template-literals";

// App imports
import useGetUser from "@/hooks/use.get.user";
import { UserImage } from "@/models/user";

// Current directory imports
import { ProfileDetailCard } from "@/components/feed.components";
import ProfileDetailCardSkeleton from "@/components/loading.skeletons/profile.detail.card";
import PromotionCard from "@/components/feed.components/promotion.card";
import PromotionCard2nd from "@/components/feed.components/promotion.card.2nd";

type CoverImageWithFile = Partial<UserImage> & {
  blob: File | null;
  newImage: boolean;
};

const ProfileSideCard: React.FC = () => {
  const router = useRouter();
  const {
    user,
    mutateUser,
    loading: userLoading,
  } = useGetUser(router.query.account_address?.toString()?.toLowerCase());

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
export default ProfileSideCard;

// styling
const profilePageHeader = ctl(`
w-full max-w-[1136px] mx-auto
`);
