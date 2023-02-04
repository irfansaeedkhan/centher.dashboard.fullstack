import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    draggable: post.media!.length > 1,
    speed: 20,
    startIndex: previewIndex,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect, previewIndex]);

  // When media is deleted from post during edit, scroll the carousel to the first image
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(0);
  }, [post.media?.length, emblaApi]);

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
      <div className="rounded-10px overflow-hidden" ref={emblaRef}>
        {/* container node */}
        <div className="flex">
          {post.media!.map((media) => {
            if (media.type === "image") {
              return (
                // Slide
                <Image
                  key={media.url}
                  src={media.url}
                  alt={media.alt ?? media.url}
                  width={544}
                  height={326}
                  sizes="544px"
                  className={`flex-[0_0_100%] min-h-[200px] max-h-[326px] lg:max-h-[510px] object-cover rounded-10px mx-2 break-all`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClickMedia(media.url);
                  }}
                />
              );
            } else if (media.type === "video") {
              return (
                // Slide
                <video
                  key={media.url}
                  src={media.url}
                  className={`flex-[0_0_100%] min-h-[200px] max-h-[326px] lg:max-h-[510px] rounded-xl object-cover mx-2 break-all`}
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
          })}
        </div>
      </div>
      {/* navigation prev*/}
      {post.media!.length > 1 && selectedIndex > 0 && (
        <button
          className="absolute left-0 top-1/2 p-1 transform -translate-y-1/2 translate-x-1 fsm:translate-x-2 bg-gray-900/50 hover:bg-gray-900 rounded-full"
          onClick={scrollPrev}
        >
          <MdNavigateBefore className="w-3 h-3 fsm:w-4 fsm:h-4 fill-white" />
        </button>
      )}
      {/* navigation next*/}
      {post.media!.length > 1 && selectedIndex < post.media!.length - 1 && (
        <button
          className="absolute right-0 top-1/2 p-1 transform -translate-y-1/2 -translate-x-1 fsm:-translate-x-2 bg-gray-900/50 hover:bg-gray-900 rounded-full"
          onClick={scrollNext}
        >
          <MdNavigateNext className="w-3 h-3 fsm:w-4 fsm:h-4 fill-white" />
        </button>
      )}
    </div>
  );
};
