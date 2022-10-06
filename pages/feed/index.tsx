// React, Next, NPM Packages
import { useEffect, useState } from "react";
import { NextPage } from "next";
import ctl from "@netlify/classnames-template-literals";
import { toast } from "react-hot-toast";

// App imports
import useUser from "@/hooks/use.user";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { Post } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";
import Loader from "@/components/loader";

// Current page imports
import {
  ProfileDetailCard,
  DiscoverCard,
  MessagesCard,
  RecentActivitiesCard,
  PostCard,
  SinglePost,
} from "@/pages.components/feed";
import {
  checkValidImageFile,
  checkValidVideoFile,
  checkFileAlreadyAddedInSelectedFile,
  post_file_details,
  FileChunksChunksCalculations,
} from "@/utils/mediafile/valid.media.files";

const Feed: NextPage = () => {
  const { user: loggedInUser, isLoading: isLoggedInUserLoading } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const fetchFeedsData = async () => {
    try {
      setLoadingState(true);
      const { data } = await axiosNodeApi.get("/api/socials/posts");
      setPosts(data.posts);
      if (data) {
        setLoadingState(false);
      }
    } catch (error: any) {
      setLoadingState(false);
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  };

  // function when create post and rendered the posts again
  const renderFeedPage = () => {
    fetchFeedsData();
  };
  useEffect(() => {
    fetchFeedsData();
  }, []);
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
          <div className={postsContainer}>
            <PostCard renderFeedPage={renderFeedPage} />
            {posts
              ?.filter((p) => !p.parent_post)
              .map((post) => (
                <SinglePost
                  key={post._id}
                  post={post}
                  renderFeedPage={renderFeedPage}
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
