import clsx from "clsx";
import React, { useRef } from "react";
import { cva } from "class-variance-authority";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";

import { useNewPostStore } from "@/store/new.post.store";
import { customLog } from "@/utils/custom.log";
import { PhotoIcon, VideoIcon, EmojiIcon } from "@/assets/svgs";

import {
  FileType,
  validateSelectedFiles,
} from "../utils/validate.selected.files";

interface Props {
  placement: "in-modal" | "create-post-card";
}

export const PostModalActionButtons: React.FC<Props> = ({ placement }) => {
  const { openModal, setPostText, postText } = useNewPostStore();
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const emojiPickerContainerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(emojiPickerContainerRef, () => {
    setShowEmojiPicker(false);
  });

  // Append emoji to post text
  const onEmojiClick = (emojiObject: EmojiClickData, _event: MouseEvent) => {
    setPostText(postText + emojiObject.emoji);
  };

  const handleSelectFiles = (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: FileType
  ) => {
    try {
      // Can throw error if validation fails
      validateSelectedFiles(event, fileType);
      // Open modal
      openModal();
    } catch (err: any) {
      customLog(err.message, ["development", "staging"]);
      if (err.code.startsWith("app_")) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div
      className={clsx(`relative flex`, {
        "justify-between": placement === "create-post-card",
        "gap-x-9": placement === "in-modal",
      })}
    >
      <label
        className={clsx(`select-none`, buttonVariants({ color: "primary" }))}
      >
        <PhotoIcon />
        Photo
        <input
          type="file"
          id="files-photo"
          name="photos-file"
          accept=".gif,.jpg,.jpeg,.jfif,.pjpeg,.pjp,.png"
          style={{ display: "none" }}
          multiple
          onChange={(e) => handleSelectFiles(e, "image")}
        />
      </label>

      <label className={clsx(`select-none`, buttonVariants({ color: "blue" }))}>
        <VideoIcon />
        Video
        <input
          type="file"
          id="files-videos"
          name="videos-file"
          accept=".webm,.mp4,.mpg,.avi,.m4v"
          style={{ display: "none" }}
          multiple
          onChange={(e) => handleSelectFiles(e, "video")}
        />
      </label>

      <label
        className={clsx(`select-none`, buttonVariants({ color: "green" }))}
        onClick={
          placement === "create-post-card"
            ? openModal
            : () => {
                setShowEmojiPicker((prev) => !prev);
              }
        }
      >
        <EmojiIcon />
        Emoji
      </label>

      {showEmojiPicker && (
        <div
          ref={emojiPickerContainerRef}
          className={`absolute left-3/4 -top-16 ${
            showEmojiPicker && "!block z-50"
          }`}
        >
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            height={400}
            width={300}
            autoFocusSearch={false}
            emojiStyle={EmojiStyle.NATIVE}
            theme={Theme.AUTO}
          />
        </div>
      )}
    </div>
  );
};

const buttonVariants = cva(
  "flex items-center gap-3 text-14px font-medium cursor-pointer",
  {
    variants: {
      color: {
        primary: "text-brand-primary",
        blue: "text-[#157AFB]",
        green: "text-[#00BF96]",
      },
    },
    defaultVariants: {
      color: "primary",
    },
  }
);
