// React, Next, NPM Packages
import { useState } from "react";
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

// Current directory imports
import { ReplyCardLevel2 } from "./reply.card.level2";

export const FeedCardLevel2 = (props: setLevelFunctionInterface) => {
  // states
  const [togglePop, setTogglePop] = useState(false);

  // toggle function to show/hide edit/delete popup
  const togglePopFunc = async () => {
    setTogglePop((prev) => !prev);
  };
  return (
    <div className={postCardContainer}>
      <div className={topCard}>
        <div className={profileDetail}>
          <img
            src={"/images/feedprofilepic.png"}
            width="48"
            height="48"
            className="rounded-full"
          />
          <div>
            <h5 className={PFName}>uixamjad 2</h5>
            <h6 className={PFTime}>Today at 2:30 PM</h6>
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
          <img
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
            their ideas are just too good to ignore.please check thread for more
            details 😎👇
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
      <ReplyCardLevel2 setLevelFunc={props.setLevelFunc} />
      <ReplyCardLevel2 setLevelFunc={props.setLevelFunc} />
    </div>
  );
};

// styling
const postCardContainer = ctl(`
w-full pt-4  rounded-10px bg-background-shade-3 flex flex-col gap-4
`);
const topCard = ctl(`
w-full z-20 flex items-center justify-between gap-2 mb-2 px-4
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
const maincontentContainer = ctl(`
 px-4
`);
const mediaContainer = ctl(`
  
`);
const textContainer = ctl(`
pt-4 pb-2 
`);
const textContainerContent = ctl(`
text-16px font-semibold  text-[#E7E8EE]
`);
const footerBtnContainer = ctl(`
flex items-items justify-between   px-4  
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

// interfaces
interface setLevelFunctionInterface {
  setLevelFunc: (levelVal: "level1" | "level2" | "level3") => void;
}
