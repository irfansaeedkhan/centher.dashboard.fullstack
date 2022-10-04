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
} from "@/assets/svgs";
import { Post } from "@/models/post";
import { AppRoutes } from "@/constants/app.routes";
import { NODE_API_URL } from "@/constants/common";

// import from same directory
import { ReplyPost } from "./reply.post";
import { axiosNodeApi } from "@/utils/axios";
// import { posts } from "./dummy.posts";

interface FeedCardLevel1Props {
  post: Post;
}

export const SinglePost: React.FC<FeedCardLevel1Props> = ({ post }) => {
  // states
  const [togglePop, setTogglePop] = useState<boolean>(false);
  const [toggleSharePop, setToggleSharePop] = useState<boolean>(false);
  const [toggleSharePop_2, setToggleSharePop_2] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [replies, setReplies] = useState<Post[]>([]);
  const [totalLikePost, setTotalLikePost] = useState<number>(
    post.likes_count_on_post
  );
  const router = useRouter();
  const isFeedPage = router.pathname === AppRoutes.feed;
  const isProfilePage = router.pathname === AppRoutes.user_profile;

  // useEffect(() => {
  //   const post_id = router.query.post_id;
  //   const account_address = router.query.account_address;

  //   const _replies = posts.filter(
  //     (p) =>
  //       p.parent_post?._id === post_id &&
  //       p.parent_post?.user.account_address === account_address
  //   );
  //   setReplies(_replies);
  // }, [router]);

  const likePost = async (post_id: String) => {
    try {
      const { data } = await axiosNodeApi.post("api/socials/analytics/likes", {
        post_id,
      });
      setTotalLikePost(data.likes_count);
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
  // function to set max value of text
  const handleTextLength = (e: any) => {
    var box: HTMLElement | null = document.getElementById("trashRect");
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
  };
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => {
    setTogglePop(false);
  });
  const ref2 = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref2, () => {
    setToggleSharePop(false);
    setToggleSharePop_2(false);
  });

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
            {/* TODO: Irfan - Use dayjs for created at*/}
            <h6 className={PFTime}>{moment(post.createdAt).fromNow()}</h6>
          </div>
        </div>
        <div ref={ref} className={toggleContainer}>
          <button onClick={togglePopFunc}>
            <DotsIcon />
          </button>
          <div className={`${toggleList} ${togglePop && "!block z-50"}`}>
            <button className={toggleListBtn}>
              <EditIcon className={toggleListIcons} /> Edit
            </button>
            <button className={toggleListBtn}>
              <TrashIcon className={toggleListIcons} /> Delete
            </button>
          </div>
        </div>
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
              {post.media.map((media) => (
                <Image
                  key={media.url}
                  src={media.url}
                  width={452}
                  height={312}
                  alt="post media"
                  className="w-full"
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
          <MessageIcon /> {post.comments_count_on_post}
        </button>
        <button className={footerdetailBtn} onClick={() => likePost(post._id)}>
          <LikeIcon /> {totalLikePost > 0 && totalLikePost}
        </button>
        <div ref={ref2} className={toggleContainer}>
          <button className={footerdetailBtn} onClick={toggleSharePopFunc}>
            <ShareIcon /> {post.shares_count_on_post}
          </button>

          <div
            className={`${SharetoggleList} ${toggleSharePop && "!block z-50"}`}
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
            <button className={SharetoggleListBtn}>
              <Image
                src="/images/whatsapp.png"
                width={24}
                height={24}
                alt="whatapp"
              />
              WhatsApp
            </button>
            <button className={SharetoggleListBtn}>
              <Image
                src="/images/twitter2.png"
                width={24}
                height={24}
                alt="twitter"
              />
              Twitter
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

      {!(isFeedPage || isProfilePage) && (
        <>
          {replies.map((reply) => {
            return <ReplyPost key={reply._id} post={reply} />;
          })}
        </>
      )}
      {showModal && (
        <CustomModal onClose={() => setShowModal(false)} title={"Create post"}>
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
            <div className={ModalmaincontentContainer}>
              <div className={ModalmediaContainer}>
                <div className={mediaItem}>
                  <Image
                    src="/images/postimage.png"
                    width={452}
                    height={312}
                    alt={"post media"}
                    className={"w-full"}
                  />
                </div>
                <div className={mediaItem}>
                  <Image
                    src="/images/postimage.png"
                    width={452}
                    height={312}
                    alt={"post media"}
                    className={"w-full"}
                  />
                </div>
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
                <button className={`${uploadBtn} text-yellow-theme`}>
                  <PhotoIcon />
                  Photo
                </button>
                <button className={`${uploadBtn} text-[#157AFB]`}>
                  <VideoIcon />
                  Video
                </button>
                <button className={`${uploadBtn} text-[#00BF96]`}>
                  <EmojiIcon />
                  Emoji
                </button>
              </div>
              <div className={RightActionBtns}>
                <AnimateTrashIcon />
                <div className={divider}></div>
                <button className={clearBtn}>+</button>
                <Button title={"Post"} variant="v1" className="max-w-[140px]" />
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
const ModalmaincontentContainer = ctl(`
px-6
`);
const ModalmediaContainer = ctl(`
 w-full flex gap-2 
`);
const mediaItem = ctl(`  

`);
const inputTextContainer = ctl(`
pt-4 pb-2 w-full
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
