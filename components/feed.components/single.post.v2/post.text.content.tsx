import React from "react";
import DOMPurify from "dompurify";
import clsx from "clsx";
import { ArchivedPost, CompletedPost, PostEntities } from "@/models/post";

interface Props {
  post: CompletedPost | ArchivedPost;
}

export const PostTextContent: React.FC<Props> = ({ post }) => (
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
    dangerouslySetInnerHTML={{
      __html: purify(post.text_content, post.entities),
    }}
  />
);

const purify = (text: string = "", entities: PostEntities) => {
  const hashtags = entities?.hashtags;
  const mentions = entities?.mentions;

  const texts = text;

  for (let i = 0; i < hashtags?.length; i++) {
    text = text?.replaceAll(
      texts.substring(hashtags[i].indices[0], hashtags[i].indices[1]),
      '<span class="textGradient">' +
        texts.substring(hashtags[i].indices[0], hashtags[i].indices[1]) +
        " </span>"
    );
  }
  for (let i = 0; i < mentions?.length; i++) {
    text = text?.replaceAll(
      texts.substring(mentions[i].indices[0], mentions[i].indices[1]),
      `<span class="textGradient"><a href='/profile/${mentions[i].user_id}
      '>${texts.substring(
        mentions[i].indices[0],
        mentions[i].indices[1]
      )}</a></span>`
    );
  }

  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ["span", "a"],
  });
};
