import { useEffect } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

import { useMyPostStore } from "@/store/my.post.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { useCreateUserProfileView } from "@/hooks/user.profile.views";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { PostCardNew, SinglePost } from "@/components/feed.components";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import SinglePostTextCardSkeleton from "@/components/loading.skeletons/single.post.text";
import { NoPost } from "@/assets/svgs";

import { ProfilePageWrapper } from "./_components";

const Profile: NextPageWithLayout = () => {
  // Create User Profile View
  useCreateUserProfileView();

  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { user, loading: userLoading } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );

  const {
    posts,
    fetchPosts,
    addNewPost,
    deletePost,
    offset,
    updateOffset,
    resetPosts,
    loading,
  } = useMyPostStore((state) => ({
    posts: state.posts,
    fetchPosts: state.fetchPosts,

    addNewPost: state.addNewPost,
    deletePost: state.deletePost,

    offset: state.offset,
    updateOffset: state.updateOffset,
    resetPosts: state.resetPosts,
    loading: state.loading,
  }));

  const [lastPostRef, _lastPostInView, lastPostEntry] = useInView();

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
      {loggedInUser?.account_address === router.query.account_address && (
        <PostCardNew
          onPostCreated={(post) => {
            addNewPost(post);
          }}
        />
      )}
      {posts.map((post) => {
        if (post._id === posts[posts.length - 1]._id) {
          return (
            <SinglePost
              ref={lastPostRef}
              key={post._id}
              post={post}
              onDelete={(post_id) => {
                deletePost(post_id);
              }}
            />
          );
        }
        return (
          <SinglePost
            key={post._id}
            post={post}
            onDelete={(post_id) => {
              deletePost(post_id);
            }}
          />
        );
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
          <div className="flex justify-center mt-[60px]">
            <NoPost />
          </div>
          <div className="flex justify-center mt-[35px]">
            <p className="text-white">No posts available</p>
          </div>
          <div className="flex justify-center mt-3">
            <p className="text-gray-shade-7">
              Create a new post or follow someone
            </p>
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

Profile.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Profile">
      <ProfilePageWrapper currentTab="social-profile">
        <div className="space-y-3">{page}</div>
      </ProfilePageWrapper>
    </AllPagesWrapper>
  );
};

export default Profile;
