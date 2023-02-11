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
      <div className="overflow-hidden rounded-10px" ref={emblaRef}>
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
                  className={`mx-2 max-h-[326px] min-h-[200px] flex-[0_0_100%] break-all rounded-10px object-cover lg:max-h-[510px]`}
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
                  className={`mx-2 max-h-[326px] min-h-[200px] flex-[0_0_100%] break-all rounded-xl object-cover lg:max-h-[510px]`}
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
          className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-1 transform rounded-full bg-gray-900/50 p-1 hover:bg-gray-900 fsm:translate-x-2"
          onClick={scrollPrev}
        >
          <MdNavigateBefore className="h-3 w-3 fill-white fsm:h-4 fsm:w-4" />
        </button>
      )}
      {/* navigation next*/}
      {post.media!.length > 1 && selectedIndex < post.media!.length - 1 && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 transform rounded-full bg-gray-900/50 p-1 hover:bg-gray-900 fsm:-translate-x-2"
          onClick={scrollNext}
        >
          <MdNavigateNext className="h-3 w-3 fill-white fsm:h-4 fsm:w-4" />
        </button>
      )}
    </div>
  );
};
