import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { useFeedStore } from "@/store/feed.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { SinglePost, FeedPagesWrapper } from "@/components/feed.components";
import { CreatePostCard } from "@/components/feed.components/create.post/create.post.card";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import SinglePostTextCardSkeleton from "@/components/loading.skeletons/single.post.text";
import { NoPost } from "@/assets/svgs";

const Feed: NextPageWithLayout = () => {
  const { posts, fetchPosts, removePost, offset, updateOffset, loading } =
    useFeedStore((state) => ({
      posts: state.posts,
      fetchPosts: state.fetchPosts,

      addNewPost: state.addNewPost,
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

  return (
    <>
      {((loading === "loaded" && posts.length === 0) || posts.length > 0) && (
        <CreatePostCard />
      )}

      {posts.map((post) => {
        if (post._id === posts[posts.length - 1]._id) {
          return (
            <SinglePost
              key={post._id}
              ref={lastPostRef}
              post={post}
              onDelete={removePost}
              placement="feed"
            />
          );
        }
        return (
          <SinglePost
            key={post._id}
            post={post}
            onDelete={removePost}
            placement="feed"
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
