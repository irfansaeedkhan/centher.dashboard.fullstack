import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useShallow } from "zustand/react/shallow";
import { usePostEditorStore } from "@/store/post-editor-store";
import { PhotoIcon, VideoIcon, CameraIcon2 } from "@/assets/svgs";
import cn from "@/utils/cn";
import { customLog } from "@/utils/custom.log";
import {
  SUPPORTED_IMAGE_MIME_TYPES,
  SUPPORTED_VIDEO_MIME_TYPES,
} from "@/constants/supported.media.type";
import {
  FileType,
  validateSelectedFiles,
} from "../utils/validate-selected-files";
import { CameraModal } from "./camera-modal";

interface Props {
  placement: "in-modal" | "create-post-card";
  onClickActionButton?: () => void;
}

export const ActionButtons: React.FC<Props> = ({
  placement,
  onClickActionButton,
}) => {
  const [showCameraModal, setShowCameraModal] = useState(false);
  const isModalOpen = usePostEditorStore(
    useShallow((state) => state.isModalOpen)
  );
  const { getLastActivePost, addNewPost } = usePostEditorStore(
    useShallow((state) => state.actions)
  );
  const lastActivePost = getLastActivePost();
  const activeMedia = useMemo<"image" | "video" | null>(() => {
    if (
      !lastActivePost ||
      (lastActivePost.media?.length ?? 0) === 0 ||
      !isModalOpen
    ) {
      return null;
    }
    if (lastActivePost.media[0]?.original.type.startsWith("image")) {
      return "image";
    }
    if (lastActivePost.media[0]?.original.type.startsWith("video")) {
      return "video";
    }
    return null;
  }, [lastActivePost, isModalOpen]);

  const handleSelectFiles = (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: FileType
  ) => {
    try {
      // If there is no post, create a new post.
      // This is to handle the case when the user clicks on the action button from Start a post card
      if (!lastActivePost) {
        addNewPost();
      }

      // Can throw error if validation fails
      validateSelectedFiles(event, fileType);

      onClickActionButton && onClickActionButton();
    } catch (err: any) {
      customLog(["development", "staging"], err);
      if (err.code?.startsWith("app_")) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div
      className={cn(
        `relative flex w-full`,
        {
          "justify-between fsm:gap-x-4": placement === "create-post-card",
        },
        placement === "in-modal" && `justify-start gap-x-4`
      )}
    >
      <CustomLabel
        className={cn(
          `hover:border-brand-primary/30 hover:bg-brand-primary/20`,
          activeMedia !== "image" &&
            activeMedia !== null &&
            "pointer-events-none"
        )}
        variant="primary"
        placement={placement}
      >
        <PhotoIcon
          className={"size-5 group-hover:[&>*]:stroke-brand-primary"}
        />
        <span className={cn(placement === "in-modal" && "hidden fsm:block")}>
          Photo
        </span>
        <input
          type="file"
          id="files-photo"
          name="photos-file"
          accept={SUPPORTED_IMAGE_MIME_TYPES.join(",")}
          style={{ display: "none" }}
          multiple
          onChange={(e) => handleSelectFiles(e, "image")}
        />
      </CustomLabel>
      <CustomLabel
        className={cn(
          `hover:border-[#21BF7F]/30 hover:bg-[#21BF7F]/20`,
          activeMedia !== "image" &&
            activeMedia !== null &&
            "pointer-events-none"
        )}
        placement={placement}
        variant="light_green"
        onClick={() => {
          setShowCameraModal(true);
          onClickActionButton && onClickActionButton();
          if (!lastActivePost) {
            addNewPost();
          }
        }}
      >
        <CameraIcon2
          className={cn("size-5 group-hover:[&>*]:stroke-[#21BF7F]")}
        />
        <span className={cn(placement === "in-modal" && "hidden fsm:block")}>
          Camera
        </span>
      </CustomLabel>

      <CustomLabel
        className={cn(
          `hover:border-[#5F97FF]/30 hover:bg-[#5F97FF]/20`,
          activeMedia !== "video" &&
            activeMedia !== null &&
            "pointer-events-none"
        )}
        variant="blue"
        placement={placement}
      >
        <VideoIcon
          className={cn("size-5 group-hover:[&>*]:stroke-[#5F97FF]")}
        />
        <span className={cn(placement === "in-modal" && "hidden fsm:block")}>
          Video
        </span>
        <input
          type="file"
          id="files-videos"
          name="videos-file"
          accept={SUPPORTED_VIDEO_MIME_TYPES.join(",")}
          style={{ display: "none" }}
          onChange={(e) => handleSelectFiles(e, "video")}
        />
      </CustomLabel>

      {showCameraModal && (
        <CameraModal onClose={() => setShowCameraModal(false)} />
      )}
    </div>
  );
};

interface CustomLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant: "primary" | "blue" | "green" | "light_green";
  placement: "in-modal" | "create-post-card";
}

const CustomLabel: React.FC<CustomLabelProps> = ({
  children,
  className,
  variant,
  placement,
  ...props
}) => {
  return (
    <label
      {...props}
      className={cn(
        "group flex cursor-pointer select-none items-center rounded-md border border-transparent px-[5px] py-[5px] font-medium text-[#A0A4BB] transition-all duration-150",
        {
          "hover:text-white/75": variant === "primary",
          "hover:text-[#5F97FF]": variant === "blue",
          "hover:text-[#00BF96]": variant === "green",
          "hover:text-[#21BF7F]": variant === "light_green",
        },
        {
          "gap-3 text-[13px]": placement === "create-post-card",
          "gap-2 text-xs fsm:gap-3 fsm:text-[13px]": placement === "in-modal",
        },
        className
      )}
    >
      {children}
    </label>
  );
};
