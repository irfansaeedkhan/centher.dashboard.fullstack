import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

import { useFollowersStore } from "@/store/followers.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import SearchUserSkeleton from "@/components/loading.skeletons/search.user";
import UserWithFollow from "@/components/user.with.follow";

import { ProfilePageWrapper } from "../_components";
import { FollowerIcon } from "@/assets/svgs";

const Followers: NextPageWithLayout = () => {
  const router = useRouter();

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
    <>
      {followers.map((user) => {
        if (user._id === followers[followers.length - 1]._id) {
          return (
            <UserWithFollow key={user._id} result={user} ref={lastUserRef} />
          );
        }
        return <UserWithFollow key={user._id} result={user} />;
      })}

      {(followersLoading === "loading" || followersLoading === "idle") && (
        <SearchUserSkeleton />
      )}

      {followersLoading === "loaded" && followers.length === 0 && (
        <div>
          <div className="flex justify-center mt-[48px]">
            <FollowerIcon />
          </div>
          <div className="flex justify-center text-white font-semibold text-xs mt-6">
            <p>No followers yet!</p>
          </div>
        </div>
      )}

      {followersLoading === "failed" && (
        <div className="flex justify-center">
          <p className="text-gray-500">Something went wrong!</p>
        </div>
      )}
    </>
  );
};

Followers.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Followers">
      <ProfilePageWrapper currentTab="social-profile">
        <div className="space-y-3">{page}</div>
      </ProfilePageWrapper>
    </AllPagesWrapper>
  );
};

export default Followers;
