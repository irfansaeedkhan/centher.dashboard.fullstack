import React, { useState, useEffect } from "react";
import { RoundInfo, RoundState, RoundStatus } from "@/web3/constants/types";

import { TimeCount } from "./time.count";

interface PresaleCardProps {
  currentRound: number;
  roundInfo: RoundInfo;
  roundStatus: RoundStatus;
}

export const PresaleCard: React.FC<PresaleCardProps> = ({
  roundStatus,
  roundInfo,
  currentRound,
}) => {
  return (
    <div
      className={`bg-no-repeat bg-top bg-buydao-pattern rounded-2xl bg-background-shade-1 p-8 flg:p-14 bg-cover`}
    >
      <div
        className={`content flex flex-col flg:flex-row items-center justify-between gap-8`}
      >
        <div className="max-w-[404px]">
          <h1 className={`text-24px text-white font-semibold pb-2.5`}>
            Join with BUSD or NTR to Claim Your NTRDAO
          </h1>
          <div className="flex gap-x-2">
            <div
              className={`text-14px font-bold text-white rounded-xl bg-white/20 backdrop-blur-lg py-1 px-2.5 border border-solid border-white/20`}
            >
              1 BUSD = 40 NTRDAO
            </div>
            <div
              className={`text-14px font-bold text-white rounded-xl bg-white/20 backdrop-blur-lg py-1 px-2.5 border border-solid border-white/20`}
            >
              1 NTR = 1 NTRDAO
            </div>
          </div>
        </div>

        <TimeCount
          roundInfo={roundInfo}
          roundStatus={roundStatus}
          currentRound={currentRound}
        />
      </div>
    </div>
  );
};
