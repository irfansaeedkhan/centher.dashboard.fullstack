import React from "react";

const HistoryTableSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="w-full flex flex-col bg-[#131314] rounded-[14px]">
        <div className="w-full h-auto bg-[#131314] rounded-[14px] p-2">
          <div className="w-full h-[72px] flex  bg-[#3C3F4A]  animate-pulse border-2 rounded-2xl border-gray-shade-3"></div>
          <div className="w-full h-[72px]  flex   animate-pulse border-b-2  border-gray-shade-3"></div>
          <div className="w-full h-[72px]  flex    animate-pulse border-b-2  border-gray-shade-3"></div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTableSkeleton;

// lightbackround with pulse :  bg-[#3C3F4A]  animate-pulse

// background dark :  bg-[#131314]
