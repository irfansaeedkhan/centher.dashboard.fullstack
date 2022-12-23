import React from "react";

const SingleNetworkDownline = ({ data }: any) => {
  const level =
    Number(data.level) === 1
      ? "First Level"
      : Number(data.level) === 2
      ? "Second Level"
      : Number(data.level) === 3
      ? "Third Level"
      : Number(data.level) === 4
      ? "Fourth Level"
      : Number(data.level) === 5
      ? "Fifth Level"
      : "Sixth Level";
  return (
    <div className="h-[228px] w-full f2xl:w-[364px] f2xl:max-w-[364px] fxl:w-[317px] fxl:max-w-[368px] flg:w-[315px] flg:max-w-[368px] fmd:w-[352px] fsm:w-[256px] flex-grow bg-elevation-1 py-6 rounded-xl">
      <div className="px-6 pb-4 flex justify-between items-center gap-10 text-sm font-semibold leading-6 border-b border-gray-shade-3">
        <p className="text-gray-shade-7">{level}</p>
        {/* <p className="text-brand-primary">{`${data.percent}%`}</p> */}

        <div
          className={`rounded-lg w-8 h-8 border-2 flex justify-center items-center
          ${data?.level === "01" && "border-[#FEBF32]/60 bg-[#FEBF32]/10"}
          ${data?.level === "02" && "border-[#D35DB9]/60 bg-[#D35DB9]/10"}
          ${data?.level === "03" && "border-[#45F0D1]/60 bg-[#45F0D1]/10"}
          ${data?.level === "04" && "border-[#B85FFF]/60 bg-[#B85FFF]/10"}
          ${data?.level === "05" && "border-[#A0ED8D]/60 bg-[#A0ED8D]/10"}
          ${data?.level === "06" && "border-[#5F97FF]/60 bg-[#5F97FF]/10"}
        `}
        >
          <h6
            className={`text-12px font-medium 
            ${data?.level === "01" && "text-[#FEBF32]"}
            ${data?.level === "02" && "text-[#D35DB9]"}
            ${data?.level === "03" && "text-[#45F0D1]"}
            ${data?.level === "04" && "text-[#B85FFF]"}
            ${data?.level === "05" && "text-[#A0ED8D]"}
            ${data?.level === "06" && "text-[#5F97FF]"}
            `}
          >
            {data?.percent}%
          </h6>
        </div>
      </div>
      <div className="mt-2 space-y-3 px-6">
        <div className="flex justify-between items-center gap-10 text-sm font-semibold text-white leading-6">
          <p>{data.people}</p>
          <p>People</p>
        </div>
        <div className="flex justify-between items-center gap-10 text-sm font-semibold text-white leading-6">
          <p>{data.generatedBNB}</p>
          <p>BNB</p>
        </div>
        <div className="flex justify-between items-center gap-10 text-sm font-semibold text-white leading-6">
          <p>{data.generatedBUSD}</p>
          <p>BUSD</p>
        </div>
        <div className="flex justify-between items-center gap-10 text-sm font-semibold text-white leading-6">
          <p>{data.generatedNTR}</p>
          <p>NTR</p>
        </div>
      </div>
    </div>
  );
};

export default SingleNetworkDownline;
