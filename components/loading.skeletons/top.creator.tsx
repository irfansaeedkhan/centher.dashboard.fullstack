import React from "react";

const TopCreatorsSkeleton = () => {
  return (
    <div className="flex items-center">
      <div className="ml-2 h-[40px] w-[40px] animate-pulse rounded-full bg-[#3C3F4A]"></div>

      <div className="ml-2 h-[15px] w-[7rem] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
    </div>
  );
};

export default TopCreatorsSkeleton;
