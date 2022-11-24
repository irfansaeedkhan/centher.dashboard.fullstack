import { useEffect } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

import { useMyPostStore } from "@/store/my.post.store";
import { useProfileCardStore } from "@/store/profile.card.store";
import { useFeedStore } from "@/store/feed.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { useCreateUserProfileView } from "@/hooks/user.profile.views";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import {
  archivePost,
  deletePost,
  SinglePostV2,
} from "@/components/feed.components";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import SinglePostTextCardSkeleton from "@/components/loading.skeletons/single.post.text";
import { CreatePostCard } from "@/components/feed.components/create.post/create.post.card";
import { customLog } from "@/utils/custom.log";
import { AppRoutes } from "@/constants/app.routes";
import { NoPost } from "@/assets/svgs";

import { ProfilePageWrapper } from "./_components";

const Profile: NextPageWithLayout = () => {
  // Create User Profile View
  useCreateUserProfileView();

  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { user } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );

  const {
    posts,
    fetchPosts,
    removePost,
    offset,
    updateOffset,
    resetPosts,
    loading,
    likePostAPI,
  } = useMyPostStore((state) => ({
    posts: state.posts,
    fetchPosts: state.fetchPosts,

    addNewPost: state.addNewPost,
    removePost: state.removePost,

    likePostAPI: state.likePostAPI,

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

  const handleAction = async (
    postId: string,
    actionFunction: (postId: string) => Promise<void>
  ) => {
    try {
      await actionFunction(postId);
      removePost(postId);
      // Remove the post from the feed store
      useFeedStore.getState().removePost(postId);

      // Decrement post count on profile card
      useProfileCardStore.getState().decrementPostsCount();
    } catch (error: any) {
      customLog(error, ["development"]);
    }
  };

  return (
    <>
      {loggedInUser?.account_address === router.query.account_address && (
        <CreatePostCard />
      )}

      {posts.map((post) => {
        if (post._id === posts[posts.length - 1]._id) {
          return (
            <SinglePostV2
              key={post._id}
              post={post}
              postType={"main"}
              placement="profile-posts-page"
              shouldShowThread={post.replies_count > 0}
              onClickLike={async () => {
                await likePostAPI(
                  post._id,
                  post.liked_by_loggedin_user ? "unlike" : "like"
                );
              }}
              onClickReply={() => {
                router.push({
                  pathname: AppRoutes.feed.single_post,
                  query: {
                    account_address: post.user.account_address,
                    post_id: post._id,
                  },
                });
              }}
              onClickArchive={() => handleAction(post._id, archivePost)}
              onClickDelete={() => handleAction(post._id, deletePost)}
            />
          );
        }
        return (
          <SinglePostV2
            key={post._id}
            post={post}
            postType={"main"}
            placement="profile-posts-page"
            shouldShowThread={post.replies_count > 0}
            onClickLike={async () => {
              await likePostAPI(
                post._id,
                post.liked_by_loggedin_user ? "unlike" : "like"
              );
            }}
            onClickReply={() => {
              router.push({
                pathname: AppRoutes.feed.single_post,
                query: {
                  account_address: post.user.account_address,
                  post_id: post._id,
                },
              });
            }}
            onClickArchive={() => handleAction(post._id, archivePost)}
            onClickDelete={() => handleAction(post._id, deletePost)}
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
