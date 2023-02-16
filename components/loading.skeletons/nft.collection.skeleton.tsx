import React from "react";

const NftCollectionSkeleton = () => {
  return (
    <div className="flex w-full max-w-[300px] flex-col rounded-lg border border-gray-shade-3">
      <div className="relative flex justify-center">
        <div className="h-[180px] w-full animate-pulse rounded-t-lg bg-[#3C3F4A]"></div>
        <div className="absolute top-full z-50 h-16 w-16 -translate-y-1/2 transform rounded-full border-2 border-gray-shade-3 bg-background-shade-3 object-cover"></div>
      </div>
      <div className="mt-10 flex flex-grow flex-col items-center gap-3 px-2 pb-8 fsm:px-4">
        <div className="h-[15px] w-full max-w-[80px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
        <div className="h-[15px] w-full max-w-[150px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
        <div className="h-[25px] w-full max-w-[250px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
      </div>
    </div>
  );
};

export default NftCollectionSkeleton;
