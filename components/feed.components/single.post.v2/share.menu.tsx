import React, { HTMLAttributes, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { BsWhatsapp } from "react-icons/bs";
import { FiTwitter } from "react-icons/fi";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { TwitterShareButton, WhatsappShareButton } from "react-share";

import { ArchivedPost, CompletedPost } from "@/models/post";
import { AppRoutes } from "@/constants/app.routes";
import { LinkIcon, WorldIcon } from "@/assets/svgs";

import { PostType } from "./main";

interface SinglePostProps extends HTMLAttributes<HTMLDivElement> {
  post: CompletedPost | ArchivedPost;
  postType: PostType;
}

export const ShareMenu: React.FC<SinglePostProps> = ({
  post,
  postType,
  className,
  ...props
}) => {
  const shareUrl = useMemo(() => {
    //return `${window.location.origin}${AppRoutes.feed.index}/${post.user.account_address}/post/${post._id}`;
    return `${window.location.origin}/post/${post._id}`;
    //}, [post._id, post.user.account_address]);
  }, [post._id]);

  const [shareMenuState, setShareMenuState] = useState<"menu-1" | "menu-2">(
    "menu-1"
  );

  // Copy post share url to clipboard
  const copyShareUrl = useCallback(() => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Post link copied to clipboard!");
  }, [shareUrl]);

  return (
    <div
      className={clsx(
        `absolute right-0 z-[500] top-full w-[235px] bg-black-shade-12 rounded-10px overflow-hidden`,
        className
      )}
      {...props}
    >
      {shareMenuState === "menu-1" && (
        <div>
          <button onClick={copyShareUrl} className={clsx(shareBtnClasses)}>
            <LinkIcon className={`w-5 h-5`} />
            <span>Copy Link</span>
          </button>
          {postType !== "archived" && (
            <button
              className={clsx(shareBtnClasses)}
              onClick={() => setShareMenuState("menu-2")}
            >
              <WorldIcon className={`w-5 h-5`} />
              <span className="flex-grow text-left">Share Via...</span>
              <MdNavigateNext className={`w-6 h-6`} />
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
            <MdNavigateBefore className={`w-6 h-6`} />
            <span className="flex-grow text-left">Share Via</span>
          </button>
          <WhatsappShareButton
            url={shareUrl}
            resetButtonStyle={false}
            className={clsx(shareBtnClasses)}
          >
            <BsWhatsapp className={`w-5 h-5`} />
            <span>WhatsApp</span>
          </WhatsappShareButton>
          <TwitterShareButton
            url={shareUrl}
            resetButtonStyle={false}
            className={clsx(shareBtnClasses)}
          >
            <FiTwitter className={`w-5 h-5`} />
            <span>Twitter</span>
          </TwitterShareButton>
        </div>
      )}
    </div>
  );
};

const shareBtnClasses = `w-full text-sm text-white flex items-center gap-3 transition hover:bg-background-shade-2 px-5 py-4`;
