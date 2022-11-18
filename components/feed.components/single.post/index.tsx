// React, Next, NPM Packages
import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useOnClickOutside } from "usehooks-ts";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";
import { toast } from "react-hot-toast";
import { TwitterShareButton, WhatsappShareButton } from "react-share";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { useFeedStore } from "@/store/feed.store";
import { useNewPostStore } from "@/store/new.post.store";
import { useSinglePostStore } from "@/store/single.post.store";
import { useProfileCardStore } from "@/store/profile.card.store";
import useUser from "@/hooks/use.user";
import Button from "@/components/button";
import { CustomModal } from "@/components/modal/custom.modal";
import { ModalWrapper } from "@/components/modal";
import {
  MessageIcon,
  LikeIcon,
  ShareIcon,
  AnimateTrashIcon,
  LinkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  WorldIcon,
  DeleteCrossIcon,
  SpinIcon3,
} from "@/assets/svgs";
import { CompletedPost, PostMedia } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";
import { customLog } from "@/utils/custom.log";
import { AppRoutes } from "@/constants/app.routes";

import { ReplyPost } from "../reply.post";
import { createPostView } from "./create.post.view";
import { PostCarousel } from "./post.carousel";
import PostUserDetails from "./post.user.details";
import Post3DotsMenu from "./post.3.dots.menu";
import { useCurrentPageRoute } from "./use.current.page.route";
import { useMyPostStore } from "@/store/my.post.store";
import { useMyRepliesStore } from "@/store/my.replies.store";

interface Props {
  placement:
    | "feed"
    | "single-post-page"
    | "profile-tab-posts"
    | "profile-tab-replies";
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

export const SinglePost = React.forwardRef<HTMLDivElement, Props>(
  ({ post, onDelete }, ref) => {
    const { user } = useUser();
    const { openModal } = useNewPostStore();
    const {
      replies,
      updateRepliesOffset,
      deleteReply,
      updatePost,
      updatePostLikesCount: updatePostLikesCountSinglePost,
    } = useSinglePostStore();
    const { updatePostLikesCount: updatePostLikesCountFeed } = useFeedStore();
    const { updatePostLikesCount: updatePostLikesCountMyPost } =
      useMyPostStore();
    const { updatePostLikesCount: updatePostLikesCountMyReplies } =
      useMyRepliesStore();
    const decrementPostsCount = useProfileCardStore(
      (state) => state.decrementPostsCount
    );

    const currentPageRoute = useCurrentPageRoute();

    const [deleteModal, setDeleteModal] = useState(false);

    const shareUrl = useMemo(() => {
      return `${window.location.origin}${AppRoutes.feed.index}/${post.user.account_address}/post/${post._id}`;
    }, [post._id, post.user.account_address]);

    const [currentPostRef, _currentPostInView, currentPostEntry] = useInView({
      threshold: 0.8,
    });

    const [editPostData, setEditPostData] =
      useState<IEditPostData>(initialEditPostData);

    const [toggleSharePop, setToggleSharePop] = useState(false);
    const [toggleSharePop_2, setToggleSharePop_2] = useState(false);
    const [updateLoadingButton, setUpdateLoadingButton] = useState(false);

    const { ref: lastReplyRef, entry: lastReplyEntry } = useInView();

    useEffect(() => {
      if (lastReplyEntry?.isIntersecting) {
        updateRepliesOffset();
      }
    }, [updateRepliesOffset, lastReplyEntry]);

    // Create Post View
    useEffect(() => {
      (async () => {
        if (
          currentPostEntry &&
          currentPostEntry.intersectionRatio > 0.8 &&
          !post.viewed_by_loggedin_user
        ) {
          try {
            await createPostView(post._id);

            updatePost({
              viewed_by_loggedin_user: true,
            });
          } catch (error: any) {
            customLog(error, ["development"]);
          }
        }
      })();
    }, [post._id, post.viewed_by_loggedin_user, currentPostEntry, updatePost]);

    const likePost = async (postId: string) => {
      try {
        // putting it before the api call to make it feel faster
        if (post.liked_by_loggedin_user) {
          updatePostLikesCountFeed("decrement", postId);
          updatePostLikesCountMyPost("decrement", postId);
          updatePostLikesCountMyReplies("decrement", postId);
          updatePostLikesCountSinglePost("decrement", postId);

          axiosNodeApi.post("api/socials/analytics/likes", {
            postId,
            actionType: "unlike",
          });
        } else {
          updatePostLikesCountFeed("increment", postId);
          updatePostLikesCountMyPost("increment", postId);
          updatePostLikesCountMyReplies("increment", postId);
          updatePostLikesCountSinglePost("increment", postId);

          axiosNodeApi.post("api/socials/analytics/likes", {
            postId,
            actionType: "like",
          });
        }
      } catch (error: any) {
        customLog(error, ["development"]);
      }
    };

    const deletePost = async () => {
      try {
        await axiosNodeApi.delete(`/api/socials/posts/${post._id}`);

        toast.success("Post Deleted Successfully");

        // Remove the post from posts state
        onDelete(post._id);

        // Decrement the posts count in profile card details
        if (!post.parent_post) {
          decrementPostsCount();
        }
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
        editedPostText: post.text_content ?? "",
        media: post.media ?? [],
      }));
    }, [post.text_content, post.media]);

    const ref2 = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref2, () => {
      setToggleSharePop(false);
      setToggleSharePop_2(false);
    });

    // Images that will be displayed after it is selected
    const [displaySelectedFiles, setdisplaySelectedFiles] = useState(
      Array<JSX.Element>
    );

    const handleDeleteReply = (post_id: string) => {
      deleteReply(post_id);
    };

    const editPost = async () => {
      setUpdateLoadingButton(true);
      try {
        if (
          editPostData.deletedMedia.length == post.media?.length &&
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
          `/api/socials/posts/${post._id}`
        );
        updatePost(data.post);
        setUpdateLoadingButton(false);
        setEditPostData((prev) => ({
          ...prev,
          isEditModalVisible: false,
        }));
      } catch (error: any) {
        updatePost(post);
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
      <div ref={currentPostRef} className="flex flex-grow">
        <div
          className={`w-full max-w-[544px] flex-grow relative py-4 rounded-10px bg-background-shade-3 flex flex-col gap-4`}
          ref={ref}
        >
          {/* Connect Lines */}
          {(currentPageRoute.isFeedPage || currentPageRoute.isProfilePage) &&
            !!post.replies_count && (
              <div
                className={`absolute top-[35px] left-[38px] z-0 w-[2px] h-[calc(100%-80px)] bg-gray-shade-3`}
              ></div>
            )}

          <div
            className={`top w-full z-10 flex items-center justify-between gap-2 mb-2 px-4`}
          >
            <PostUserDetails post={post} />

            {post.user._id === user?._id && (
              <Post3DotsMenu
                post={post}
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

          <div
            className={clsx(
              `px-4`,
              (currentPageRoute.isFeedPage || currentPageRoute.isProfilePage) &&
                "ml-16"
            )}
          >
            <div>
              {post.media && (
                <Carousel
                  showStatus={false}
                  showThumbs={false}
                  showIndicators={false}
                  showArrows={
                    post.media && post.media.length === 1 ? false : true
                  }
                >
                  {post.media.map((media, index) =>
                    media.type == "image" ? (
                      <Image
                        key={index}
                        src={media.url}
                        width={452}
                        height={312}
                        alt={String(index) + "post image"}
                        className={`object-left !w-auto h-auto rounded-xl !max-h-[20rem] !block !m-0 !object-contain`}
                      />
                    ) : (
                      <video
                        key={index}
                        src={media.url}
                        width={452}
                        height={312}
                        className={`object-left !w-[99%] h-auto rounded-xl !block !m-0 !object-contain`}
                        controls
                        controlsList="nodownload"
                      />
                    )
                  )}
                </Carousel>
              )}
            </div>
            {post.text_content && (
              <div className={`pt-4 pb-2`}>
                <p
                  className={`text-16px font-semibold text-[#E7E8EE] whitespace-pre-wrap break-all`}
                >
                  {post.text_content}
                </p>
              </div>
            )}
          </div>

          <div
            className={clsx(
              `flex items-items justify-between px-4`,
              currentPageRoute.isFeedPage || currentPageRoute.isProfilePage
                ? "ml-16"
                : "pb-4 border-b-2 border-gray-shade-3"
            )}
          >
            {currentPageRoute.isFeedPage || currentPageRoute.isProfilePage ? (
              <Link
                href={{
                  pathname: AppRoutes.feed.single_post,
                  query: {
                    account_address: post.user.account_address,
                    post_id: post._id,
                  },
                }}
              >
                <button
                  className={`flex items-center gap-2 lg:gap-3 text-14px font-medium text-gray-shade-10`}
                >
                  <MessageIcon /> {post.replies_count}
                </button>
              </Link>
            ) : (
              <button
                className={`flex items-center gap-2 lg:gap-3 text-14px font-medium text-gray-shade-10`}
                onClick={() => {
                  openModal({
                    modalType: "reply",
                    parentPostId: post._id,
                  });
                }}
              >
                <MessageIcon /> {post.replies_count}
              </button>
            )}
            <button
              className={`flex items-center gap-2 lg:gap-3 text-14px font-medium text-gray-shade-10`}
              onClick={() => likePost(post._id)}
            >
              <LikeIcon
                className={
                  post.liked_by_loggedin_user ? "stroke-brand-primary" : ""
                }
              />{" "}
              <span
                className={`${
                  post.liked_by_loggedin_user ? "text-brand-primary" : ""
                }`}
              >
                {post.likes_count}
              </span>
            </button>
            <div ref={ref2} className={`relative`}>
              <button
                className={`flex items-center gap-2 lg:gap-3 text-14px font-medium text-gray-shade-10`}
                onClick={toggleSharePopFunc}
              >
                <ShareIcon />
              </button>

              <div
                className={clsx(
                  `hidden absolute right-0 top-6 rounded-10px bg-black-shade-12 shadow-sm overflow-hidden w-[235px]`,
                  toggleSharePop && "!block z-40"
                )}
              >
                <button
                  onClick={copyShareUrl}
                  className={`w-full text-14px font-semibold text-white flex items-center gap-3 transition hover:bg-[#1f1f1f] px-5 py-4`}
                >
                  <LinkIcon className={`w-[20px] h-[20px]`} /> Copy link
                </button>
                <button
                  className={`w-full flex items-center justify-between pr-4 transition hover:bg-[#1f1f1f]`}
                  onClick={toggleSharePopFunc_2}
                >
                  <div
                    className={`w-full text-14px font-semibold text-white flex items-center gap-3 transition hover:bg-[#1f1f1f] px-5 py-4`}
                  >
                    <WorldIcon className={`w-[20px] h-[20px]`} /> Share Via...
                  </div>
                  <ArrowRightIcon />
                </button>
              </div>
              <div
                className={clsx(
                  `hidden absolute right-0 top-6 rounded-10px bg-black-shade-12 shadow-sm overflow-hidden w-[235px]`,
                  toggleSharePop_2 && "!block z-40"
                )}
              >
                <button
                  className={`w-full text-14px font-semibold text-white flex items-center gap-3 transition hover:bg-[#1f1f1f] px-5 py-4`}
                  onClick={toggleSharePopFunc_2}
                >
                  <ArrowLeftIcon /> Share Via
                </button>
                <div
                  className={`w-full text-14px font-semibold text-white flex items-center gap-3 transition hover:bg-[#1f1f1f]`}
                >
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
                <div
                  className={`w-full text-14px font-semibold text-white flex items-center gap-3 transition hover:bg-[#1f1f1f]`}
                >
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
            !!post.replies_count && (
              <div className={`z-10 flex gap-3 pl-6 items-center `}>
                <Image
                  src={post.user.profile_image.path}
                  width={30}
                  height={30}
                  className="rounded-full w-[30px] h-[30px] object-cover"
                  alt={post.user.display_name}
                  sizes="256px"
                />
                <Link
                  href={{
                    pathname: AppRoutes.feed.single_post,
                    query: {
                      account_address: post.user.account_address,
                      post_id: post._id,
                    },
                  }}
                  className={`text-brand-primary text-[11px] px-3 py-2 bg-brand-primary/10 rounded-full hover:bg-brand-primary hover:text-black-shade-2 transition font-medium`}
                >
                  Show Thread
                </Link>
              </div>
            )}

          <div className={`flex flex-col gap-4`}>
            {!(
              currentPageRoute.isFeedPage || currentPageRoute.isProfilePage
            ) && (
              <>
                {replies?.length > 0 &&
                  replies.map((reply) => {
                    if (reply._id === replies[replies.length - 1]._id) {
                      return (
                        <ReplyPost
                          ref={lastReplyRef}
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
              </>
            )}
          </div>

          {/* edit modal */}
          {editPostData.isEditModalVisible && user && (
            <CustomModal
              onClose={() => {
                setEditPostData((prev) => ({
                  ...prev,
                  isEditModalVisible: false,
                  deletedMedia: [],
                  media: post.media ?? [],
                  editedPostText: post.text_content ?? "",
                }));
              }}
              title={"Edit post"}
            >
              <div
                className={`flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 pt-4`}
              >
                <div className={`flex items-center gap-3 px-6`}>
                  <Image
                    src={user.profile_image.path}
                    width={44}
                    height={44}
                    className="rounded-full w-[44px] h-[44px] object-cover"
                    alt={user.display_name ?? "profile image"}
                    sizes="256px"
                  />
                  <h5 className={`text-14px font-semibold text-white`}>
                    {user.display_name}
                  </h5>
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

                <div
                  className={`flex lg:flex-row [@media(max-width:600px)]:flex-col gap-3 items-center justify-between border-t-2 border-gray-shade-3 pt-6 px-6`}
                >
                  <div
                    className={`w-full lg:w-[40%] flex items-center [@media(max-width:600px)]:!justify-between gap-2 justify-end`}
                  >
                    <AnimateTrashIcon />
                    <div
                      className={`w-[2px] h-[10px] bg-[#333333] rounded-xl`}
                    ></div>

                    {updateLoadingButton ? (
                      <button className="bg-brand-primary  text-14px font-bold py-2 px-2 rounded-xl flex items-center justify-center w-[136px] h-[36px]">
                        <SpinIcon3 />
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

        <ModalWrapper
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          title={"Delete Post"}
        >
          <div className="lg:px-10 sm:px-5 flex flex-col lg:gap-6 sm:gap-3 pt-5 pb-8">
            <div className="flex justify-center">
              <DeleteCrossIcon />
            </div>
            <div className="flex flex-col gap-2 items-center">
              <h2 className="font-semibold lg:text-lg sm:text-lg text-center text-white">
                Are you sure?
              </h2>
              <h2 className="font-[400px] lg:text-lg sm:text-sm text-center text-[#ABAFC4]">
                Do you want to delete this post? This process cannot be undone.
              </h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="mt-2 py-3 w-full font-bold rounded-lg items-center justify-center !bg-black-shade-7 hover:!bg-gray-900 transition-all text-[#666C8F]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setDeleteModal(false);
                  deletePost();
                }}
                className="mt-2 py-3 w-full font-bold rounded-lg items-center justify-center !bg-[#EA3943] hover:!bg-red-900  text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </ModalWrapper>
      </div>
    );
  }
);

SinglePost.displayName = "SinglePost";
