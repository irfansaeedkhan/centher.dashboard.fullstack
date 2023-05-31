import React from "react";
export const LevelParentCard = ({ parentData }: any) => {
  return (
    <div className="w-full rounded-t-lg  bg-background-shade-3  ">
      <div className="flex items-center justify-between gap-2 p-3 pb-5">
        <div className="flex flex-col gap-2">
          <h5 className="text-12px font-medium text-gray-shade-19">LEVEL</h5>
          <h6 className="text-14px font-semibold text-white-shade-1">
            {parentData?.level}
          </h6>
        </div>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg border-2
          ${parentData?.level === "01" && "border-[#FEBF32]/60 bg-[#FEBF32]/10"}
          ${parentData?.level === "02" && "border-[#D35DB9]/60 bg-[#D35DB9]/10"}
          ${parentData?.level === "03" && "border-[#45F0D1]/60 bg-[#45F0D1]/10"}
          ${parentData?.level === "04" && "border-[#B85FFF]/60 bg-[#B85FFF]/10"}
          ${parentData?.level === "05" && "border-[#A0ED8D]/60 bg-[#A0ED8D]/10"}
          ${parentData?.level === "06" && "border-[#5F97FF]/60 bg-[#5F97FF]/10"}
        `}
        >
          <h6
            className={`text-12px font-medium 
            ${parentData?.level === "01" && "text-[#FEBF32]"}
            ${parentData?.level === "02" && "text-[#D35DB9]"}
            ${parentData?.level === "03" && "text-[#45F0D1]"}
            ${parentData?.level === "04" && "text-[#B85FFF]"}
            ${parentData?.level === "05" && "text-[#A0ED8D]"}
            ${parentData?.level === "06" && "text-[#5F97FF]"}
            `}
          >
            {parentData?.percent}%
          </h6>
        </div>
      </div>
      <div className="flex justify-between gap-2 border-t-2 border-gray-shade-3 bg-background-shade-2 p-3 pb-4">
        <div className="flex flex-col gap-2">
          <h5 className="text-12px font-medium text-gray-shade-19">People</h5>
          <h6 className="text-14px font-semibold text-white-shade-1">
            {parentData?.people}
          </h6>
        </div>
        <div className="flex flex-col items-end  gap-2">
          <h5 className=" text-12px font-medium text-gray-shade-19 ">
            Total BUSD Generated
          </h5>
          <h6 className="text-14px font-semibold text-white-shade-1">
            {`${parentData?.generatedBUSD} BUSD`}
          </h6>
          {/* <h6 className="text-white-shade-1 text-14px font-semibold">
            {`${parentData?.generatedNTR} NTR`}
          </h6> */}
        </div>
      </div>
    </div>
  );
};
