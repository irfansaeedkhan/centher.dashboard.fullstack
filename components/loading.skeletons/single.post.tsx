import React from "react";

const SinglePostCardSkeleton = () => {
  return (
    // main container
    <div className="h-[364px] w-[544px] relative py-4 bg-background-shade-3 rounded-10px flex">
      {/*  left line */}
      <div className="absolute top-[64px] left-[38px] z-0 w-[2px] h-[calc(100%-112px)]  bg-gray-shade-3"></div>

      <div className="w-full z-10 items-center justify-between gap-2 mb-2 px-4">
        <div className="flex gap-3">
          <div className="h-[48px] w-[48px] rounded-full cursor-pointer bg-gray-700 animate-pulse"></div>
          <div>
            <div>
              <div className="w-28 h-2 rounded-md mt-4 bg-gray-700 cursor-pointer animate-pulse"></div>
              <div className="w-12 h-1 mt-2 rounded-sm bg-gray-700 animate-pulse"></div>
            </div>
            <div className="h-[200px] w-[440px] mt-10 rounded-md bg-gray-700 animate-pulse"></div>
            <div className="h-[15px] w-[440px] mt-2 rounded-md bg-gray-700 animate-pulse"></div>
          </div>
        </div>
        <div className="flex gap-3 pl-2">
          <div className="h-[30px] w-[30px] rounded-full bg-gray-700 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SinglePostCardSkeleton;
