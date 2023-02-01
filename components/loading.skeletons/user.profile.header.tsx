import React from "react";

const UserProfileHeaderSkeleton: React.FC = () => {
  return (
    <div className="bg-[#131314] rounded-xl">
      {/* cover card */}
      <div>
        <div className="relative rounded-t-xl bg-center bg-cover bg-no-repeat w-full h-[25vh] bg-[#3C3F4A] animate-pulse">
          {/* profile image , user display name , icons , edit profile */}
          <div className="cursor-pointer absolute left-[50%] translate-x-[-50%] -bottom-12">
            <div className="rounded-full h-[112px] w-[111px] object-cover bg-[#3C3F4A] border-2 border-[#2A2D3C] animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-5">
        <div className="flex justify-center items-center">
          <div className="h-[15px] items-end w-[180px] bg-[#3C3F4A] rounded-md animate-pulse"></div>
        </div>

        <div className="flex justify-center items-center">
          <div className="h-[15px] w-[120px] bg-[#3C3F4A] rounded-md animate-pulse"></div>
        </div>

        <div className="flex justify-center items-center mb-6">
          <div className="h-[35px] w-[250px] bg-[#3C3F4A] rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeaderSkeleton;
