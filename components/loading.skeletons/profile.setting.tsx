import React from "react";

// #888DAA #2A2D3C

const ProfileSettingSkeleton = () => {
  return (
    <div className="bg-[#131314] py-10 flex justify-center items-center">
      <div className="flex flex-col gap-6 max-w-[496px] w-full">
        <div className="flex gap-2 items-center">
          <div className="h-[80px] w-[80px] rounded-full bg-[#3C3F4A] animate-pulse"></div>
          <div>
            <div>
              <div className="h-[15px] w-[156px] rounded-sm bg-[#3C3F4A] animate-pulse"></div>
            </div>
          </div>
        </div>
        {/* input fields */}
        <div className="flex gap-2 flex-col">
          <div className="h-[10px] w-[100px] rounded-sm bg-[#3C3F4A] animate-pulse"></div>
          <div className="w-full py-3 px-5 rounded-sm bg-[#3C3F4A] animate-pulse"></div>

          <div className="h-[10px] w-[100px] mt-2 rounded-sm bg-[#3C3F4A] animate-pulse"></div>
          <div className="w-full py-3 px-5 rounded-sm bg-[#3C3F4A] animate-pulse"></div>

          <div className="h-[10px] w-[100px] mt-2 rounded-sm bg-[#3C3F4A] animate-pulse"></div>
          <div className="w-full py-3 px-5 rounded-sm bg-[#3C3F4A] animate-pulse"></div>

          <div className="h-[10px] w-[100px] mt-2 rounded-sm bg-[#3C3F4A] animate-pulse"></div>
          <div className="w-full py-3 px-5 rounded-sm bg-[#3C3F4A] animate-pulse"></div>

          <div className="h-[10px] w-[100px] mt-2 rounded-sm bg-[#3C3F4A] animate-pulse"></div>
          <div className="w-full py-3 px-5 rounded-sm bg-[#3C3F4A] animate-pulse"></div>

          <div className="h-[10px] w-[100px] mt-2 rounded-sm bg-[#3C3F4A] animate-pulse"></div>
          <div className="w-full py-3 px-5 rounded-sm bg-[#3C3F4A] animate-pulse"></div>

          <div className="h-[10px] w-[100px] mt-2 rounded-sm bg-[#3C3F4A] animate-pulse"></div>
          <div className="w-full py-20 px-5 rounded-sm bg-[#3C3F4A] animate-pulse"></div>
        </div>
        <div className="mt-2 py-5 flex w-full rounded-sm justify-center bg-[#3C3F4A] animate-pulse"></div>
      </div>
    </div>
  );
};

export default ProfileSettingSkeleton;
