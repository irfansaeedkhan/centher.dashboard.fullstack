import React, { HTMLAttributes, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import clsx from "clsx";
import { FiMessageCircle, FiThumbsUp } from "react-icons/fi";
import { IoMdShareAlt } from "react-icons/io";

import { ArchivedPost, CompletedPost } from "@/models/post";

import { ShareMenu } from "./share.menu";
import { PostType } from "./main";

interface Props {
  post: CompletedPost | ArchivedPost;
  postType: PostType;
  onClickLike: () => Promise<void>;
  onClickReply: () => void;
}

export const PostFooter: React.FC<Props> = ({
  post,
  postType,
  onClickLike,
  onClickReply,
}) => {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const shareMenuContainerRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(shareMenuContainerRef, () => setIsShareMenuOpen(false));

  return (
    <footer
      className={clsx(
        "flex justify-between",
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
        <FiMessageCircle className="w-5 h-5" />
        <span>{post.replies_count}</span>
      </AnalyticsCount>
      <AnalyticsCount
        onClick={(e) => {
          e.stopPropagation();
          onClickLike();
        }}
        className={clsx(
          post.liked_by_loggedin_user
            ? "text-brand-primary"
            : "text-gray-shade-10",
          postType === "archived" && "!cursor-default"
        )}
      >
        <FiThumbsUp className="w-5 h-5" />
        <span className="mt-1">{post.likes_count}</span>
      </AnalyticsCount>
      <AnalyticsCount
        onClick={(e) => {
          e.stopPropagation();
        }}
        ref={shareMenuContainerRef}
        className="relative text-gray-shade-10"
      >
        <IoMdShareAlt
          className="w-7 h-7 p-1"
          onClick={() => setIsShareMenuOpen((prev) => !prev)}
        />

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
          "flex items-center gap-x-2 font-medium text-base cursor-pointer",
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
