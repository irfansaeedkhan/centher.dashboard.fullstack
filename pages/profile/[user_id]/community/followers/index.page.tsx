import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import { useFollowersStore } from "@/store/followers.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import SearchUserSkeleton from "@/components/loading.skeletons/search.user";
import UserWithFollow from "@/components/user.with.follow";
import useUser from "@/hooks/use.user";
import { AppRoutes } from "@/constants/app.routes";
import { FollowerIcon } from "@/assets/svgs";
import ProfileCommunityLayout from "@/layouts/profile.community.layout";

const Followers: NextPageWithLayout = () => {
  const router = useRouter();
  const { user } = useUser();

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
    if (router.query.user_id && user) {
      if (
        router.query.user_id.toString().toLowerCase() !== user._id.toLowerCase()
      ) {
        // Redirect to the profile page if the account address in the URL is not the same as the logged in user's account address
        router.replace({
          pathname: AppRoutes.profile.user_id,
          query: { user_id: router.query.user_id },
        });
        return;
      }

      resetFollowers("loading");
      fetchFollowers();
    }

    return () => {
      resetFollowers("idle");
    };
  }, [router.query.user_id, resetFollowers, fetchFollowers, router, user]);

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
          <div className="mt-[48px] flex justify-center">
            <FollowerIcon />
          </div>
          <div className="mt-6 flex justify-center text-xs font-semibold text-white">
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

Followers.getLayout = (page) => (
  <ProfileCommunityLayout>
    <div>{page}</div>
  </ProfileCommunityLayout>
);

export default Followers;
