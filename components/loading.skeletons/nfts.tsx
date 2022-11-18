import React from "react";

const NftsSkeleton = () => {
  return (
    <div className="w-[310px] h-[380px] relative bg-[#131314] rounded-t-[10px] rounded-b-[10px]">
      <div className="flex items-center w-[16.688rem] h-[48px]">
        <div className="ml-6 rounded-full w-[40px] h-[40px] bg-[#3C3F4A] mt-5 animate-pulse"></div>

        <div className="h-[15px] w-[10rem] bg-[#3C3F4A] rounded-sm ml-2 mt-5 animate-pulse"></div>
      </div>
      <div className="h-[200px] w-[310px] top-3 left-0 bg-[#3C3F4A] mt-4 animate-pulse"></div>
      <div className="p-2">
        <div className="h-[20px] w-[12rem] bg-[#3C3F4A] rounded-sm mt-2 animate-pulse"></div>
      </div>

      <div className="h-[50px] w-[310px] bg-[#3C3F4A] mt-6 rounded-b-[10px] animate-pulse"></div>
    </div>
  );
};

export default NftsSkeleton;
