import React from "react";

const ProfileSettingSkeleton = () => {
  return (
    <div>
      <div className="flex items-center gap-5">
        <div className="h-[80px] w-full max-w-[80px] animate-pulse rounded-full bg-[#3C3F4A]"></div>
        <div className="h-[24px] w-full max-w-[224px] animate-pulse rounded-md bg-[#3C3F4A]"></div>
      </div>
      <div className="mt-4 h-[40px] w-full max-w-[140px] animate-pulse rounded-lg bg-[#3C3F4A]"></div>
      <div className="mt-14 h-[48px] w-full max-w-[640px] animate-pulse rounded-lg bg-[#3C3F4A]"></div>
      <div className="flex items-center gap-3 fxs:flex-col fxs:items-start fsm:flex-row fmd:flex-row">
        <div className="mt-12 h-[48px] w-full animate-pulse rounded-lg bg-[#3C3F4A] fxs:max-w-[640px] fsm:max-w-[312px]"></div>
        <div className="mt-12 h-[48px] w-full animate-pulse rounded-lg bg-[#3C3F4A] fxs:max-w-[640px] fsm:max-w-[312px]"></div>
      </div>
      <div className="mt-12 h-[48px] w-full max-w-[640px] animate-pulse rounded-lg bg-[#3C3F4A]"></div>
      <div className="mt-12 h-[48px] w-full max-w-[640px] animate-pulse rounded-lg bg-[#3C3F4A]"></div>
      <div className="mt-12 h-[120px] w-full max-w-[640px] animate-pulse rounded-lg bg-[#3C3F4A]"></div>
      <div className="mt-10 h-[48px] w-full max-w-[140px] animate-pulse rounded-lg bg-[#3C3F4A]"></div>
    </div>
  );
};

export default ProfileSettingSkeleton;
