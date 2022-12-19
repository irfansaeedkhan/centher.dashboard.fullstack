import React from "react";

const SingleNetworkDownline = () => {
  return (
    <div className="h-[228px] w-full f2xl:w-[368px] f2xl:max-w-[368px] fxl:w-[317px] fxl:max-w-[368px] flg:w-[315px] flg:max-w-[368px] fmd:w-[352px] fsm:w-[256px] flex-grow bg-elevation-1 py-6 rounded-xl">
      <div className="px-6 pb-4 flex justify-between items-center gap-10 text-sm font-semibold leading-6 border-b border-gray-shade-3">
        <p className="text-gray-shade-7">FIRST LEVEL</p>
        <p className="text-brand-primary">6%</p>
      </div>
      <div className="mt-2 space-y-3 px-6">
        <div className="flex justify-between items-center gap-10 text-sm font-semibold text-white leading-6">
          <p>200</p>
          <p>Members</p>
        </div>
        <div className="flex justify-between items-center gap-10 text-sm font-semibold text-white leading-6">
          <p>20</p>
          <p>BNB</p>
        </div>
        <div className="flex justify-between items-center gap-10 text-sm font-semibold text-white leading-6">
          <p>300</p>
          <p>BUSD</p>
        </div>
        <div className="flex justify-between items-center gap-10 text-sm font-semibold text-white leading-6">
          <p>500</p>
          <p>NTR</p>
        </div>
      </div>
    </div>
  );
};

export default SingleNetworkDownline;
