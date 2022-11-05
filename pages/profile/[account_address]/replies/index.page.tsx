// React, Next, NPM Packages
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

// App imports
import { useRepliesStore } from "@/store/profile.replies.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import useGetUser from "@/hooks/use.get.user";
import { useCreateUserProfileView } from "@/hooks/user.profile.views";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { SingleReply } from "@/components/feed.components";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import SinglePostTextCardSkeleton from "@/components/loading.skeletons/single.post.text";

// Current page imports
import { ProfilePageWrapper } from "../_components";
import { RepliesIcon } from "@/assets/svgs";

const Replies: NextPageWithLayout = () => {
  // Create User Profile View
  useCreateUserProfileView();

  const router = useRouter();
  const { user } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );
  const [lastPostRef, lastPostInView, lastPostEntry] = useInView();

  const {
    posts,
    resetPosts,
    fetchPosts,
    deletePost,
    offset,
    updateOffset,
    loading,
  } = useRepliesStore((state) => ({
    posts: state.posts,
    fetchPosts: state.fetchPosts,

    deletePost: state.deletePost,

    offset: state.offset,
    updateOffset: state.updateOffset,

    resetPosts: state.resetPosts,

    loading: state.loading,
  }));

  useEffect(() => {
    if (lastPostEntry?.isIntersecting) {
      updateOffset();
    }
  }, [lastPostRef, lastPostEntry, updateOffset]);

  useEffect(() => {
    if (offset > 0) {
      fetchPosts();
    }
  }, [offset, fetchPosts]);

  useEffect(() => {
    if (user?._id) {
      resetPosts(user?._id, "loading");
      fetchPosts();
    }

    return () => {
      resetPosts("", "idle");
    };
  }, [user?._id, resetPosts, fetchPosts]);

  return (
    <>
      {posts.map((post) => {
        if (post._id === posts[posts.length - 1]._id) {
          return (
            <SingleReply
              ref={lastPostRef}
              key={post._id}
              post={post}
              onDelete={deletePost}
            />
          );
        }
        return <SingleReply key={post._id} post={post} onDelete={deletePost} />;
      })}

      {(loading === "loading" || loading === "idle") && (
        <>
          <SinglePostCardSkeleton />
          <SinglePostTextCardSkeleton />
          <SinglePostCardSkeleton />
        </>
      )}

      {loading === "loaded" && posts.length === 0 && (
        <div>
          <div className="flex justify-center mt-[48px]">
            <RepliesIcon />
          </div>
          <div className="flex justify-center text-white font-semibold text-xs mt-6">
            <p>No Replies!</p>
          </div>

          <div className="flex justify-center text-gray-shade-7 font-normal text-xs mt-2">
            <p>No replies yet. All replies will apper here</p>
          </div>
        </div>
      )}

      {loading === "failed" && (
        <div className="flex justify-center">
          <p className="text-gray-500">Something went wrong!</p>
        </div>
      )}
    </>
  );
};

Replies.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Profile">
      <ProfilePageWrapper>{page}</ProfilePageWrapper>
    </AllPagesWrapper>
  );
};

export default Replies;
