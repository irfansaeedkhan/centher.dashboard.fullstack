// React, Next, NPM Packages
import { useEffect, useState } from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import {
  MessageIcon,
  LikeIcon,
  ShareIcon,
  DotsIcon,
  EditIcon,
  TrashIcon,
} from "@/assets/svgs";
import Image from "next/future/image";
import { Post } from "@/models/post";
import { useRouter } from "next/router";
import { AppRoutes } from "@/constants/app.routes";
import { posts } from "./dummy.posts";
import Link from "next/link";

interface ReplyPostProps {
  post: Post;
}

export const ReplyPost: React.FC<ReplyPostProps> = ({ post }) => {
  // states
  const [togglePop, setTogglePop] = useState(false);
  const [replies, setReplies] = useState<Post[]>([]);
  // const router = useRouter();
  // const isFeedPage = router.pathname === AppRoutes.feed;

  useEffect(() => {
    const post_id = post._id;
    const account_address = post.user.account_address;

    const _replies = posts
      .filter(
        (p) =>
          p.parent_post?._id === post_id &&
          p.parent_post?.user.account_address === account_address
      )
      .slice(0, 1);
    setReplies(_replies);
  }, [post]);

  console.log("replies", replies);
  // toggle function to show/hide edit/delete popup
  const togglePopFunc = async () => {
    setTogglePop((prev) => !prev);
  };
  return (
    <div className={replyBoxContainer}>
      <div className={firstReplyBox}>
        {replies.length > 0 && <div className={connectLines}></div>}
        <div className={topCard}>
          <div className={profileDetail}>
            <Image
              src={post.user.profile_image}
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
              <h6 className={PFTime}>{post.createdAt}</h6>
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
          {/* <div className={mediaContainer}>
              <img
                src="/images/postimage.png"
                width={452}
                height={312}
                alt="post media"
                className="w-full"
              />
            </div> */}
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
          <button className={footerdetailBtn}>
            <LikeIcon />
            {post.likes_count_on_post}
          </button>
          <button className={footerdetailBtn}>
            <ShareIcon /> {post.shares_count_on_post}
          </button>
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
ml-16  px-4 cursor-pointer
`);
const mediaContainer = ctl(`

`);
const textContainer = ctl(`
pt-4 pb-2 
`);
const textContainerContent = ctl(`
text-14px font-light text-[#E7E8EE]
`);
const footerBtnContainer = ctl(`
  flex items-items justify-between ml-16  px-4  
`);
const footerdetailBtn = ctl(`
flex items-center gap-3 text-14px font-medium  text-gray-shade-10
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
border-t-2 border-gray-shade-3 py-4 flex flex-col gap-4
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
const secondReplyBox = ctl(`
z-20
`);
// interfaces
interface setLevelFunction {
  setLevelFunc: (levelVal: "level1" | "level2" | "level3") => void;
}
