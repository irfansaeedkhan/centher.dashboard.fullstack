import React from "react";

const SearchUserSkeleton = () => {
  return (
    <>
      <div className="h-[80px] w-[544px] p-4 bg-[#2A2D3C] rounded-lg flex gap-10 items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="!h-[40px] !w-[40px] rounded-full bg-[#888DAA] animate-pulse"></div>
          <div className="flex flex-col gap-1">
            <div className="h-[10px] w-[100px] bg-[#888DAA] rounded-lg animate-pulse"></div>
            <div className="h-[10px] w-[80px] bg-[#888DAA] rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div className="h-[36px] w-[120px] flex rounded-lg items-center bg-[#888DAA] animate-pulse"></div>
      </div>

      <div className="h-[80px] w-[544px] mt-2 p-4 bg-[#2A2D3C] rounded-lg flex gap-10 items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="!h-[40px] !w-[40px] rounded-full bg-[#888DAA] animate-pulse"></div>
          <div className="flex flex-col gap-1">
            <div className="h-[10px] w-[100px] bg-[#888DAA] rounded-lg animate-pulse"></div>
            <div className="h-[10px] w-[80px] bg-[#888DAA] rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div className="h-[36px] w-[120px] flex rounded-lg items-center bg-[#888DAA] animate-pulse"></div>
      </div>

      <div className="h-[80px] w-[544px] mt-2 p-4 bg-[#2A2D3C] rounded-lg flex gap-10 items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="!h-[40px] !w-[40px] rounded-full bg-[#888DAA] animate-pulse"></div>
          <div className="flex flex-col gap-1">
            <div className="h-[10px] w-[100px] bg-[#888DAA] rounded-lg animate-pulse"></div>
            <div className="h-[10px] w-[80px] bg-[#888DAA] rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div className="h-[36px] w-[120px] flex rounded-lg items-center bg-[#888DAA] animate-pulse"></div>
      </div>
    </>
  );
};

export default SearchUserSkeleton;
