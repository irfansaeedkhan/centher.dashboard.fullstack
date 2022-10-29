import React from "react";

// #888DAA #2A2D3C

const ProfileDetailCardSkeleton = () => {
  return (
    <div className="min-h-[272px] max-w-[272px] pt-6 rounded-10px text-center bg-[#2A2D3C]">
      <div className="w-[60px] h-[60px] mx-auto rounded-full bg-[#888DAA] animate-pulse"></div>
      <div className="flex justify-center mt-2">
        <div className="h-2 w-36 bg-[#888DAA] rounded-md animate-pulse"></div>
      </div>
      <div className="h-[68px] w-[272px] bg-[#888DAA] mt-8 animate-pulse"></div>
      <div className="h-2 w-56 mt-4 mx-5 bg-[#888DAA] rounded-md animate-pulse"></div>
      <div className="h-2 w-56 mt-4 mx-5 bg-[#888DAA] rounded-md animate-pulse"></div>
    </div>
  );
};

export default ProfileDetailCardSkeleton;
