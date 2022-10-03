// React, Next, NPM Packages
import React, { FC } from "react";
import ctl from "@netlify/classnames-template-literals";
import { RoundInfo, RoundState } from "@/web3/constants/types";
import { useState } from "react";
import { useEffect } from "react";
import { TimeCount } from "./TimeCount";

interface PresaleCardProps {
  round: number;
  roundInfo: RoundInfo | null;
  roundState: RoundState;
}

export const PresaleCard: React.FC<PresaleCardProps> = ({
  round,
  roundInfo,
  roundState,
}) => {
  const [deadLineTime, setDeadLineTime] = useState(0);
  useEffect(() => {
    const getDeadlineTime = (roundInfo: RoundInfo) => {
      if (round < roundState) {
        setDeadLineTime(0);
      } else if (round == roundState) {
        setDeadLineTime(roundInfo?.startTime + roundInfo?.duration);
      } else {
        setDeadLineTime(roundInfo?.startTime);
      }
    };
    if (roundInfo) getDeadlineTime(roundInfo);
  }, [round, roundInfo, roundState]);
  return (
    <div className={presaleCardContainer}>
      <div className={timerContentContainer}>
        <div>
          <h1 className={timerTitle}>
            The time remaining to <br className="hidden lg:block" /> participate
            {`in Presale Round ${round + 1}`}
          </h1>
          <div className={timerSubTitleContainer}>
            <h2 className={timerSubTitle}>
              [1° Round ] Join in to this round to jet a{" "}
              <span className={timerSubTitleBold}>60% Token Bonus</span>
            </h2>
          </div>
        </div>
        <TimeCount deadline={deadLineTime} />
      </div>
    </div>
  );
};

// styling
const presaleCardContainer = ctl(`
bg-no-repeat bg-top bg-buydao-pattern rounded-2xl bg-background-shade-1 p-8 lg:p-14 bg-cover
`);
const timerContentContainer = ctl(`
content flex flex-col lg:flex-row items-center justify-between gap-8
`);
const timerTitle = ctl(`
text-24px text-white font-semibold pb-2.5
`);
const timerSubTitleContainer = ctl(`
blurbackground rounded-xl bg-white/30 backdrop-blur-sm py-1 px-2.5 border border-solid border-white/20
`);
const timerSubTitle = ctl(`
text-14px text-[#F6F7FA]
`);
const timerSubTitleBold = ctl(`
text-white font-semibold
`);
