import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import { useShallow } from "zustand/react/shallow";
import { useMyRepliesStore } from "@/store/my.replies.store";
import { useCreateUserProfileView } from "@/hooks/user.profile.views";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { usePostEditorStore } from "@/store/post-editor-store";
import { PostEditorModal } from "@/components/post-editor/post-editor-modal";
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
import useUser from "@/hooks/use.user";
import { ProfilePageWrapper } from "../_components";

const Replies: NextPageWithLayout = () => {
  // Create User Profile View
  useCreateUserProfileView();

  const router = useRouter();
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const { openModal: openPostModal } = usePostEditorStore(
    useShallow((state) => state.actions)
  );
  const { user } = useUser();

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
      resetPosts("loading");
      fetchPosts();
    }
    return () => {
      resetPosts("idle");
    };
  }, [user, resetPosts, fetchPosts, router]);

  const handleAction = async (
    postId: string,
    actionFunction: (postId: string) => Promise<void>
  ) => {
    try {
      await actionFunction(postId);
      removePost(postId);
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
      {posts.map((post) => {
        return (
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
              parentPost={post.parent_post}
              postType={"reply-w-parent-header"}
              placement="profile-replies-page"
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
        );
      })}

      {!!posts.length && <div ref={lastPostRef} />}

      {(loading === "loading" || loading === "idle") && (
        <>
          <RepliesProfileSkeletons />
          <RepliesProfileSkeletons />
        </>
      )}

      {loading === "loaded" && posts.length === 0 && (
        <div>
          <div className="mt-[48px] flex justify-center">
            <RepliesIcon />
          </div>
          <div className="mt-6 flex justify-center text-xs font-semibold text-white">
            <p>No Replies!</p>
          </div>

          <div className="mt-2 flex justify-center text-xs font-normal text-gray-shade-7">
            <p>No replies yet. All replies will appear here</p>
          </div>
        </div>
      )}

      {loading === "failed" && (
        <div className="flex justify-center">
          <p className="text-gray-500">Something went wrong!</p>
        </div>
      )}
      {isReplyModalOpen && user && (
        <PostEditorModal modalTitle="Reply" user={user} />
      )}
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
