import React from "react";

// #888DAA #2A2D3C

const UserProfileHeaderSkeleton = () => {
  return (
    <div>
      {/* cover card */}
      <div className="bg-[#2A2D3C]  rounded-md">
        <div className="relative rounded-md bg-center bg-cover bg-no-repeat w-full h-[31vh] bg-[#888DAA] animate-pulse">
          {/* profile image , user display name , icons , edit profile */}
          <div className="cursor-pointer absolute left-6 -bottom-12">
            <div className="rounded-full h-[112px] w-[111px] object-cover bg-[#888DAA] border-2 border-[#2A2D3C] animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="mt-8 lg:mt-10 p-7">
        <div className="flex flex-col lg:flex-row items-baseline justify-between">
          <div>
            <div className="h-[15px] w-[136px] bg-[#888DAA] rounded-md animate-pulse"></div>
            <div className="flex items-center gap-3">
              <div className="pt-1 flex items-center gap-2 relative">
                <div className="h-[15px] w-[200px] rounded-md bg-[#888DAA] animate-pulse"></div>
              </div>
            </div>
          </div>
          {/* button */}
          <div className="mt-5 lg:mt-0 flex items-center justify-center gap-3 w-full rounded-md h-[40px] max-w-[157px] bg-[#888DAA] animate-pulse"></div>
        </div>
        {/* description */}
        <div className="mt-6">
          <div className="h-[20px] w-[300px] bg-[#888DAA] rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeaderSkeleton;
