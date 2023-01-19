import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import useUser from "@/hooks/use.user";
import useGetUserWithPostId from "@/hooks/use.get.user/with.post.id";
import { User } from "@/models/user";
import { AppRoutes } from "@/constants/app.routes";

import ProfileDetailCardSkeleton from "../loading.skeletons/profile.detail.card";
import { ProfileDetailCard } from "./profile.detail.card";
import { PromotionCard1, PromotionCard2 } from "./promotion.cards";

export const CardsContainerLeft = () => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { user } = useGetUserWithPostId(router.query.post_id?.toString());
  const [profileCardUser, setProfileCardUser] = useState<User | null>(null);
  const [postId, setPostId] = useState<string | undefined>("");

  useEffect(() => {
    if (loggedInUser && router.pathname === "/feed") {
      setProfileCardUser(loggedInUser);
    } else if (user && router.pathname === AppRoutes.feed.single_post) {
      const postId = router.query.post_id?.toString();
      setPostId(postId);
      setProfileCardUser(user);
    } else {
      setProfileCardUser(null);
    }

    return () => {
      setProfileCardUser(null);
    };
  }, [router, user, loggedInUser]);

  return (
    <div className={`hidden flg:block max-w-[272px] space-y-3`}>
      {profileCardUser ? (
        <>
          <ProfileDetailCard user={profileCardUser} postId={postId} />
          <PromotionCard1 />
          <PromotionCard2 className="sticky top-[84px]" />
        </>
      ) : (
        <ProfileDetailCardSkeleton />
      )}
    </div>
  );
};
