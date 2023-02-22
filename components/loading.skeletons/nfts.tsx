import React from "react";

const NFTsSkeleton = () => {
  return (
    <div className="relative flex w-full max-w-[300px] flex-col rounded-10px border border-gray-shade-3">
      <div className="flex items-center space-x-3 p-4">
        <div className="h-7 w-7 animate-pulse rounded-full bg-[#3C3F4A]"></div>
        <div className="h-[15px] w-[10rem] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
      </div>

      <div className="h-[200px] animate-pulse bg-[#3C3F4A]"></div>

      <div className="flex flex-grow items-center py-4">
        <div className="ml-2 h-5 w-[14rem] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
      </div>

      <div className="h-[60px] animate-pulse rounded-b-10px bg-[#3C3F4A]"></div>
    </div>
  );
};

export default NFTsSkeleton;
