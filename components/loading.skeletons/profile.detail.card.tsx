import React from "react";

// #888DAA #2A2D3C

const ProfileDetailCardSkeleton = () => {
  return (
    <div className="min-h-[272px] max-w-[272px] rounded-10px bg-[#131314] pt-6 text-center">
      <div className="mx-auto h-[60px] w-[60px] animate-pulse rounded-full bg-[#3C3F4A]"></div>
      <div className="mt-2 flex justify-center">
        <div className="h-2 w-36 animate-pulse rounded-md bg-[#3C3F4A]"></div>
      </div>
      <div className="mt-8 h-[68px] w-[272px] animate-pulse bg-[#3C3F4A]"></div>
      <div className="mx-5 mt-4 h-2 w-56 animate-pulse rounded-md bg-[#3C3F4A]"></div>
      <div className="mx-5 mt-4 h-2 w-56 animate-pulse rounded-md bg-[#3C3F4A]"></div>
    </div>
  );
};

export default ProfileDetailCardSkeleton;
