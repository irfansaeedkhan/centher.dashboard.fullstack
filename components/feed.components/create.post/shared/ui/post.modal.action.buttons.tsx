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
import { PhotoIcon, VideoIcon, EmojiIcon, CameraIcon2 } from "@/assets/svgs";

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
        `relative flex w-full`,
        {
          "justify-between fsm:gap-x-4": placement === "create-post-card",
        },
        placement === "in-modal" && `justify-start gap-x-4`
      )}
    >
      <label
        className={clsx(
          `group select-none rounded-md border border-transparent py-[5px] px-[5px] text-[#A0A4BB] transition-all duration-150 hover:border-brand-primary/30 hover:bg-brand-primary/20`,
          buttonVariants({ color: "primary", placement })
        )}
      >
        <PhotoIcon
          className={clsx(
            placement === "in-modal" && iconClassesInModal,
            placement === "create-post-card" && iconClassesCreatePostCard,
            " group-hover:[&>*]:stroke-brand-primary"
          )}
        />
        <span className={clsx(placement === "in-modal" && "hidden fsm:block")}>
          Photo
        </span>
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
          `group select-none rounded-md border border-transparent py-[5px] px-[5px] text-[#A0A4BB] transition-all duration-200 hover:border-[#76E268]/30 hover:bg-[#76E268]/20`,
          buttonVariants({ color: "light_green", placement })
        )}
        onClick={() => {
          setShowCameraModal(true);
          onClickActionButton && onClickActionButton();
          if (!getLastPost()) {
            addNewPost();
          }
        }}
      >
        <CameraIcon2
          className={clsx(
            placement === "in-modal" && iconClassesInModal,
            placement === "create-post-card" && iconClassesCreatePostCard,
            " group-hover:[&>*]:stroke-[#76E268]"
          )}
        />
        <span className={clsx(placement === "in-modal" && "hidden fsm:block")}>
          Camera
        </span>
      </label>

      <label
        className={clsx(
          `group  select-none rounded-md border border-transparent py-[5px] px-[5px] text-[#A0A4BB] transition-all duration-200 hover:border-[#5F97FF]/30 hover:bg-[#5F97FF]/20`,
          buttonVariants({ color: "blue", placement })
        )}
      >
        <VideoIcon
          className={clsx(
            placement === "in-modal" && iconClassesInModal,
            placement === "create-post-card" && iconClassesCreatePostCard,
            " group-hover:[&>*]:stroke-[#5F97FF]"
          )}
        />
        <span className={clsx(placement === "in-modal" && "hidden fsm:block")}>
          Video
        </span>
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
          `group mr-2 hidden select-none rounded-md border border-transparent py-[5px] px-[5px] text-[#A0A4BB] transition-all duration-200 hover:border-[#00BF96]/30 hover:bg-[#00BF96]/20 flg:flex`,
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
            placement === "create-post-card" && iconClassesCreatePostCard,
            " group-hover:[&>*]:stroke-[#00BF96]"
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
      primary: "hover:text-brand-primary",
      blue: "hover:text-[#5F97FF]",
      green: "hover:text-[#00BF96]",
      light_green: "hover:text-[#76E268]",
    },
    placement: {
      "create-post-card": "gap-3 text-[13px]",
      "in-modal": "gap-2 fsm:gap-3 text-xs fsm:text-[13px]",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});
