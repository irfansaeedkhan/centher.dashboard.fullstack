import React from "react";
import clsx from "clsx";

const NetworkGenealogySkeleton: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div
      className={clsx(
        "h-[178px] w-full max-w-[240px] rounded-t-lg bg-[#131314]",
        className
      )}
    >
      <div className="flex items-center justify-between p-3 pb-5">
        <div className="flex w-full flex-col gap-2">
          <div className="h-[16px] w-full max-w-[40px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
          <div className="h-[20px] w-full max-w-[20px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
        </div>
        <div className="h-[32px] w-full max-w-[32px] animate-pulse rounded-lg bg-[#3C3F4A]"></div>
      </div>
      <div className="h-[2px] w-full bg-[#3C3F4A] "></div>
      <div className="flex justify-between p-3">
        <div className="flex w-full flex-col gap-2">
          <div className="h-[16px] w-full max-w-[40px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
          <div className="h-[12px] w-full max-w-[20px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
        </div>

        <div className="flex w-full flex-col items-end gap-2">
          <div className="h-[16px] w-full max-w-[70px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
          <div className="h-[20px] w-full max-w-[50px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
          <div className="h-[20px] w-full max-w-[40px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
        </div>
      </div>
    </div>
  );
};

export default NetworkGenealogySkeleton;
