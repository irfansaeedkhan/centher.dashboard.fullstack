import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import { useMyPostStore } from "@/store/my.post.store";
import { useProfileCardStore } from "@/store/profile.card.store";
import { useFeedStore } from "@/store/feed.store";
import { useNewPostStore } from "@/store/new.post.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { useCreateUserProfileView } from "@/hooks/user.profile.views";
import { customLog } from "@/utils/custom.log";
import { AppRoutes } from "@/constants/app.routes";
import { NoPost } from "@/assets/svgs";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import {
  archivePost,
  createPostView,
  deletePost,
  SinglePostV2,
} from "@/components/feed.components";
import AdsWrapper from "@/components/wrappers/ads-wrapper";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import { PostModal } from "@/components/feed.components/create.post/post.modal";
import SinglePostTextCardSkeleton from "@/components/loading.skeletons/single.post.text";
import { CreatePostCard } from "@/components/feed.components/create.post/create.post.card";
import { SuggestedCardMobile } from "@/components/feed.components/suggested-card-mobile";
import { PromotionCard2Mobile } from "@/components/feed.components/promotion.cards/card-2-mobile";
import { PromotionCard5Mobile } from "@/components/feed.components/promotion.cards/card-5-mobile";
import { PromotionCard6Mobile } from "@/components/feed.components/promotion.cards/card-6-mobile";
import { PromotionCard3Mobile } from "@/components/feed.components/promotion.cards/card-3-mobile";
import { ProfilePageWrapper } from "./_components";

const Profile: NextPageWithLayout = () => {
  // Create User Profile View
  useCreateUserProfileView();

  const router = useRouter();
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const openPostModal = useNewPostStore((state) => state.openModal);
  const { user: loggedInUser } = useUser();
  const { user } = useGetUser(router.query.user_id?.toString()?.toLowerCase());

  const {
    posts,
    fetchPosts,
    removePost,
    offset,
    updateOffset,
    resetPosts,
    loading,
    likePostAPI,
    createPostViewInStore,
  } = useMyPostStore((state) => ({
    posts: state.posts,
    fetchPosts: state.fetchPosts,
    addNewPost: state.addNewPost,
    removePost: state.removePost,
    likePostAPI: state.likePostAPI,
    offset: state.offset,
    updateOffset: state.updateOffset,
    resetPosts: state.resetPosts,
    createPostViewInStore: state.createPostViewInStore,
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
      fetchPosts(!!loggedInUser);
    }
  }, [offset, fetchPosts, loggedInUser]);

  useEffect(() => {
    if (user?._id) {
      resetPosts(user?._id, "loading");
      fetchPosts(!!loggedInUser);
    }
    return () => {
      resetPosts("", "idle");
    };
  }, [user?._id, resetPosts, fetchPosts, loggedInUser]);

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

  const handleCreatePostView = async (postId: string) => {
    try {
      await createPostView(postId);
      createPostViewInStore(postId);
    } catch (error: any) {
      customLog(error, ["development"]);
    }
  };

  return (
    <>
      {loggedInUser?._id === router.query.user_id && <CreatePostCard />}

      {posts.map((post, index) => {
        return (
          <>
            <div
              key={post._id}
              onClick={() =>
                router.push({
                  pathname: AppRoutes.feed.single_post,
                  query: {
                    post_id: post._id,
                  },
                })
              }
            >
              <SinglePostV2
                post={post}
                parentPost={undefined}
                postType={"main"}
                placement="profile-posts-page"
                borderRadius={{
                  top: true,
                  bottom: true,
                }}
                shouldShowThread={post.is_thread}
                onClickLike={async () => {
                  await likePostAPI(
                    post._id,
                    post.liked_by_loggedin_user ? "unlike" : "like"
                  );
                }}
                onClickReply={() => {
                  setIsReplyModalOpen(true);
                  openPostModal({
                    modalType: "reply",
                    parentPostId: post._id,
                    onCloseModal: () => setIsReplyModalOpen(false),
                    shouldAddNewPost: true,
                  });
                }}
                onClickArchive={() => handleAction(post._id, archivePost)}
                onClickDelete={() => handleAction(post._id, deletePost)}
                onPostInViewport={() => handleCreatePostView(post._id)}
              />
            </div>
            {(index + 1) / 4 === 1 && (
              <div className="block flg:hidden">
                <AdsWrapper>
                  <PromotionCard2Mobile />
                </AdsWrapper>
              </div>
            )}
            {(index + 1) / 6 === 1 && (
              <div className="block flg:hidden">
                <AdsWrapper>
                  <PromotionCard5Mobile />
                </AdsWrapper>
              </div>
            )}

            {(index + 1) / 8 === 1 && (
              <div className="block f2xl:hidden">
                <AdsWrapper>
                  <PromotionCard6Mobile />
                </AdsWrapper>
              </div>
            )}
            {(index + 1) / 12 === 1 && (
              <div className="block f2xl:hidden">
                <AdsWrapper>
                  <PromotionCard3Mobile />
                </AdsWrapper>
              </div>
            )}

            {(index + 1) % 10 === 0 && (
              <SuggestedCardMobile className={`block f2xl:hidden`} />
            )}
          </>
        );
      })}

      {!!posts.length && <div ref={lastPostRef} />}

      {(loading === "loading" || loading === "idle") && (
        <>
          <SinglePostCardSkeleton />
          <SinglePostTextCardSkeleton />
          <SinglePostCardSkeleton />
        </>
      )}

      {loading === "loaded" && posts.length === 0 && (
        <div>
          <div className="mt-[60px] flex justify-center">
            <NoPost />
          </div>
          <div className="mt-[35px] flex justify-center">
            <p className="text-white">No posts available</p>
          </div>
          <div className="mt-3 flex justify-center">
            <p className="text-gray-shade-7">
              Create a new post or follow someone
            </p>
          </div>
          <div className="mt-4">
            <SuggestedCardMobile className={`block f2xl:hidden`} />
          </div>
          <div className={`mt-4 flex flg:hidden`}>
            <AdsWrapper>
              <PromotionCard2Mobile />
            </AdsWrapper>
          </div>
          <div className={`mt-4 flex flg:hidden`}>
            <AdsWrapper>
              <PromotionCard5Mobile />
            </AdsWrapper>
          </div>
          <div className={`mt-4 flex f2xl:hidden`}>
            <AdsWrapper>
              <PromotionCard6Mobile />
            </AdsWrapper>
          </div>
          <div className={`mt-4 flex f2xl:hidden`}>
            <AdsWrapper>
              <PromotionCard3Mobile />
            </AdsWrapper>
          </div>
        </div>
      )}

      {loading === "failed" && (
        <div className="flex justify-center">
          <p className="text-gray-500">Something went wrong!</p>
        </div>
      )}

      {isReplyModalOpen && <PostModal modalTitle="Reply" />}
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
