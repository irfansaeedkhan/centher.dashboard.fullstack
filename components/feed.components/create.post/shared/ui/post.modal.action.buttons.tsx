import clsx from "clsx";
import React, { useRef, useState } from "react";
import { cva } from "class-variance-authority";
import toast from "react-hot-toast";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import { FiCamera } from "react-icons/fi";

import { useNewPostStore } from "@/store/new.post.store";
import { customLog } from "@/utils/custom.log";
import { SUPPORTED_VIDEO_TYPES } from "@/constants/supported.media.type";
import { PhotoIcon, VideoIcon, EmojiIcon } from "@/assets/svgs";

import {
  FileType,
  validateSelectedFiles,
} from "../utils/validate.selected.files";
import CameraModal from "./camera.modal";

interface Props {
  placement: "in-modal" | "create-post-card";
  onClickActionButton?: () => void;
}

export const PostModalActionButtons: React.FC<Props> = ({
  placement,
  onClickActionButton,
}) => {
  const { appendPostText, getLastPost, addNewPost } = useNewPostStore();
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerContainerRef = useRef<HTMLDivElement>(null);
  const belowMobile = useMediaQuery("(max-width: 560px)");

  useOnClickOutside(emojiPickerContainerRef, () => {
    setShowEmojiPicker(false);
  });

  // Append emoji to post text
  const onEmojiClick = (emojiObject: EmojiClickData, _event: MouseEvent) => {
    appendPostText(emojiObject.emoji);
  };

  const handleSelectFiles = (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: FileType
  ) => {
    try {
      if (!getLastPost()) {
        addNewPost();
      }
      // Can throw error if validation fails
      validateSelectedFiles(event, fileType);
      // Call the callback function if any
      onClickActionButton && onClickActionButton();
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
      className={clsx(
        `relative flex`,
        {
          "justify-between": placement === "create-post-card",
        },
        placement === "in-modal" && `gap-3 fsm:justify-start fsm:gap-7`
      )}
    >
      <label
        className={clsx(
          `select-none`,
          buttonVariants({ color: "primary", placement })
        )}
      >
        <PhotoIcon
          className={clsx(
            placement === "in-modal" && iconClassesInModal,
            placement === "create-post-card" && iconClassesCreatePostCard
          )}
        />
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
      <label
        className={clsx(
          `select-none`,
          buttonVariants({ color: "green", placement })
        )}
        onClick={() => {
          setShowCameraModal(true);
          onClickActionButton && onClickActionButton();
          if (!getLastPost()) {
            addNewPost();
          }
        }}
      >
        <FiCamera
          className={clsx(
            placement === "in-modal" && iconClassesInModal,
            placement === "create-post-card" && iconClassesCreatePostCard
          )}
        />
        Camera
      </label>

      <label
        className={clsx(
          `select-none`,
          buttonVariants({ color: "blue", placement })
        )}
      >
        <VideoIcon
          className={clsx(
            placement === "in-modal" && iconClassesInModal,
            placement === "create-post-card" && iconClassesCreatePostCard
          )}
        />
        Video
        <input
          type="file"
          id="files-videos"
          name="videos-file"
          accept={SUPPORTED_VIDEO_TYPES}
          style={{ display: "none" }}
          multiple
          onChange={(e) => handleSelectFiles(e, "video")}
        />
      </label>

      <label
        className={clsx(
          `mr-2 hidden select-none flg:flex`,
          buttonVariants({ color: "green", placement })
        )}
        onClick={() => {
          if (placement === "in-modal") {
            setShowEmojiPicker((prev) => !prev);
          }
          onClickActionButton && onClickActionButton();
          if (!getLastPost()) {
            addNewPost();
          }
        }}
      >
        <EmojiIcon
          className={clsx(
            placement === "in-modal" && iconClassesInModal,
            placement === "create-post-card" && iconClassesCreatePostCard
          )}
        />
        Emoji
      </label>

      {showEmojiPicker && (
        <div
          ref={emojiPickerContainerRef}
          className={clsx(
            `absolute top-[170%] -right-6 pb-2 fsm:top-[120%] fsm:right-0 `,
            showEmojiPicker && "z-50 !block"
          )}
        >
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            height={400}
            width={belowMobile ? 280 : 300}
            autoFocusSearch={false}
            emojiStyle={EmojiStyle.NATIVE}
            theme={Theme.AUTO}
          />
        </div>
      )}
      {showCameraModal && (
        <CameraModal onClose={() => setShowCameraModal(false)} />
      )}
    </div>
  );
};

const iconClassesInModal = `w-5 h-5`;
const iconClassesCreatePostCard = `w-5 h-5`;

const buttonVariants = cva("flex items-center font-medium cursor-pointer", {
  variants: {
    color: {
      primary: "text-brand-primary",
      blue: "text-[#157AFB]",
      green: "text-[#00BF96]",
    },
    placement: {
      "create-post-card": "gap-3 text-14px",
      "in-modal": "gap-2 text-[13px]",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});
