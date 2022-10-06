// React, Next, NPM Packages
import { useEffect, useState, useRef } from "react";
import ctl from "@netlify/classnames-template-literals";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useOnClickOutside } from "usehooks-ts";
import Image from "next/future/image";
import Link from "next/link";
import moment from "moment";
import { toast } from "react-hot-toast";

// App imports
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
  WorldIcon,
  MessageIcon2,
} from "@/assets/svgs";
import { Post } from "@/models/post";
import { useRouter } from "next/router";
import { AppRoutes } from "@/constants/app.routes";
import { NODE_API_URL } from "@/constants/common";
import { axiosNodeApi } from "@/utils/axios";

// import { posts } from "./dummy.posts";

// import from same directory
// import { posts } from "./dummy.posts";
interface ReplyPostProps {
  post: Post;
}

export const ReplyPost: React.FC<ReplyPostProps> = ({ post }) => {
  // states
  const [togglePop, setTogglePop] = useState<boolean>(false);
  const [toggleSharePop, setToggleSharePop] = useState<boolean>(false);
  const [toggleSharePop_2, setToggleSharePop_2] = useState<boolean>(false);
  const [replies, setReplies] = useState<Post[]>([]);
  const [totalLikePost, setTotalLikePost] = useState<number>(
    post.likes_count_on_post
  );
  useEffect(() => {
    //   const post_id = router.query.post_id;
    //   const account_address = router.query.account_address;

    //   const _replies = posts.filter(
    //     (p) =>
    //       p.parent_post?._id === post_id &&
    //       p.parent_post?.user.account_address === account_address
    //   );
    //   setReplies(_replies);
    const fetchRepliesPostData = async () => {
      try {
        // Create a user with registration_pending state in database
        const { data } = await axiosNodeApi.get(
          `/api/socials/posts/'${post.user.account_address}'/post/${post._id}/replies?limit=1`
        );
        setReplies(data.postData);
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

  const likePost = async (post_id: String) => {
    try {
      const { data } = await axiosNodeApi.post("api/socials/analytics/likes", {
        post_id,
      });
      setTotalLikePost(data.total_likes);
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

  // using OnclickOutside to have better toggle on popups
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
    <div
      className={`${replyBoxContainer} ${
        replies.length === 0 && " border-b-2 border-gray-shade-3"
      } `}
    >
      <div className={firstReplyBox}>
        {replies.length > 0 && <div className={connectLines}></div>}
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
                {post.media.map((media, index) => (
                  <Image
                    key={index}
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
        <div className={footerBtnContainer}>
          <Link
            href={{
              pathname: AppRoutes.single_post,
              query: {
                post_id: post._id,
                account_address: post.user.account_address,
              },
            }}
          >
            <a className={footerdetailBtn}>
              <MessageIcon /> {post.comments_count_on_post}
            </a>
          </Link>
          <button
            className={footerdetailBtn}
            onClick={() => likePost(post._id)}
          >
            <LikeIcon />
            {totalLikePost > 0 && totalLikePost}
          </button>
          <div ref={ref2} className={toggleContainer}>
            <button className={footerdetailBtn} onClick={toggleSharePopFunc}>
              <ShareIcon /> {post.shares_count_on_post}
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
        return <ReplyPost key={reply._id} post={reply} />;
      })}
      {/* <div className={secondReplyBox}>
        <div className={topCard}>
          <div className={profileDetail}>
            <Image
              src={"/images/feedprofilepic.png"}
              width={48}
              height={48}
              className="rounded-full"
              alt="User Display Name"
            />
            <div>
              <div className="flex items-center gap-2 ">
                <h5 className={PFName}>irfan</h5>
                <button className={replyToContent}>
                  Replying to{" "}
                  <span className={repliedToPersonName}> uixamjad 2</span>
                </button>
              </div>
              <h6 className={PFTime}>11 Feb, 2022 at 2:30 PM</h6>
            </div>
          </div>
          <div className={toggleContainer}>
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
          className={maincontentContainer}
          onClick={() => {
            // props.setLevelFunc("level3");
          }}
        >
          <div className={mediaContainer}>
            <Image
              src="/images/postimage.png"
              width={452}
              height={312}
              alt="post media"
              className="w-full"
            />
          </div>
          <div className={textContainer}>
            <p className={textContainerContent}>
              We know the voices in our heads aren&apos;t real, but sometimes
              their ideas are just too good to ignore.please check thread for
              more details 😎👇
            </p>
          </div>
        </div>
        <div className={footerBtnContainer}>
          <button className={footerdetailBtn}>
            <MessageIcon />3
          </button>
          <button className={footerdetailBtn}>
            <LikeIcon />
            194
          </button>
          <button className={footerdetailBtn}>
            <ShareIcon />2
          </button>
        </div>
      </div> */}
    </div>
  );
};

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
text-14px font-light text-[#E7E8EE]
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
 hidden absolute right-0 top-6 rounded-10px bg-[#0D0D0D] shadow-sm overflow-hidden w-[170px]
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
// interfaces
interface setLevelFunction {
  setLevelFunc: (levelVal: "level1" | "level2" | "level3") => void;
}
