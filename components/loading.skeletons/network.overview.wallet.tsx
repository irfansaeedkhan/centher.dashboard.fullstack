import React from "react";

const WalletSectionSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-6 md:flex-row">
      <div className="h-[198px] w-full max-w-[810px] rounded-[14px] bg-[#131314]">
        <div className="flex h-1/2 flex-col justify-center space-y-1 rounded-t-[14px] bg-[#131314] bg-transparent bg-cover bg-center bg-no-repeat py-5 px-6"></div>
        <div className="flex h-1/2 animate-pulse flex-col  justify-center space-y-1 rounded-b-[14px] bg-[#3C3F4A] py-5 px-6"></div>
      </div>
      <div className="flex h-[198px] w-full max-w-full flex-grow flex-col justify-between rounded-[14px] bg-transparent bg-[#131314] bg-cover bg-no-repeat py-6 px-5 sm:h-[175px] md:h-[198px] md:max-w-[310px]">
        <div className="h-[70px] w-full animate-pulse rounded-[14px]  bg-[#3C3F4A]"></div>
        <div className="flex h-[52px] w-full animate-pulse  items-center  justify-between gap-2 rounded-xl bg-[#3C3F4A] p-2 backdrop-blur-md"></div>
      </div>
    </div>
  );
};

export default WalletSectionSkeleton;
