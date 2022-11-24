import React from "react";

const NftProfileCollectionSkeleton = () => {
  return (
    <div className="w-[340px] h-[360px] bg-[#131314] rounded-lg flex flex-col gap-12 ">
      <div className="relative flex justify-center">
        <div className="rounded-t-lg bg-[#3C3F4A] w-[340px] h-[180px] animate-pulse"></div>
        <div className="rounded-full absolute object-cover h-[64px] w-[64px] z-50 -bottom-[1.8rem] border-2 border-gray-700 bg-background-shade-3"></div>
      </div>
      <div className="flex flex-col gap-3 px-4 items-center">
        <div className="h-[15px] w-[80px] bg-[#3C3F4A] rounded-sm animate-pulse"></div>
        <div className="h-[15px] w-[150px] bg-[#3C3F4A] rounded-sm animate-pulse"></div>
        <div className="h-[25px] w-[250px] bg-[#3C3F4A] rounded-sm animate-pulse"></div>
      </div>
    </div>
  );
};

export default NftProfileCollectionSkeleton;
