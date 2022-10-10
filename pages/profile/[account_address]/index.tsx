// React, Next, NPM Packages
import { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import ctl from "@netlify/classnames-template-literals";
import { toast } from "react-hot-toast";

// App imports
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { useCreateUserProfileView } from "@/hooks/user.profile.views";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { Post } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";

// Current page imports
import {
  ProfileDetailCard,
  DiscoverCard,
  MessagesCard,
  RecentActivitiesCard,
  PostCardNew,
  SinglePost,
} from "@/pages.components/feed";
import { ProfilePageWrapper } from "@/pages.components/profile";

const Profile: NextPage = () => {
  // Create User Profile View
  useCreateUserProfileView();

  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const { user, loading: userLoading } = useGetUser(
    router.query.account_address?.toString()?.toLowerCase()
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [skip, setSkip] = useState(0);
  const [followUser, setFollowUser] = useState<boolean>(false);

  const fetchUserFeedsData = useCallback(async () => {
    try {
      setLoadingState(true);
      const { data } = await axiosNodeApi.get(
        `/api/socials/posts/users/${user?._id}?off_set=${skip}`
      );

      const _posts = data.posts;

      setPosts((prev) => {
        const filteredPosts = _posts.filter((post: Post) => {
          return prev.every((prevPost) => prevPost._id !== post._id);
        });
        return [...prev, ...filteredPosts];
      });
      if (data) {
        setLoadingState(false);
      }
    } catch (error: any) {
      setLoadingState(false);
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  }, [skip, user?._id]);

  useEffect(() => {
    if (user?._id) {
      fetchUserFeedsData();
    }
  }, [fetchUserFeedsData, user?._id]);

  const handleScroll = (event: any): void => {
    const { offsetHeight, scrollTop, scrollHeight } = event.target;

    if (offsetHeight + scrollTop >= scrollHeight) {
      setSkip(posts?.length);
    }
  };

  return (
    <AllPagesWrapper pageTitle="Profile">
      <ProfilePageWrapper setFollowUser={setFollowUser}>
        <div>
          <div className={feedContainer}>
            <div className={leftSidebar}>
              {/* TODO: Irfan - Use some loader */}
              {userLoading === "loaded" && user && (
                <ProfileDetailCard
                  user={user}
                  isLoggedInUser={
                    user.account_address === loggedInUser?.account_address
                  }
                />
              )}
              {userLoading === "loading" && <p>Loading...</p>}
              {userLoading === "failed" && <p>Error!</p>}
              <DiscoverCard />
            </div>
            <div className={postsContainer} onScroll={handleScroll}>
              <PostCardNew
                onPostCreated={(post) => {
                  setPosts((prev) => [post, ...prev]);
                }}
              />
              {followUser &&
                posts
                  .filter((p) => !p.parent_post)
                  .map((post) => (
                    <SinglePost
                      key={post._id}
                      post={post}
                      onDelete={(post_id) => {
                        setPosts(posts.filter((p) => p._id !== post_id));
                      }}
                    />
                  ))}
            </div>
            <div className={rightSidebar}>
              <MessagesCard />
              <RecentActivitiesCard />
            </div>
          </div>
        </div>
      </ProfilePageWrapper>
    </AllPagesWrapper>
  );
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
w-full max-w-[544px] flex flex-col gap-3 overflow-y-scroll h-[calc(100vh-158px)]
`);
