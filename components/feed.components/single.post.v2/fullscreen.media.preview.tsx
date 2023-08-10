import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { IoClose } from "react-icons/io5";

import { PostMedia } from "@/models/post";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

interface Props {
  previewIndex: number;
  media: PostMedia[];
  onClose: (previewIndex: number) => void;
}

export const FullscreenMediaPreview: React.FC<Props> = ({
  previewIndex,
  media,
  onClose,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    draggable: media.length > 1,
    slidesToScroll: 1,
    startIndex: previewIndex,
    speed: 20,
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose(selectedIndex);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, selectedIndex]);

  return (
    <>
      {createPortal(
        <div
          className="fixed inset-0 z-[1010] bg-black"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* Close Icon */}
          <div className="absolute right-4 top-4 z-10">
            <button
              className="rounded-full bg-gray-900/50 p-1 hover:bg-gray-900 fsm:p-1.5"
              onClick={() => onClose(selectedIndex)}
            >
              <IoClose className="h-4 w-4 fill-white" />
            </button>
          </div>

          {/* root node */}
          <div className="h-full overflow-hidden" ref={emblaRef}>
            {/* container node */}
            <div className="flex h-full">
              {media.map((media) => {
                if (media.type.includes("image")) {
                  return (
                    // Slide
                    <div
                      key={media.url}
                      className="flex-shrink-0 flex-grow-0 basis-full"
                    >
                      <Image
                        src={media.url}
                        alt={media.alt ?? media.url}
                        width={1920}
                        height={1080}
                        className={`h-full object-contain`}
                      />
                    </div>
                  );
                } else if (media.type.includes("video")) {
                  return (
                    // Slide
                    <div
                      key={media.url}
                      className="flex-shrink-0 flex-grow-0 basis-full"
                    >
                      <video
                        key={media.url}
                        src={media.url}
                        className={`h-full w-full object-contain`}
                        controls
                        controlsList="nodownload"
                      />
                    </div>
                  );
                }
              })}
            </div>
          </div>

          {/* navigation prev*/}
          {media!.length > 1 && selectedIndex > 0 && (
            <button
              className="absolute left-0 top-1/2 hidden -translate-y-1/2 translate-x-1 transform rounded-full bg-gray-900/50 p-1 hover:bg-gray-900 fsm:translate-x-2 fmd:block"
              onClick={scrollPrev}
            >
              <MdNavigateBefore className="h-4 w-4 fill-white fsm:h-5 fsm:w-5" />
            </button>
          )}
          {/* navigation next*/}
          {media!.length > 1 && selectedIndex < media!.length - 1 && (
            <button
              className="absolute right-0 top-1/2 hidden -translate-x-1 -translate-y-1/2 transform rounded-full bg-gray-900/50 p-1 hover:bg-gray-900 fsm:-translate-x-2 fmd:block"
              onClick={scrollNext}
            >
              <MdNavigateNext className="h-4 w-4 fill-white fsm:h-5 fsm:w-5" />
            </button>
          )}
        </div>,
        document.body
      )}
    </>
  );
};
