// React, Next, NPM Packages
import React from "react";
import { useRouter } from "next/router";
import clsx from "clsx";

// App imports
import useGetUser from "@/hooks/use.get.user";
import {
  PromotionCard1,
  PromotionCard2,
} from "@/components/feed.components/promotion.cards";
import { ProfileDetailCard } from "@/components/feed.components";
import ProfileDetailCardSkeleton from "@/components/loading.skeletons/profile.detail.card";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const ProfileSideCard: React.FC<Props> = ({ className, ...props }) => {
  const router = useRouter();
  const { user } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );

  return (
    <div
      className={clsx(`hidden flg:block max-w-[272px] space-y-3`, className)}
      {...props}
    >
      {user ? (
        <>
          <ProfileDetailCard user={user} />
          <PromotionCard1 />
          <PromotionCard2 className="sticky top-[84px]" />
        </>
      ) : (
        <ProfileDetailCardSkeleton />
      )}
    </div>
  );
};

export default ProfileSideCard;
