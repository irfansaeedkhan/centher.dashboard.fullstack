import React from "react";

const RewardsTableSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex w-full flex-col rounded-[14px] bg-[#131314]">
        <div className="h-auto w-full rounded-[14px] bg-[#131314] p-2">
          <div className="flex h-[92px]  w-full animate-pulse  rounded-[14px]  bg-[#3C3F4A]"></div>
        </div>
        <div className="flex justify-center  gap-10 p-2 py-6">
          <div className="h-[73px] w-full max-w-[338px] animate-pulse rounded-[14px] bg-[#3C3F4A] fsm:max-w-[232px] fmd:max-w-[200px]  flg:max-w-[285px] fxl:max-w-[288px] f2xl:max-w-[338px]"></div>
          <div className="h-[73px] w-full max-w-[338px] animate-pulse rounded-[14px] bg-[#3C3F4A] fsm:max-w-[232px] fmd:max-w-[200px]  flg:max-w-[285px] fxl:max-w-[288px] f2xl:max-w-[338px]"></div>
          <div className="h-[73px] w-full max-w-[338px] animate-pulse rounded-[14px] bg-[#3C3F4A] fsm:max-w-[232px] fmd:max-w-[200px]  flg:max-w-[285px] fxl:max-w-[288px] f2xl:max-w-[338px]"></div>
        </div>
      </div>
    </div>
  );
};

export default RewardsTableSkeleton;

// lightbackround with pulse :  bg-[#3C3F4A]  animate-pulse

// background dark :  bg-[#131314]
