import React from "react";

// #888DAA #2A2D3C

const ProfileSettingSkeleton1 = () => {
  return (
    <div className="flex items-center justify-center bg-[#131314] py-10">
      <div className="flex w-full max-w-[496px] flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="h-[80px] w-[80px] animate-pulse rounded-full bg-[#3C3F4A]"></div>
          <div>
            <div>
              <div className="h-[15px] w-[156px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
            </div>
          </div>
        </div>
        {/* input fields */}
        <div className="flex flex-col gap-2">
          <div className="h-[10px] w-[100px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
          <div className="w-full animate-pulse rounded-sm bg-[#3C3F4A] py-3 px-5"></div>

          <div className="mt-2 h-[10px] w-[100px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
          <div className="w-full animate-pulse rounded-sm bg-[#3C3F4A] py-3 px-5"></div>

          <div className="mt-2 h-[10px] w-[100px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
          <div className="w-full animate-pulse rounded-sm bg-[#3C3F4A] py-3 px-5"></div>

          <div className="mt-2 h-[10px] w-[100px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
          <div className="w-full animate-pulse rounded-sm bg-[#3C3F4A] py-3 px-5"></div>

          <div className="mt-2 h-[10px] w-[100px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
          <div className="w-full animate-pulse rounded-sm bg-[#3C3F4A] py-3 px-5"></div>

          <div className="mt-2 h-[10px] w-[100px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
          <div className="w-full animate-pulse rounded-sm bg-[#3C3F4A] py-3 px-5"></div>

          <div className="mt-2 h-[10px] w-[100px] animate-pulse rounded-sm bg-[#3C3F4A]"></div>
          <div className="w-full animate-pulse rounded-sm bg-[#3C3F4A] py-20 px-5"></div>
        </div>
        <div className="mt-2 flex w-full animate-pulse justify-center rounded-sm bg-[#3C3F4A] py-5"></div>
      </div>
    </div>
  );
};

export default ProfileSettingSkeleton1;
