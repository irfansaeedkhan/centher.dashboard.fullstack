import React from "react";
import clsx from "clsx";
import { FiMessageCircle, FiThumbsUp, FiShare } from "react-icons/fi";

import { CompletedPost } from "@/models/post";

interface Props {
  post: CompletedPost;
}

export const PostFooter: React.FC<Props> = ({ post }) => {
  return (
    <footer
      className={clsx(
        "ml-[60px] flex justify-between",
        post.text_content ? "mt-3" : "mt-4"
      )}
    >
      <div className="flex items-center gap-x-2 text-gray-shade-10 font-medium text-base">
        <FiMessageCircle className="w-5 h-5" />
        <span>{post.replies_count}</span>
      </div>

      <div
        className={clsx(
          "flex items-center gap-x-2 font-medium text-base",
          post.liked_by_loggedin_user
            ? "text-brand-primary"
            : "text-gray-shade-10"
        )}
      >
        <FiThumbsUp className="w-5 h-5" />
        <span className="mt-1">{post.likes_count}</span>
      </div>

      <div className="flex items-center text-gray-shade-10 font-medium text-base">
        <FiShare className="w-5 h-5" />
      </div>
    </footer>
  );
};
