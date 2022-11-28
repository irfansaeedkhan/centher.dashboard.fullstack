import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { useArchivedPostsStore } from "@/store/archived.post.store";
import { useProfileCardStore } from "@/store/profile.card.store";
import { useFeedStore } from "@/store/feed.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { ArchivedPost } from "@/models/post";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import {
  unArchivePost,
  deletePost,
  SinglePostV2,
  getPost,
} from "@/components/feed.components";
import { customLog } from "@/utils/custom.log";

const ArchivedPosts: NextPageWithLayout = () => {
  const { posts, fetchPosts, removePost, offset, updateOffset } =
    useArchivedPostsStore((state) => ({
      posts: state.posts,
      fetchPosts: state.fetchPosts,

      removePost: state.removePost,

      offset: state.offset,
      updateOffset: state.updateOffset,
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

  const handleRestoreAction = async (postId: string, isReply: boolean) => {
    try {
      await unArchivePost(postId);
      removePost(postId);

      if (!isReply) {
        // Increment post count on profile card
        useProfileCardStore.getState().incrementPostsCount();
        useFeedStore.getState().addNewPost(await getPost(postId));
      }
    } catch (error: any) {
      customLog(error, ["development"]);
    }
  };

  const handleDeleteAction = async (postId: string) => {
    try {
      await deletePost(postId);
      removePost(postId);
    } catch (error: any) {
      customLog(error, ["development"]);
    }
  };

  return (
    <>
      <div className="mb-6 bg-gray-shade-9 rounded-md py-[10px] text-[#E7E8EE] text-center text-sm">
        Items in your archive are only visible to you.
      </div>
      <div className="space-y-3">
        {posts.map((post) => {
          if (post._id === posts[posts.length - 1]._id) {
            return (
              <div key={post._id} ref={lastPostRef}>
                <SinglePostV2
                  post={post}
                  postType={"archived"}
                  placement="profile-archived-page"
                  shouldShowThread={false}
                  onClickRestore={() =>
                    handleRestoreAction(post._id, !!post.parent_post_id)
                  }
                  onClickDelete={() => handleDeleteAction(post._id)}
                />
              </div>
            );
          }

          return (
            <SinglePostV2
              key={post._id}
              post={post}
              postType={"archived"}
              placement="profile-archived-page"
              shouldShowThread={false}
              onClickRestore={() =>
                handleRestoreAction(post._id, !!post.parent_post_id)
              }
              onClickDelete={() => handleDeleteAction(post._id)}
            />
          );
        })}
      </div>
    </>
  );
};

ArchivedPosts.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Archived Posts">
      <div className="max-w-[544px] mx-auto">{page}</div>
    </AllPagesWrapper>
  );
};

export default ArchivedPosts;
