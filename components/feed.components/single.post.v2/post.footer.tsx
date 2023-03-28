import React, { HTMLAttributes, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import clsx from "clsx";

import { ArchivedPost, CompletedPost } from "@/models/post";
import {
  CommentIcon,
  HeartIcon,
  // RetweetIcon,
  ShareIcon,
} from "@/assets/svgs";

import { ShareMenu } from "./share.menu";
import { Placement, PostType } from "./main";

interface Props {
  post: CompletedPost | ArchivedPost;
  postType: PostType;
  placement: Placement;
  onClickLike: () => Promise<void>;
  onClickReply: () => void;
}

export const PostFooter: React.FC<Props> = ({
  post,
  postType,
  placement,
  onClickLike,
  onClickReply,
}) => {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const shareMenuContainerRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(shareMenuContainerRef, () => setIsShareMenuOpen(false));

  return (
    <footer
      className={clsx(
        "flex justify-between fsm:justify-start fsm:gap-x-5",
        post.text_content ? "mt-3" : "mt-4"
      )}
    >
      <AnalyticsCount
        onClick={(e) => {
          e.stopPropagation();
          onClickReply();
        }}
        className={clsx(
          "text-gray-shade-10",
          postType === "archived" && "!cursor-default"
        )}
      >
        <span className="group flex h-6 items-center justify-center rounded-md border border-transparent px-1 transition-all duration-200 hover:border-[#5F97FF]/30 hover:bg-[#5F97FF]/20">
          <CommentIcon className="h-4 w-4 transition-all duration-100 group-hover:[&>*>*]:stroke-[#5F97FF]" />
        </span>
        <span className="leading-[17px]">{post.replies_count}</span>
      </AnalyticsCount>
      {/* <AnalyticsCount
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={clsx(
          "text-gray-shade-10",
          postType === "archived" && "!cursor-default"
        )}
      >
        <span className="group flex h-6 items-center justify-center rounded-md border border-transparent px-1 transition-all duration-200 hover:border-brand-primary/30 hover:bg-brand-primary/20">
          <RetweetIcon className="h-4 w-4 transition-all duration-100 group-hover:[&>*]:stroke-brand-primary" />
        </span>
        <span className="leading-[17px]">45</span>
      </AnalyticsCount> */}
      <AnalyticsCount
        onClick={(e) => {
          e.stopPropagation();
          onClickLike();
        }}
        className={clsx(
          post.liked_by_loggedin_user
            ? "text-gray-shade-10"
            : "text-gray-shade-10",
          postType === "archived" && "!cursor-default"
        )}
      >
        <span className="group flex h-6 items-center justify-center rounded-md border border-transparent px-1 transition-all duration-200 hover:border-[#EA3943]/30 hover:bg-[#EA3943]/20">
          <HeartIcon
            className={clsx(
              `h-4 w-4 transition-all duration-100 group-hover:[&>*]:stroke-[#EA3943]`,
              post.liked_by_loggedin_user && "[&>*]:stroke-[#EA3943]"
            )}
          />
        </span>
        <span
          className={clsx(
            "leading-[17px]",
            post.liked_by_loggedin_user && "text-[#EA3943]"
          )}
        >
          {post.likes_count}
        </span>
      </AnalyticsCount>
      <AnalyticsCount
        onClick={(e) => {
          e.stopPropagation();
        }}
        ref={shareMenuContainerRef}
        className="relative text-gray-shade-10"
      >
        <span className="group flex h-6 items-center justify-center rounded-md border border-transparent px-1 transition-all duration-200 hover:border-[#00BF96]/30 hover:bg-[#00BF96]/20">
          <ShareIcon
            className="h-4 w-4 cursor-pointer transition-all duration-100 group-hover:[&>*]:stroke-[#00BF96]"
            onClick={() => setIsShareMenuOpen((prev) => !prev)}
          />
        </span>

        {isShareMenuOpen && <ShareMenu post={post} postType={postType} />}
      </AnalyticsCount>
    </footer>
  );
};

interface AnalyticsCountProps extends HTMLAttributes<HTMLDivElement> {}

const AnalyticsCount = React.forwardRef<HTMLDivElement, AnalyticsCountProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "flex cursor-pointer items-center gap-x-2 text-xs font-medium fmd:text-[13px]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AnalyticsCount.displayName = "AnalyticsCount";
