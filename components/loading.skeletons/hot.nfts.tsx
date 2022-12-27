import React from "react";

const HotNftsSkeleton = () => {
  return (
    <div className="w-[16.688rem] h-[270px] bg-[#131314] rounded-b-[10px]">
      <div className=" w-[16.688rem] h-[50px] absolute bg-[#131314] top-0 left-0 rounded-t-[10px] py-4">
        <div className="h-[15px] w-[10rem] bg-[#3C3F4A] rounded-sm ml-2 animate-pulse"></div>
      </div>
      <div className="h-[200px] w-[16.688rem] mt-12 top-0 left-0 bg-[#3C3F4A] animate-pulse"></div>
      <div className="flex flex-col gap-1 p-2">
        <div className="h-[15px] w-[10rem] bg-[#3C3F4A] rounded-sm animate-pulse"></div>
      </div>
      <div className="h-[40px] w-[16.688rem] bg-[#3C3F4A] top-0 rounded-b-[10px] left-0 animate-pulse"></div>
    </div>
  );
};

export default HotNftsSkeleton;
