import React from "react";

import { RoundInfo } from "@/web3/constants/types";

import { TimeCount } from "./time.count";

interface PresaleCardProps {
  roundInfo: RoundInfo;
}

export const PresaleCard: React.FC<PresaleCardProps> = ({ roundInfo }) => {
  return (
    <div
      className={`bg-no-repeat bg-left-top bg-buydao-pattern rounded-2xl bg-background-shade-1 p-3.5 fsm:p-8 flg:p-14 bg-cover`}
    >
      <div
        className={`content flex flex-col flg:flex-row items-center justify-between gap-4 fsm:gap-8`}
      >
        <div className="max-w-[404px]">
          <h1
            className={`text-base fsm:text-xl flg:text-2xl text-center flg:text-left text-white font-semibold pb-2.5`}
          >
            Join with BUSD or NTR to Claim Your NTRDAO
          </h1>
          <div className="flex gap-x-2 justify-center flg:justify-start">
            <div
              className={`text-[10px] fsm:text-xs flg:text-sm text-white font-bold rounded-10px bg-white/20 backdrop-blur-lg py-1 px-2.5 border border-solid border-white/20`}
            >
              1 BUSD = {roundInfo.rateForBusd} NTRDAO
            </div>
            <div
              className={`text-[10px] fsm:text-xs flg:text-sm text-white font-bold rounded-10px bg-white/20 backdrop-blur-lg py-1 px-2.5 border border-solid border-white/20`}
            >
              1 NTR = {roundInfo.rateForNtr} NTRDAO
            </div>
          </div>
        </div>

        <TimeCount roundInfo={roundInfo} />
      </div>
    </div>
  );
};
