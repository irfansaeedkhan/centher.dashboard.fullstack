import React from "react";

const HotNftsHeaderSkeleton = () => {
  return (
    <div className="flex items-center">
      <div className="ml-2 rounded-full w-[40px] h-[40px] bg-[#3C3F4A] animate-pulse"></div>

      <div className="h-[15px] w-[10rem] bg-[#3C3F4A] rounded-sm ml-2 animate-pulse"></div>
    </div>
  );
};

export default HotNftsHeaderSkeleton;
