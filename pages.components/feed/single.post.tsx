// React, Next, NPM Packages
import { useEffect, useState } from "react";
import Image from "next/future/image";
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
import { Post } from "@/models/post";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";
import { ReplyPost } from "./reply.post";
import { useRouter } from "next/router";
import { posts } from "./dummy.posts";

interface FeedCardLevel1Props {
  post: Post;
}

export const SinglePost: React.FC<FeedCardLevel1Props> = ({ post }) => {
  // states
  const [togglePop, setTogglePop] = useState(false);
  const [replies, setReplies] = useState<Post[]>([]);
  const router = useRouter();
  const isFeedPage = router.pathname === AppRoutes.feed;

  useEffect(() => {
    const post_id = router.query.post_id;
    const account_address = router.query.account_address;

    const _replies = posts.filter(
      (p) =>
        p.parent_post?._id === post_id &&
        p.parent_post?.user.account_address === account_address
    );
    setReplies(_replies);
  }, [router]);

  // toggle function to show/hide edit/delete popup
  const togglePopFunc = async () => {
    setTogglePop((prev) => !prev);
  };

  return (
    <div className={postCardContainer}>
      {isFeedPage && <div className={connectLines}></div>}
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
            <h5 className={PFName}>{post.user.display_name}</h5>
            {/* TODO: Irfan - Use dayjs for created at*/}
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
      <div className={maincontentContainer}>
        <div className={mediaContainer}>
          {post.media && post.media.length === 1 && (
            <Image
              src={post.media[0].url}
              width={452}
              height={312}
              alt="post media"
              className="w-full"
            />
          )}

          {/* Multiple Images */}
          {post.media && post.media.length > 1 && (
            <>
              {post.media.map((media) => (
                // TODO: Irfan - Wrap it in carousel
                <Image
                  key={media._id}
                  src={media.url}
                  width={452}
                  height={312}
                  alt="post media"
                  className="w-full"
                />
              ))}
            </>
          )}
        </div>
        {post.text_content && (
          <div className={textContainer}>
            <p className={textContainerContent}>{post.text_content}</p>
          </div>
        )}
      </div>
      <div className={footerBtnContainer}>
        <button className={footerdetailBtn}>
          <MessageIcon /> {post.comments_count_on_post}
        </button>
        <button className={footerdetailBtn}>
          <LikeIcon /> {post.likes_count_on_post}
        </button>
        <button className={footerdetailBtn}>
          <ShareIcon /> {post.shares_count_on_post}
        </button>
      </div>
      {isFeedPage && (
        <div className={showThreadBtnContainer}>
          <Image
            src={post.user.profile_image}
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
            className={showThreadBtn}
          >
            <a>Show Thread</a>
          </Link>
        </div>
      )}

      {!isFeedPage && (
        <>
          {replies.map((reply) => {
            return <ReplyPost key={reply._id} post={reply} />;
          })}
        </>
      )}
    </div>
  );
};

// styling
const postCardContainer = ctl(`
  relative w-full p-4 rounded-10px bg-background-shade-3 flex flex-col gap-4
`);
const topCard = ctl(`
top w-full z-10 flex items-center justify-between gap-2 mb-2
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
ml-16  
`);
const mediaContainer = ctl(`

`);
const textContainer = ctl(`
pt-4 pb-2 
`);
const textContainerContent = ctl(`
text-14px font-light text-[#E7E8EE]
`);
const showThreadBtnContainer = ctl(`
z-10 flex gap-3 pl-2 items-center
`);
const showThreadBtn = ctl(`
text-brand-primary text-[11px] px-3 py-2 bg-brand-primary/10 rounded-full hover:bg-brand-primary hover:text-black-shade-2 transition font-medium
`);
const footerBtnContainer = ctl(`
  flex items-items justify-between ml-16   
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
