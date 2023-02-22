import React from "react";

const SinglePostCardSkeleton: React.FC = () => {
  return (
    // main container
    <div className="relative flex w-full max-w-[544px] rounded-10px bg-[#131314] py-4">
      {/*  left line */}
      {/* <div className="absolute top-[64px] left-[38px] z-0 w-[2px] h-[calc(100%-112px)]  bg-[#3C3F4A]"></div> */}

      <div className="z-10 mb-2 w-full items-center justify-between gap-2 px-4">
        <div className="flex w-full gap-3">
          <div className="h-[48px] min-w-[48px] max-w-[48px] animate-pulse cursor-pointer rounded-full bg-[#3C3F4A]"></div>
          <div className="flex flex-grow flex-col">
            <div>
              <div className="mt-4 h-2 w-28 animate-pulse cursor-pointer rounded-md bg-[#3C3F4A]"></div>
              <div className="mt-2 h-1 w-12 animate-pulse rounded-sm bg-[#3C3F4A]"></div>
            </div>
            <div className="mt-4 h-[200px] w-full animate-pulse rounded-md bg-[#3C3F4A]"></div>
            <div className="mt-2 h-[15px] w-full animate-pulse rounded-md bg-[#3C3F4A]"></div>
          </div>
        </div>
        {/* <div className="flex gap-3 pl-2">
          <div className="h-[30px] w-[30px] rounded-full bg-[#3C3F4A] animate-pulse"></div>
        </div> */}
      </div>
    </div>
  );
};

export default SinglePostCardSkeleton;
