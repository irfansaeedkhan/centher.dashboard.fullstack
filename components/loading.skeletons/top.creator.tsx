import React from "react";

const TopCreatorsSkeleton = () => {
  return (
    <div className="flex items-center">
      <div className="ml-2 rounded-full w-12 h-12 bg-gray-shade-3 animate-pulse"></div>

      <div className="h-[15px] w-[7rem] bg-gray-shade-3 rounded-sm ml-2 animate-pulse"></div>
    </div>
  );
};

export default TopCreatorsSkeleton;
