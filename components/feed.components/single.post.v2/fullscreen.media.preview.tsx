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
          className="fixed inset-0 bg-black z-[1010]"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* Close Icon */}
          <div className="absolute top-4 right-4 z-10">
            <button
              className="p-1 fsm:p-1.5 bg-gray-900/50 hover:bg-gray-900 rounded-full"
              onClick={() => onClose(selectedIndex)}
            >
              <IoClose className="w-4 h-4 fill-white" />
            </button>
          </div>

          {/* root node */}
          <div className="h-full overflow-hidden" ref={emblaRef}>
            {/* container node */}
            <div className="flex h-full">
              {media.map((media) => {
                if (media.type === "image") {
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
                } else if (media.type === "video") {
                  return (
                    // Slide
                    <div
                      key={media.url}
                      className="flex-shrink-0 flex-grow-0 basis-full"
                    >
                      <video
                        key={media.url}
                        src={media.url}
                        className={`w-full h-full object-contain`}
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
              className="hidden fmd:block absolute left-0 top-1/2 p-1 transform -translate-y-1/2 translate-x-1 fsm:translate-x-2 bg-gray-900/50 hover:bg-gray-900 rounded-full"
              onClick={scrollPrev}
            >
              <MdNavigateBefore className="w-4 h-4 fsm:w-5 fsm:h-5 fill-white" />
            </button>
          )}
          {/* navigation next*/}
          {media!.length > 1 && selectedIndex < media!.length - 1 && (
            <button
              className="hidden fmd:block absolute right-0 top-1/2 p-1 transform -translate-y-1/2 -translate-x-1 fsm:-translate-x-2 bg-gray-900/50 hover:bg-gray-900 rounded-full"
              onClick={scrollNext}
            >
              <MdNavigateNext className="w-4 h-4 fsm:w-5 fsm:h-5 fill-white" />
            </button>
          )}
        </div>,
        document.body
      )}
    </>
  );
};
