import React from "react";

const RepliesProfileSkeletons: React.FC = () => {
  return (
    // main container
    <div className="relative flex w-full max-w-[544px] flex-col rounded-10px bg-[#131314] py-4">
      {/*  left line */}
      <div className="w-full items-center justify-center gap-2 px-4">
        <div className="flex w-full gap-3">
          <div className="h-[48px] !w-[48px] animate-pulse rounded-full bg-[#3C3F4A]"></div>

          <div className="flex flex-grow flex-col">
            <div>
              <div className="mt-4 h-2 max-w-[112px] animate-pulse cursor-pointer rounded-md bg-[#3C3F4A]"></div>
              <div className="mt-2 h-1 max-w-[48px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
              <div className="mt-4 h-[2px] max-w-[520px] rounded-sm bg-[#3C3F4A]"></div>
            </div>
            {/* <div className="h-[95px] md:w-[440px] sm:w-[230px] mt-10 rounded-md bg-[#888DAA] animate-pulse"></div> */}
            {/* <div className="h-[15px] md:w-[440px] sm:w-[230px] mt-2 rounded-md bg-[#888DAA] animate-pulse"></div> */}
          </div>
        </div>
      </div>

      <div className="z-10 mb-3 mt-5 w-full items-center justify-between gap-2 px-4">
        <div className="flex w-full gap-3">
          <div className="h-[48px] min-w-[48px] max-w-[48px] animate-pulse cursor-pointer rounded-full bg-[#3C3F4A]"></div>
          <div className="flex flex-grow flex-col">
            <div>
              <div className="mt-4 h-2 w-28 animate-pulse cursor-pointer rounded-md bg-[#3C3F4A]"></div>
              <div className="mt-2 h-1 w-12 animate-pulse rounded-sm bg-[#3C3F4A]"></div>
            </div>
            <div className="mt-4 h-[110px] animate-pulse rounded-md bg-[#3C3F4A]"></div>
            <div className="mt-2 h-[15px] max-w-[350px] animate-pulse rounded-md bg-[#3C3F4A]"></div>
          </div>
        </div>

        {/* <div className="flex gap-3 pl-2">
          <div className="h-[30px] w-[30px] rounded-full bg-[#888DAA] animate-pulse"></div>
        </div> */}
      </div>
    </div>
  );
};

export default RepliesProfileSkeletons;
