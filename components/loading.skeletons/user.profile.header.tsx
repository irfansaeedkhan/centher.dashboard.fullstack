import React from "react";

const UserProfileHeaderSkeleton = () => {
  return (
    <div>
      {/* cover card */}
      <div className="bg-background-shade-3  rounded-md">
        <div className="relative rounded-md bg-center bg-cover bg-no-repeat w-full h-[31vh] bg-gray-700 animate-pulse">
          {/* profile image , user display name , icons , edit profile */}
          <div className="cursor-pointer absolute left-6 -bottom-12">
            <div className="rounded-full h-[112px] w-[111px] object-cover bg-gray-700 border-2 border-background-shade-3 animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="mt-8 lg:mt-10 p-7">
        <div className="flex flex-col lg:flex-row items-baseline justify-between">
          <div>
            <div className="h-[15px] w-[136px] bg-gray-700 rounded-md animate-pulse"></div>
            <div className="flex items-center gap-3">
              <div className="pt-1 flex items-center gap-2 relative">
                <div className="h-[15px] w-[200px] rounded-md bg-gray-700 animate-pulse"></div>
              </div>
            </div>
          </div>
          {/* button */}
          <div className="mt-5 lg:mt-0 flex items-center justify-center gap-3 w-full rounded-md h-[40px] max-w-[157px] bg-gray-700 animate-pulse"></div>
        </div>
        {/* description */}
        <div className="mt-6">
          <div className="h-[20px] w-[300px] bg-gray-700 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeaderSkeleton;
