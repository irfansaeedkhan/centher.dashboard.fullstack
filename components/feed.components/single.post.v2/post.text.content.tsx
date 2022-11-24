import React from "react";
import clsx from "clsx";

import { CompletedPost } from "@/models/post";

import type { Placement, PostType } from "./main";

interface Props {
  post: CompletedPost;
  postType: PostType;
  placement: Placement;
}

export const PostTextContent: React.FC<Props> = ({
  post,
  postType,
  placement,
}) => {
  return (
    <div
      className={clsx(
        `whitespace-pre-wrap break-words text-app-post-text text-sm mt-4`,
        placement === "single-post-page" && postType === "main" && "font-bold"
      )}
    >
      {post.text_content}
    </div>
  );
};
