// React, Next, NPM Packages
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import ctl from "@netlify/classnames-template-literals";
import { toast } from "react-hot-toast";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { useCreateUserProfileView } from "@/hooks/user.profile.views";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { SinglePost } from "@/components/feed.components";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import SinglePostTextCardSkeleton from "@/components/loading.skeletons/single.post.text";
import { CompletedPost } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";

// Current page imports
import { ProfilePageWrapper } from "../_components";

const Replies: NextPageWithLayout = () => {
  // Create User Profile View
  useCreateUserProfileView();

  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { user } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );
  const [posts, setPosts] = useState<CompletedPost[]>([]);
  const [skip, setSkip] = useState(0);
  const [loader, setLoader] = useState(false);

  const [lastPostRef, lastPostInView, lastPostEntry] = useInView();

  useEffect(() => {
    if (lastPostInView) {
      setSkip(posts.length);
    }
  }, [posts, lastPostRef, lastPostInView, lastPostEntry]);

  const fetchUserFeedsData = useCallback(async () => {
    setLoader(true);
    try {
      const { data } = await axiosNodeApi.get(
        `/api/socials/posts/user/replies/${user?._id}?offset=${skip}`
      );
      const _postsReplies = data.postsReplies;
      setPosts((prev) => {
        const filteredPosts =
          _postsReplies?.filter((post: CompletedPost) => {
            return prev.every((prevPost) => prevPost._id !== post._id);
          }) ?? [];
        return [...prev, ...filteredPosts];
      });
      setLoader(false);
    } catch (error: any) {
      setLoader(false);
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  }, [skip, user]);

  useEffect(() => {
    if (user && loggedInUser) {
      fetchUserFeedsData();
    }
  }, [fetchUserFeedsData, user, loggedInUser]);

  return (
    <>
      {posts.length > 0 ? (
        posts.map((post) => {
          if (post._id === posts[posts.length - 1]._id) {
            return (
              <SinglePost
                ref={lastPostRef}
                key={post._id}
                post={post}
                onDelete={(post_id) => {
                  setPosts(posts.filter((p) => p._id !== post_id));
                }}
              />
            );
          }
          return (
            <SinglePost
              key={post._id}
              post={post}
              onDelete={(post_id) => {
                setPosts(posts.filter((p) => p._id !== post_id));
              }}
            />
          );
        })
      ) : loader ? (
        <>
          <SinglePostCardSkeleton />
          <SinglePostTextCardSkeleton />
          <SinglePostCardSkeleton />
        </>
      ) : null}
    </>
  );
};

Replies.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Profile">
      <ProfilePageWrapper>{page}</ProfilePageWrapper>
    </AllPagesWrapper>
  );
};

export default Replies;
