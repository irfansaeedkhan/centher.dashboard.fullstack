import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { useFeedStore } from "@/store/feed.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import {
  MessagesCard,
  PostCardNew,
  SinglePost,
  LeftSidebarStickyContainer,
} from "@/components/feed.components";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import SinglePostTextCardSkeleton from "@/components/loading.skeletons/single.post.text";
import { NoPost } from "@/assets/svgs";

const Feed: NextPageWithLayout = () => {
  const {
    posts,
    fetchPosts,
    addNewPost,
    deletePost,
    offset,
    updateOffset,
    loading,
  } = useFeedStore((state) => ({
    posts: state.posts,
    fetchPosts: state.fetchPosts,

    addNewPost: state.addNewPost,
    deletePost: state.deletePost,

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

  return (
    <>
      {((loading === "loaded" && posts.length === 0) || posts.length > 0) && (
        <PostCardNew
          onPostCreated={(post) => {
            addNewPost(post);
          }}
        />
      )}

      {posts.map((post) => {
        if (post._id === posts[posts.length - 1]._id) {
          return (
            <SinglePost
              key={post._id}
              ref={lastPostRef}
              post={post}
              onDelete={deletePost}
            />
          );
        }
        return <SinglePost key={post._id} post={post} onDelete={deletePost} />;
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
    </>
  );
};

Feed.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Feed">
      <div className={`max-w-[848px] f2xl:max-w-[1136px] mx-auto relative`}>
        <div
          className={`flex flex-col lg:flex-row lg:items-start lg:gap-8 f2xl:gap-6`}
        >
          <div
            className={`w-full max-w-[272px] lg:sticky lg:top-0 hidden lg:block`}
          >
            <LeftSidebarStickyContainer />
          </div>

          <div className={`w-full max-w-[544px] mx-auto space-y-3 flex-grow`}>
            {page}
          </div>

          <div
            className={`w-full max-w-[272px] hidden f2xl:flex flex-col gap-3 sticky top-0`}
          >
            <MessagesCard />
          </div>
        </div>
      </div>
    </AllPagesWrapper>
  );
};

export default Feed;
