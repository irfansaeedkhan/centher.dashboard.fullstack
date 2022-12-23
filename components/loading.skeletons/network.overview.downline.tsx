import React from "react";

// #888DAA #2A2D3C

const NetworkDownlineSkeleton = () => {
  return (
    <div className="h-[228px] w-full f2xl:w-[364px] f2xl:max-w-[364px] fxl:w-[317px] fxl:max-w-[368px] flg:w-[315px] flg:max-w-[368px] fmd:w-[352px] fsm:w-[256px] flex-grow bg-[#131314] py-6 rounded-xl">
      <div className="px-6 pb-4 flex justify-end items-center gap-10 text-sm ">
        <div className="rounded-lg w-8 h-8  flex justify-center items-center bg-[#3C3F4A]  animate-pulse "></div>
      </div>
      <div className="w-full h-full px-6 py-2 flex items-center justify-center">
        <div className="w-full h-[100px] bg-[#3C3F4A]  animate-pulse rounded-xl"></div>
      </div>
    </div>
  );
};

export default NetworkDownlineSkeleton;
