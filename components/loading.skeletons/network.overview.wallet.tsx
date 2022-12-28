import React from "react";

const WalletSectionSkeleton = () => {
  return (
    <div className="w-full flex md:flex-row flex-col gap-6">
      <div className="w-full max-w-[810px] bg-[#131314] rounded-[14px] h-[198px]">
        <div className="h-1/2 py-5 px-6 bg-[#131314] rounded-t-[14px] bg-no-repeat bg-cover bg-transparent bg-center space-y-1 flex flex-col justify-center"></div>
        <div className="h-1/2 py-5 px-6 bg-[#3C3F4A]  animate-pulse rounded-b-[14px] space-y-1 flex flex-col justify-center"></div>
      </div>
      <div className="md:max-w-[310px] max-w-full w-full md:h-[198px] sm:h-[175px] h-[198px] rounded-[14px] bg-no-repeat bg-cover flex flex-grow bg-transparent py-6 px-5 flex-col justify-between bg-[#131314]">
        <div className="w-full rounded-[14px] h-[70px] bg-[#3C3F4A]  animate-pulse"></div>
        <div className="w-full rounded-xl p-2 bg-[#3C3F4A]  animate-pulse  backdrop-blur-md h-[52px] flex items-center justify-between gap-2"></div>
      </div>
    </div>
  );
};

export default WalletSectionSkeleton;
