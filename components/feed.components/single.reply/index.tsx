// React, Next, NPM Packages
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useOnClickOutside } from "usehooks-ts";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";
import { toast } from "react-hot-toast";
import { TwitterShareButton, WhatsappShareButton } from "react-share";
import { Rings } from "react-loader-spinner";
import ctl from "@netlify/classnames-template-literals";
import { Carousel } from "react-responsive-carousel";

import { useFeedStore } from "@/store/feed.store";
import { useProfileCardStore } from "@/store/profile.card.store";
import useUser from "@/hooks/use.user";
import Button from "@/components/button";
import { CustomModal } from "@/components/modal/custom.modal";

import {
  MessageIcon,
  LikeIcon,
  ShareIcon,
  AnimateTrashIcon,
  LinkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  WorldIcon,
} from "@/assets/svgs";
import { CompletedPost, PostMedia } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";
import { AppRoutes } from "@/constants/app.routes";

// import from same directory
import { ReplyPost } from "../reply.post";
import { usePostUpload } from "../post.logicv2";
import { createPostView } from "../single.post/create.post.view";
import { PostCarousel } from "../single.post/post.carousel";
import Post3DotsMenu from "../single.post/post.3.dots.menu";
import { useCurrentPageRoute } from "../single.post/use.current.page.route";
import moment from "moment";
import ParentPost from "./parent.post";
import DeleteModal from "./modal";
import ReplyPostModal from "./reply.post.modal";
import ReplyUserDetails from "./reply.user.details";

interface FeedCardLevel1Props {
  post: CompletedPost;
  onDelete: (id: string) => void;
}

interface IEditPostData {
  isEditModalVisible: boolean;
  editedPostText: string;
  media: PostMedia[];
  deletedMedia: string[];
}

const initialEditPostData: IEditPostData = {
  isEditModalVisible: false,
  editedPostText: "",
  media: [],
  deletedMedia: [],
};

export const SingleReply = React.forwardRef<
  HTMLDivElement,
  FeedCardLevel1Props
>(({ post, onDelete }, ref) => {
  const [_post, setPost] = useState<CompletedPost>(post);
  const router = useRouter();
  const { user } = useUser();
  const decrementPostsCount = useProfileCardStore(
    (state) => state.decrementPostsCount
  );
  const incrementPostRepliesCount = useFeedStore(
    (state) => state.incrementPostRepliesCount
  );
  const [deleteModal, setDeleteModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const [replies, setReplies] = useState<CompletedPost[]>([]);
  const [skip, setSkip] = useState(0);
  const [loader, setLoader] = useState(false);
  const [lastPostRef, lastPostInView] = useInView();
  const [currentPostRef, _currentPostInView, currentPostEntry] = useInView({
    threshold: 0.8,
  });

  const [editPostData, setEditPostData] =
    useState<IEditPostData>(initialEditPostData);

  // For Emoji Picker
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(emojiPickerRef, () => setIsEmojiPickerVisible(false));

  const [toggleSharePop, setToggleSharePop] = useState(false);
  const [toggleSharePop_2, setToggleSharePop_2] = useState(false);
  const [updateLoadingButton, setUpdateLoadingButton] = useState<true | false>(
    false
  );

  const currentPageRoute = useCurrentPageRoute();

  // Update post from props
  useEffect(() => {
    setPost(post);
  }, [post]);

  // Set updated post share url
  useEffect(() => {
    setShareUrl(
      `${window.location.origin}${AppRoutes.feed.index}/${_post.user.account_address}/post/${_post._id}`
    );
  }, [router, _post.user.account_address, _post._id]);

  // Create Post View
  useEffect(() => {
    (async () => {
      if (
        currentPostEntry &&
        currentPostEntry.intersectionRatio > 0.8 &&
        !_post.viewed_by_loggedin_user
      ) {
        try {
          await createPostView(_post._id);

          setPost((prev) => ({
            ...prev,
            viewed_by_loggedin_user: true,
          }));
        } catch (error) {
          process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
            console.dir(error);
        }
      }
    })();
  }, [_post._id, _post.viewed_by_loggedin_user, currentPostEntry]);

  const likePost = async (post_id: string) => {
    try {
      // putting it before the api call to make it feel faster
      if (_post.liked_by_loggedin_user) {
        setPost((prev) => ({
          ...prev,
          likes_count: prev.likes_count - 1,
          liked_by_loggedin_user: false,
        }));
      } else {
        setPost((prev) => ({
          ...prev,
          likes_count: prev.likes_count + 1,
          liked_by_loggedin_user: true,
        }));
      }
      await axiosNodeApi.post("api/socials/analytics/likes", {
        post_id,
      });
    } catch (error: any) {
      setPost((prev) => ({
        ...prev,
        likes_count: post.likes_count,
        liked_by_loggedin_user: post.liked_by_loggedin_user,
      }));

      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  };

  const deletePost = async () => {
    try {
      await axiosNodeApi.delete(`/api/socials/posts/${_post._id}`);

      toast.success("Post Deleted Successfully");

      // Remove the post from posts state
      onDelete(_post._id);

      // Decrement the posts count in profile card details
      if (!_post.parent_post) {
        decrementPostsCount();
      }
      onDelete(_post._id);
    } catch (error: any) {
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  };

  // Copy post share url to clipboard
  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Copy Link Successfully!");
  };

  useEffect(() => {
    setEditPostData((prev) => ({
      ...prev,
      editedPostText: _post.text_content ?? "",
      media: _post.media ?? [],
    }));
  }, [_post.text_content, _post.media]);

  useEffect(() => {
    if (lastPostInView) {
      setSkip(replies.length);
    }
  }, [replies, lastPostInView]);

  // Fetch post replies
  useEffect(() => {
    const fetchRepliesPostData = async () => {
      setLoader(true);
      try {
        const { data } = await axiosNodeApi.get(
          `/api/socials/posts/${_post._id}/replies?offset=${skip}`
        );

        const _replies = data.posts;

        setReplies((prev) => {
          const filteredReplies = _replies.filter((reply: CompletedPost) => {
            return prev.every((prevReply) => prevReply._id !== reply._id);
          });

          return [...prev, ...filteredReplies];
        });
        setLoader(false);
      } catch (error: any) {
        setLoader(false);
        toast.error(
          error.response.data?.message_description || "Something went wrong"
        );
      }
    };

    // Temporary fix for replies
    if (currentPageRoute.isSinglePostPage) {
      fetchRepliesPostData();
    }
  }, [
    _post.user.account_address,
    _post._id,
    skip,
    currentPageRoute.isSinglePostPage,
  ]);

  const ref2 = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref2, () => {
    setToggleSharePop(false);
    setToggleSharePop_2(false);
  });

  // Files selected by user
  const [userSelectedFiles, setUserSelectedFilesList] = useState<File[]>([]);

  // User_Selected_Files
  const [detailsOfUserSelected, setdetailsOfUserSelected] = useState<string[]>(
    []
  );

  // Images that will be displayed after it is selected
  const [displaySelectedFiles, setdisplaySelectedFiles] = useState(
    Array<JSX.Element>
  );

  const [lastItem, setLastItem] = useState<number>(0);
  const {
    showModal,
    setShowModal,
    //displaySelectedFiles,
    totalReplyCount,
    handleTextLength,
    createPost,
    closePostModal,
    handleSelectFile,
    loadingState,
    postError,
    file,
    refe,
    onEmojiClick,
    uploadingFileStatus,
    tweetText,
    deleteText,
  } = usePostUpload({
    reply: true,
    reply_address: _post.user.account_address,
    reply_post_id: _post._id,
    replyCount: _post.replies_count,
    onPostCreated: (newPost) => {
      setReplies((prev) => [newPost, ...prev]);
      incrementPostRepliesCount(newPost.parent_post?._id);
    },
    userSelectedFiles,
    setUserSelectedFilesList,
    detailsOfUserSelected,
    setdetailsOfUserSelected,
    displaySelectedFiles,
    setdisplaySelectedFiles,
    lastItem,
    setLastItem,
  });

  const handleDeleteReply = (post_id: string) => {
    setReplies(replies.filter((rep) => rep._id !== post_id));
  };

  const editPost = async () => {
    setUpdateLoadingButton(true);
    try {
      if (
        editPostData.deletedMedia.length == _post.media?.length &&
        !editPostData.editedPostText
      ) {
        setUpdateLoadingButton(false);
        toast.error("Post text is required");

        return;
      }
      await axiosNodeApi.patch(`/api/socials/posts/${post._id}/edit`, {
        text: editPostData.editedPostText,
        deleted_media: editPostData.deletedMedia,
      });

      // Get Updated Post
      const { data } = await axiosNodeApi.get(
        `/api/socials/posts/${_post._id}`
      );
      setPost(data.post);
      setUpdateLoadingButton(false);
      toast.success("Post Edited Successfully");
      setEditPostData((prev) => ({
        ...prev,
        isEditModalVisible: false,
      }));
    } catch (error: any) {
      setPost(post);
      setUpdateLoadingButton(false);
      toast.error(
        error?.response?.data?.message_description || "Something went wrong"
      );
    }
  };

  const toggleSharePopFunc = async () => {
    setToggleSharePop((prev) => !prev);
  };

  const toggleSharePopFunc_2 = async () => {
    setToggleSharePop_2((prev) => !prev);
  };

  // function to set max value of text
  const handleEditTextLength = (postText: string) => {
    var box: HTMLElement | null = document.getElementById("trashRect");
    if (box) {
      box.style.transform = `translateY(${
        -(postText.length * 100) / 200 + 100
      }%)`;
      if ((postText.length * 100) / 200 > 80) {
        box.style.fill = `#E03434`;
      } else {
        box.style.fill = `#FEBF32`;
      }
    }
    setEditPostData((prev) => ({
      ...prev,
      editedPostText: postText,
    }));
  };

  return (
    <div ref={currentPostRef}>
      <div
        className={`sm:w-full lg:w-[544px] relative py-4 rounded-10px bg-background-shade-3 flex flex-col gap-4`}
        ref={ref}
      >
        {_post.parent_post && <ParentPost parentPost={_post.parent_post} />}
        {/* Connect Lines */}
        {(currentPageRoute.isFeedPage || currentPageRoute.isProfilePage) &&
          !!totalReplyCount && <div className={connectLines}></div>}

        <div className={`top w-full z-10 flex justify-between gap-2 px-4 mt-5`}>
          <ReplyUserDetails post={_post} />
          <div className="flex-grow space-y-3 max-w-[calc(544px-32px-48px-24px-16px)]">
            <div>
              <Link
                href={{
                  pathname: AppRoutes.profile.account_address,
                  query: {
                    account_address: post.user?.account_address,
                  },
                }}
                className={`text-14px font-semibold text-white pb-1 cursor-pointer`}
              >
                {post.user.display_name}
              </Link>

              <h4 className={`text-12px font-ligth text-gray-shade-7`}>
                {moment(post.createdAt).format("MMM Do")} at{" "}
                {moment(post.createdAt).format("LT")}
              </h4>
            </div>
            <div
              className={`${
                (currentPageRoute.isFeedPage ||
                  currentPageRoute.isProfilePage) &&
                " ml-16 "
              }`}
            >
              <div className={``}>
                {_post.media && (
                  <Carousel
                    showStatus={false}
                    showThumbs={false}
                    showIndicators={false}
                    showArrows={
                      _post.media && _post.media.length === 1 ? false : true
                    }
                  >
                    {_post.media.map((media, index) =>
                      media.type == "image" ? (
                        <Image
                          key={index}
                          src={media.url}
                          width={452}
                          height={312}
                          alt={String(index) + "post image"}
                          className={postImageStyling}
                        />
                      ) : (
                        <video
                          key={index}
                          src={media.url}
                          width={452}
                          height={312}
                          //alt="post media"
                          className={postVideoStyling}
                          controls
                        />
                      )
                    )}
                  </Carousel>
                )}
              </div>
              {_post.text_content && (
                <div className="">
                  <p className={clsx(textContainerContent, "pt-2")}>
                    {_post.text_content}
                  </p>
                </div>
              )}
            </div>
            <div
              className={clsx(
                `flex items-items justify-between mt-4`,
                currentPageRoute.isFeedPage || currentPageRoute.isProfilePage
                  ? "ml-16"
                  : ""
              )}
            >
              {currentPageRoute.isFeedPage || currentPageRoute.isProfilePage ? (
                <Link
                  href={{
                    pathname: AppRoutes.feed.single_post,
                    query: {
                      account_address: _post.user.account_address,
                      post_id: _post._id,
                    },
                  }}
                >
                  <button className={footerdetailBtn}>
                    <MessageIcon /> {totalReplyCount}
                  </button>
                </Link>
              ) : (
                <button
                  className={footerdetailBtn}
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  <MessageIcon /> {totalReplyCount}
                </button>
              )}
              <button
                className={footerdetailBtn}
                onClick={() => likePost(_post._id)}
              >
                <LikeIcon
                  className={
                    _post.liked_by_loggedin_user ? "stroke-brand-primary" : ""
                  }
                />{" "}
                <span
                  className={`${
                    _post.liked_by_loggedin_user ? "text-brand-primary" : ""
                  }`}
                >
                  {_post.likes_count}
                </span>
              </button>
              <div ref={ref2} className={`relative`}>
                <button
                  className={footerdetailBtn}
                  onClick={toggleSharePopFunc}
                >
                  <ShareIcon />
                </button>

                <div
                  className={`${SharetoggleList} ${
                    toggleSharePop && "!block z-40"
                  }`}
                >
                  <button onClick={copyShareUrl} className={SharetoggleListBtn}>
                    <LinkIcon className={SharetoggleListIcons} /> Copy link
                  </button>
                  <button
                    className={shareBtnContainer}
                    onClick={toggleSharePopFunc_2}
                  >
                    <div className={SharetoggleListBtn}>
                      <WorldIcon className={SharetoggleListIcons} /> Share
                      Via...
                    </div>
                    <ArrowRightIcon />
                  </button>
                </div>
                <div
                  className={`${SharetoggleList} ${
                    toggleSharePop_2 && "!block z-40"
                  }`}
                >
                  <button
                    className={SharetoggleListBtn}
                    onClick={toggleSharePopFunc_2}
                  >
                    <ArrowLeftIcon /> Share Via
                  </button>
                  <div className={SharetoggleListBtn2}>
                    <WhatsappShareButton
                      url={shareUrl}
                      className="flex items-center gap-3 w-full h-full !px-5 !py-4"
                    >
                      <Image
                        src="/images/whatsapp.png"
                        width={24}
                        height={24}
                        alt="whatsapp"
                      />
                      WhatsApp
                    </WhatsappShareButton>
                  </div>
                  <div className={SharetoggleListBtn2}>
                    <TwitterShareButton
                      url={shareUrl}
                      className="flex items-center  gap-3 w-full h-full !px-5 !py-4"
                    >
                      <Image
                        src="/images/twitter2.png"
                        width={24}
                        height={24}
                        alt="twitter"
                      />
                      Twitter
                    </TwitterShareButton>
                  </div>
                </div>
              </div>
            </div>
            {(currentPageRoute.isFeedPage || currentPageRoute.isProfilePage) &&
              !!totalReplyCount && (
                <div className={showThreadBtnContainer}>
                  <Image
                    src={_post.user.profile_image.path}
                    width={30}
                    height={30}
                    className="rounded-full w-[30px] h-[30px] object-cover"
                    alt={_post.user.display_name}
                    sizes="256px"
                  />
                  <Link
                    href={{
                      pathname: AppRoutes.feed.single_post,
                      query: {
                        account_address: _post.user.account_address,
                        post_id: _post._id,
                      },
                    }}
                    className={showThreadBtn}
                  >
                    Show Thread
                  </Link>
                </div>
              )}

            {!(currentPageRoute.isFeedPage || currentPageRoute.isProfilePage) &&
              replies?.length > 0 && (
                <div className={repliesContainer}>
                  {replies?.length > 0 &&
                    replies.map((reply) => {
                      if (reply._id === replies[replies.length - 1]._id) {
                        return (
                          <ReplyPost
                            ref={lastPostRef}
                            key={reply._id}
                            post={reply}
                            onDelete={handleDeleteReply}
                          />
                        );
                      }
                      return (
                        <ReplyPost
                          key={reply._id}
                          post={reply}
                          onDelete={handleDeleteReply}
                        />
                      );
                    })}
                </div>
              )}
          </div>

          {_post.user._id === user?._id && (
            <Post3DotsMenu
              post={_post}
              onClickDelete={() => setDeleteModal(true)}
              onArchive={(postId) => onDelete(postId)}
              onClickEdit={() =>
                setEditPostData((prev) => ({
                  ...prev,
                  isEditModalVisible: true,
                }))
              }
            />
          )}
        </div>

        {/* Reply Post Modal */}
        {showModal && user && (
          <ReplyPostModal
            onClose={closePostModal}
            user={user}
            lastItem={lastItem}
            setLastItem={setLastItem}
            createPost={createPost}
            displaySelectedFiles={displaySelectedFiles}
            deleteText={deleteText}
            loadingState={loadingState}
            uploadingFileStatus={uploadingFileStatus}
            handleTextLength={handleTextLength}
            tweetText={tweetText}
            handleSelectFile={handleSelectFile}
            onEmojiClick={onEmojiClick}
            isEmojiPickerVisible={isEmojiPickerVisible}
            setIsEmojiPickerVisible={setIsEmojiPickerVisible}
            emojiPickerRef={emojiPickerRef}
          />
        )}

        {/* edit modal */}
        {editPostData.isEditModalVisible && user && (
          <CustomModal
            onClose={() => {
              setEditPostData((prev) => ({
                ...prev,
                isEditModalVisible: false,
                deletedMedia: [],
                media: _post.media ?? [],
                editedPostText: _post.text_content ?? "",
              }));
            }}
            title={"Edit post"}
          >
            <div className={modalBodyWrapper}>
              <div className={contactDetail}>
                <Image
                  src={user.profile_image.path}
                  width={44}
                  height={44}
                  className="rounded-full w-[44px] h-[44px] object-cover"
                  alt={user.display_name ?? "profile image"}
                  sizes="256px"
                />
                <h5 className={cdName}>{user.display_name}</h5>
              </div>

              <PostCarousel
                editedText={editPostData.editedPostText}
                postMedia={editPostData.media}
                previewFilesUI={displaySelectedFiles}
                user={user}
                onPostTextEdit={handleEditTextLength}
                onMediaDelete={(media) => {
                  setEditPostData((prev) => ({
                    ...prev,
                    deletedMedia: [...prev.deletedMedia, media.url],
                    media: prev.media.filter((m) => m.url !== media.url),
                  }));
                }}
              />

              <div className={`${modalFooter} justify-end`}>
                <div className={RightActionBtns}>
                  <AnimateTrashIcon />
                  <div className={divider}></div>

                  {updateLoadingButton ? (
                    <button className="bg-brand-primary  text-14px font-bold py-2 px-2 rounded-xl flex items-center justify-center w-[136px] h-[36px]">
                      <Rings
                        height="30"
                        width="30"
                        color="#1C1F29"
                        radius="6"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel="rings-loading"
                      />
                    </button>
                  ) : (
                    <Button
                      title={"Update"}
                      variant="v1"
                      className="max-w-[140px]"
                      onClick={editPost}
                    />
                  )}
                </div>
              </div>
            </div>
          </CustomModal>
        )}
      </div>
      <DeleteModal
        deleteModal={deleteModal}
        onClose={() => setDeleteModal(false)}
        deletePost={deletePost}
      />
    </div>
  );
});

SingleReply.displayName = "SingleReply";

// styling

const connectLines = ctl(`
  absolute top-[35px] left-[38px] z-0 w-[2px] h-[calc(100%-80px)]  bg-gray-shade-3  
`);

const textContainerContent = ctl(`
text-16px font-semibold text-[#E7E8EE] whitespace-pre-wrap break-all
`);
const showThreadBtnContainer = ctl(`
z-10 flex gap-3 pl-6 items-center 
`);
const showThreadBtn = ctl(`
text-brand-primary text-[11px] px-3 py-2 bg-brand-primary/10 rounded-full hover:bg-brand-primary hover:text-black-shade-2 transition font-medium
`);

const footerdetailBtn = ctl(`
flex items-center gap-2 lg:gap-3  text-14px font-medium  text-gray-shade-10
`);

const SharetoggleList = ctl(`
 hidden absolute right-0 top-6 rounded-10px bg-black-shade-12 shadow-sm overflow-hidden w-[235px]
`);
const SharetoggleListBtn = ctl(`
w-full text-14px font-semibold text-white  flex items-center gap-3  transition hover:bg-[#1f1f1f] px-5 py-4
`);
const SharetoggleListBtn2 = ctl(`
w-full text-14px font-semibold text-white  flex items-center gap-3  transition hover:bg-[#1f1f1f]
`);
const SharetoggleListIcons = ctl(`
w-[20px] h-[20px]
`);
const shareBtnContainer = ctl(`
w-full flex items-center justify-between pr-4 transition hover:bg-[#1f1f1f]
`);

// create post modal styling
const modalBodyWrapper = ctl(`
  flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 pt-4 
`);
const contactDetail = ctl(`
  flex items-center  gap-3 px-6
`);
const cdName = ctl(`
  text-14px font-semibold text-white
`);

const modalFooter = ctl(`
flex lg:flex-row [@media(max-width:600px)]:flex-col gap-3 items-center justify-between border-t-2 border-gray-shade-3 pt-6 px-6
`);

const RightActionBtns = ctl(`
w-[100%] lg:w-[40%] flex items-center [@media(max-width:600px)]:!justify-between gap-2 justify-end
`);
const divider = ctl(`
w-[2px] h-[10px] bg-[#333333]  rounded-xl
`);

const postImageStyling = ctl(`
  object-left  !w-auto h-auto rounded-xl !max-w-[27rem] !max-h-[20rem] !block !m-0 !min-w-fit !object-contain 
`);
const postVideoStyling = ctl(`
  object-left  !w-[99%] h-auto rounded-xl  !block !m-0   !object-contain 
`);

const repliesContainer = ctl(`
flex flex-col gap-4  
  `);
