import React from "react";

const NftCollectionSkeleton = () => {
  return (
    <div className="flex h-[400px] w-[340px] flex-col gap-12 rounded-lg bg-[#131314] ">
      <div className="relative flex justify-center">
        <div className="h-[244px] w-[340px] animate-pulse rounded-t-lg bg-[#3C3F4A]"></div>
        <div className="absolute -bottom-[1.8rem] z-50 h-[64px] w-[64px] rounded-full border-2 border-[#3C3F4A] bg-background-shade-3 object-cover"></div>
      </div>
      <div className="flex flex-col items-center gap-3 px-4">
        <div className="h-[15px] w-[80px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
        <div className="h-[15px] w-[150px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
        <div className="h-[25px] w-[250px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
      </div>
    </div>
  );
};

export default NftCollectionSkeleton;
