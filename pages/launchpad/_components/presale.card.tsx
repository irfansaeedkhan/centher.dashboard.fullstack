import React from "react";

import { RoundInfo } from "@/web3/constants/types";

import { TimeCount } from "./time.count";

interface PresaleCardProps {
  roundInfo: RoundInfo;
}

export const PresaleCard: React.FC<PresaleCardProps> = ({ roundInfo }) => {
  return (
    <div
      className={`rounded-2xl bg-background-shade-1 bg-buydao-pattern bg-cover bg-left-top bg-no-repeat p-3.5 fsm:p-8 flg:p-14`}
    >
      <div
        className={`content flex flex-col items-center justify-between gap-4 fsm:gap-8 flg:flex-row`}
      >
        <div className="max-w-[380px]">
          <h1
            className={`pb-2.5 text-center text-base font-semibold text-white fsm:text-xl flg:text-left flg:text-2xl`}
          >
            Join with BUSD to Claim Your CTHR
          </h1>
          <div className="flex justify-center gap-x-2 flg:justify-start">
            <div
              className={`rounded-10px border border-solid border-white/20 bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-lg fsm:text-xs flg:text-sm`}
            >
              1 CTHR = {roundInfo.priceForBusd} BUSD
            </div>
          </div>
        </div>

        <TimeCount roundInfo={roundInfo} />
      </div>
    </div>
  );
};
