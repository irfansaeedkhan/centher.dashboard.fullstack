import React from "react";

const SinglePostTextCardSkeleton = () => {
  return (
    // main container
    <div className="h-[264px] md:max-w-[544px] sm:max-w-fit w-full relative py-4 bg-background-shade-3 rounded-10px flex">
      {/*  left line */}
      <div className="absolute top-[64px] left-[38px] z-0 w-[2px] h-[calc(100%-118px)]  bg-gray-shade-3"></div>

      <div className="w-full z-10 items-center justify-between gap-2 mb-2 px-4">
        <div className="flex gap-3 w-full">
          <div className="h-[48px] min-w-[48px] max-w-[48px] rounded-full cursor-pointer bg-gray-700 animate-pulse"></div>
          <div className="w-[cal(100%-48px)] flex flex-col">
            <div>
              <div className="w-28 h-2 rounded-md mt-4 bg-gray-700 cursor-pointer animate-pulse"></div>
              <div className="w-12 h-1 mt-2 rounded-sm bg-gray-700 animate-pulse"></div>
            </div>
            <div className="h-[95px] md:w-[440px] sm:w-[230px] mt-10 rounded-md bg-gray-700 animate-pulse"></div>
            <div className="h-[15px] md:w-[440px] sm:w-[230px] mt-2 rounded-md bg-gray-700 animate-pulse"></div>
          </div>
        </div>
        <div className="flex gap-3 pl-2">
          <div className="h-[30px] w-[30px] rounded-full bg-gray-700 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SinglePostTextCardSkeleton;
