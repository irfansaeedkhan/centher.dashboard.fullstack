// React, Next, NPM Packages
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "react-circular-progressbar/dist/styles.css";
import ctl from "@netlify/classnames-template-literals";
import Image from "next/image";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import Picker, { EmojiStyle, Theme } from "emoji-picker-react";

// App imports
import {
  AnimateTrashIcon,
  EmojiIcon,
  PhotoIcon,
  VideoIcon,
} from "@/assets/svgs";
import { CustomModal } from "@/components/modal/custom.modal";
import Button from "@/components/button";

// import from same directory
import { ModalProps } from "./reply";

const ReplyPostModal: React.FC<ModalProps> = (props) => {
  return (
    <CustomModal onClose={props.onClose} title={"Reply"}>
      <div
        className={`flex flex-col gap-4 w-full border-t-2 border-gray-shade-3 pt-4`}
      >
        <div className={`flex items-center  gap-3 px-6`}>
          <Image
            src={props.user.profile_image.path}
            width={44}
            height={44}
            alt={props.user?.display_name ?? "profile image"}
            className="rounded-full w-[44px] h-[44px] object-cover"
            sizes="256px"
          />
          <h5 className={`text-14px font-semibold text-white`}>
            {props.user?.display_name}
          </h5>
        </div>
        <div className={`px-4`}>
          <div>
            <Carousel
              showStatus={false}
              showThumbs={false}
              showIndicators={false}
              showArrows={
                props.displaySelectedFiles.length === 1 ? false : true
              }
              selectedItem={props.lastItem}
              onChange={(i) => {
                props.setLastItem(i);
              }}
            >
              {props.displaySelectedFiles}
            </Carousel>
          </div>
          <div className={`pt-4 pb-2 w-full px-6`}>
            <textarea
              className={`text-14px rounded-10px w-full leading-6  text-white font-medium bg-background-shade-3`}
              name=""
              id="posttext"
              cols={12}
              rows={4}
              placeholder="Type Here"
              maxLength={200}
              value={props.tweetText}
              onChange={(e) => props.handleTextLength(e)}
            ></textarea>
          </div>
        </div>
        <div
          className={`flex lg:flex-row [@media(max-width:600px)]:flex-col gap-3 items-center justify-between border-t-2 border-gray-shade-3 pt-6 px-6`}
        >
          <div
            className={`w-[100%] lg:w-[48%] flex items-center justify-between`}
          >
            <label className={`${uploadBtn} text-yellow-theme`}>
              <PhotoIcon />
              Photo
              <input
                type="file"
                id="files-photo"
                name="photos-file"
                accept=".gif,.jpg,.jpeg,.jfif,.pjpeg,.pjp,.png"
                style={{ display: "none" }}
                multiple
                onChange={(e) => {
                  props.handleSelectFile(e, "images");
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
                  props.handleSelectFile(e, "videos");
                }}
              />
            </label>
            <button
              className={`${uploadBtn} text-[#00BF96]`}
              onClick={() => {
                props.setIsEmojiPickerVisible((prev) => !prev);
              }}
            >
              <EmojiIcon />
              Emoji
            </button>
            {props.isEmojiPickerVisible && (
              <div
                ref={props.emojiPickerRef}
                className={`emojiContainer absolute right-[0] top-[287px] ${
                  props.isEmojiPickerVisible && "!block z-40"
                }`}
              >
                <Picker
                  onEmojiClick={props.onEmojiClick}
                  height={400}
                  width={300}
                  autoFocusSearch={false}
                  emojiStyle={EmojiStyle.NATIVE}
                  theme={Theme.AUTO}
                />
              </div>
            )}
          </div>
          <div
            className={`w-[100%] lg:w-[40%] flex items-center [@media(max-width:600px)]:!justify-between gap-2 justify-end`}
          >
            <span onClick={props.deleteText}>
              <AnimateTrashIcon />
            </span>
            <div className={`w-[2px] h-[10px] bg-[#333333]  rounded-xl`}></div>
            {props.loadingState ? (
              <button className="bg-brand-primary  text-14px font-bold py-2 px-2 rounded-xl flex items-center justify-center w-[136px] h-[36px]">
                <div style={{ width: 30, height: 30 }}>
                  <CircularProgressbar
                    value={
                      props.uploadingFileStatus ? props.uploadingFileStatus : 0
                    }
                    text={`${
                      props.uploadingFileStatus ? props.uploadingFileStatus : 0
                    }%`}
                    styles={buildStyles({
                      textColor: "#ffffff",
                      textSize: "20px",
                      pathColor: "#1C1F29",
                    })}
                  />
                </div>
              </button>
            ) : (
              <Button
                title={"Post"}
                variant="v1"
                className="max-w-[140px]"
                onClick={() => props.createPost("reply")}
              />
            )}
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ReplyPostModal;

const uploadBtn = ctl(`
flex items-center gap-3 text-14px font-medium 
`);
