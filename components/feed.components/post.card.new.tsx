// React, Next, NPM Packages
import { useState, useRef, useEffect } from "react";
import ctl from "@netlify/classnames-template-literals";
//import Image from "next/future/image";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import Picker, { Theme } from "emoji-picker-react";
import { useOnClickOutside } from "usehooks-ts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Oval, Rings } from "react-loader-spinner";

// App imports
import useUser from "@/hooks/use.user";
import { CustomModal } from "@/components/modal/custom.modal";
import Button from "@/components/button";
import { Post } from "@/models/post";
import { NODE_API_URL } from "@/constants/common";
import {
  PhotoIcon,
  VideoIcon,
  EmojiIcon,
  AnimateTrashIcon,
} from "@/assets/svgs";

// Current directory imports
import { usePostUpload } from "./post.logic";

interface PostCardNewProps {
  onPostCreated: (post: Post) => void;
}

export const PostCardNew: React.FC<PostCardNewProps> = ({ onPostCreated }) => {
  const {
    showModal,
    setShowModal,
    previewFilesUI,
    handleTextLength,
    createPost,
    closePostModel,
    handleSelectFile,
    lastItem,
    postError,
    loadingState,
    refe,
    tweetText,
    uploadingFile,
    file,
    onEmojiClick,
  } = usePostUpload({
    onPostCreated,
  });

  const [togglePop, setTogglePop] = useState(false);
  const togglePopFunc = async () => {
    setTogglePop((prev) => !prev);
  };

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => {
    setTogglePop(false);
  });

  const { user } = useUser();

  useEffect(() => {}, [previewFilesUI]);

  return user ? (
    <div className={postCardContainer}>
      <div className={topCard}>
        <Image
          src={user.profile_image.path}
          width={48}
          height={48}
          className={profileImagePreview}
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
        <label
          className={`${uploadBtn} text-[#00BF96]`}
          onClick={() => {
            setShowModal(true);
            setTogglePop(true);
          }}
        >
          <EmojiIcon />
          Emoji
        </label>
      </div>

      {showModal && (
        <CustomModal onClose={closePostModel} title={"Create post"}>
          <div className={modalBodyWrapper}>
            <div className={contactDetail}>
              <Image
                src={user.profile_image.path}
                width={44}
                height={44}
                className="rounded-full dpImagePreview"
                alt={user.display_name ?? "profile image"}
              />
              <h5 className={cdName}>{user.display_name}</h5>
            </div>
            <div className={maincontentContainer}>
              <div
                className={`${mediaContainer} 
                    // ${previewFilesUI.length === 1 && "grid-cols-1"} 
                    // ${previewFilesUI.length === 2 && "grid-cols-2"} 
                    // ${previewFilesUI.length > 2 && "grid-cols-3"} 
                    `}
              >
                <Carousel
                  showStatus={false}
                  showThumbs={false}
                  showIndicators={false}
                  showArrows={previewFilesUI.length === 1 ? false : true}
                  selectedItem={lastItem}
                >
                  {previewFilesUI}
                </Carousel>
                {/* {previewFilesUI} */}
              </div>
              <div className={inputTextContainer}>
                <textarea
                  className={textContainerContent}
                  ref={refe}
                  name=""
                  id="posttext"
                  cols={12}
                  rows={4}
                  placeholder="Type Here"
                  maxLength={200}
                  value={tweetText}
                  onChange={handleTextLength}
                  onKeyPress={(e) => {
                    if (e.key !== "Enter") return;
                  }}
                ></textarea>
              </div>
            </div>
            {/* {file && (
              <p className="px-6 text-14 text-[#ec5858] font-semibold">
                {file} - {uploadingFile} %
              </p>
            )} */}
            {postError && (
              <div className={postErrorMessage}>
                <p className="px-6 text-14 text-[#ec5858] font-semibold">
                  {postError}
                </p>
              </div>
            )}
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
                <button
                  className={`${uploadBtn} text-[#00BF96]`}
                  onClick={() => {
                    togglePopFunc();
                  }}
                >
                  <EmojiIcon />
                  Emoji
                </button>
                {togglePop && (
                  <div
                    ref={ref}
                    className={`emojiContainer absolute right-[0] top-[287px] ${
                      togglePop && "!block z-50"
                    }`}
                  >
                    <Picker
                      onEmojiClick={onEmojiClick}
                      height={400}
                      width={300}
                      autoFocusSearch={false}
                      theme={Theme.AUTO}
                    />
                  </div>
                )}
                {/* <div className="emojiContainer absolute left-[212px] bottom-[-390px]">
                  <EmojiPicker
                    height={400}
                    width={300}
                    onEmojiClick={onClick}
                    autoFocusSearch={false}
                    theme={Theme.AUTO}
                  />
                </div> */}
              </div>
              <div className={RightActionBtns}>
                <AnimateTrashIcon />
                <div className={divider}></div>
                {loadingState ? (
                  <button className="bg-brand-primary  text-14px font-bold py-2 px-2 rounded-xl flex items-center justify-center w-[136px] h-[36px]">
                    {/* <Rings
                      height="30"
                      width="30"
                      color="#1C1F29"
                      radius="6"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                      ariaLabel="rings-loading"
                    /> */}
                    <div style={{ width: 30, height: 30 }}>
                      <CircularProgressbar
                        value={uploadingFile ? uploadingFile : 0}
                        text={`${uploadingFile ? uploadingFile : 0}%`}
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
                    onClick={(e) => {
                      createPost(e);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  ) : null;
};

// styling
const postCardContainer = ctl(`
  w-full p-4 rounded-10px bg-background-shade-3 flex flex-col gap-4 relative
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
flex items-center gap-3 text-14px font-medium  cursor-pointer
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
 w-full grid, gap-3,
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
w-[100%] lg:w-[40%] flex items-center justify-end gap-2
`);
const divider = ctl(`
w-[2px] h-[10px] bg-[#333333]  rounded-xl
`);
const imageDelBtn = ctl(`
absolute top-2 right-6 ml-auto border-0 text-gray-shade-3 opacity-100 outline-none leading-none font-semibold focus:outline-none transition bg-white/70  rounded-full hover:scale-110 z-30 w-[24px] h-[24px] flex items-center justify-center leading-0 text-2xl
`);

const profileImagePreview = ctl(`rounded-full dpImagePreview`);

const postErrorMessage = ctl(`postErrorMessage`);
