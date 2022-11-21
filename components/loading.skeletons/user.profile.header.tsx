import React from "react";

// #888DAA #2A2D3C

const UserProfileHeaderSkeleton = () => {
  return (
    <div className="bg-[#131314]">
      {/* cover card */}
      <div className="rounded-md">
        <div className="relative rounded-md bg-center bg-cover bg-no-repeat w-full h-[25vh] bg-[#3C3F4A] animate-pulse">
          {/* profile image , user display name , icons , edit profile */}
          <div className="cursor-pointer absolute left-[50%] translate-x-[-50%] -bottom-12">
            <div className="rounded-full h-[112px] w-[111px] object-cover bg-[#3C3F4A] border-2 border-[#2A2D3C] animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col gap-5">
        <div className="flex justify-center items-center">
          <div className="h-[15px] items-end w-[180px] bg-[#3C3F4A] rounded-md animate-pulse"></div>
        </div>

        <div className="flex justify-center items-center">
          <div className="h-[15px] w-[120px] bg-[#3C3F4A] rounded-md animate-pulse"></div>
        </div>

        <div className="flex justify-center items-center">
          <div className="h-[35px] w-[250px] bg-[#3C3F4A] mb-2 rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* <div className="mt-8 lg:mt-10 p-7">
        <div className="flex justify-center items-center lg:flex-row">
          <div className="">
            <div className="h-[15px] w-[136px] bg-[#888DAA] rounded-md animate-pulse"></div>
            <div className="flex items-center gap-3">
              <div className="pt-1 flex items-center gap-2 relative">
                <div className="h-[15px] w-[200px] rounded-md bg-[#888DAA] animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center mt-6">
          <div className="h-[20px] w-[300px] bg-[#888DAA] rounded-md animate-pulse"></div>
        </div>
      </div> */}
    </div>
  );
};

export default UserProfileHeaderSkeleton;
