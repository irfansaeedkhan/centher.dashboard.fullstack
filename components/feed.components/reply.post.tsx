// React, Next, NPM Packages
import React, { useEffect, useState, useRef } from "react";
import Image from "next/future/image";
import Link from "next/link";
import { useOnClickOutside } from "usehooks-ts";
import moment from "moment";
import { useInView } from "react-intersection-observer";
import { toast } from "react-hot-toast";
import ctl from "@netlify/classnames-template-literals";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Bars, Rings } from "react-loader-spinner";

// App imports
import useUser from "@/hooks/use.user";
import { CustomModal } from "@/components/modal/custom.modal";
import Button from "@/components/button";
import {
  MessageIcon,
  LikeIcon,
  ShareIcon,
  DotsIcon,
  EditIcon,
  TrashIcon,
  LinkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  AnimateTrashIcon,
  WorldIcon,
  MessageIcon2,
  ArchiveIcon,
} from "@/assets/svgs";
import { Post, PostMedia } from "@/models/post";
import { AppRoutes } from "@/constants/app.routes";
import { axiosNodeApi } from "@/utils/axios";

import { usePostUpload } from "./../feed.components/post.logic";
import { createPostView } from "./single.post/create.post.view";
import { PostCarousel } from "./single.post/post.carousel";

interface ReplyPostProps {
  post: Post;
  onDelete: (post_id: string) => void;
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

export const ReplyPost = React.forwardRef<HTMLDivElement, ReplyPostProps>(
  ({ post, onDelete }, ref) => {
    const [_post, setPost] = useState(post);
    const { user } = useUser();
    const [togglePop, setTogglePop] = useState<boolean>(false);
    const [toggleSharePop, setToggleSharePop] = useState<boolean>(false);
    const [toggleSharePop_2, setToggleSharePop_2] = useState<boolean>(false);
    const [replies, setReplies] = useState<Post[]>([]);
    const [totalPostLikes, setTotalPostLikes] = useState<number>(
      post.likes_count
    );
    const [isLikedByLoggedInUser, setIsLikedByLoggedInUser] = useState(
      post.liked_by_loggedin_user
    );
    const [currentPostRef, currentPostInView, currentPostEntry] = useInView({
      threshold: 0.8,
    });
    const [updateLoadingButton, setUpdateLoadingButton] = useState<
      true | false
    >(false);

    const [editPostData, setEditPostData] =
      useState<IEditPostData>(initialEditPostData);

    useEffect(() => {
      setEditPostData((prev) => ({
        ...prev,
        editedPostText: _post.text_content ?? "",
        media: _post.media ?? [],
      }));
    }, [_post]);

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
    }, [_post, currentPostEntry]);

    useEffect(() => {
      const fetchRepliesPostData = async () => {
        try {
          // Fetch a single reply of reply
          const { data } = await axiosNodeApi.get(
            `/api/socials/posts/'${post.user.account_address}'/post/${post._id}/replies?limit=1`
          );

          setReplies(data.posts);
        } catch (error: any) {
          toast.error(
            error.response.data?.message_description || "Something went wrong"
          );
        }
      };
      if (post._id) {
        fetchRepliesPostData();
      }
    }, [post]);

    const likePost = async (post_id: string) => {
      try {
        // putting it before the api call to make it feel faster
        if (isLikedByLoggedInUser) {
          setIsLikedByLoggedInUser(false);
          setTotalPostLikes(totalPostLikes - 1);
        } else {
          setTotalPostLikes((prev) => prev + 1);
          setIsLikedByLoggedInUser(true);
        }
        await axiosNodeApi.post("api/socials/analytics/likes", {
          post_id,
        });
      } catch (error: any) {
        setIsLikedByLoggedInUser(post.liked_by_loggedin_user);
        setTotalPostLikes(post.likes_count);
        toast.error(
          error.response.data?.message_description || "Something went wrong"
        );
      }
    };

    const deletePost = async () => {
      await axiosNodeApi
        .delete(`api/socials/posts/${post._id}`)
        .then(() => {
          toast.success("Post Deleted Successfully");
          onDelete(post._id);
        })
        .catch((error: any) => {
          console.dir("Error inside Delete", error);
          toast.error(
            error.response?.data?.message_description || "Something Went Wrong"
          );
        });
    };

    const archivePost = async (post_id: string) => {
      try {
        await axiosNodeApi.post(`/api/socials/posts/archive`, {
          post_id,
        });

        toast.success("Reply Archived Successfully");

        onDelete(post_id);
      } catch (error: any) {
        console.dir("Error inside Archive", error);
        toast.error(
          error.response?.data?.message_description || "Something went wrong"
        );
      }
    };

    const editPost = async () => {
      setUpdateLoadingButton(true);
      try {
        await axiosNodeApi.patch(`api/socials/posts/edit`, {
          post_id: post._id,
          text: editPostData.editedPostText,
          deleted_media: editPostData.deletedMedia,
        });

        // Get Updated Post
        const { data } = await axiosNodeApi.get(
          `/api/socials/posts/${_post._id}`
        );
        setPost(data.post);
        setEditPostData((prev) => ({
          ...prev,
          isEditModalVisible: false,
          deletedMedia: [],
          media: _post.media ?? [],
          editedPostText: _post.text_content ?? "",
        }));
        setUpdateLoadingButton(false);
        toast.success("Post Edited Successfully");
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

    // using OnclickOutside to have better toggle on popups
    const toggleContainerRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(toggleContainerRef, () => {
      setTogglePop(false);
    });
    const ref2 = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref2, () => {
      setToggleSharePop(false);
      setToggleSharePop_2(false);
    });

    const {
      showModal,
      setShowModal,
      previewFilesUI,
      totalReplyCount,
      loadingState,
      handleTextLength,
      createPost,
      closePostModel,
      handleSelectFile,
    } = usePostUpload({
      reply: true,
      reply_address: post.user.account_address,
      reply_post_id: post._id,
      replyCount: post.replies_count,
      onPostCreated: (replies) => {
        setReplies((prev) => [replies, ...prev]);
      },
    });

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
    const timeAfter15Minutes = moment(post.createdAt).add(15, "minutes");

    return (
      <div ref={currentPostRef}>
        <div
          className={`${replyBoxContainer} ${
            replies.length === 0 && " border-b-2 border-gray-shade-3"
          } `}
          ref={ref}
        >
          <div className={firstReplyBox}>
            {replies.length > 0 && <div className={connectLines}></div>}
            <div className={topCard}>
              <div className={profileDetail}>
                <Image
                  src={post.user.profile_image.path}
                  width={48}
                  height={48}
                  className="rounded-full dpImagePreview"
                  alt={post.user.display_name}
                />
                <div>
                  <div className={replyToBox}>
                    <h5 className={PFName}>{post.user.display_name}</h5>
                    <button className={replyToContent}>
                      Replying to{" "}
                      <span className={repliedToPersonName}>
                        {" "}
                        {post.parent_post?.user.display_name}
                      </span>
                    </button>
                  </div>
                  <h6 className={PFTime}>{moment(post.createdAt).fromNow()}</h6>
                </div>
              </div>

              {post.user._id === user?._id && (
                <div ref={toggleContainerRef} className={toggleContainer}>
                  <button onClick={togglePopFunc}>
                    <DotsIcon />
                  </button>
                  {timeNow >= timeAfter15Minutes ? (
                    <div
                      className={`${toggleList} ${
                        togglePop ? "!block z-50" : "hidden"
                      }`}
                    >
                      <button
                        className={toggleListBtn}
                        onClick={() => {
                          archivePost(post._id);
                        }}
                      >
                        <ArchiveIcon className={toggleListIcons} /> Archive
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`${toggleList} ${
                        togglePop ? "!block z-50" : "hidden"
                      }`}
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
                          archivePost(post._id);
                        }}
                      >
                        <ArchiveIcon className={toggleListIcons} /> Archive
                      </button>
                      <button className={toggleListBtn} onClick={deletePost}>
                        <TrashIcon className={toggleListIcons} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div
              className={maincontentContainer}
              onClick={() => {
                // props.setLevelFunc("level3");
              }}
            >
              <div className={mediaContainer}>
                {post.media && post.media.length > 0 && (
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
                          alt="post media"
                          className="w-full"
                        />
                      ) : (
                        <video
                          key={index}
                          src={media.url}
                          width={452}
                          height={312}
                          className="w-full"
                          controls
                        />
                      )
                    )}
                  </Carousel>
                )}
              </div>
              {post.text_content && (
                <div className={textContainer}>
                  <p className={textContainerContent}>{post.text_content}</p>
                </div>
              )}
            </div>
            <div className={footerBtnContainer}>
              <Link
                href={{
                  pathname: AppRoutes.feed.single_post,
                  query: {
                    post_id: post._id,
                    account_address: post.user.account_address,
                  },
                }}
              >
                <a className={footerdetailBtn}>
                  <MessageIcon /> {post.replies_count}
                </a>
              </Link>
              <button
                className={footerdetailBtn}
                onClick={() => likePost(post._id)}
              >
                <LikeIcon
                  className={
                    isLikedByLoggedInUser ? "stroke-brand-primary" : ""
                  }
                />{" "}
                <span
                  className={`${
                    isLikedByLoggedInUser ? "text-brand-primary" : ""
                  }`}
                >
                  {totalPostLikes > 0 && totalPostLikes}
                </span>
              </button>
              <div ref={ref2} className={toggleContainer}>
                <button
                  className={footerdetailBtn}
                  onClick={toggleSharePopFunc}
                >
                  <ShareIcon /> {post.shares_count}
                </button>

                <div
                  className={`${SharetoggleList} ${
                    toggleSharePop && "!block z-50"
                  }`}
                >
                  <button className={SharetoggleListBtn}>
                    <MessageIcon2 className={SharetoggleListIcons} /> Search in
                    message
                  </button>
                  <button className={SharetoggleListBtn}>
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
                    toggleSharePop_2 && "!block z-50"
                  }`}
                >
                  <button
                    className={SharetoggleListBtn}
                    onClick={toggleSharePopFunc_2}
                  >
                    <ArrowLeftIcon /> Share Via
                  </button>
                  <button className={SharetoggleListBtn}>
                    <Image
                      src="/images/whatsapp.png"
                      width={24}
                      height={24}
                      alt="icon"
                    />
                    WhatsApp
                  </button>
                  <button className={SharetoggleListBtn}>
                    <Image
                      src="/images/twitter2.png"
                      width={24}
                      height={24}
                      alt="icon"
                    />
                    Twitter
                  </button>
                </div>
              </div>
            </div>
          </div>
          {replies.map((reply) => {
            return (
              <ReplyPost
                key={reply._id}
                post={reply}
                onDelete={(post_id) => {
                  setReplies(replies.filter((p) => p._id !== post_id));
                }}
              />
            );
          })}
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
              title={"Edit Reply"}
            >
              <div className={modalBodyWrapper}>
                <div className={contactDetail}>
                  <Image
                    src={user.profile_image.path}
                    width={44}
                    height={44}
                    className="rounded-full dpImagePreview"
                    alt={user.display_name ?? "profile image"}
                  />
                  <h5 className={cdName}>{user.display_name}</h5>
                </div>

                <PostCarousel
                  editedText={editPostData.editedPostText}
                  postMedia={editPostData.media}
                  previewFilesUI={previewFilesUI}
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
                            value={uploadingFile ? uploadingFile : 0}
                            text={`${uploadingFile ? uploadingFile : 0}%`}
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
ReplyPost.displayName = "ReplyPost";

// styling
const topCard = ctl(`
top w-full z-20 flex items-center justify-between gap-2 mb-2 px-4
`);
const profileDetail = ctl(`
flex items-center gap-3 z-20
`);
const PFName = ctl(`
text-14px font-semibold text-white
`);
const PFTime = ctl(`
text-12px font-ligth text-gray-shade-7 pt-1
`);
const connectLines = ctl(`
  absolute top-[35px] left-[38px] z-0 w-[2px] h-[calc(100%)]  bg-gray-shade-3  
`);
const maincontentContainer = ctl(`
ml-16   cursor-pointer
`);
const mediaContainer = ctl(`
pr-4
`);
const textContainer = ctl(`
pt-4 pb-3 
`);
const textContainerContent = ctl(`
text-14px font-light text-[#E7E8EE] whitespace-pre-wrap break-all
`);
const footerBtnContainer = ctl(`
  flex items-items justify-between ml-16 pb-3 pr-4  
`);
const footerdetailBtn = ctl(`
flex items-center gap-2 lg:gap-3 text-14px font-medium  text-gray-shade-10
`);
const toggleContainer = ctl(`
relative
`);
const toggleList = ctl(`
 absolute right-0 top-6 rounded-10px bg-black-shade-12 shadow-sm w-[170px]
`);
const toggleListBtn = ctl(`
w-full text-14px font-semibold text-white  flex gap-3 px-5 py-4 transition hover:bg-[#1f1f1f]
`);
const toggleListIcons = ctl(`
w-[18px] h-[18px]
`);
const replyBoxContainer = ctl(`
  flex flex-col gap-4
`);
const firstReplyBox = ctl(`
relative
`);
const replyToBox = ctl(`
flex items-center gap-2
`);
const replyToContent = ctl(`
bg-[#3638438c] text-12px py-1 px-3 text-gray-shade-7  rounded-full
`);
const repliedToPersonName = ctl(`
text-brand-primary
`);
const SharetoggleList = ctl(`
 hidden absolute right-0 top-6 rounded-10px bg-black-shade-12 shadow-sm overflow-hidden w-[235px]
`);
const SharetoggleListBtn = ctl(`
w-full text-14px font-semibold text-white  flex items-center gap-3 px-5 py-4 transition hover:bg-[#1f1f1f]
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
flex items-center justify-between border-t-2 border-gray-shade-3 pt-6 px-6
`);

const RightActionBtns = ctl(`
w-[100%] lg:w-[40%] flex items-center gap-2  justify-end
`);
const divider = ctl(`
w-[2px] h-[10px] bg-[#333333]  rounded-xl
`);
