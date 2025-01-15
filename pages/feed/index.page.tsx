import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useShallow } from "zustand/react/shallow";
import { useInView } from "react-intersection-observer";
import { useFeedStore } from "@/store/feed.store";
import { useProfileCardStore } from "@/store/profile.card.store";
import { usePostEditorStore } from "@/store/post-editor-store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { FeedPagesWrapper } from "@/components/feed.components";
import {
  SinglePostV2,
  archivePost,
  deletePost,
  createPostView,
} from "@/components/feed.components";
import { CreatePostCard } from "@/components/post-editor/create-post-card";
import { PostModal } from "@/components/feed.components/create.post/post.modal";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import SinglePostTextCardSkeleton from "@/components/loading.skeletons/single.post.text";
import AdsWrapper from "@/components/wrappers/ads-wrapper";
import { SuggestedCardMobile } from "@/components/feed.components/suggested-card-mobile";
import { PromotionCard6Mobile } from "@/components/feed.components/promotion.cards/card-6-mobile";
import { PromotionCard5Mobile } from "@/components/feed.components/promotion.cards/card-5-mobile";
import { PromotionCard3Mobile } from "@/components/feed.components/promotion.cards/card-3-mobile";
import { PromotionCard7Mobile } from "@/components/feed.components/promotion.cards/card-7-mobile";
import { PromotionCard8Mobile } from "@/components/feed.components/promotion.cards/card-8-mobile";
import useUser from "@/hooks/use.user";
import { customLog } from "@/utils/custom.log";
import { AppRoutes } from "@/constants/app.routes";
import { NoPost } from "@/assets/svgs";
import { VoiSpaceFeedCard } from "@/components/voispace/voispace.feed.card";

const Feed: NextPageWithLayout = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const { openModal: openPostModal } = usePostEditorStore(
    useShallow((state) => state.actions)
  );
  const {
    posts,
    fetchPosts,
    removePost,
    offset,
    updateOffset,
    likePostAPI,
    createPostViewInStore,
    loading,
  } = useFeedStore((state) => ({
    posts: state.posts,
    fetchPosts: state.fetchPosts,

    addNewPost: state.addNewPost,
    removePost: state.removePost,

    offset: state.offset,
    updateOffset: state.updateOffset,

    likePostAPI: state.likePostAPI,

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
      fetchPosts();
    }
  }, [offset, fetchPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleAction = async (
    postId: string,
    actionFunction: (postId: string) => Promise<void>
  ) => {
    try {
      await actionFunction(postId);
      removePost(postId);
      // Decrement post count on profile card
      useProfileCardStore.getState().decrementPostsCount();
    } catch (error: any) {
      customLog(["development"], error);
    }
  };

  const handleCreatePostView = async (postId: string) => {
    try {
      await createPostView(postId);
      createPostViewInStore(postId);
    } catch (error: any) {
      customLog(["development"], error);
    }
  };

  return (
    <>
      {((loading === "loaded" && posts.length === 0) || posts.length > 0) &&
        user && <CreatePostCard user={user} />}

      {posts.length === 0 && (
        <div className="mt-3 block w-full flg:hidden">
          <VoiSpaceFeedCard />
        </div>
      )}
      {posts.map((post, index) => {
        return (
          <div key={post._id}>
            <div
              onClick={() => {
                router.push({
                  pathname: AppRoutes.feed.single_post,
                  query: {
                    post_id: post._id,
                  },
                });
              }}
            >
              <SinglePostV2
                post={post}
                parentPost={undefined}
                postType={"main"}
                placement="feed-page"
                shouldShowThread={post.is_thread}
                borderRadius={{
                  top: true,
                  bottom: true,
                }}
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
            {index === 0 && (
              <div className="mt-3 block w-full flg:hidden">
                <VoiSpaceFeedCard />
              </div>
            )}
            {(index + 1) / 4 === 1 && (
              <div className="mt-3 block flg:hidden">
                <AdsWrapper>
                  <PromotionCard7Mobile />
                </AdsWrapper>
              </div>
            )}

            {(index + 1) / 8 === 1 && (
              <>
                {user?.membership.status !== "citizen" && (
                  <div className="mt-3 block flg:hidden">
                    <AdsWrapper>
                      <PromotionCard5Mobile />
                    </AdsWrapper>
                  </div>
                )}
              </>
            )}

            {(index + 1) / 12 === 1 && (
              <div className="block f2xl:hidden">
                <AdsWrapper>
                  <PromotionCard6Mobile />
                </AdsWrapper>
              </div>
            )}
            {(index + 1) / 14 === 1 && (
              <div className="block f2xl:hidden">
                <AdsWrapper>
                  <PromotionCard8Mobile />
                </AdsWrapper>
              </div>
            )}
            {(index + 1) / 16 === 1 && (
              <div className="block f2xl:hidden">
                <AdsWrapper>
                  <PromotionCard3Mobile />
                </AdsWrapper>
              </div>
            )}

            {(index + 1) % 10 === 0 && (
              <SuggestedCardMobile className={`block f2xl:hidden`} />
            )}
          </div>
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
              <PromotionCard7Mobile />
            </AdsWrapper>
          </div>
          {user?.membership.status !== "citizen" && (
            <div className={`mt-4 flex flg:hidden`}>
              <AdsWrapper>
                <PromotionCard5Mobile />
              </AdsWrapper>
            </div>
          )}
          <div className={`mt-4 flex f2xl:hidden`}>
            <AdsWrapper>
              <PromotionCard6Mobile />
            </AdsWrapper>
          </div>
          <div className={`mt-4 flex f2xl:hidden`}>
            <AdsWrapper>
              <PromotionCard8Mobile />
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
        <p className="!mt-12 flex justify-center text-gray-shade-7">
          Something went wrong!
        </p>
      )}

      {isReplyModalOpen && <PostModal modalTitle="Reply" />}
    </>
  );
};

Feed.getLayout = (page) => {
  return (
    <FeedPagesWrapper>
      <div className={`mx-auto w-full space-y-3`}>{page}</div>
    </FeedPagesWrapper>
  );
};

export default Feed;
