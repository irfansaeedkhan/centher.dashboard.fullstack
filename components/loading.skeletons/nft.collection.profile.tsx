import React from "react";

const NftCollectionProfileSkeleton = () => {
  return (
    <div className="bg-[#131314]">
      {/* cover card */}
      <div className="rounded-md">
        <div className="relative rounded-md bg-center bg-cover bg-no-repeat w-full h-[25vh] bg-[#3C3F4A] animate-pulse">
          {/* profile image , user display name , icons , edit profile */}
          <div className="cursor-pointer absolute left-[1%] -bottom-12">
            <div className="h-[112px] w-[111px] rounded-md object-cover bg-[#3C3F4A] border-2 border-[#2A2D3C] animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="mt-20 mb-5 pl-5 flex flex-col gap-5">
        <div className="h-[15px] items-end w-[180px] bg-[#3C3F4A] rounded-md animate-pulse"></div>

        <div className="h-[15px] w-[120px] bg-[#3C3F4A] rounded-md animate-pulse"></div>

        <div className="h-[25px] w-[250px] bg-[#3C3F4A] rounded-md animate-pulse"></div>
      </div>
    </div>
  );
};

export default NftCollectionProfileSkeleton;
