import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

import { CompletedPost } from "@/models/post";

interface Props {
  post: CompletedPost;
}

export const PostMedia: React.FC<Props> = ({ post }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    draggable: post.media!.length > 1,
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
  }, [emblaApi, onSelect]);

  return (
    <div className="relative mt-4">
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
                  className={`flex-[0_0_100%] min-h-[200px] max-h-[326px] lg:max-h-[510px] object-cover rounded-10px mx-2`}
                />
              );
            } else if (media.type === "video") {
              return (
                // Slide
                <video
                  key={media.url}
                  src={media.url}
                  className={`flex-[0_0_100%] min-h-[200px] max-h-[326px] lg:max-h-[510px] rounded-xl object-cover`}
                  controls
                  controlsList="nodownload"
                />
              );
            }
          })}
        </div>
      </div>
      {/* navigation prev*/}
      {post.media!.length > 1 && selectedIndex > 0 && (
        <button
          className="absolute left-0 top-1/2 p-1 transform -translate-y-1/2 translate-x-1 fsm:translate-x-2 bg-black/50 rounded-full"
          onClick={scrollPrev}
        >
          <MdNavigateBefore className="w-4 h-4 fsm:w-5 fsm:h-5 fill-white" />
        </button>
      )}
      {/* navigation next*/}
      {post.media!.length > 1 && selectedIndex < post.media!.length - 1 && (
        <button
          className="absolute right-0 top-1/2 p-1 transform -translate-y-1/2 -translate-x-1 fsm:-translate-x-2 bg-black/50 rounded-full"
          onClick={scrollNext}
        >
          <MdNavigateNext className="w-4 h-4 fsm:w-5 fsm:h-5 fill-white" />
        </button>
      )}
    </div>
  );
};
