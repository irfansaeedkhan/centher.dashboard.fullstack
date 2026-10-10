import React from "react";
import clsx from "clsx";
import {
  PromotionCard5,
  PromotionCard7,
} from "@/components/feed.components/promotion.cards";
import { ProfileDetailCard } from "@/components/feed.components";
import ProfileDetailCardSkeleton from "@/components/loading.skeletons/profile.detail.card";
import { User } from "@/models/user";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  user: User | null;
  loggedInUser: User | null;
}

export const CardsContainerLeft: React.FC<Props> = ({
  user,
  loggedInUser,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(`hidden max-w-[272px] space-y-3 flg:block`, className)}
      {...props}
    >
      {user ? (
        <>
          <ProfileDetailCard user={user} />
          {loggedInUser?.membership.status !== "citizen" && <PromotionCard5 />}
          <PromotionCard7 />
        </>
      ) : (
        <>
          <ProfileDetailCardSkeleton />
        </>
      )}
    </div>
  );
};
