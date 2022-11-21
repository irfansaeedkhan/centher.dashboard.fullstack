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
    <div className="relative ml-[60px] mt-1">
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
                  sizes="(max-width: 544px) 100vw, 544px"
                  className={`flex-[0_0_100%] max-h-[326px] lg:max-h-[510px] object-cover rounded-10px mx-2`}
                />
              );
            } else if (media.type === "video") {
              return (
                // Slide
                <video
                  key={media.url}
                  src={media.url}
                  className={`flex-[0_0_100%] max-h-[326px] lg:max-h-[510px] rounded-xl`}
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
          className="absolute left-0 top-1/2 p-1 transform -translate-y-1/2 translate-x-2 bg-black/50 rounded-full"
          onClick={scrollPrev}
        >
          <MdNavigateBefore className="w-5 h-5 fill-white" />
        </button>
      )}
      {/* navigation next*/}
      {post.media!.length > 1 && selectedIndex < post.media!.length - 1 && (
        <button
          className="absolute right-0 top-1/2 p-1 transform -translate-y-1/2 -translate-x-2 bg-black/50 rounded-full"
          onClick={scrollNext}
        >
          <MdNavigateNext className="w-5 h-5 fill-white" />
        </button>
      )}
    </div>
  );
};
