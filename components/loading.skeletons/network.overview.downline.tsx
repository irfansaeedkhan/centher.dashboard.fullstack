import React from "react";

// #888DAA #2A2D3C

const NetworkDownlineSkeleton = () => {
  return (
    <div className="h-[228px] w-full flex-grow rounded-xl bg-[#131314] py-6 fsm:w-[256px] fmd:w-[352px] flg:w-[315px] flg:max-w-[368px] fxl:w-[317px] fxl:max-w-[368px] f2xl:w-[364px] f2xl:max-w-[364px]">
      <div className="flex items-center justify-end gap-10 px-6 pb-4 text-sm ">
        <div className="flex h-8 w-8  animate-pulse items-center justify-center rounded-lg  bg-[#3C3F4A] "></div>
      </div>
      <div className="flex h-full w-full items-center justify-center px-6 py-2">
        <div className="h-[100px] w-full animate-pulse  rounded-xl bg-[#3C3F4A]"></div>
      </div>
    </div>
  );
};

export default NetworkDownlineSkeleton;
