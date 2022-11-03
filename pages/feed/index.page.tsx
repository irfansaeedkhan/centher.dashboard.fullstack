import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { useFeedStore } from "@/store/feed.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import {
  MessagesCard,
  RecentActivitiesCard,
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
    window.scrollTo(0, 0);
  }, []);

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
    <div
      className={`w-full max-w-[544px] flex flex-col gap-3 pb-24 lg:mt-[3.5rem]`}
    >
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
              ref={lastPostRef}
              key={post._id}
              post={post}
              onDelete={(post_id) => {
                deletePost(post_id);
              }}
            />
          );
        }
        return (
          <SinglePost
            key={post._id}
            post={post}
            onDelete={(post_id) => {
              deletePost(post_id);
            }}
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
        <div className="flex justify-center">
          <p className="text-gray-500">Something went wrong!</p>
        </div>
      )}
    </div>
  );
};

Feed.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Feed">
      <div
        className={`bg-black-shade-3 w-full h-full font-monto max-w-[544px] lg:max-w-[835px] mx-auto relative`}
      >
        <div className={`flex flex-col lg:flex-row gap-5 lg:items-start`}>
          <LeftSidebarStickyContainer />

          {page}

          <div className={`w-full max-w-[272px] flex-col gap-3 hidden xl:flex`}>
            <MessagesCard />
            <RecentActivitiesCard />
          </div>
        </div>
      </div>
    </AllPagesWrapper>
  );
};

export default Feed;
