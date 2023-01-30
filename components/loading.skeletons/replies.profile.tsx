import React from "react";

const RepliesProfileSkeletons = () => {
  return (
    // main container
    <div className="h-[300px] flex-col md:w-[440px] fsm:w-[480px] fxs:w-[320px] w-full relative py-4 bg-[#131314] rounded-10px flex">
      {/*  left line */}
      <div className="w-full items-center justify-center gap-2 mb-2 px-4">
        <div className="flex gap-3 w-full">
          <div className="h-[48px] !w-[48px] rounded-full bg-[#3C3F4A] animate-pulse"></div>

          <div className="flex-grow flex flex-col">
            <div>
              <div className="max-w-[112px] h-2 rounded-md mt-4 bg-[#3C3F4A] cursor-pointer animate-pulse"></div>
              <div className="max-w-[48px] h-1 mt-2 rounded-sm bg-[#3C3F4A] animate-pulse"></div>
              <div className="max-w-[520px] h-[2px] mt-4 rounded-sm bg-[#3C3F4A]"></div>
            </div>
            {/* <div className="h-[95px] md:w-[440px] sm:w-[230px] mt-10 rounded-md bg-[#888DAA] animate-pulse"></div> */}
            {/* <div className="h-[15px] md:w-[440px] sm:w-[230px] mt-2 rounded-md bg-[#888DAA] animate-pulse"></div> */}
          </div>
        </div>
      </div>

      <div className="w-full mt-3 z-10 items-center justify-between gap-2 mb-2 px-4">
        <div className="flex gap-3 w-full">
          <div className="h-[48px] min-w-[48px] max-w-[48px] rounded-full cursor-pointer bg-[#3C3F4A] animate-pulse"></div>
          <div className="w-[cal(100%-48px)] flex flex-col">
            <div>
              <div className="w-28 h-2 rounded-md mt-4 bg-[#3C3F4A] cursor-pointer animate-pulse"></div>
              <div className="w-12 h-1 mt-2 rounded-sm bg-[#3C3F4A] animate-pulse"></div>
            </div>
            <div className="h-[95px] md:w-[350px] fsm:w-[390px] fxs:w-[230px] mt-10 rounded-md bg-[#3C3F4A] animate-pulse"></div>
            <div className="h-[15px] md:w-[350px] fsm:w-[390px] fxs-[230px] mt-2 rounded-md bg-[#3C3F4A] animate-pulse"></div>
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
