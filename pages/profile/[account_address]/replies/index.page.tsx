// React, Next, NPM Packages
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

// App imports
import { useMyRepliesStore } from "@/store/my.replies.store";
import useGetUser from "@/hooks/use.get.user";
import { useCreateUserProfileView } from "@/hooks/user.profile.views";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import {
  archivePost,
  createPostView,
  deletePost,
  SinglePostV2,
} from "@/components/feed.components";
import RepliesProfileSkeletons from "@/components/loading.skeletons/replies.profile";
import { customLog } from "@/utils/custom.log";
import { AppRoutes } from "@/constants/app.routes";
import { RepliesIcon } from "@/assets/svgs";

import { ProfilePageWrapper } from "../_components";
import { useNewPostStore } from "@/store/new.post.store";
import { PostModal } from "@/components/feed.components/create.post/post.modal";

const Replies: NextPageWithLayout = () => {
  // Create User Profile View
  useCreateUserProfileView();

  const router = useRouter();
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const openPostModal = useNewPostStore((state) => state.openModal);
  const { user } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );
  const [lastPostRef, _lastPostInView, lastPostEntry] = useInView();

  const {
    posts,
    resetPosts,
    fetchPosts,
    removePost,
    offset,
    updateOffset,
    loading,
    likePostAPI,
    createPostViewInStore,
  } = useMyRepliesStore((state) => ({
    posts: state.posts,
    fetchPosts: state.fetchPosts,
    removePost: state.removePost,
    offset: state.offset,
    updateOffset: state.updateOffset,
    resetPosts: state.resetPosts,
    likePostAPI: state.likePostAPI,
    loading: state.loading,
    createPostViewInStore: state.createPostViewInStore,
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

  const handleAction = async (
    postId: string,
    actionFunction: (postId: string) => Promise<void>
  ) => {
    try {
      await actionFunction(postId);
      removePost(postId);
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
      {posts.map((post) => {
        if (post._id === posts[posts.length - 1]._id) {
          return (
            <div ref={lastPostRef} key={post._id}>
              <SinglePostV2
                post={post}
                postType={"reply-w-parent-header"}
                placement="profile-replies-page"
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
            postType={"reply-w-parent-header"}
            placement="profile-replies-page"
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
          <RepliesProfileSkeletons />
          <RepliesProfileSkeletons />
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
            <p>No replies yet. All replies will appear here</p>
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

Replies.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Profile">
      <ProfilePageWrapper currentTab="social-profile">
        <div className="space-y-3">{page}</div>
      </ProfilePageWrapper>
    </AllPagesWrapper>
  );
};

export default Replies;
