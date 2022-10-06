// React, Next, NPM Packages
import { useState } from "react";
import { NextPage } from "next";
import ctl from "@netlify/classnames-template-literals";

// App imports
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { useCreateUserProfileView } from "@/hooks/user.profile.views";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { Post } from "@/models/post";

// Current page imports
import {
  ProfileDetailCard,
  DiscoverCard,
  MessagesCard,
  RecentActivitiesCard,
  PostCard,
  SinglePost,
} from "@/pages.components/feed";
import { ProfilePageWrapper } from "@/pages.components/profile";

const Profile: NextPage = () => {
  // Create User Profile View
  useCreateUserProfileView();

  const { user: loggedInUser } = useUser();
  const { user, loading: userLoading } = useGetUser();
  const [posts, setPosts] = useState<Post[]>([]);

  return (
    <AllPagesWrapper pageTitle="Profile">
      <ProfilePageWrapper>
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
            <div className={postsContainer}>
              <PostCard />
              {posts
                .filter((p) => !p.parent_post)
                .map((post) => (
                  <SinglePost key={post._id} post={post} />
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
