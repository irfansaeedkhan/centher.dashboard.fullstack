import React from "react";

const HotNftsSkeleton = () => {
  return (
    <div className="h-[270px] w-[16.688rem] rounded-b-[10px] bg-[#131314]">
      <div className=" absolute top-0 left-0 h-[50px] w-[16.688rem] rounded-t-[10px] bg-[#131314] py-4">
        <div className="ml-2 h-[15px] w-[10rem] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
      </div>
      <div className="top-0 left-0 mt-12 h-[200px] w-[16.688rem] animate-pulse bg-[#3C3F4A]"></div>
      <div className="flex flex-col gap-1 p-2">
        <div className="h-[15px] w-[10rem] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
      </div>
      <div className="top-0 left-0 h-[40px] w-[16.688rem] animate-pulse rounded-b-[10px] bg-[#3C3F4A]"></div>
    </div>
  );
};

export default HotNftsSkeleton;
