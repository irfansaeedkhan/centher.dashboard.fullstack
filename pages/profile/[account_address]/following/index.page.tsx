import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

import { useFollowingStore } from "@/store/following.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import UserWithFollow from "@/components/user.with.follow";
import SearchUserSkeleton from "@/components/loading.skeletons/search.user";

import { ProfilePageWrapper } from "../_components";

const Following: NextPageWithLayout = () => {
  const router = useRouter();

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
    <>
      {following.map((user) => {
        if (user._id === following[following.length - 1]._id) {
          return (
            <UserWithFollow key={user._id} result={user} ref={lastUserRef} />
          );
        }
        return <UserWithFollow key={user._id} result={user} />;
      })}

      {(followingLoading === "loading" || followingLoading === "idle") && (
        <SearchUserSkeleton />
      )}

      {followingLoading === "loaded" && following.length === 0 && (
        <div>
          <div className="flex justify-center font-semibold text-white mt-[48px]">
            <p>Not following anyone yet!</p>
          </div>
        </div>
      )}

      {followingLoading === "failed" && (
        <div className="flex justify-center">
          <p className="text-gray-500">Something went wrong!</p>
        </div>
      )}
    </>
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
