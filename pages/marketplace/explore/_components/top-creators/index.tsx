import React, { useRef } from "react";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import clsx from "clsx";
import { SectionTitle } from "@/pages/marketplace/_components";
import TopCreatorsSkeleton from "@/components/loading.skeletons/top.creator";
import { useTopCreators } from "./use-top-creators";
import CreatorCard from "./creator-card";
import styles from "./styles.module.css";

export const TopCreators = () => {
  const { topCreators, loading } = useTopCreators();

  const ref = useRef<HTMLInputElement>(null);

  const scroll = (scrollOffset: number) => {
    if (ref.current) {
      ref.current.scrollLeft += scrollOffset;
    }
  };

  return (
    <div className={`mx-auto max-w-screen-2xl space-y-4 fsm:space-y-6`}>
      <SectionTitle title={"Top Creators"} showViewAll={false} />

      <div
        className={`relative -mx-2 flex h-[80px] items-center justify-between overflow-hidden border-gray-shade-3 bg-[url(/images/bg-top-creators.png)] bg-cover bg-center bg-no-repeat fsm:-mx-4 fmd:mx-0 fmd:h-[100px] fmd:rounded-2xl fmd:border-2 flg:h-[120px]`}
      >
        <button
          onClick={() => scroll(-200)}
          className={clsx(scrollButton, `left-2`)}
        >
          <BsArrowLeftShort className="h-6 w-6 fill-gray-shade-18 hover:fill-gray-shade-3" />
        </button>

        <div
          ref={ref}
          className={clsx(
            "flex h-full items-center gap-x-8 overflow-y-hidden py-4",
            topCreators.length > 0 && loading === "loaded" && "overflow-x-auto",
            styles["custom-scrollbar"]
          )}
        >
          {topCreators.length > 0 && loading === "loaded" ? (
            topCreators.map((creator) => {
              return (
                <CreatorCard
                  data={creator}
                  key={creator._id}
                  className="ml-4 last:mr-4 fmd:first:ml-12 fmd:last:mr-12"
                />
              );
            })
          ) : loading === "loading" || loading === "idle" ? (
            <>
              {Array.from({ length: 5 }).map((_, index) => {
                return (
                  <div className="px-10" key={index}>
                    <TopCreatorsSkeleton />
                  </div>
                );
              })}
            </>
          ) : null}
        </div>

        <button
          onClick={() => scroll(200)}
          className={clsx(scrollButton, `right-2`)}
        >
          <BsArrowRightShort className="h-6 w-6 fill-gray-shade-18 hover:fill-gray-shade-3" />
        </button>
      </div>
    </div>
  );
};

const scrollButton = `hidden absolute p-1 top-1/2 -translate-y-1/2 transform fmd:block rounded-full bg-gray-shade-9 hover:bg-brand-primary`;
