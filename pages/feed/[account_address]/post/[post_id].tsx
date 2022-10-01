// React, Next, NPM Packages
import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import ctl from "@netlify/classnames-template-literals";

// App imports
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
  posts as dummyPosts,
  posts,
} from "@/pages.components/feed";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";

const SinglePostPage: NextPage = () => {
  const [post, setPost] = useState<Post>();
  const router = useRouter();

  console.log(router.query);

  useEffect(() => {
    const _post = posts.find(
      (p) =>
        p._id === router.query.post_id &&
        p.user.account_address === router.query.account_address
    );
    console.log("post", _post);
    setPost(_post);
  }, [router]);

  return (
    <AllPagesWrapper pageTitle="Feed">
      <div className={dashboardContentContainer}>
        <h1 className={title}>My Feed</h1>
        <div className={feedContainer}>
          <div className={leftSidebar}>
            <ProfileDetailCard />
            <DiscoverCard />
          </div>
          {post ? (
            <div>
              {post.parent_post ? (
                <Link
                  href={{
                    pathname: AppRoutes.single_post,
                    query: {
                      account_address: post.parent_post.user.account_address,
                      post_id: post.parent_post._id,
                    },
                  }}
                >
                  <a className={backBtn}>Back</a>
                </Link>
              ) : (
                <Link
                  href={{
                    pathname: AppRoutes.feed,
                  }}
                >
                  <a className={backBtn}>Back</a>
                </Link>
              )}
              <SinglePost post={post} />
            </div>
          ) : (
            <p>Loading...</p>
          )}
          <div className={rightSidebar}>
            <MessagesCard />
            <RecentActivitiesCard />
          </div>
        </div>
      </div>
    </AllPagesWrapper>
  );
};

export default SinglePostPage;

// styling
const dashboardContentContainer = ctl(`
stakingpack bg-black-shade-3 w-full min-h-screen font-monto
`);
const title = ctl(`
textGradient  font-semibold leading-[42px]  pb-6 animationTextHeading text-34px
`);
const feedContainer = ctl(`
flex justify-center gap-5
`);
const leftSidebar = ctl(`
w-full max-w-[272px] flex flex-col gap-3
`);
const rightSidebar = ctl(`
w-full max-w-[272px] flex flex-col gap-3
`);
const postsContainer = ctl(`
w-full flex flex-col gap-3 overflow-y-scroll h-[calc(100vh-60px)]
`);
const backBtn = ctl(`
text-brand-primary text-[11px] px-3 py-2 bg-brand-primary/10 rounded-full hover:bg-brand-primary hover:text-black-shade-2 transition font-medium w-20
`);
// interfaces
type setLevelFunction = (levelVal: "level1" | "level2" | "level3") => void;
