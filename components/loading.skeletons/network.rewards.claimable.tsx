import React from "react";

const ClaimableRewardsSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="w-full flex flex-col bg-[#131314] rounded-[14px]">
        <div className="w-full h-auto bg-[#131314] rounded-[14px] p-2">
          <div className="w-full fsm:h-[92px] h-[146px]  rounded-[14px] flex  bg-[#3C3F4A]  animate-pulse"></div>
        </div>
        <div className="py-6 flex flex-wrap gap-10 p-2 justify-center">
          <div className="w-[43%] f2xl:max-w-[338px] fxl:max-w-[288px] flg:max-w-[285px] fmd:max-w-[200px] fsm:max-w-[232px] max-w-[338px] bg-[#3C3F4A]  animate-pulse h-[73px] rounded-[14px]"></div>
          <div className="w-[43%] f2xl:max-w-[338px] fxl:max-w-[288px] flg:max-w-[285px] fmd:max-w-[200px] fsm:max-w-[232px] max-w-[338px] bg-[#3C3F4A]  animate-pulse h-[73px] rounded-[14px]"></div>
          <div className="w-[43%] f2xl:max-w-[338px] fxl:max-w-[288px] flg:max-w-[285px] fmd:max-w-[200px] fsm:max-w-[232px] max-w-[338px] bg-[#3C3F4A]  animate-pulse h-[73px] rounded-[14px]"></div>
          <div className="w-[43%] f2xl:max-w-[338px] fxl:max-w-[288px] flg:max-w-[285px] fmd:max-w-[200px] fsm:max-w-[232px] max-w-[338px] bg-[#3C3F4A]  animate-pulse h-[73px] rounded-[14px]"></div>
          <div className="w-[43%] f2xl:max-w-[338px] fxl:max-w-[288px] flg:max-w-[285px] fmd:max-w-[200px] fsm:max-w-[232px] max-w-[338px] bg-[#3C3F4A]  animate-pulse h-[73px] rounded-[14px]"></div>
          <div className="w-[43%] f2xl:max-w-[338px] fxl:max-w-[288px] flg:max-w-[285px] fmd:max-w-[200px] fsm:max-w-[232px] max-w-[338px] bg-[#3C3F4A]  animate-pulse h-[73px] rounded-[14px]"></div>
        </div>
      </div>
      {/* table */}
      <div className="w-full flex flex-col bg-[#131314] rounded-[14px]">
        <div className="w-full h-auto bg-[#131314] rounded-[14px] p-2">
          <div className="w-full h-[92px]  flex  bg-[#3C3F4A]  animate-pulse border-2 rounded-2xl border-gray-shade-3"></div>
          <div className="w-full h-[92px]  flex   animate-pulse border-b-2  border-gray-shade-3"></div>
          <div className="w-full h-[92px]  flex    animate-pulse border-b-2  border-gray-shade-3"></div>
          <div className="w-full h-[92px]  flex   animate-pulse border-b-2  border-gray-shade-3"></div>
          <div className="w-full h-[92px]  flex    animate-pulse border-b-2  border-gray-shade-3"></div>
        </div>
      </div>
    </div>
  );
};

export default ClaimableRewardsSkeleton;

// lightbackround with pulse :  bg-[#3C3F4A]  animate-pulse

// background dark :  bg-[#131314]
