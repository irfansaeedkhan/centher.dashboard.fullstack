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
import {
  ProfileDetailCard,
  DiscoverCard,
  MessagesCard,
  RecentActivitiesCard,
  PostCardNew,
  SinglePost,
} from "@/components/feed.components";
import { Post } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";

// Current page imports
import { ProfilePageWrapper } from "./_components";

const Profile: NextPageWithLayout = () => {
  // Create User Profile View
  useCreateUserProfileView();

  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { user, loading: userLoading } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [skip, setSkip] = useState(0);
  const [followUser, setFollowUser] = useState<boolean>(false);

  const [lastPostRef, lastPostInView, lastPostEntry] = useInView();

  // FIXME: this is a quick fix to change the feed posts when navigating from one user profile to another
  useEffect(() => {
    setFollowUser(false);
  }, [router]);

  useEffect(() => {
    if (lastPostInView) {
      setSkip(posts.length);
    }
  }, [posts, lastPostRef, lastPostInView, lastPostEntry]);

  const fetchUserFeedsData = useCallback(async () => {
    try {
      const { data } = await axiosNodeApi.get(
        `/api/socials/posts/user/${user?._id}?off_set=${skip}`
      );

      const _posts = data.posts;

      setPosts((prev) => {
        const filteredPosts = _posts.filter((post: Post) => {
          return prev.every((prevPost) => prevPost._id !== post._id);
        });
        return [...prev, ...filteredPosts];
      });
    } catch (error: any) {
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  }, [skip, user]);

  useEffect(() => {
    if (user && loggedInUser) {
      // if (loggedInUser._id === user._id) {
      //   fetchUserFeedsData();
      // } else if (loggedInUser._id !== user._id) {
      //   fetchUserFeedsData();
      // } else {
      //   setPosts([]);
      //   setSkip(0);
      // }
      fetchUserFeedsData();
    }
  }, [fetchUserFeedsData, user, followUser, loggedInUser]);

  // console.log(posts);
  return (
    <ProfilePageWrapper setFollowUser={setFollowUser}>
      <div>
        <div className={feedContainer}>
          <div className={leftSidebar}>
            <div className={stickySidebar}>
              {userLoading === "loaded" && user && (
                <ProfileDetailCard
                  user={user}
                  isLoggedInUser={
                    user.account_address === loggedInUser?.account_address
                  }
                />
              )}
              <DiscoverCard />
            </div>
          </div>

          <div className={postsContainer}>
            {loggedInUser?.account_address === router.query.account_address && (
              <PostCardNew
                onPostCreated={(post) => {
                  setPosts((prev) => [post, ...prev]);
                }}
              />
            )}
            {posts
              .filter((p) => !p.parent_post)
              .map((post) => {
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
              })}
          </div>

          <div className={rightSidebar}>
            <MessagesCard />
            <RecentActivitiesCard />
          </div>
        </div>
      </div>
    </ProfilePageWrapper>
  );
};

Profile.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Profile">{page}</AllPagesWrapper>;
};

export default Profile;

// styling
const feedContainer = ctl(`
flex  gap-5 max-w-[835px]
`);
const leftSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden lg:flex
`);
const rightSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden xl:flex
`);
const postsContainer = ctl(`
w-full max-w-[544px] flex flex-col gap-3 
`);
const stickySidebar = ctl(`
lg:sticky lg:top-0 flex flex-col gap-4
`);
