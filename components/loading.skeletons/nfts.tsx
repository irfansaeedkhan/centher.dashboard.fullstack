import React from "react";

const NftsSkeleton = () => {
  return (
    <div className="relative h-[380px] w-[310px] rounded-t-[10px] rounded-b-[10px] bg-[#131314]">
      <div className="flex h-[48px] w-[16.688rem] items-center">
        <div className="ml-6 mt-5 h-[40px] w-[40px] animate-pulse rounded-full bg-[#3C3F4A]"></div>

        <div className="ml-2 mt-5 h-[15px] w-[10rem] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
      </div>
      <div className="top-3 left-0 mt-4 h-[200px] w-[310px] animate-pulse bg-[#3C3F4A]"></div>
      <div className="p-2">
        <div className="mt-2 h-[20px] w-[12rem] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
      </div>

      <div className="mt-6 h-[50px] w-[310px] animate-pulse rounded-b-[10px] bg-[#3C3F4A]"></div>
    </div>
  );
};

export default NftsSkeleton;
