import React from "react";

const NetworkGenealogySingleCard = () => {
  return (
    <div className="w-full max-w-[998px] h-[178px] bg-[#131314] rounded-t-lg">
      <div className="flex items-center justify-between p-3 pb-5">
        <div className="w-full flex flex-col gap-2">
          <div className="w-full max-w-[70px] h-[16px] bg-[#3C3F4A] rounded-sm animate-pulse"></div>
          <div className="w-full max-w-[40px] h-[20px] bg-[#3C3F4A] rounded-sm animate-pulse"></div>
        </div>
        <div className="w-full max-w-[40px] h-[40px] rounded-lg bg-[#3C3F4A] animate-pulse"></div>
      </div>
      <div className="w-full max-w-[998px] h-[2px] bg-[#3C3F4A] "></div>
      <div className="flex justify-between p-3">
        <div className="w-full flex flex-col gap-2">
          <div className="w-full max-w-[70px] h-[16px] bg-[#3C3F4A] rounded-sm animate-pulse"></div>
          <div className="w-full max-w-[40px] h-[12px] bg-[#3C3F4A] rounded-sm animate-pulse"></div>
        </div>

        <div className="flex flex-col items-end gap-2 w-full">
          <div className="w-full max-w-[90px] h-[16px] rounded-sm bg-[#3C3F4A] animate-pulse"></div>
          <div className="w-full max-w-[70px] h-[20px] rounded-sm bg-[#3C3F4A] animate-pulse"></div>
          <div className="w-full max-w-[50px] h-[20px] rounded-sm bg-[#3C3F4A] animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default NetworkGenealogySingleCard;
