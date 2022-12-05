import React, { useState, useEffect } from "react";

import { getUTCNow } from "@/web3/utils/utils";
import { RoundInfo, RoundStatus } from "@/web3/constants/types";

interface TimeCountProps {
  roundInfo: RoundInfo;
  roundStatus: RoundStatus;
  currentRound: number;
}

export const TimeCount: React.FC<TimeCountProps> = ({
  roundInfo,
  roundStatus,
  currentRound,
}) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timeRemaining = 0;
    if (!roundStatus || roundStatus === "ended") return;

    console.log("useEffect runs");
    if (roundStatus === "not-started") {
      // Calculate time remaining until round starts
      timeRemaining = roundInfo.startTime * 1000 - getUTCNow();
      setCountdownFor(timeRemaining);
    }

    if (roundStatus === "active") {
      // Calculate time remaining until round ends
      timeRemaining =
        roundInfo.startTime * 1000 + roundInfo.duration * 1000 - getUTCNow();
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
  }, [roundStatus, roundInfo]);

  const setCountdownFor = (deadline: number) => {
    const _days = Math.floor(deadline / (1000 * 60 * 60 * 24));
    const _hours = Math.floor((deadline / (1000 * 60 * 60)) % 24);
    const _minutes = Math.floor((deadline / 1000 / 60) % 60);
    const _seconds = Math.floor((deadline / 1000) % 60);

    setDays(_days);
    setHours(_hours);
    setMinutes(_minutes);
    setSeconds(_seconds);
  };

  return (
    <div>
      <div className="mb-4 text-14px text-brand-primary font-semibold text-center">
        {roundStatus === "not-started" && (
          <>Presale for round {currentRound} starts in</>
        )}
        {roundStatus === "active" && (
          <>
            The time remaining to participate in Presale Round{" "}
            {`(${currentRound})`}
          </>
        )}
      </div>

      <div className="timer flex items-center gap-8">
        <div className="box flex flex-col gap-2 items-center ">
          <div className="date bg-[#F3F4F7] border-white/25 rounded-xl f2xl:w-[80px] f2xl:h-[80px] sm:w-[60px] sm:h-[60px] flex items-center justify-center">
            <h1 className="text-black-shade-3 font-semibold text-34px">
              {days}
            </h1>
          </div>
          <p className="text-14px font-semibold text-gray-shade-7 ">Days</p>
        </div>
        <div className="box flex flex-col gap-2 items-center ">
          <div className="date bg-[#F3F4F7] border-white/25 rounded-xl f2xl:w-[80px] f2xl:h-[80px] sm:w-[60px] sm:h-[60px] flex items-center justify-center">
            <h1 className="text-black-shade-3 font-semibold text-34px">
              {hours}
            </h1>
          </div>
          <p className="text-14px font-semibold text-gray-shade-7 ">Hours</p>
        </div>
        <div className="box flex flex-col gap-2 items-center ">
          <div className="date bg-[#F3F4F7] border-white/25 rounded-xl f2xl:w-[80px] f2xl:h-[80px] sm:w-[60px] sm:h-[60px] flex items-center justify-center">
            <h1 className="text-black-shade-3 font-semibold text-34px">
              {minutes}
            </h1>
          </div>
          <p className="text-14px font-semibold text-gray-shade-7 ">Minutes</p>
        </div>
        <div className="box flex flex-col gap-2 items-center ">
          <div className="date bg-[#F3F4F7] border-white/25 rounded-xl f2xl:w-[80px] f2xl:h-[80px] sm:w-[60px] sm:h-[60px] flex items-center justify-center">
            <h1 className="text-black-shade-3 font-semibold text-34px">
              {seconds}
            </h1>
          </div>
          <p className="text-14px font-semibold text-gray-shade-7 ">Seconds</p>
        </div>
      </div>
    </div>
  );
};
