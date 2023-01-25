import React from "react";
import DOMPurify from "dompurify";
import clsx from "clsx";

import { ArchivedPost, CompletedPost } from "@/models/post";

import type { Placement, PostType } from "./main";

interface Props {
  post: CompletedPost | ArchivedPost;
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
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={clsx(
        `whitespace-pre-wrap break-all text-app-post-text text-sm cursor-text`,
        placement === "single-post-page" &&
          (postType === "main" || postType === "reply-w-parent-header")
          ? "font-medium -ml-14 mt-6"
          : "mt-4"
      )}
      style={{
        wordBreak: "break-word",
      }}
      dangerouslySetInnerHTML={{ __html: purify(post.text_content) }}
    />
  );
};

const purify = (text: string = "") => {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
  });
};
