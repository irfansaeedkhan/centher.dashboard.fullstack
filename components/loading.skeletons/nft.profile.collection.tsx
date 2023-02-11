import React from "react";

const NftProfileCollectionSkeleton = () => {
  return (
    <div className="flex h-[360px] w-full flex-col gap-12 rounded-lg bg-[#131314] fsm:w-[45%] ">
      <div className="relative flex justify-center">
        <div className="h-[180px] w-full animate-pulse rounded-t-lg bg-[#3C3F4A] fsm:w-[45%]"></div>
        <div className="absolute -bottom-[1.8rem] z-50 h-[64px] w-[64px] rounded-full border-2 border-gray-700 bg-background-shade-3 object-cover"></div>
      </div>
      <div className="flex flex-col items-center gap-3 px-4">
        <div className="h-[15px] w-[80px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
        <div className="h-[15px] w-[150px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
        <div className="h-[25px] w-[250px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
      </div>
    </div>
  );
};

export default NftProfileCollectionSkeleton;
