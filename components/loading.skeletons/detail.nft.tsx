import React from "react";

const DetailNftSkeleton = () => {
  return (
    <div className="flex gap-9 justify-center">
      <div className="flex flex-col gap-3">
        <div className="h-[500px] w-[500px] rounded-[10px] bg-gray-700 animate-pulse"></div>
        <div className="h-[58px] w-[500px] rounded-[10px] bg-gray-700 animate-pulse"></div>
        <div className="h-[58px] w-[500px] rounded-[10px] bg-gray-700 animate-pulse"></div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="w-full flex flex-col gap-6">
          <div className="flex items-center">
            <div className="h-[40px] w-[200px] bg-gray-700 rounded-[10px] animate-pulse"></div>
          </div>
        </div>

        {/* nft desicription container */}
        <div className="w-full flex flex-col gap-5">
          <div className="flex items-center">
            <div className="h-[40px] w-[300px] bg-gray-700 rounded-[10px] animate-pulse"></div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5">
          <div className="flex items-center justify-center">
            <div className="h-[100px] w-[616px] bg-gray-700 rounded-[10px] animate-pulse"></div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5">
          <div className="flex items-center justify-center">
            <div className="h-[150px] w-[616px] bg-gray-700 rounded-[10px] animate-pulse"></div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5">
          <div className="flex items-center justify-center">
            <div className="h-[50px] w-[616px] bg-gray-700 rounded-[10px] animate-pulse"></div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5">
          <div className="flex items-center justify-center">
            <div className="h-[58px] w-[616px] bg-gray-700 rounded-[10px] animate-pulse"></div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5">
          <div className="flex items-center justify-center">
            <div className="h-[58px] w-[616px] bg-gray-700 rounded-[10px] animate-pulse"></div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5">
          <div className="flex items-center justify-center">
            <div className="h-[58px] w-[616px] bg-gray-700 rounded-[10px] animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailNftSkeleton;
