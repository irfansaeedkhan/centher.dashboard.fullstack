import React from "react";

const NftsSkeleton = () => {
  return (
    <div className="w-[16.688rem] h-[270px] bg-gray-700 rounded-b-[10px]">
      <div className=" w-[16.688rem] h-[48px] absolute bg-gray-600 top-0 left-0 rounded-t-[10px] py-4">
        <div className="h-[15px] w-[10rem] bg-gray-500 rounded-sm ml-2 animate-pulse"></div>
      </div>
      <div className="h-[200px] w-[16.688rem] mt-12 top-0 left-0 bg-gray-500 animate-pulse"></div>
      <div className="flex flex-col gap-1 p-2">
        <div className="h-[15px] w-[10rem] bg-gray-500 rounded-sm animate-pulse"></div>
      </div>
      <div className="h-[40px] w-[16.688rem] bg-gray-500 top-0 rounded-b-[10px] left-0 animate-pulse"></div>
    </div>
  );
};

export default NftsSkeleton;
