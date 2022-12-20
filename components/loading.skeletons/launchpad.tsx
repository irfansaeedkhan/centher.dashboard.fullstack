import React from "react";

const Launchpad = () => {
  return (
    <div className="flex items-center justify-center max-w-[1000px] h-[256px] bg-slate-600 rounded-md">
      <div className="w-full grid flg:grid-cols-2 gap-4">
        <div>
          <div className="px-16">
            <div className="w-full max-w-[400px] h-[60px] bg-[#3C3F4A] rounded-md"></div>
            <div className="flex w-full mt-4 gap-2">
              <div className="w-full max-w-[150px] h-[30px] bg-[#3C3F4A] rounded-md"></div>
              <div className="w-full max-w-[150px] h-[30px] bg-[#3C3F4A] rounded-md"></div>
            </div>
          </div>
          {/* <div className="max-w-[400px] h-[60px] bg-[#3C3F4A] rounded-md"></div> */}
        </div>
        <div>
          <div className="w-full max-w-[300px] h-[20px] bg-[#3C3F4A] rounded-md"></div>
          <div className="flex mt-4 gap-5">
            <div className="w-full max-w-[80px] h-[80px] bg-[#3C3F4A] rounded-md"></div>
            <div className="w-full max-w-[80px] h-[80px] bg-[#3C3F4A] rounded-md"></div>
            <div className="w-full max-w-[80px] h-[80px] bg-[#3C3F4A] rounded-md"></div>
            <div className="w-full max-w-[80px] h-[80px] bg-[#3C3F4A] rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Launchpad;
