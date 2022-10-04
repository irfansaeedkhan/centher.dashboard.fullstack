// React, Next, NPM Packages
import { useState } from "react";
import { NextPage } from "next";
import ctl from "@netlify/classnames-template-literals";

// App imports
import { ProfilePageWrapper } from "@/pages.components/profile/profile.wrapper";
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

const Profile: NextPage = () => {
  // states
  const [posts, setPosts] = useState<Post[]>([]);

  return (
    <AllPagesWrapper pageTitle="Profile">
      <ProfilePageWrapper>
        <div>
          <div className={feedContainer}>
            <div className={leftSidebar}>
              <ProfileDetailCard />
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
flex justify-center gap-5
`);
const leftSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden lg:flex
`);
const rightSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden xl:flex
`);
const postsContainer = ctl(`
w-full lg:w-[544px] flex flex-col gap-3 overflow-y-scroll h-[calc(100vh-60px)]
`);
