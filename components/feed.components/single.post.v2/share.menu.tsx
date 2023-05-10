import React, { HTMLAttributes, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { BsWhatsapp } from "react-icons/bs";
import { FiTwitter } from "react-icons/fi";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { TwitterShareButton, WhatsappShareButton } from "react-share";

import { ArchivedPost, CompletedPost } from "@/models/post";
import { copyText } from "@/utils/copy.text";
import { LinkIcon, WorldIcon } from "@/assets/svgs";

import { PostType } from "./main";

interface SinglePostProps extends HTMLAttributes<HTMLDivElement> {
  post: CompletedPost | ArchivedPost;
  postType: PostType;
  setIsShareMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ShareMenu: React.FC<SinglePostProps> = ({
  post,
  postType,
  className,
  setIsShareMenuOpen,
  ...props
}) => {
  const shareUrl = useMemo(() => {
    return `${window.location.origin}/post/${post._id}`;
  }, [post._id]);

  const [shareMenuState, setShareMenuState] = useState<"menu-1" | "menu-2">(
    "menu-1"
  );

  // Copy post share url to clipboard
  const copyShareUrl = useCallback(async () => {
    await copyText(shareUrl);
    toast.success("Post link copied to clipboard!");
  }, [shareUrl]);

  return (
    <div
      className={clsx(
        `absolute right-0 top-full z-[500] w-[235px] overflow-hidden rounded-10px bg-black-shade-12`,
        className
      )}
      {...props}
    >
      {shareMenuState === "menu-1" && (
        <div>
          <button
            onClick={() => {
              copyShareUrl();
              setIsShareMenuOpen(false);
            }}
            className={clsx(shareBtnClasses)}
          >
            <LinkIcon className={`h-5 w-5`} />
            <span>Copy Link</span>
          </button>
          {postType !== "archived" && (
            <button
              className={clsx(shareBtnClasses)}
              onClick={() => setShareMenuState("menu-2")}
            >
              <WorldIcon className={`h-5 w-5`} />
              <span className="flex-grow text-left">Share Via...</span>
              <MdNavigateNext className={`h-6 w-6`} />
            </button>
          )}
        </div>
      )}

      {shareMenuState === "menu-2" && postType !== "archived" && (
        <div>
          <button
            className={clsx(shareBtnClasses, "pl-4")}
            onClick={() => setShareMenuState("menu-1")}
          >
            <MdNavigateBefore className={`h-6 w-6`} />
            <span className="flex-grow text-left">Share Via</span>
          </button>
          <WhatsappShareButton
            onClick={() => setIsShareMenuOpen(false)}
            url={shareUrl}
            resetButtonStyle={false}
            className={clsx(shareBtnClasses)}
          >
            <BsWhatsapp className={`h-5 w-5`} />
            <span>WhatsApp</span>
          </WhatsappShareButton>
          <TwitterShareButton
            onClick={() => setIsShareMenuOpen(false)}
            url={shareUrl}
            resetButtonStyle={false}
            className={clsx(shareBtnClasses)}
          >
            <FiTwitter className={`h-5 w-5`} />
            <span>Twitter</span>
          </TwitterShareButton>
        </div>
      )}
    </div>
  );
};

const shareBtnClasses = `w-full text-sm text-white flex items-center gap-3 transition hover:bg-background-shade-2 px-5 py-4`;
