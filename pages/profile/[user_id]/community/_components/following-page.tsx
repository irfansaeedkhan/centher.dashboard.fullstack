import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import { FollowerIcon } from "@/assets/svgs";
import useUser from "@/hooks/use.user";
import UserWithFollow from "@/components/user.with.follow";
import SearchUserSkeleton from "@/components/loading.skeletons/search.user";
import { AppRoutes } from "@/constants/app.routes";
import { useFollowingStore } from "@/store/following.store";

const FollowingPage = () => {
  const router = useRouter();
  const { user } = useUser();

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

      resetFollowing("loading");
      fetchFollowing();
    }

    return () => {
      resetFollowing("idle");
    };
  }, [router.query.user_id, resetFollowing, fetchFollowing, user, router]);

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
          <div className="mt-[48px] flex justify-center">
            <FollowerIcon />
          </div>
          <div className="mt-6 flex justify-center text-xs font-semibold text-white">
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

export default FollowingPage;
