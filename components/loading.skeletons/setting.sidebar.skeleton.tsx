import React from "react";

const SettingSidebarSkeleton = () => {
  return (
    <>
      <div className="mb-2 flex h-[290px] w-[250px] rounded-[20px] bg-[#131314] p-[25px]">
        <div>
          <div className="mb-6 h-[40px] w-[200px] animate-pulse items-center justify-center rounded-10px bg-[#3C3F4A]"></div>
          <div className="mb-6 h-[40px] w-[200px] animate-pulse items-center justify-center rounded-10px bg-[#3C3F4A]"></div>
          <div className="mb-6 h-[40px] w-[200px] animate-pulse items-center justify-center rounded-10px bg-[#3C3F4A]"></div>
          <div className="mb-6 h-[40px] w-[200px] animate-pulse items-center justify-center rounded-10px bg-[#3C3F4A]"></div>
        </div>
      </div>
    </>
  );
};

export default SettingSidebarSkeleton;
