import React, { useState, useEffect } from "react";

import { getUTCNow } from "@/web3/utils/utils";
import { RoundInfo } from "@/web3/constants/types";

interface TimeCountProps {
  roundInfo: RoundInfo;
}

export const TimeCount: React.FC<TimeCountProps> = ({ roundInfo }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timeRemaining = 0;
    if (!roundInfo.status || roundInfo.status === "ended") return;

    if (roundInfo.status === "not-started") {
      // Calculate time remaining until round starts
      timeRemaining = roundInfo.startTime * 1000 - getUTCNow();
      setCountdownFor(timeRemaining);
    }

    if (roundInfo.status === "active") {
      // Calculate time remaining until round ends
      timeRemaining = roundInfo.endTime * 1000 - getUTCNow();
      setCountdownFor(timeRemaining);
    }

    const interval = setInterval(() => {
      if (timeRemaining > 1000) {
        timeRemaining -= 1000;
        setCountdownFor(timeRemaining);
      }

      if (timeRemaining <= 1000) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [roundInfo.status, roundInfo.startTime, roundInfo.endTime]);

  const setCountdownFor = (deadline: number) => {
    const _days = Math.floor(deadline / (1000 * 60 * 60 * 24));
    const _hours = Math.floor((deadline / (1000 * 60 * 60)) % 24);
    const _minutes = Math.floor((deadline / 1000 / 60) % 60);
    const _seconds = Math.floor((deadline / 1000) % 60);

    setDays(_days <= 0 ? 0 : _days);
    setHours(_hours <= 0 ? 0 : _hours);
    setMinutes(_minutes <= 0 ? 0 : _minutes);
    setSeconds(_seconds <= 0 ? 0 : _seconds);
  };

  return (
    <div>
      <div className="mb-4 text-center text-xs font-semibold text-brand-primary fsm:text-sm">
        {roundInfo.status === "not-started" && (
          <>Presale for round {roundInfo.round + 1} starts in</>
        )}
        {roundInfo.status === "active" && (
          <>
            The time remaining to participate in Presale Round{" "}
            {`(${roundInfo.round + 1})`}
          </>
        )}
      </div>

      <div className="timer flex items-center justify-center gap-5 fsm:gap-8">
        <SingleUnitBox value={days} unit="Days" />
        <SingleUnitBox value={hours} unit="Hours" />
        <SingleUnitBox value={minutes} unit="Minutes" />
        <SingleUnitBox value={seconds} unit="Seconds" />
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
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border-white/25 bg-[#F3F4F7] fsm:h-16 fsm:w-16 flg:h-20 flg:w-20 f2xl:h-[80px] f2xl:w-[80px]">
        <h1 className="text-xl font-semibold text-black-shade-3 fsm:text-2xl flg:text-[34px]">
          {value}
        </h1>
      </div>
      <p className="text-[10px] font-semibold text-gray-shade-7 fsm:text-sm ">
        {unit}
      </p>
    </div>
  );
};
