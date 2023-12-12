import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { useSinglePostStore } from "@/store/single.post.store";
import { User } from "@/models/user";
import { AppRoutes } from "@/constants/app.routes";
import ProfileDetailCardSkeleton from "@/components/loading.skeletons/profile.detail.card";
import { ProfileDetailCard } from "./profile.detail.card";
import {
  PromotionCard2,
  PromotionCard4,
  PromotionCard5,
  PromotionCard7,
} from "./promotion.cards";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const CardsContainerLeft: React.FC<Props> = ({
  className,
  ...props
}) => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const postAuthorId = useSinglePostStore((state) => state.posts[0]?.user._id);
  const { user } = useGetUser(postAuthorId);
  const [profileCardUser, setProfileCardUser] = useState<User | null>(null);

  useEffect(() => {
    if (
      loggedInUser &&
      (router.pathname === AppRoutes.feed.index ||
        router.pathname === AppRoutes.recommended)
    ) {
      setProfileCardUser(loggedInUser);
    } else if (user && router.pathname === AppRoutes.feed.single_post) {
      setProfileCardUser(user);
    } else {
      setProfileCardUser(null);
    }

    return () => {
      setProfileCardUser(null);
    };
  }, [router, user, loggedInUser]);

  return (
    <div
      className={clsx(`hidden max-w-[272px] space-y-3 flg:block`, className)}
      {...props}
    >
      {profileCardUser ? (
        <>
          <ProfileDetailCard user={profileCardUser} />
          {loggedInUser?.membership.status !== "citizen" && <PromotionCard5 />}
          <PromotionCard7 />
          <PromotionCard4 />
          <PromotionCard2 />
        </>
      ) : (
        <ProfileDetailCardSkeleton />
      )}
    </div>
  );
};
