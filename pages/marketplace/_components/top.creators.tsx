import React, { useEffect, useRef } from "react";
import CreatorCard from "./creator.card";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import ctl from "@netlify/classnames-template-literals";
import { useExploreStore } from "@/store/explore.store";
import TopCreatorsSkeleton from "@/components/loading.skeletons/top.creator";
import clsx from "clsx";

const TopCreators = () => {
  const { topCreators, fetchTopCreators, loadingTopCreators } = useExploreStore(
    (state) => ({
      topCreators: state.topCreators,
      fetchTopCreators: state.fetchTopCreators,
      loadingTopCreators: state.loadingTopCreators,
    })
  );
  useEffect(() => {
    fetchTopCreators();
  }, [fetchTopCreators]);

  const ref = useRef<HTMLInputElement>(null);

  const scroll = (scrollOffset: number) => {
    if (ref.current) {
      ref.current.scrollLeft += scrollOffset;
    }
  };

  return (
    <div className={`flex max-w-[1300px] flex-col gap-8`}>
      <div
        className={`animationTextHeading sm:!text-2xl md:!text-3xl lg:!text-34`}
      >
        Top Creators
      </div>
      <div
        className={`flex h-[120px] w-full items-center justify-between rounded-2xl border-2 border-gray-shade-3 bg-[url(/images/bg-top-creators.png)] bg-cover bg-center bg-no-repeat px-4`}
      >
        <button onClick={() => scroll(-200)} className={scrollButton}>
          <BsArrowLeftShort />
        </button>

        <div
          ref={ref}
          className={clsx(
            "flex w-[calc(100%-132px)] items-center gap-14 !overflow-y-hidden py-8",
            topCreators.length > 0 &&
              loadingTopCreators === "loaded" &&
              "scrollSetLight2 overflow-x-scroll "
          )}
        >
          {topCreators.length > 0 && loadingTopCreators === "loaded" ? (
            topCreators.map((item: any, index: any) => {
              return <CreatorCard publicKey={item} key={index} />;
            })
          ) : loadingTopCreators === "loading" ||
            loadingTopCreators === "idle" ? (
            <>
              <TopCreatorsSkeleton />
              <TopCreatorsSkeleton />
              <TopCreatorsSkeleton />
              <TopCreatorsSkeleton />
              <TopCreatorsSkeleton />
              <TopCreatorsSkeleton />
              <TopCreatorsSkeleton />
              <TopCreatorsSkeleton />
            </>
          ) : null}
        </div>
        <button onClick={() => scroll(200)} className={scrollButton}>
          <BsArrowRightShort />
        </button>
      </div>
    </div>
  );
};

export default TopCreators;

const scrollButton = ctl(`
  !w-9 
  !h-9 
  flex 
  text-2xl 
  rounded-full
  items-center
  justify-center
  bg-gray-shade-9 
  text-gray-shade-18 
  hover:bg-brand-primary 
  hover:text-gray-shade-3 
`);
