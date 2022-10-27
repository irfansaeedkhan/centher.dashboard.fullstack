// React, Next, NPM Packages
import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useOnClickOutside } from "usehooks-ts";
import { useInView } from "react-intersection-observer";
import moment from "moment";
import { toast } from "react-hot-toast";
import { TwitterShareButton, WhatsappShareButton } from "react-share";
import { Bars, Rings } from "react-loader-spinner";
import ctl from "@netlify/classnames-template-literals";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Picker, { EmojiStyle, Theme } from "emoji-picker-react";
// App imports
import { useProfileCardStore } from "@/store/profile.card.store";
import useUser from "@/hooks/use.user";
import Button from "@/components/button";
import { CustomModal } from "@/components/modal/custom.modal";
import SinglePostCardSkeleton from "@/components/loading.skeletons/single.post";
import SinglePostTextCardSkeleton from "@/components/loading.skeletons/single.post.text";
import {
  MessageIcon,
  LikeIcon,
  ShareIcon,
  DotsIcon,
  EditIcon,
  TrashIcon,
  PhotoIcon,
  VideoIcon,
  EmojiIcon,
  AnimateTrashIcon,
  LinkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  WorldIcon,
} from "@/assets/svgs";
import { CompletedPost, PostMedia } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";
import { AppRoutes } from "@/constants/app.routes";
import { ArchiveIcon } from "@/assets/svgs";

// import from same directory
import { ReplyPost } from "../reply.post";
import { usePostUpload } from "../post.logicv1";
import { createPostView } from "./create.post.view";
import { PostCarousel } from "./post.carousel";
import { ModalWrapper } from "@/components/modal";

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

export const SinglePost = React.forwardRef<HTMLDivElement, FeedCardLevel1Props>(
  ({ post, onDelete }, ref) => {
    const router = useRouter();
    const { user } = useUser();
    const decrementPostsCount = useProfileCardStore(
      (state) => state.decrementPostsCount
    );
    const [deleteModal, setDeleteModal] = useState(false);
    const [_post, setPost] = useState<CompletedPost>(post);
    const [replies, setReplies] = useState<CompletedPost[]>([]);
    const [skip, setSkip] = useState(0);
    const [loader, setLoader] = useState(false);
    const [lastPostRef, lastPostInView] = useInView();
    const [currentPostRef, currentPostInView, currentPostEntry] = useInView({
      threshold: 0.8,
    });

    const [editPostData, setEditPostData] =
      useState<IEditPostData>(initialEditPostData);

    // For Emoji Picker
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(emojiPickerRef, () => setIsEmojiPickerVisible(false));

    const [togglePop, setTogglePop] = useState(false);
    const [toggleSharePop, setToggleSharePop] = useState(false);
    const [toggleSharePop_2, setToggleSharePop_2] = useState(false);
    const [shareUrl, setShareUrl] = useState("");
    const [updateLoadingButton, setUpdateLoadingButton] = useState<
      true | false
    >(false);

    const currentPageRoute = useMemo(
      () => ({
        isSinglePostPage: router.pathname === AppRoutes.feed.single_post,
        isFeedPage: router.pathname === AppRoutes.feed.index,
        isProfilePage: router.pathname === AppRoutes.profile.account_address,
      }),
      [router.pathname]
    );

    useEffect(() => {
      setEditPostData((prev) => ({
        ...prev,
        editedPostText: _post.text_content ?? "",
        media: _post.media ?? [],
      }));
    }, [_post.text_content, _post.media]);

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
            process.env.NODE_ENV !== "production" && console.dir(error);
          }
        }
      })();
    }, [_post._id, _post.viewed_by_loggedin_user, currentPostEntry]);

    useEffect(() => {
      if (lastPostInView) {
        setSkip(replies.length);
      }
    }, [replies, lastPostInView]);

    // Update post
    useEffect(() => {
      setPost(post);
    }, [post]);

    // Set updated post share url
    useEffect(() => {
      setShareUrl(
        `${window.location.origin}${AppRoutes.feed.index}/${_post.user.account_address}/post/${_post._id}`
      );
    }, [router, _post.user.account_address, _post._id]);

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

    // Copy post share url to clipboard
    const copyShareUrl = () => {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Copy Link Successfully!");
    };

    // ref for toggle function
    const toggleContainerRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(toggleContainerRef, () => {
      setTogglePop(false);
    });

    const ref2 = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref2, () => {
      setToggleSharePop(false);
      setToggleSharePop_2(false);
    });

    // Files selected by user
    const [userSelectedFiles, setUserSelectedFilesList] = useState<File[]>([]);

    // User_Selected_Files
    const [detailsOfUserSelected, setdetailsOfUserSelected] = useState<
      string[]
    >([]);

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
      onPostCreated: (replies) => {
        setReplies((prev) => [replies, ...prev]);
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

    const handleDeleteReply = (post_id: string) => {
      setReplies(replies.filter((rep) => rep._id !== post_id));
    };

    const sharePost = async () => {
      try {
        const { data } = await axiosNodeApi.post(
          "api/socials/analytics/shares",
          {
            post_id: _post._id,
          }
        );

        // Update share count
        setPost((prev) => ({
          ...prev,
          shares_count: data.shares_count,
        }));
      } catch (error: any) {
        // Reset share count
        setPost((prev) => ({
          ...prev,
          shares_count: post.shares_count,
        }));

        toast.error(
          error.response.data?.message_description || "Something went wrong"
        );
      }
    };

    const archivePost = async (post_id: string) => {
      try {
        await axiosNodeApi.patch(`/api/socials/posts/${post_id}/archive`);

        toast.success("Post Archived Successfully");

        if (currentPageRoute.isSinglePostPage) {
          router.replace(AppRoutes.feed.index);
          return;
        }

        // Using onDeleted prop to remove the post from the feed page as archiving the post is same as deleting it
        onDelete(post_id);
      } catch (error: any) {
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
        decrementPostsCount();
        onDelete(_post._id);
      } catch (error: any) {
        toast.error(
          error.response.data?.message_description || "Something went wrong"
        );
      }
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

    // toggle function to show/hide edit/delete popup
    const togglePopFunc = async () => {
      setTogglePop((prev) => !prev);
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

    // Timer to check 15 min difference
    const timeNow = moment();
    const timeAfter15Minutes = moment(_post.createdAt).add(15, "minutes");

    return (
      <div ref={currentPostRef}>
        <div className={postCardContainer} ref={ref}>
          {(currentPageRoute.isFeedPage || currentPageRoute.isProfilePage) && (
            <div className={connectLines}></div>
          )}
          <div className={topCard}>
            <div className={profileDetail}>
              <Link
                href={{
                  pathname: AppRoutes.profile.account_address,
                  query: {
                    account_address: post.user?.account_address,
                  },
                }}
              >
                <Image
                  src={_post.user.profile_image.path}
                  width={48}
                  height={48}
                  className="rounded-full cursor-pointer w-[48px] h-[48px] object-cover border border-gray-shade-3"
                  alt={_post.user.display_name}
                />
              </Link>
              <div>
                <Link
                  href={{
                    pathname: AppRoutes.profile.account_address,
                    query: {
                      account_address: post.user?.account_address,
                    },
                  }}
                >
                  <h5 className={PFName}>{_post.user.display_name}</h5>
                </Link>
                <h6 className={PFTime}>{moment(_post.createdAt).fromNow()}</h6>
              </div>
            </div>
            {_post.user._id === user?._id && (
              <div ref={toggleContainerRef} className={toggleContainer}>
                <button onClick={togglePopFunc}>
                  <DotsIcon />
                </button>
                {timeNow >= timeAfter15Minutes ? (
                  <div
                    className={`${toggleList} ${togglePop && "!block z-40"}`}
                  >
                    <button
                      className={toggleListBtn}
                      onClick={() => {
                        archivePost(_post._id);
                      }}
                    >
                      <ArchiveIcon className={toggleListIcons} /> Archive
                    </button>
                  </div>
                ) : (
                  <div
                    className={`${toggleList} ${togglePop && "!block z-40"}`}
                  >
                    <button
                      className={toggleListBtn}
                      onClick={() => {
                        setEditPostData((prev) => ({
                          ...prev,
                          isEditModalVisible: true,
                        }));
                      }}
                    >
                      <EditIcon className={toggleListIcons} /> Edit
                    </button>
                    <button
                      className={toggleListBtn}
                      onClick={() => {
                        archivePost(_post._id);
                      }}
                    >
                      <ArchiveIcon className={toggleListIcons} /> Archive
                    </button>
                    <ModalWrapper
                      isOpen={deleteModal}
                      onClose={() => setDeleteModal(false)}
                      title={"Delete Post"}
                    >
                      <div>hellooo</div>
                    </ModalWrapper>
                    <button
                      className={toggleListBtn}
                      onClick={() => setDeleteModal(true)}
                    >
                      <TrashIcon className={toggleListIcons} /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div
            className={`${maincontentContainer} ${
              (currentPageRoute.isFeedPage || currentPageRoute.isProfilePage) &&
              " ml-16 "
            }`}
          >
            <div className={mediaContainer}>
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
              <div className={textContainer}>
                <p className={textContainerContent}>{_post.text_content}</p>
              </div>
            )}
          </div>
          <div
            className={`${footerBtnContainer} ${
              (currentPageRoute.isFeedPage || currentPageRoute.isProfilePage) &&
              " ml-16 "
            } ${
              !(
                currentPageRoute.isFeedPage || currentPageRoute.isProfilePage
              ) && " pb-4 border-b-2 border-gray-shade-3 "
            }`}
          >
            {!(
              currentPageRoute.isFeedPage || currentPageRoute.isProfilePage
            ) && (
              <button
                className={footerdetailReplyBtn}
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <MessageIcon /> Reply
              </button>
            )}
            <button className={footerdetailBtn}>
              <MessageIcon /> {totalReplyCount}
            </button>
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
                {_post.likes_count > 0 && _post.likes_count}
              </span>
            </button>
            <div ref={ref2} className={toggleContainer}>
              <button className={footerdetailBtn} onClick={toggleSharePopFunc}>
                <ShareIcon /> {_post.shares_count}
              </button>

              <div
                className={`${SharetoggleList} ${
                  toggleSharePop && "!block z-40"
                }`}
              >
                {/* <button className={SharetoggleListBtn}>
              <MessageIcon2 className={SharetoggleListIcons} /> Search in
              message
          </button> */}
                <button onClick={copyShareUrl} className={SharetoggleListBtn}>
                  <LinkIcon className={SharetoggleListIcons} /> Copy link
                </button>
                <button
                  className={shareBtnContainer}
                  onClick={toggleSharePopFunc_2}
                >
                  <div className={SharetoggleListBtn}>
                    <WorldIcon className={SharetoggleListIcons} /> Share Via...
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
                    onClick={sharePost}
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
                    onClick={sharePost}
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
          {(currentPageRoute.isFeedPage || currentPageRoute.isProfilePage) && (
            <div className={showThreadBtnContainer}>
              <Image
                src={_post.user.profile_image.path}
                width={30}
                height={30}
                className="rounded-full w-[30px] h-[30px] object-cover border border-gray-shade-3"
                alt={_post.user.display_name}
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
          {/* // */}
          <div className={repliesContainer}>
            {!(
              currentPageRoute.isFeedPage || currentPageRoute.isProfilePage
            ) && (
              <>
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
                {loader && (
                  <>
                    <SinglePostCardSkeleton />
                    <SinglePostTextCardSkeleton />
                    <SinglePostCardSkeleton />
                  </>
                )}
              </>
            )}
          </div>

          {/* Reply Post Modal */}
          {showModal && user && (
            <CustomModal onClose={closePostModal} title={"Reply"}>
              <div className={modalBodyWrapper}>
                <div className={contactDetail}>
                  <Image
                    src={user.profile_image.path}
                    width={44}
                    height={44}
                    alt={user?.display_name ?? "profile image"}
                    className="rounded-full w-[44px] h-[44px] object-cover border border-gray-shade-3"
                  />
                  <h5 className={cdName}>{user?.display_name}</h5>
                </div>
                <div className={maincontentContainer}>
                  <div
                    className={`${mediaContainer}
                    `}
                  >
                    <Carousel
                      showStatus={false}
                      showThumbs={false}
                      showIndicators={false}
                      showArrows={
                        displaySelectedFiles.length === 1 ? false : true
                      }
                      selectedItem={lastItem}
                      onChange={(i) => {
                        setLastItem(i);
                      }}
                    >
                      {displaySelectedFiles}
                    </Carousel>
                  </div>
                  <div className={inputTextContainer}>
                    <textarea
                      className={ModaltextContainerContent}
                      name=""
                      id="posttext"
                      cols={12}
                      rows={4}
                      placeholder="Type Here"
                      maxLength={200}
                      value={tweetText}
                      onChange={handleTextLength}
                    ></textarea>
                  </div>
                </div>
                <div className={modalFooter}>
                  <div className={leftActionBtns}>
                    <label className={`${uploadBtn} text-yellow-theme`}>
                      <PhotoIcon />
                      Photo
                      <input
                        type="file"
                        id="files-photo"
                        name="photos-file"
                        accept=".gif,.jpg,.jpeg,.jfif,.pjpeg,.pjp,.png"
                        style={{ display: "none" }}
                        multiple
                        onChange={(e) => {
                          handleSelectFile(e, "images");
                        }}
                      />
                    </label>
                    <label className={`${uploadBtn} text-[#157AFB]`}>
                      <VideoIcon />
                      Video
                      <input
                        type="file"
                        id="files-videos"
                        name="videos-file"
                        accept=".webm,.mp4,.mpg,.avi,.m4v"
                        style={{ display: "none" }}
                        multiple
                        onChange={(e) => {
                          handleSelectFile(e, "videos");
                        }}
                      />
                    </label>
                    <button
                      className={`${uploadBtn} text-[#00BF96]`}
                      onClick={() => {
                        setTogglePop((prev) => !prev);
                        setIsEmojiPickerVisible((prev) => !prev);
                      }}
                    >
                      <EmojiIcon />
                      Emoji
                    </button>
                    {isEmojiPickerVisible && (
                      <div
                        ref={emojiPickerRef}
                        className={`emojiContainer absolute right-[0] top-[287px] ${
                          isEmojiPickerVisible && "!block z-40"
                        }`}
                      >
                        <Picker
                          onEmojiClick={onEmojiClick}
                          height={400}
                          width={300}
                          autoFocusSearch={false}
                          emojiStyle={EmojiStyle.NATIVE}
                          theme={Theme.AUTO}
                        />
                      </div>
                    )}
                  </div>
                  <div className={RightActionBtns}>
                    <span onClick={deleteText}>
                      <AnimateTrashIcon />
                    </span>
                    <div className={divider}></div>
                    {loadingState ? (
                      <button className="bg-brand-primary  text-14px font-bold py-2 px-2 rounded-xl flex items-center justify-center w-[136px] h-[36px]">
                        {/* <Rings
                          height="30"
                          width="30"
                          color="#1C1F29"
                          radius="6"
                          wrapperStyle={{}}
                          wrapperClass=""
                          visible={true}
                          ariaLabel="rings-loading"
                        /> */}
                        <div style={{ width: 30, height: 30 }}>
                          <CircularProgressbar
                            value={
                              uploadingFileStatus ? uploadingFileStatus : 0
                            }
                            text={`${
                              uploadingFileStatus ? uploadingFileStatus : 0
                            }%`}
                            styles={buildStyles({
                              textColor: "#ffffff",
                              textSize: "20px",
                              pathColor: "#1C1F29",
                            })}
                          />
                        </div>
                      </button>
                    ) : (
                      <Button
                        title={"Post"}
                        variant="v1"
                        className="max-w-[140px]"
                        onClick={createPost}
                      />
                    )}
                  </div>
                </div>
              </div>
            </CustomModal>
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
                    className="rounded-full w-[44px] h-[44px] object-cover border border-gray-shade-3"
                    alt={user.display_name ?? "profile image"}
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
                        {/* <div style={{ width: 30, height: 30 }}>
                          <CircularProgressbar
                            value={uploadingFileStatus ? uploadingFileStatus : 0}
                            text={`${uploadingFileStatus ? uploadingFileStatus : 0}%`}
                            styles={buildStyles({
                              textColor: "#ffffff",
                              textSize: "20px",
                              pathColor: "#1C1F29",
                            })}
                          />
                        </div> */}
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
      </div>
    );
  }
);

SinglePost.displayName = "SinglePost";

// styling
const postCardContainer = ctl(`
sm:w-full lg:w-[544px] relative  py-4 rounded-10px bg-background-shade-3 flex flex-col gap-4
`);
const topCard = ctl(`
top w-full z-10 flex items-center justify-between gap-2 mb-2 px-4
`);
const profileDetail = ctl(`
flex items-center gap-3
`);
const PFName = ctl(`
text-14px font-semibold text-white pb-1 cursor-pointer
`);
const PFTime = ctl(`
text-12px font-ligth text-gray-shade-7
`);
const connectLines = ctl(`
  absolute top-[35px] left-[38px] z-0 w-[2px] h-[calc(100%-65px)]  bg-gray-shade-3  
`);
const maincontentContainer = ctl(`
px-4
`);
const mediaContainer = ctl(``);
const textContainer = ctl(`
pt-4 pb-2 
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
const footerBtnContainer = ctl(`
  flex items-items justify-between px-4  
`);
const footerdetailBtn = ctl(`
flex items-center gap-2 lg:gap-3  text-14px font-medium  text-gray-shade-10
`);
const footerdetailReplyBtn = ctl(`
flex items-center gap-3 text-14px font-medium  text-white
`);
const toggleContainer = ctl(`
relative
`);
const toggleList = ctl(`
 hidden absolute right-0 top-6 rounded-10px bg-black-shade-12 shadow-sm overflow-hidden w-[170px]
`);
const toggleListBtn = ctl(`
w-full text-14px font-semibold text-white  flex items-center gap-3 px-5 py-4 transition hover:bg-[#1f1f1f]
`);
const toggleListIcons = ctl(`
w-[18px] h-[18px]
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

const inputTextContainer = ctl(`
pt-4 pb-2 w-full px-6
`);
const ModaltextContainerContent = ctl(`
text-14px rounded-10px w-full leading-6  text-white font-medium bg-background-shade-3 
`);
const modalFooter = ctl(`
flex lg:flex-row [@media(max-width:600px)]:flex-col gap-3 items-center justify-between border-t-2 border-gray-shade-3 pt-6 px-6
`);
const leftActionBtns = ctl(`
w-[100%] lg:w-[48%] flex items-center justify-between
`);
const RightActionBtns = ctl(`
w-[100%] lg:w-[40%] flex items-center [@media(max-width:600px)]:!justify-between gap-2 justify-end
`);
const divider = ctl(`
w-[2px] h-[10px] bg-[#333333]  rounded-xl
`);
const uploadBtn = ctl(`
flex items-center gap-3 text-14px font-medium 
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
