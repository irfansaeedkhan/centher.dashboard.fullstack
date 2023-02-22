import React from "react";

const HistoryTableSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex w-full flex-col rounded-[14px] bg-[#131314]">
        <div className="h-auto w-full rounded-[14px] bg-[#131314] p-2">
          <div className="flex h-[72px] w-full  animate-pulse  rounded-2xl border-2 border-gray-shade-3 bg-[#3C3F4A]"></div>
          <div className="flex h-[72px]  w-full   animate-pulse border-b-2  border-gray-shade-3"></div>
          <div className="flex h-[72px]  w-full    animate-pulse border-b-2  border-gray-shade-3"></div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTableSkeleton;

// lightbackround with pulse :  bg-[#3C3F4A]  animate-pulse

// background dark :  bg-[#131314]
