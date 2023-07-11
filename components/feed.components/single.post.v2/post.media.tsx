import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import clsx from "clsx";

import { ArchivedPost, CompletedPost } from "@/models/post";

import { Placement, PostType } from "./main";

interface Props {
  post: CompletedPost | ArchivedPost;
  postType: PostType;
  placement: Placement;
  previewIndex: number;
  onClickMedia: (mediaUrl: string) => void;
}

export const PostMedia: React.FC<Props> = ({
  post,
  postType,
  placement,
  previewIndex,
  onClickMedia,
}) => {
  return (
    <div
      className={clsx(
        "relative",
        placement === "single-post-page" &&
          (postType === "main" || postType === "reply-w-parent-header")
          ? "mt-3"
          : "mt-1"
      )}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* root node */}
      <div className="relative">
        <div className="grid max-h-[45dvh] grid-cols-2 grid-rows-2 gap-[6px] fsm:gap-2 [@media(max-width:500px)]:max-h-[30dvh] [@media(max-width:500px)]:min-h-[22dvh]">
          {post.media!.map((media, index) => {
            let mediaData: React.ReactNode = null;
            if (media.type === "image") {
              mediaData = (
                <Image
                  key={media.url}
                  src={media.url}
                  alt={media.alt ?? media.url}
                  width={544}
                  height={326}
                  sizes="544px"
                  className={`h-full max-h-[480px] w-full rounded-xl object-cover`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClickMedia(media.url);
                  }}
                />
              );
            } else if (media.type === "video") {
              mediaData = (
                <video
                  autoPlay={false}
                  muted={false}
                  playsInline={true}
                  key={media.url}
                  src={media.url}
                  className={`h-full max-h-[480px] w-full rounded-xl object-cover`}
                  controls
                  controlsList="nodownload"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onClickMedia(media.url);
                  }}
                />
              );
            }
            return (
              <div
                key={index}
                className={clsx(
                  `relative`,
                  post.media?.length == 1 && "col-span-2 row-span-2",
                  post.media?.length === 2 && "col-span-1 row-span-2",
                  post.media?.length === 4 && "col-span-1 row-span-1",
                  index === 0 &&
                    post.media?.length == 3 &&
                    "col-span-1 row-span-2",
                  index === 1 &&
                    post.media?.length == 3 &&
                    "col-span-1 row-span-1 ",
                  index === 2 &&
                    post.media?.length == 3 &&
                    "col-span-1 row-span-1 "
                )}
              >
                {mediaData}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
