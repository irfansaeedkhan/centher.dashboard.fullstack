import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ProfileDetailCard } from "@/components/feed.components";
import ProfileDetailCardSkeleton from "@/components/loading.skeletons/profile.detail.card";
import UserWithFollow from "@/components/user.with.follow";
import useGetUser from "@/hooks/use.get.user";
import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { useFollowersStore } from "@/store/followers.store";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ProfilePageWrapper } from "../_components";

const Followers: NextPageWithLayout = () => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { user, loading: userLoading } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );

  const {
    followersLoading,
    offset,
    updateOffset,
    followers,
    fetchFollowers,
    resetFollowers,
  } = useFollowersStore((state) => ({
    followersLoading: state.loading,
    offset: state.offset,
    updateOffset: state.updateOffset,
    followers: state.followers,
    fetchFollowers: state.fetchFollowers,
    resetFollowers: state.resetFollowers,
  }));

  const { ref: lastUserRef, entry: lastUserEntry } = useInView();

  useEffect(() => {
    if (lastUserEntry?.isIntersecting) {
      updateOffset();
    }
  }, [updateOffset, lastUserEntry]);

  useEffect(() => {
    if (offset > 0) {
      fetchFollowers();
    }
  }, [fetchFollowers, offset]);

  useEffect(() => {
    if (router.query.account_address) {
      resetFollowers(
        router.query.account_address.toString().toLowerCase(),
        "loading"
      );
      fetchFollowers();
    }

    return () => {
      resetFollowers("", "idle");
    };
  }, [router.query.account_address, resetFollowers, fetchFollowers]);

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
        {/* TODO: Talha add the Skeletons  */}
        {followers.map((user) => {
          if (user._id === followers[followers.length - 1]._id) {
            return (
              <UserWithFollow key={user._id} result={user} ref={lastUserRef} />
            );
          }
          return <UserWithFollow key={user._id} result={user} />;
        })}
        {followersLoading === "loaded" && followers.length === 0 && (
          // TODO: Talha - Ask amjad for design when there is no following, also for posts on profile page
          <div className="flex justify-center">
            <p className="text-gray-500">No followers!</p>
          </div>
        )}
        {followersLoading === "failed" && (
          // TODO: Talha - Ask amjad for design when something went wrong
          <div className="flex justify-center">
            <p className="text-gray-500">Something went wrong!</p>
          </div>
        )}
      </div>
    </div>
  );
};

Followers.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Followers">
      <ProfilePageWrapper>{page}</ProfilePageWrapper>
    </AllPagesWrapper>
  );
};

export default Followers;
