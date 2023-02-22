import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import clsx from "clsx";

import { ArchivedPost, CompletedPost } from "@/models/post";
import { CollectionCard } from "../collection.card";

interface Props {
  items: any;
}

export const EmblaCarousel: React.FC<Props> = ({ items }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    draggable: items!.length > 1,
    speed: 20,
    startIndex: 0,
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

  // When media is deleted from post during edit, scroll the carousel to the first image
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(0);
  }, [items?.length, emblaApi]);

  return (
    <div
      className={clsx("relative mt-3")}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* root node */}
      <div className="overflow-hidden rounded-10px" ref={emblaRef}>
        {items.map((collection: any) => {
          return <CollectionCard data={collection} key={collection.id} />;
        })}
      </div>
      {/* navigation prev*/}
      {items!.length > 1 && selectedIndex > 0 && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-1 transform rounded-full bg-gray-900/50 p-1 hover:bg-gray-900 fsm:translate-x-2"
          onClick={scrollPrev}
        >
          <MdNavigateBefore className="h-3 w-3 fill-white fsm:h-4 fsm:w-4" />
        </button>
      )}
      {/* navigation next*/}
      {items!.length > 1 && selectedIndex < items!.length - 1 && (
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
