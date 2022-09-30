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

export const ReplyCardLevel2 = (props: setLevelFunction) => {
  // states
  const [togglePop, setTogglePop] = useState(false);

  // toggle function to show/hide edit/delete popup
  const togglePopFunc = async () => {
    setTogglePop((prev) => !prev);
  };
  return (
    <div className={replyBoxContainer}>
      <div className={firstReplyBox}>
        <div className={connectLines}></div>
        <div className={topCard}>
          <div className={profileDetail}>
            <img
              src={"/images/feedprofilepic.png"}
              width="48"
              height="48"
              className="rounded-full"
            />
            <div>
              <div className={replyToBox}>
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
            props.setLevelFunc("level3");
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
      </div>
      <div className={secondReplyBox}>
        <div className={topCard}>
          <div className={profileDetail}>
            <img
              src={"/images/feedprofilepic.png"}
              width="48"
              height="48"
              className="rounded-full"
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
            props.setLevelFunc("level3");
          }}
        >
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
      </div>
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
