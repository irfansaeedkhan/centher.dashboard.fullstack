import React from "react";
import clsx from "clsx";

import { CompletedPost } from "@/models/post";

interface Props {
  post: CompletedPost;
}

export const PostTextContent: React.FC<Props> = ({ post }) => {
  return (
    <div
      className={clsx(
        `whitespace-pre-wrap break-all text-app-post-text text-sm mt-4`
      )}
    >
      {post.text_content}
    </div>
  );
};
