import React from "react";

const NftCollectionProfileSkeleton = () => {
  return (
    <div className="bg-[#131314]">
      {/* cover card */}
      <div className="rounded-md">
        <div className="relative h-[25vh] w-full animate-pulse rounded-md bg-[#3C3F4A] bg-cover bg-center bg-no-repeat">
          {/* profile image , user display name , icons , edit profile */}
          <div className="absolute left-[1%] -bottom-12 cursor-pointer">
            <div className="h-[112px] w-[111px] animate-pulse rounded-md border-2 border-[#2A2D3C] bg-[#3C3F4A] object-cover"></div>
          </div>
        </div>
      </div>

      <div className="mt-20 mb-5 flex flex-col gap-5 pl-5">
        <div className="h-[15px] w-[180px] animate-pulse items-end rounded-md bg-[#3C3F4A]"></div>

        <div className="h-[15px] w-[120px] animate-pulse rounded-md bg-[#3C3F4A]"></div>

        <div className="h-[25px] w-[250px] animate-pulse rounded-md bg-[#3C3F4A]"></div>
      </div>
    </div>
  );
};

export default NftCollectionProfileSkeleton;
