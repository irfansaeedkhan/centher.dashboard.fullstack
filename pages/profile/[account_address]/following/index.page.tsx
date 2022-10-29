import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

import { useFollowingStore } from "@/store/following.store";
import useGetUser from "@/hooks/use.get.user";
import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ProfileDetailCard } from "@/components/feed.components";
import UserWithFollow from "@/components/user.with.follow";
import SearchUserSkeleton from "@/components/loading.skeletons/search.user";
import ProfileDetailCardSkeleton from "@/components/loading.skeletons/profile.detail.card";

import { ProfilePageWrapper } from "../_components";

const Following: NextPageWithLayout = () => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { user, loading: userLoading } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );

  const {
    followingLoading,
    offset,
    updateOffset,
    following,
    fetchFollowing,
    resetFollowing,
  } = useFollowingStore((state) => ({
    followingLoading: state.loading,
    offset: state.offset,
    updateOffset: state.updateOffset,
    following: state.following,
    fetchFollowing: state.fetchFollowing,
    resetFollowing: state.resetFollowing,
  }));

  const { ref: lastUserRef, entry: lastUserEntry } = useInView();

  useEffect(() => {
    if (lastUserEntry?.isIntersecting) {
      updateOffset();
    }
  }, [updateOffset, lastUserEntry]);

  useEffect(() => {
    if (offset > 0) {
      fetchFollowing();
    }
  }, [fetchFollowing, offset]);

  useEffect(() => {
    if (router.query.account_address) {
      resetFollowing(
        router.query.account_address.toString().toLowerCase(),
        "loading"
      );
      fetchFollowing();
    }

    return () => {
      resetFollowing("", "idle");
    };
  }, [router.query.account_address, resetFollowing, fetchFollowing]);

  return (
    <div className="flex gap-5">
      <div className="w-full max-w-[272px]  flex-col gap-3 hidden lg:flex">
        <div className="lg:sticky lg:top-0 flex flex-col gap-4">
          {userLoading === "loaded" && user ? (
            <ProfileDetailCard
              user={user}
              isLoggedInUser={
                user.account_address === loggedInUser?.account_address
              }
            />
          ) : (
            <ProfileDetailCardSkeleton />
          )}
          {/* <DiscoverCard /> */}
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        {following.map((user) => {
          if (user._id === following[following.length - 1]._id) {
            return (
              <UserWithFollow key={user._id} result={user} ref={lastUserRef} />
            );
          }
          return <UserWithFollow key={user._id} result={user} />;
        })}

        {followingLoading === "loaded" && following.length === 0 && (
          // TODO: Talha - Ask amjad for design when there is no following, also for posts on profile page
          <div className="flex justify-center">
            <p className="text-gray-500">No following!</p>
          </div>
        )}

        {(followingLoading === "loading" || followingLoading === "idle") && (
          <SearchUserSkeleton />
        )}

        {followingLoading === "failed" && (
          // TODO: Talha - Ask amjad for design when something went wrong
          <div className="flex justify-center">
            <p className="text-gray-500">Something went wrong!</p>
          </div>
        )}
      </div>
    </div>
  );
};

Following.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Following">
      <ProfilePageWrapper>{page}</ProfilePageWrapper>
    </AllPagesWrapper>
  );
};

export default Following;
