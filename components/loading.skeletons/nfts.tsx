import React from "react";

const NftsSkeleton = () => {
  return (
    <div className="w-[16.688rem] h-[310px] relative bg-black rounded-t-[10px] rounded-b-[10px]">
      <div className="flex items-center w-[16.688rem] h-[48px] absolute bg-black top-0 left-0 rounded-t-[10px] py-4">
        <div className="ml-2 rounded-full w-[40px] h-[40px] bg-[#888DAA] animate-pulse"></div>

        <div className="h-[15px] w-[10rem] bg-[#888DAA] rounded-sm ml-2 animate-pulse"></div>
      </div>
      <div className="h-[200px] w-[16.688rem] mt-12 top-0 left-0 bg-[#888DAA] animate-pulse"></div>
      <div className="p-2">
        <div className="h-[15px] w-[10rem] bg-[#888DAA] rounded-sm animate-pulse"></div>
      </div>
      <div className="h-[40px] w-[16.688rem] bg-black top-0 rounded-b-[10px] left-0 "></div>
    </div>
  );
};

export default NftsSkeleton;
