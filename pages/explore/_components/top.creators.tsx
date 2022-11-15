import React, { useEffect, useRef } from "react";
import CreatorCard from "./creator.card";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import ctl from "@netlify/classnames-template-literals";
import { useExploreStore } from "@/store/explore.store";

const MAX_TOP_CREATORS = 10;
const TopCreators = () => {
  const { topCreators, fetchTopCreators, loadingTopCreators } = useExploreStore(
    (state) => ({
      topCreators: state.topCreators,
      fetchTopCreators: state.fetchTopCreators,
      loadingTopCreators: state.loadingTopCreators,
    })
  );

  useEffect(() => {
    fetchTopCreators(0, MAX_TOP_CREATORS);
  }, [fetchTopCreators]);

  const ref = useRef<HTMLInputElement>(null);

  const scroll = (scrollOffset: number) => {
    if (ref.current) {
      ref.current.scrollLeft += scrollOffset;
    }
  };

  return (
    <div className={`flex flex-col gap-8 max-w-[1300px]`}>
      <div
        className={`animationTextHeading lg:!text-34 md:!text-3xl sm:!text-2xl`}
      >
        Top Creators
      </div>
      <div
        className={`bg-[url(/images/bg-top-creators.png)] w-full h-[120px] bg-no-repeat bg-cover bg-center rounded-2xl border-2 border-gray-shade-3 flex items-center justify-between px-4`}
      >
        <button onClick={() => scroll(-200)} className={scrollButton}>
          <BsArrowLeftShort />
        </button>

        <div
          ref={ref}
          className="flex w-[calc(100%-132px)] items-center gap-14 overflow-x-scroll scrollSetLight2 !overflow-y-hidden py-8"
        >
          {topCreators.length > 0 &&
            topCreators.map((item: any, index: any) => {
              return <CreatorCard publicKey={item} key={index} />;
            })}
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
