import React from "react";

const SearchUserSkeleton = () => {
  return (
    <>
      <div className="flex h-[80px] w-full items-center justify-between gap-10 rounded-lg bg-[#131314] p-4">
        <div className="flex items-center gap-2">
          <div className="!h-[40px] !w-[40px] animate-pulse rounded-full bg-[#3C3F4A]"></div>
          <div className="flex flex-col gap-1">
            <div className="h-[10px] w-[100px] animate-pulse rounded-lg bg-[#3C3F4A]"></div>
            <div className="h-[10px] w-[80px] animate-pulse rounded-lg bg-[#3C3F4A]"></div>
          </div>
        </div>
        <div className="flex h-[36px] w-[120px] animate-pulse items-center rounded-lg bg-[#3C3F4A]"></div>
      </div>

      <div className="flex h-[80px] w-full items-center justify-between gap-10 rounded-lg bg-[#131314] p-4">
        <div className="flex items-center gap-2">
          <div className="!h-[40px] !w-[40px] animate-pulse rounded-full bg-[#3C3F4A]"></div>
          <div className="flex flex-col gap-1">
            <div className="h-[10px] w-[100px] animate-pulse rounded-lg bg-[#3C3F4A]"></div>
            <div className="h-[10px] w-[80px] animate-pulse rounded-lg bg-[#3C3F4A]"></div>
          </div>
        </div>
        <div className="flex h-[36px] w-[120px] animate-pulse items-center rounded-lg bg-[#3C3F4A]"></div>
      </div>

      <div className="flex h-[80px] w-full items-center justify-between gap-10 rounded-lg bg-[#131314] p-4">
        <div className="flex items-center gap-2">
          <div className="!h-[40px] !w-[40px] animate-pulse rounded-full bg-[#3C3F4A]"></div>
          <div className="flex flex-col gap-1">
            <div className="h-[10px] w-[100px] animate-pulse rounded-lg bg-[#3C3F4A]"></div>
            <div className="h-[10px] w-[80px] animate-pulse rounded-lg bg-[#3C3F4A]"></div>
          </div>
        </div>
        <div className="flex h-[36px] w-[120px] animate-pulse items-center rounded-lg bg-[#3C3F4A]"></div>
      </div>
    </>
  );
};

export default SearchUserSkeleton;
