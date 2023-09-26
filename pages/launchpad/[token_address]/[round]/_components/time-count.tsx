import React from "react";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { RoundInfo } from "@/web3/constants/types";

interface TimeCountProps {
  roundInfo: RoundInfo;
}

export const TimeCount: React.FC<TimeCountProps> = ({ roundInfo }) => {
  let startTime = roundInfo?.startTime;
  return (
    <div>
      <div className="mb-4 flex flex-col items-start text-xs font-semibold text-white fsm:text-sm">
        {roundInfo?.status === "not-started" && (
          <>Presale for round {roundInfo.round + 1} starts in</>
        )}
        <p className="textGradient mb-2">
          The time remaining to participate in Presale Round
        </p>

        <Countdown
          date={new Date(startTime * 1000)}
          renderer={countdownRenderer}
        />
      </div>
    </div>
  );
};

interface SingleUnitBoxProps {
  value: number;
  unit: string;
}

const SingleUnitBox: React.FC<SingleUnitBoxProps> = ({ value, unit }) => {
  return (
    <div className={"box flex flex-col items-center gap-2"}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border-white/25 bg-[#F3F4F7] fsm:h-10 fsm:w-10 flg:h-12 flg:w-12 f2xl:h-[60px] f2xl:w-[60px]">
        <h1 className="text-xl font-semibold text-black-shade-3 fsm:text-xl flg:text-[24px]">
          {value}
        </h1>
      </div>
      <p className="fsm:text-14px text-[10px] font-semibold text-gray-shade-7 ">
        {unit}
      </p>
    </div>
  );
};

// Countdown Renderer
const countdownRenderer: CountdownRendererFn = ({
  days,
  hours,
  minutes,
  seconds,
}) => {
  return (
    <div className="timer flex items-center justify-center gap-5 fsm:gap-8">
      <SingleUnitBox value={days} unit="Days" />
      <SingleUnitBox value={hours} unit="Hours" />
      <SingleUnitBox value={minutes} unit="Minutes" />
      <SingleUnitBox value={seconds} unit="Seconds" />
    </div>
  );
};
