import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

import { useFeedStore } from "@/store/feed.store";
import { useProfileCardStore } from "@/store/profile.card.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { FeedPagesWrapper } from "@/components/feed.components";
import {
  SinglePostV2,
  archivePost,
  deletePost,
  createPostView,
} from "@/components/feed.components";
import { CreatePostCard } from "@/components/feed.components/create.post/create.post.card";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import SinglePostTextCardSkeleton from "@/components/loading.skeletons/single.post.text";
import { customLog } from "@/utils/custom.log";
import { AppRoutes } from "@/constants/app.routes";
import { NoPost } from "@/assets/svgs";
import { useNewPostStore } from "@/store/new.post.store";
import { PostModal } from "@/components/feed.components/create.post/post.modal";

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

      {posts.map((post) => {
        if (post._id === posts[posts.length - 1]._id) {
          return (
            <div
              key={post._id}
              ref={lastPostRef}
              onClick={() =>
                router.push({
                  pathname: AppRoutes.feed.single_post,
                  query: {
                    account_address: post.user.account_address,
                    post_id: post._id,
                  },
                })
              }
            >
              <SinglePostV2
                post={post}
                postType={"main"}
                placement="feed-page"
                shouldShowThread={post.replies_count > 0}
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
                  });
                }}
                onClickArchive={() => handleAction(post._id, archivePost)}
                onClickDelete={() => handleAction(post._id, deletePost)}
                onPostInViewport={() => handleCreatePostView(post._id)}
              />
            </div>
          );
        }

        return (
          <SinglePostV2
            key={post._id}
            post={post}
            postType={"main"}
            placement="feed-page"
            shouldShowThread={post.replies_count > 0}
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
              });
            }}
            onClickArchive={() => handleAction(post._id, archivePost)}
            onClickDelete={() => handleAction(post._id, deletePost)}
            onPostInViewport={() => handleCreatePostView(post._id)}
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
        <p className="flex justify-center text-gray-shade-7 !mt-12">
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
      <div className={`w-full mx-auto space-y-3`}>{page}</div>
    </FeedPagesWrapper>
  );
};

export default Feed;
