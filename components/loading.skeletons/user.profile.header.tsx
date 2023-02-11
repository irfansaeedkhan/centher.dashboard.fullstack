import React from "react";

const UserProfileHeaderSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl bg-[#131314]">
      {/* cover card */}
      <div>
        <div className="relative h-[25vh] w-full animate-pulse rounded-t-xl bg-[#3C3F4A] bg-cover bg-center bg-no-repeat">
          {/* profile image , user display name , icons , edit profile */}
          <div className="absolute left-[50%] -bottom-12 translate-x-[-50%] cursor-pointer">
            <div className="h-[112px] w-[111px] animate-pulse rounded-full border-2 border-[#2A2D3C] bg-[#3C3F4A] object-cover"></div>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-5">
        <div className="flex items-center justify-center">
          <div className="h-[15px] w-[180px] animate-pulse items-end rounded-md bg-[#3C3F4A]"></div>
        </div>

        <div className="flex items-center justify-center">
          <div className="h-[15px] w-[120px] animate-pulse rounded-md bg-[#3C3F4A]"></div>
        </div>

        <div className="mb-6 flex items-center justify-center">
          <div className="h-[35px] w-[250px] animate-pulse rounded-md bg-[#3C3F4A]"></div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeaderSkeleton;
