import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

import { useFeedStore } from "@/store/feed.store";
import { useProfileCardStore } from "@/store/profile.card.store";
import { useNewPostStore } from "@/store/new.post.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { FeedPagesWrapper } from "@/components/feed.components";
import {
  SinglePostV2,
  archivePost,
  deletePost,
  createPostView,
} from "@/components/feed.components";
import { CreatePostCard } from "@/components/feed.components/create.post/create.post.card";
import { PostModal } from "@/components/feed.components/create.post/post.modal";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import SinglePostTextCardSkeleton from "@/components/loading.skeletons/single.post.text";
import { customLog } from "@/utils/custom.log";
import { AppRoutes } from "@/constants/app.routes";
import { NoPost } from "@/assets/svgs";
import { SuggestedCardMobile } from "@/components/feed.components/suggested-card-mobile";

const Feed: NextPageWithLayout = () => {
  const router = useRouter();
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const openPostModal = useNewPostStore((state) => state.openModal);

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
      {((loading === "loaded" && posts.length === 0) || posts.length > 0) && (
        <CreatePostCard />
      )}

      {posts.map((post, index) => {
        return (
          <>
            <div
              key={post._id}
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
