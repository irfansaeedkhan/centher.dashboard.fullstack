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
        `cursor-text whitespace-pre-wrap break-all text-sm text-app-post-text`,
        post.media && post.media.length > 0 ? "mt-3" : "mt-2"
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
