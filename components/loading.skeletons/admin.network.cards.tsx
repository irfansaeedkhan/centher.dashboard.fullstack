import React from "react";

const OverviewCardsSkeleton = () => {
  return (
    <div className=" grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4 bg-[#131314]">
      <div className=" flex  min-h-[90px] animate-pulse flex-col gap-3 rounded-xl bg-[#3C3F4A] p-6"></div>
      <div className=" flex  min-h-[90px] animate-pulse flex-col gap-3 rounded-xl bg-[#3C3F4A] p-6"></div>
      <div className=" flex  min-h-[90px] animate-pulse flex-col gap-3 rounded-xl bg-[#3C3F4A] p-6"></div>
      <div className=" flex  min-h-[90px] animate-pulse flex-col gap-3 rounded-xl bg-[#3C3F4A] p-6"></div>
    </div>
  );
};

export default OverviewCardsSkeleton;

// lightbackround with pulse :  bg-[#3C3F4A]  animate-pulse

// background dark :  bg-[#131314]
