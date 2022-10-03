// React, Next, NPM Packages
import { useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import Image from "next/future/image";

// App imports
import { CustomModal } from "@/components/modal/custom.modal";
import Button from "@/components/button";
import {
  PhotoIcon,
  VideoIcon,
  EmojiIcon,
  AnimateTrashIcon,
} from "@/assets/svgs";

export const PostCard = () => {
  // states
  const [showModal, setShowModal] = useState<boolean>(false);

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
  return (
    <div className={postCardContainer}>
      <div className={topCard}>
        <Image
          src={"/images/feedprofilepic.png"}
          width={48}
          height={48}
          className="rounded-full"
          alt={"icon"}
        />
        <button
          className={postBtn}
          onClick={() => {
            setShowModal(true);
          }}
        >
          Start a post
        </button>
      </div>
      <div className={uploadBtnContainer}>
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
            <div className={maincontentContainer}>
              <div className={mediaContainer}>
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
                  className={textContainerContent}
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
  w-full p-4 rounded-10px bg-background-shade-3 flex flex-col gap-4
`);
const topCard = ctl(`
top w-full flex items-center gap-2 mb-2 
`);
const postBtn = ctl(`
w-full text-14px bg-transparent rounded-10px overflow-hidden h-[48px] border-2 border-gray-shade-3 px-6 text-gray-shade-7 font-medium text-left
`);
const uploadBtnContainer = ctl(`
  flex items-items justify-between
`);
const uploadBtn = ctl(`
flex items-center gap-3 text-14px font-medium 
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
const maincontentContainer = ctl(`
px-6
`);
const mediaContainer = ctl(`
 w-full flex gap-2 
`);
const mediaItem = ctl(`  

`);
const inputTextContainer = ctl(`
pt-4 pb-2 w-full
`);
const textContainerContent = ctl(`
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
