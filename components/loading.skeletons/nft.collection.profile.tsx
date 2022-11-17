import React from "react";

const NftCollectionProfileSkeleton = () => {
  return (
    <div>
      {/* cover card */}
      <div className="rounded-md">
        <div className="relative rounded-md bg-center bg-cover bg-no-repeat w-full h-[25vh] bg-[#888DAA] animate-pulse">
          {/* profile image , user display name , icons , edit profile */}
          <div className="cursor-pointer absolute left-[1%] -bottom-12">
            <div className="h-[112px] w-[111px] rounded-md object-cover bg-[#888DAA] border-2 border-[#2A2D3C] animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="mt-20 pl-5 flex flex-col gap-5">
        <div className="h-[15px] items-end w-[180px] bg-[#888DAA] rounded-md"></div>

        <div className="h-[15px] w-[120px] bg-[#888DAA] rounded-md"></div>

        <div className="h-[25px] w-[250px] bg-[#888DAA] rounded-md"></div>
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

export default NftCollectionProfileSkeleton;
