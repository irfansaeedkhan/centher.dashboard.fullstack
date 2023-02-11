import React from "react";

const DetailNftSkeleton = () => {
  return (
    <div className="flex justify-center gap-9">
      <div className="flex flex-col gap-3">
        <div className="h-[500px] w-[500px] animate-pulse rounded-[10px] bg-gray-700"></div>
        <div className="h-[58px] w-[500px] animate-pulse rounded-[10px] bg-gray-700"></div>
        <div className="h-[58px] w-[500px] animate-pulse rounded-[10px] bg-gray-700"></div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex w-full flex-col gap-6">
          <div className="flex items-center">
            <div className="h-[40px] w-[200px] animate-pulse rounded-[10px] bg-gray-700"></div>
          </div>
        </div>

        {/* nft desicription container */}
        <div className="flex w-full flex-col gap-5">
          <div className="flex items-center">
            <div className="h-[40px] w-[300px] animate-pulse rounded-[10px] bg-gray-700"></div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-5">
          <div className="flex items-center justify-center">
            <div className="h-[100px] w-[616px] animate-pulse rounded-[10px] bg-gray-700"></div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-5">
          <div className="flex items-center justify-center">
            <div className="h-[150px] w-[616px] animate-pulse rounded-[10px] bg-gray-700"></div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-5">
          <div className="flex items-center justify-center">
            <div className="h-[50px] w-[616px] animate-pulse rounded-[10px] bg-gray-700"></div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-5">
          <div className="flex items-center justify-center">
            <div className="h-[58px] w-[616px] animate-pulse rounded-[10px] bg-gray-700"></div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-5">
          <div className="flex items-center justify-center">
            <div className="h-[58px] w-[616px] animate-pulse rounded-[10px] bg-gray-700"></div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-5">
          <div className="flex items-center justify-center">
            <div className="h-[58px] w-[616px] animate-pulse rounded-[10px] bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailNftSkeleton;
