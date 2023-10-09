import React from "react";
import Image from "next/image";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { RoundInfo } from "@/web3/constants/types";

interface TimeCountProps {
  roundInfo: RoundInfo;
}

export const TimeCount: React.FC<TimeCountProps> = ({ roundInfo }) => {
  let startTime = roundInfo?.startTime;
  let endTime = roundInfo?.endTime;
  // getCurrentTime
  let currentTime = Math.floor(Date.now() / 1000);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex flex-col items-center text-xs font-semibold text-white fsm:text-sm flg:items-start">
        {roundInfo?.status === "not-started" && (
          <>Presale for round {roundInfo.round + 1} starts in</>
        )}
        <p className="textGradient mb-2">
          The time remaining to{" "}
          {startTime <= currentTime ? "end" : "participate"} in Presale Round{" "}
          {roundInfo.round + 1}
        </p>

        <div className="relative mt-3 flex h-14 w-full max-w-[275px] items-center gap-2 px-3 ">
          <Image
            src={"/images/timer.png"}
            alt="timer"
            width={275}
            height={56}
            className="absolute left-0 top-0 m-auto fmd:inset-0 flg:max-w-full"
          />
          <Countdown
            date={
              startTime <= currentTime
                ? new Date(endTime * 1000)
                : new Date(startTime * 1000)
            }
            renderer={countdownRenderer}
          />
        </div>
      </div>
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
    <div className="mx-auto flex w-full justify-center gap-5">
      <div className="flex flex-col items-center">
        <h6 className="text-sm font-semibold text-white">{days}</h6>
        <p className="text-xs font-medium text-white">DAYS</p>
      </div>
      <div className="flex flex-col items-center">
        <h6 className="text-sm font-semibold text-white">{hours}</h6>
        <p className="text-xs font-medium text-white">HOURS</p>
      </div>
      <div className="flex flex-col items-center">
        <h6 className="text-sm font-semibold text-white">{minutes}</h6>
        <p className="text-xs font-medium text-white">MIN</p>
      </div>
      <div className="flex flex-col items-center">
        <h6 className="text-sm font-semibold text-white">{seconds}</h6>
        <p className="text-xs font-medium text-white">SEC</p>
      </div>
    </div>
  );
};
