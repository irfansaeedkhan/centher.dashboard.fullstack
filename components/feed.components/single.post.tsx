// React, Next, NPM Packages
import React, { useEffect, useState, useRef, useMemo } from "react";
//import Image from "next/future/image";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { userAgent } from "next/server";
import ctl from "@netlify/classnames-template-literals";
import { toast } from "react-hot-toast";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useRouter } from "next/router";
import { useOnClickOutside } from "usehooks-ts";
import Link from "next/link";
import moment from "moment";
import { TwitterShareButton, WhatsappShareButton } from "react-share";
import { Bars } from "react-loader-spinner";

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
  PhotoIcon,
  VideoIcon,
  EmojiIcon,
  AnimateTrashIcon,
  LinkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  WorldIcon,
} from "@/assets/svgs";
import { Post } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";
import { AppRoutes } from "@/constants/app.routes";
import { NODE_API_URL } from "@/constants/common";

// import from same directory
import { ReplyPost } from "./reply.post";
import { usePostUpload } from "./post.logic";

interface FeedCardLevel1Props {
  post: Post;
  onDelete: (id: string) => void;
}

interface IEditPostData {
  isEditModalVisible: boolean;
  editedPostText: string;
  editDeletedItems: number[];
  media?: [];
}
export const SinglePost = React.forwardRef<HTMLDivElement, FeedCardLevel1Props>(
  ({ post, onDelete }, ref) => {
    const router = useRouter();
    const { user } = useUser();
    const [_post, setPost] = useState<Post>(post);
    const [replies, setReplies] = useState<Post[]>([]);
    const [skip, setSkip] = useState(0);
    const [loader, setLoader] = useState(false);
    const [lastPostRef, lastPostInView, lastPostEntry] = useInView();

    // TODO: Mubashir - need your help in this when url API is complete let me know then i will remove the images on cross, already did the function but needed some more tweaks
    const [editPostData, setEditPostData] = useState<IEditPostData>({
      isEditModalVisible: false,
      editedPostText: _post.text_content ?? "",
      editDeletedItems: [],
      // media: _post.media,
    });

    const [togglePop, setTogglePop] = useState(false);
    const [toggleSharePop, setToggleSharePop] = useState(false);
    const [toggleSharePop_2, setToggleSharePop_2] = useState(false);
    const [shareUrl, setShareUrl] = useState("");

    const currentPageRoute = useMemo(
      () => ({
        isSinglePostPage: router.pathname === AppRoutes.single_post,
        isFeedPage: router.pathname === AppRoutes.feed,
        isProfilePage: router.pathname === AppRoutes.user_profile,
      }),
      [router.pathname]
    );

    useEffect(() => {
      if (lastPostInView) {
        setSkip(replies.length);
      }
    }, [replies, lastPostRef, lastPostInView, lastPostEntry]);

    // Update post
    useEffect(() => {
      setPost(post);
    }, [post]);

    // Set updated post share url
    useEffect(() => {
      setShareUrl(
        `${window.location.origin}${AppRoutes.feed}/${_post.user.account_address}/post/${_post._id}`
      );
    }, [router, _post]);

    // Fetch post replies
    useEffect(() => {
      const fetchRepliesPostData = async () => {
        setLoader(true);
        try {
          const { data } = await axiosNodeApi.get(
            `/api/socials/posts/'${_post.user.account_address}'/post/${_post._id}/replies?off_set=${skip}`
          );

          const _replies = data.postData;

          setReplies((prev) => {
            const filteredReplies = _replies.filter((reply: Post) => {
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
    }, [_post, skip, currentPageRoute.isSinglePostPage]);

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

    const {
      showModal,
      setShowModal,
      previewFilesUI,
      totalReplyCount,
      handleTextLength,
      createPost,
      closePostModel,
      handleSelectFile,
    } = usePostUpload({
      reply: true,
      reply_address: _post.user.account_address,
      reply_post_id: _post._id,
      replyCount: _post.replies_count,
      onPostCreated: (replies) => {
        setReplies((prev) => [replies, ...prev]);
      },
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
        await axiosNodeApi.post(`/api/socials/posts/archive`, {
          post_id,
        });

        toast.success("Post Archived Successfully");

        if (currentPageRoute.isSinglePostPage) {
          router.replace(AppRoutes.feed);
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
        await axiosNodeApi.delete(`api/socials/posts/${_post._id}`);

        toast.success("Post Deleted Successfully");

        onDelete(_post._id);
      } catch (error: any) {
        toast.error(
          error.response.data?.message_description || "Something went wrong"
        );
      }
    };

    const editPost = async (
      post_id: string,
      text: string,
      delete_file_index: number[]
    ) => {
      try {
        await axiosNodeApi.post(`api/socials/posts/edit`, {
          post_id,
          text,
          delete_file_index,
        });

        // Get Updated Post
        const { data } = await axiosNodeApi.get(
          `/api/socials/posts/${_post._id}`
        );
        setPost(data.post);
        toast.success("Post Edited Successfully");
        setEditPostData((prev) => ({ ...prev, isEditModalVisible: false }));
      } catch (error: any) {
        setEditPostData((prev) => ({ ...prev, isEditModalVisible: false }));
        toast.error(
          error?.response?.data?.message_description || "Something went wrong"
        );
      }
    };

    const handleMediaDel = (id: number) => {
      // Append deleted item in array
      setEditPostData((prev) => ({
        ...prev,
        editDeletedItems: [...prev.editDeletedItems, id],
      }));
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
    const handleEditTextLength = (e: any) => {
      var box: HTMLElement | null = document.getElementById("trashRectedit");
      if (box) {
        box.style.transform = `translateY(${
          -(e.target.value.length * 100) / 200 + 100
        }%)`;
        if ((e.target.value.length * 100) / 200 > 80) {
          box.style.fill = `#E03434`;
        } else {
          box.style.fill = `#FEBF32`;
        }
      }
      setEditPostData((prev) => ({
        ...prev,
        editedPostText: e.target.value,
      }));
    };

    // Timer to check 15 min difference
    const timeNow = moment();
    const timeAfter15Minutes = moment(_post.createdAt).add(15, "minutes");
    // useEffect(() => {}, [editPostData.media]);
    // console.log("editPostData::", editPostData);
    return (
      <div className={postCardContainer} ref={ref}>
        {(currentPageRoute.isFeedPage || currentPageRoute.isProfilePage) && (
          <div className={connectLines}></div>
        )}
        <div className={topCard}>
          <div className={profileDetail}>
            <Image
              src={
                _post.user.custom_image
                  ? _post.user.profile_image
                  : `${NODE_API_URL}${_post.user.profile_image}`
              }
              width={48}
              height={48}
              className="rounded-full dpImagePreview"
              alt={_post.user.display_name}
            />
            <div>
              <h5 className={PFName}>{_post.user.display_name}</h5>
              <h6 className={PFTime}>{moment(_post.createdAt).fromNow()}</h6>
            </div>
          </div>
          {_post.user._id === user?._id && (
            <div ref={toggleContainerRef} className={toggleContainer}>
              <button onClick={togglePopFunc}>
                <DotsIcon />
              </button>
              {timeNow >= timeAfter15Minutes ? (
                <div className={`${toggleList} ${togglePop && "!block z-50"}`}>
                  <button
                    className={toggleListBtn}
                    onClick={() => {
                      archivePost(_post._id);
                    }}
                  >
                    <TrashIcon className={toggleListIcons} /> Archive
                  </button>
                </div>
              ) : (
                <div className={`${toggleList} ${togglePop && "!block z-50"}`}>
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
                    <TrashIcon className={toggleListIcons} /> Archive
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
                      className={postImageStyling}
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
            !(currentPageRoute.isFeedPage || currentPageRoute.isProfilePage) &&
            " pb-4 border-b-2 border-gray-shade-3 "
          }`}
        >
          {!(currentPageRoute.isFeedPage || currentPageRoute.isProfilePage) && (
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
                toggleSharePop && "!block z-50"
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
                toggleSharePop_2 && "!block z-50"
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
                    alt="whatapp"
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
              src={
                _post?.user?.custom_image
                  ? _post.user.profile_image
                  : `${NODE_API_URL}${_post.user.profile_image}`
              }
              width={30}
              height={30}
              className="rounded-full dpImagePreview"
              alt={_post.user.display_name}
            />
            <Link
              href={{
                pathname: AppRoutes.single_post,
                query: {
                  account_address: _post.user.account_address,
                  post_id: _post._id,
                },
              }}
            >
              <a className={showThreadBtn}>Show Thread</a>
            </Link>
          </div>
        )}
        {/* // */}
        <div className={repliesContainer}>
          {!(currentPageRoute.isFeedPage || currentPageRoute.isProfilePage) && (
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
                <div className="componentLoaderContainer">
                  <Bars
                    height="25"
                    width="25"
                    color="#FEBF32"
                    ariaLabel="bars-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Reply Post Modal */}
        {showModal && (
          <CustomModal onClose={closePostModel} title={"Reply"}>
            <div className={modalBodyWrapper}>
              <div className={contactDetail}>
                <Image
                  src={`${NODE_API_URL}${user?.profile_image}`}
                  width={44}
                  height={44}
                  alt={user?.display_name ?? "profile image"}
                  className="rounded-full dpImagePreview"
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
                    showArrows={previewFilesUI.length === 1 ? false : true}
                  >
                    {previewFilesUI}
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
                      accept=".gif,.jpg,.jpeg,.jfif,.pjpeg,.pjp,.png,.svg"
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
                  <button className={`${uploadBtn} text-[#00BF96]`}>
                    <EmojiIcon />
                    Emoji
                  </button>
                </div>
                <div className={RightActionBtns}>
                  <AnimateTrashIcon />
                  <div className={divider}></div>
                  <Button
                    title={"Post"}
                    variant="v1"
                    className="max-w-[140px]"
                    onClick={createPost}
                  />
                </div>
              </div>
            </div>
          </CustomModal>
        )}

        {/* edit modal */}
        {editPostData.isEditModalVisible && (
          <CustomModal
            onClose={() => {
              setEditPostData((prev) => ({
                ...prev,
                isEditModalVisible: false,
              }));
            }}
            title={"Edit post"}
          >
            <div className={modalBodyWrapper}>
              <div className={contactDetail}>
                <Image
                  src={`${NODE_API_URL}${user?.profile_image}`}
                  width={44}
                  height={44}
                  className="rounded-full dpImagePreview"
                  alt={user?.display_name ?? "profile image"}
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
                    showArrows={previewFilesUI.length === 1 ? false : true}
                  >
                    {/* {editPostData.media?.map((data, index) => { */}
                    {post.media?.map((data, index) => {
                      return (
                        <div
                          key={index}
                          className="h-full flex items-center justify-center relative"
                        >
                          <Image
                            src={data?.url}
                            width={452}
                            height={312}
                            className={
                              "object-contain object-center w-full h-auto rounded-xl max-w-[25rem] max-h-[25rem] block"
                            }
                            alt={user?.display_name ?? "profile image"}
                          />
                          <button
                            className={imageDelBtn}
                            onClick={() => {
                              handleMediaDel(index);
                              // setEditPostData((prev) => ({
                              //   ...prev,
                              //   media: prev.media.filter(
                              //     (filterdata) => filterdata.url !== data.url
                              //   ),
                              // }));
                            }}
                          >
                            x
                          </button>
                        </div>
                      );
                    })}
                  </Carousel>
                </div>
                <div className={inputTextContainer}>
                  <textarea
                    className={ModaltextContainerContent}
                    id="posttext"
                    cols={12}
                    rows={4}
                    placeholder="Type Here"
                    maxLength={200}
                    onChange={handleEditTextLength}
                    value={editPostData.editedPostText}
                  ></textarea>
                </div>
              </div>
              <div className={`${modalFooter} justify-end`}>
                <div className={RightActionBtns}>
                  <AnimateTrashIcon />
                  <div className={divider}></div>
                  <Button
                    title={"Update"}
                    variant="v1"
                    className="max-w-[140px]"
                    onClick={() => {
                      editPost(
                        _post._id,
                        editPostData.editedPostText,
                        editPostData.editDeletedItems
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </CustomModal>
        )}
      </div>
    );
  }
);
SinglePost.displayName = "SinglePost";

// styling
const postCardContainer = ctl(`
w-full lg:w-[544px] relative  py-4 rounded-10px bg-background-shade-3 flex flex-col gap-4
`);
const topCard = ctl(`
top w-full z-10 flex items-center justify-between gap-2 mb-2 px-4
`);
const profileDetail = ctl(`
flex items-center gap-3
`);
const PFName = ctl(`
text-14px font-semibold text-white pb-1
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
const mediaContainer = ctl(`
   
`);
const textContainer = ctl(`
pt-4 pb-2 
`);
const textContainerContent = ctl(`
text-16px font-semibold text-[#E7E8EE] whitespace-pre-wrap
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
 hidden absolute right-0 top-6 rounded-10px bg-[#0D0D0D] shadow-sm overflow-hidden w-[170px]
`);
const toggleListBtn = ctl(`
w-full text-14px font-semibold text-white  flex items-center gap-3 px-5 py-4 transition hover:bg-[#1f1f1f]
`);
const toggleListIcons = ctl(`
w-[18px] h-[18px]
`);
const SharetoggleList = ctl(`
 hidden absolute right-0 top-6 rounded-10px bg-[#0D0D0D] shadow-sm overflow-hidden w-[235px]
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
const ModalmaincontentContainer = ctl(`
px-6
`);
const ModalmediaContainer = ctl(`
 w-full flex gap-2 
`);
const mediaItem = ctl(`  

`);
const inputTextContainer = ctl(`
pt-4 pb-2 w-full px-6
`);
const ModaltextContainerContent = ctl(`
text-14px rounded-10px w-full leading-6  text-white font-medium bg-background-shade-3 
`);
const modalFooter = ctl(`
flex items-center justify-between border-t-2 border-gray-shade-3 pt-6 px-6
`);
const leftActionBtns = ctl(`
w-[100%] lg:w-[48%] flex items-center justify-between
`);
const RightActionBtns = ctl(`
w-[100%] lg:w-[40%] flex items-center gap-2  justify-end
`);
const divider = ctl(`
w-[2px] h-[10px] bg-[#333333]  rounded-xl
`);
const uploadBtn = ctl(`
flex items-center gap-3 text-14px font-medium 
`);
const postImageStyling = ctl(`
 object-contain object-left  !w-auto h-auto rounded-xl max-w-[27rem] max-h-[20rem] !block
`);
const imageDelBtn = ctl(`
  absolute top-2 right-6 ml-auto border-0 text-gray-shade-3 opacity-100 outline-none leading-none font-semibold focus:outline-none transition bg-white/70  rounded-full hover:scale-110 z-30 w-[24px] h-[24px] flex items-center justify-center leading-0 text-2xl
  `);
const repliesContainer = ctl(`
flex flex-col gap-4  
  `);
