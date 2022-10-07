// React, Next, NPM Packages
import { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import ctl from "@netlify/classnames-template-literals";
import { toast } from "react-hot-toast";

// App imports
import useUser from "@/hooks/use.user";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { Post } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";
import Loader from "@/components/loader";
import {
  checkValidImageFile,
  checkValidVideoFile,
  checkFileAlreadyAddedInSelectedFile,
  post_file_details,
  FileChunksChunksCalculations,
} from "@/utils/mediafile/valid.media.files";

// Current page imports
import {
  ProfileDetailCard,
  DiscoverCard,
  MessagesCard,
  RecentActivitiesCard,
  PostCardNew,
  SinglePost,
} from "@/pages.components/feed";

const Feed: NextPage = () => {
  const { user: loggedInUser, isLoading: isLoggedInUserLoading } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [skip, setSkip] = useState(0);

  const fetchFeedsData = useCallback(async () => {
    try {
      setLoadingState(true);
      const { data } = await axiosNodeApi.get(
        `/api/socials/posts?off_set=${skip}`
      );

      const _posts = data.posts;

      setPosts((prev) => {
        const filteredPosts = _posts.filter((post: Post) => {
          return prev.every((prevPost) => prevPost._id !== post._id);
        });
        return [...prev, ...filteredPosts];
      });

      setLoadingState(false);
    } catch (error: any) {
      setLoadingState(false);
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  }, [skip]);

  useEffect(() => {
    fetchFeedsData();
  }, [fetchFeedsData]);

  const handleScroll = (event: any): void => {
    const { offsetHeight, scrollTop, scrollHeight } = event.target;

    if (offsetHeight + scrollTop >= scrollHeight) {
      setSkip(posts?.length);
    }
  };

  return (
    <AllPagesWrapper pageTitle="Feed">
      <div className={dashboardContentContainer}>
        <h1 className={title}>My Feed</h1>
        <div className={feedContainer}>
          <div className={leftSidebar}>
            {!isLoggedInUserLoading && loggedInUser ? (
              <ProfileDetailCard user={loggedInUser} isLoggedInUser={true} />
            ) : (
              <>Loading...</>
            )}
            <DiscoverCard />
          </div>
          <div className={postsContainer} onScroll={handleScroll}>
            <PostCardNew
              onPostCreated={(post) => {
                setPosts((prev) => [post, ...prev]);
              }}
            />
            {posts.map((post) => (
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
      {loadingState && <Loader />}
    </AllPagesWrapper>
  );
};

export default Feed;

// styling
const dashboardContentContainer = ctl(`
 bg-black-shade-3 w-full h-full font-monto max-w-[544px] lg:max-w-[835px] mx-auto
`);
const title = ctl(`
textGradient  font-semibold leading-[42px]  pb-6 animationTextHeading text-34px
`);
const feedContainer = ctl(`
flex  gap-5
`);
const leftSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden lg:flex
`);
const rightSidebar = ctl(`
w-full max-w-[272px]  flex-col gap-3 hidden xl:flex
`);
const postsContainer = ctl(`
w-full max-w-[544px] flex flex-col gap-3 overflow-y-scroll h-[calc(100vh-158px)] pb-12
`);
