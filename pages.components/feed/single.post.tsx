// React, Next, NPM Packages
import { useEffect, useState, useRef } from "react";
import Image from "next/future/image";
import ctl from "@netlify/classnames-template-literals";
import { toast } from "react-hot-toast";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useRouter } from "next/router";
import { useOnClickOutside } from "usehooks-ts";
import Link from "next/link";
import moment from "moment";
import { TwitterShareButton, WhatsappShareButton } from "react-share";
import useUser from "@/hooks/use.user";
// App imports
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
  MessageIcon2,
  Users,
} from "@/assets/svgs";
import { Post } from "@/models/post";
import { axiosNodeApi } from "@/utils/axios";
import { AppRoutes } from "@/constants/app.routes";
import { NODE_API_URL } from "@/constants/common";

// import from same directory
import { ReplyPost } from "./reply.post";
import { usePostUpload } from "./post.logic";
import { userAgent } from "next/server";

interface FeedCardLevel1Props {
  post: Post;
  renderFeedPage?: () => void;
  onDelete: (id: string) => void;
}

export const SinglePost: React.FC<FeedCardLevel1Props> = ({
  post,
  renderFeedPage,
  onDelete,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPostText, setEditPostText] = useState("");
  const [editDeletedItem, setEditDeletedItem] = useState<number[]>([]);
  const [togglePop, setTogglePop] = useState(false);
  const [toggleSharePop, setToggleSharePop] = useState(false);
  const [toggleSharePop_2, setToggleSharePop_2] = useState(false);

  const [replies, setReplies] = useState<Post[]>([]);
  const [totalPostLikes, setTotalPostLikes] = useState<number>(
    post.likes_count
  );
  const [isLikedByLoggedInUser, setIsLikedByLoggedInUser] = useState(
    post.liked_by_loggedin_user
  );
  const router = useRouter();
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const { user } = useUser();
  const [skip, setSkip] = useState(0);

  const copyText = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Copy Link Successfully!");
  };

  const isFeedPage = router.pathname === AppRoutes.feed;
  const isProfilePage = router.pathname === AppRoutes.user_profile;

  // ref for toggle function
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => {
    setTogglePop(false);
  });
  const ref2 = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref2, () => {
    setToggleSharePop(false);
    setToggleSharePop_2(false);
  });

  // timer to check 15 min difference
  const myMoment = moment();
  const yourMoment = moment(post.createdAt).add(15, "minutes");

  console.log("Logged In User", user);
  //TO DO : Pass post id and account address
  const {
    showModal,
    setShowModal,
    previewFilesUI,
    handleTextLength,
    createPost,
    closePostModel,
    handleSelectFile,
  } = usePostUpload(
    true,
    router?.query?.account_address?.toString(),
    router?.query?.post_id?.toString()
  );

  useEffect(() => {
    const fetchRepliesPostData = async () => {
      try {
        // Create a user with registration_pending state in database
        const { data } = await axiosNodeApi.get(
          `/api/socials/posts/'${router?.query?.account_address}'/post/${router?.query?.post_id}/replies?off_set=${skip}`
        );
        setReplies((prev) => [...prev, ...data.postData]);
      } catch (error: any) {
        toast.error(
          error.response.data?.message_description || "Something went wrong"
        );
      }
    };
    if (router.query.account_address && router?.query?.post_id) {
      fetchRepliesPostData();
    }
  }, [router, skip]);

  const handleScroll = (event: any): void => {
    const { offsetHeight, scrollTop, scrollHeight } = event.target;

    if (offsetHeight + scrollTop >= scrollHeight) {
      setSkip(replies?.length);
    }
  };

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

  const sharePost = async () => {
    try {
      const { data } = await axiosNodeApi.post("api/socials/analytics/shares", {
        post_id: post._id,
      });
      return data;
    } catch (error: any) {
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  };

  const archivePostFunc = async (post_id: string) => {
    try {
      await axiosNodeApi.post(`/api/socials/posts/archive`, {
        post_id,
      });
      toast.success("Post Archived Successfully");
      // FIXME: This is a hack to refresh the feed page, we don't need to fetch the feed again, just remove the post from the state, use the same approach as delete post
      renderFeedPage && renderFeedPage();
    } catch (error: any) {
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  };

  const deletePost = async () => {
    try {
      await axiosNodeApi.delete(`api/socials/posts/${post._id}`);
      toast.success("Post Deleted Successfully");
      onDelete(post._id);
    } catch (error: any) {
      toast.error(
        error.response.data?.message_description || "Something went wrong"
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

  const editPost = async (
    post_id: string,
    text: string,
    delete_file_index: number[]
  ) => {
    console.log("edited", post_id, text, delete_file_index);
    try {
      await axiosNodeApi.post(`api/socials/posts/edit`, {
        post_id,
        text,
        delete_file_index,
      });
      toast.success("Post Edited Successfully");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message_description || "Something went wrong"
      );
    }
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
    setEditPostText(e.target.value);
  };

  const handleMediaDel = (id: number) => {
    setEditDeletedItem((prev) => {
      return [...prev, id];
    });
  };
  console.log("editPostText", editPostText);
  console.log("editDeletedItem", editDeletedItem);
  return (
    <div className={postCardContainer}>
      {(isFeedPage || isProfilePage) && <div className={connectLines}></div>}
      <div className={topCard}>
        <div className={profileDetail}>
          <Image
            src={
              post.user.custom_image
                ? post.user.profile_image
                : `${NODE_API_URL}${post.user.profile_image}`
            }
            width={48}
            height={48}
            className="rounded-full"
            alt={post.user.display_name}
          />
          <div>
            <h5 className={PFName}>{post.user.display_name}</h5>
            <h6 className={PFTime}>{moment(post.createdAt).fromNow()}</h6>
          </div>
        </div>
        {post.user._id === user?._id && (
          <div ref={ref} className={toggleContainer}>
            <button onClick={togglePopFunc}>
              <DotsIcon />
            </button>
            {myMoment >= yourMoment ? (
              <div className={`${toggleList} ${togglePop && "!block z-50"}`}>
                <button
                  className={toggleListBtn}
                  onClick={() => {
                    archivePostFunc(post._id);
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
                    setShowEditModal(true);
                  }}
                >
                  <EditIcon className={toggleListIcons} /> Edit
                </button>
                <button
                  className={toggleListBtn}
                  onClick={() => {
                    archivePostFunc(post._id);
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
          (isFeedPage || isProfilePage) && " ml-16 "
        }`}
      >
        <div className={mediaContainer}>
          {post.media && (
            <Carousel
              showStatus={false}
              showThumbs={false}
              showIndicators={false}
              showArrows={post.media && post.media.length === 1 ? false : true}
            >
              {post.media.map((media, index) => (
                <Image
                  key={index}
                  src={media.url}
                  width={452}
                  height={312}
                  alt="post media"
                  className={postImageStyling}
                />
              ))}
            </Carousel>
          )}
        </div>
        {post.text_content && (
          <div className={textContainer}>
            <p className={textContainerContent}>{post.text_content}</p>
          </div>
        )}
      </div>
      <div
        className={`${footerBtnContainer} ${
          (isFeedPage || isProfilePage) && " ml-16 "
        } ${
          !(isFeedPage || isProfilePage) &&
          " pb-4 border-b-2 border-gray-shade-3 "
        }`}
      >
        {!(isFeedPage || isProfilePage) && (
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
          <MessageIcon /> {post.replies_count}
        </button>
        <button className={footerdetailBtn} onClick={() => likePost(post._id)}>
          <LikeIcon
            className={isLikedByLoggedInUser ? "stroke-brand-primary" : ""}
          />{" "}
          <span
            className={`${isLikedByLoggedInUser ? "text-brand-primary" : ""}`}
          >
            {totalPostLikes > 0 && totalPostLikes}
          </span>
        </button>
        <div ref={ref2} className={toggleContainer}>
          <button className={footerdetailBtn} onClick={toggleSharePopFunc}>
            <ShareIcon /> {post.shares_count}
          </button>

          <div
            className={`${SharetoggleList} ${toggleSharePop && "!block z-50"}`}
          >
            {/* <button className={SharetoggleListBtn}>
              <MessageIcon2 className={SharetoggleListIcons} /> Search in
              message
          </button> */}
            <button onClick={copyText} className={SharetoggleListBtn}>
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
            <button className={SharetoggleListBtn2} onClick={sharePost}>
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
            </button>
            <button className={SharetoggleListBtn2} onClick={sharePost}>
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
            </button>
          </div>
        </div>
      </div>
      {(isFeedPage || isProfilePage) && (
        <div className={showThreadBtnContainer}>
          <Image
            src={
              post?.user?.custom_image
                ? post.user.profile_image
                : `${NODE_API_URL}${post.user.profile_image}`
            }
            width={30}
            height={30}
            className="rounded-full"
            alt={post.user.display_name}
          />
          <Link
            href={{
              pathname: AppRoutes.single_post,
              query: {
                account_address: post.user.account_address,
                post_id: post._id,
              },
            }}
          >
            <a className={showThreadBtn}>Show Thread</a>
          </Link>
        </div>
      )}
      <div className="overflow-y-scroll" onScroll={handleScroll}>
        {!(isFeedPage || isProfilePage) && (
          <>
            {replies.map((reply) => {
              return <ReplyPost key={reply._id} post={reply} />;
            })}
          </>
        )}
      </div>
      {showModal && (
        <CustomModal onClose={closePostModel} title={"Create post"}>
          <div className={modalBodyWrapper}>
            <div className={contactDetail}>
              <Image
                src={"/images/robertProfilepic.png"}
                width={44}
                height={44}
                alt={"image"}
              />
              <h5 className={cdName}>uixamjad</h5>
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
                <button className={clearBtn}>+</button>
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
      {showEditModal && (
        <CustomModal
          onClose={() => {
            setShowEditModal(false);
          }}
          title={"Edit post"}
        >
          <div className={modalBodyWrapper}>
            <div className={contactDetail}>
              <Image
                src={`${NODE_API_URL}${user?.profile_image}`}
                width={44}
                height={44}
                className="rounded-full"
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
                  {post.media?.map((data, index) => {
                    return (
                      <div
                        key={index}
                        className="h-full flex items-center justify-center relative"
                      >
                        <Image
                          src={data.url}
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
                  name=""
                  id="posttext"
                  cols={12}
                  rows={4}
                  placeholder="Type Here"
                  maxLength={200}
                  onChange={handleEditTextLength}
                  defaultValue={post?.text_content}
                  value={editPostText}
                ></textarea>
              </div>
            </div>
            <div className={modalFooter}>
              <div className={RightActionBtns}>
                <AnimateTrashIcon />
                <div className={divider}></div>
                <button className={clearBtn}>+</button>
                <Button
                  title={"Update"}
                  variant="v1"
                  className="max-w-[140px]"
                  onClick={() => {
                    editPost(post?._id, editPostText, editDeletedItem);
                  }}
                />
              </div>
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

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
text-16px font-semibold text-[#E7E8EE]
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
w-[100%] lg:w-[40%] flex items-center gap-2
`);
const divider = ctl(`
w-[2px] h-[10px] bg-[#333333]  rounded-xl
`);
const clearBtn = ctl(`
plus text-brand-primary text-[28px] leading-[28px] border-2 border-gray-shade-3 rounded-10px w-[50px] h-[40.08px]
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
