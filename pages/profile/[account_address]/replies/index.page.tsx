// React, Next, NPM Packages
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { useRepliesStore } from "@/store/profile.replies.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { useCreateUserProfileView } from "@/hooks/user.profile.views";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import ProfileDetailCardSkeleton from "@/components/loading.skeletons/profile.detail.card";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import SinglePostTextCardSkeleton from "@/components/loading.skeletons/single.post.text";
import {
  ProfileDetailCard,
  MessagesCard,
  RecentActivitiesCard,
  SinglePost,
} from "@/components/feed.components";

// Current page imports
import { ProfilePageWrapper } from "../_components";

const Replies: NextPageWithLayout = () => {
  // Create User Profile View
  useCreateUserProfileView();

  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { user, loading: userLoading } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );

  const [followUser, setFollowUser] = useState<boolean>(false);

  const [lastPostRef, lastPostInView, lastPostEntry] = useInView();

  // FIXME: this is a quick fix to change the feed posts when navigating from one user profile to another

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

  useEffect(() => {
    setFollowUser(false);
  }, [router]);

  return (
    <ProfilePageWrapper setFollowUser={setFollowUser}>
      <div>
        <div className={feedContainer}>
          <div className={leftSidebar}>
            <div className={stickySidebar}>
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

          <div className={postsContainer}>
            {posts.length > 0 ? (
              posts.map((post) => {
                if (post._id === posts[posts.length - 1]._id) {
                  return (
                    <SinglePost
                      ref={lastPostRef}
                      key={post._id}
                      post={post}
                      onDelete={deletePost}
                    />
                  );
                }
                return (
                  <SinglePost
                    key={post._id}
                    post={post}
                    onDelete={deletePost}
                  />
                );
              })
            ) : loading === "loading" || loading === "idle" ? (
              <>
                <SinglePostCardSkeleton />
                <SinglePostTextCardSkeleton />
                <SinglePostCardSkeleton />
              </>
            ) : null}
          </div>

          <div className={rightSidebar}>
            <MessagesCard />
            <RecentActivitiesCard />
          </div>
        </div>
      </div>
    </ProfilePageWrapper>
  );
};

Replies.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Profile">{page}</AllPagesWrapper>;
};

export default Replies;

// styling
const feedContainer = ctl(`
flex  gap-5 max-w-[835px]
`);
const leftSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden lg:flex
`);
const rightSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden xl:flex
`);
const postsContainer = ctl(`
w-full max-w-[544px] flex flex-col gap-3 
`);
const stickySidebar = ctl(`
lg:sticky lg:top-0 flex flex-col gap-4
`);
