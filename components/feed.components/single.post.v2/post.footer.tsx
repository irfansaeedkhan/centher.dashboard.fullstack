import React, { HTMLAttributes, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import clsx from "clsx";
import { FiMessageCircle, FiThumbsUp, FiShare } from "react-icons/fi";

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
        className={clsx(
          "text-gray-shade-10",
          postType === "archived" && "!cursor-default"
        )}
        onClick={onClickReply}
      >
        <FiMessageCircle className="w-5 h-5" />
        <span>{post.replies_count}</span>
      </AnalyticsCount>
      <AnalyticsCount
        onClick={onClickLike}
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
        ref={shareMenuContainerRef}
        className="relative text-gray-shade-10"
      >
        <FiShare
          className="w-5 h-5"
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
