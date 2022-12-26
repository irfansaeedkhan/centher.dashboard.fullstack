import React from "react";

const OverviewCardsSkeleton = () => {
  return (
    <div className=" grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4 bg-[#131314]">
      <div className=" bg-[#3C3F4A]  animate-pulse p-6 rounded-xl flex flex-col gap-3 min-h-[90px]"></div>
      <div className=" bg-[#3C3F4A]  animate-pulse p-6 rounded-xl flex flex-col gap-3 min-h-[90px]"></div>
      <div className=" bg-[#3C3F4A]  animate-pulse p-6 rounded-xl flex flex-col gap-3 min-h-[90px]"></div>
      <div className=" bg-[#3C3F4A]  animate-pulse p-6 rounded-xl flex flex-col gap-3 min-h-[90px]"></div>
    </div>
  );
};

export default OverviewCardsSkeleton;

// lightbackround with pulse :  bg-[#3C3F4A]  animate-pulse

// background dark :  bg-[#131314]
