import React from "react";

const NetworkGenealogySingleCard = () => {
  return (
    <div className="h-[178px] w-full max-w-[998px] rounded-t-lg bg-[#131314]">
      <div className="flex items-center justify-between p-3 pb-5">
        <div className="flex w-full flex-col gap-2">
          <div className="h-[16px] w-full max-w-[70px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
          <div className="h-[20px] w-full max-w-[40px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
        </div>
        <div className="h-[40px] w-full max-w-[40px] animate-pulse rounded-lg bg-[#3C3F4A]"></div>
      </div>
      <div className="h-[2px] w-full max-w-[998px] bg-[#3C3F4A] "></div>
      <div className="flex justify-between p-3">
        <div className="flex w-full flex-col gap-2">
          <div className="h-[16px] w-full max-w-[70px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
          <div className="h-[12px] w-full max-w-[40px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
        </div>

        <div className="flex w-full flex-col items-end gap-2">
          <div className="h-[16px] w-full max-w-[90px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
          <div className="h-[20px] w-full max-w-[70px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
          <div className="h-[20px] w-full max-w-[50px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
        </div>
      </div>
    </div>
  );
};

export default NetworkGenealogySingleCard;
