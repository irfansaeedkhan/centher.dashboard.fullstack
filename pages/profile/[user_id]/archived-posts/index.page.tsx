import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useArchivedPostsStore } from "@/store/archived.post.store";
import { useProfileCardStore } from "@/store/profile.card.store";
import { useFeedStore } from "@/store/feed.store";
import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ArchiveEmptyIcon } from "@/assets/svgs";
import {
  unArchivePost,
  deletePost,
  SinglePostV2,
  getPost,
} from "@/components/feed.components";
import { customLog } from "@/utils/custom.log";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import SinglePostTextCardSkeleton from "@/components/loading.skeletons/single.post.text";
import { BackButton } from "@/components/button/back-button";

const ArchivedPosts: NextPageWithLayout = () => {
  const { user: loggedInUser } = useUser();
  const { posts, fetchPosts, removePost, offset, updateOffset, loading } =
    useArchivedPostsStore((state) => ({
      posts: state.posts,
      fetchPosts: state.fetchPosts,

      removePost: state.removePost,

      offset: state.offset,
      updateOffset: state.updateOffset,
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

  const handleRestoreAction = async (
    postId: string,
    postType: "reply" | "thread" | "other"
  ) => {
    try {
      await unArchivePost(postId);
      removePost(postId);

      if (postType !== "reply") {
        // Increment post count on profile card
        useProfileCardStore.getState().incrementPostsCount();
        const post = await getPost(postId, !!loggedInUser);
        if (post.status === "complete" && postType !== "thread") {
          useFeedStore.getState().addNewPost(post);
        }
      }
    } catch (error: any) {
      customLog(["development"], error);
    }
  };

  const handleDeleteAction = async (postId: string) => {
    try {
      await deletePost(postId);
      removePost(postId);
    } catch (error: any) {
      customLog(["development"], error);
    }
  };

  return (
    <>
      <BackButton />
      <div className="mb-6 rounded-md bg-gray-shade-9 py-[10px] text-center text-sm text-[#E7E8EE]">
        Items in your archive are only visible to you.
      </div>
      <div className="space-y-3">
        {posts.map((post) => {
          return (
            <div key={post._id}>
              <SinglePostV2
                post={post}
                parentPost={undefined}
                postType={"archived"}
                placement="profile-archived-page"
                borderRadius={{
                  top: true,
                  bottom: true,
                }}
                onClickRestore={() =>
                  handleRestoreAction(
                    post._id,
                    post.parent_post_id
                      ? "reply"
                      : post.is_thread
                      ? "thread"
                      : "other"
                  )
                }
                onClickDelete={() => handleDeleteAction(post._id)}
              />
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
              <ArchiveEmptyIcon />
            </div>
            <div className="mt-[35px] flex justify-center">
              <p className="text-white">No Archive posts available</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

ArchivedPosts.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Archived Posts">
      <div className="mx-auto max-w-[544px]">{page}</div>
    </AllPagesWrapper>
  );
};

export default ArchivedPosts;
