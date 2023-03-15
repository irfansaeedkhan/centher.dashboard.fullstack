import React, { useEffect, useState } from "react";

import { getUTCNow } from "@/web3/utils/utils";

interface TimelineTotalProps {
  title1: string;
  title2: string;
  endTime: number;
}

const TimelineTotal: React.FC<TimelineTotalProps> = ({
  title1,
  title2,
  endTime,
}) => {
  const nowTime = Date.now() / 1000;

  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  useEffect(() => {
    let timeRemaining = 0;
    const _now = getUTCNow();

    timeRemaining = endTime * 1000 - getUTCNow();
    if (timeRemaining > 0) setCountdownFor(timeRemaining);

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
  }, [endTime]);

  const setCountdownFor = (deadline: number) => {
    const _days = Math.floor(deadline / (1000 * 60 * 60 * 24));
    const _hours = Math.floor((deadline / (1000 * 60 * 60)) % 24);
    const _minutes = Math.floor((deadline / 1000 / 60) % 60);
    const _seconds = Math.floor((deadline / 1000) % 60);

    setDays(_days <= 0 ? "00" : _days.toString());
    setHours(_hours <= 0 ? "00" : _hours.toString());
    setMinutes(_minutes <= 0 ? "00" : _minutes.toString());
    setSeconds(_seconds <= 0 ? "00" : _seconds.toString());
  };

  return (
    <div className="flex w-full items-center gap-4">
      <div
        className={`!h-11 !min-w-[44px] rounded-full border-[12px] ${
          nowTime > endTime ? "border-yellow-shade-1" : "border-gray-shade-2"
        }`}
      ></div>
      <div className="scrollSetLight2 flex h-[88px] max-w-full flex-grow justify-between gap-10 overflow-x-auto rounded-[14px] bg-elevation-1 py-5 px-6 ">
        <div className="min-w-[350px]">
          <h4 className="font-semibold text-white">
            {nowTime < endTime ? title1 : title2}
          </h4>
        </div>
        {nowTime < endTime && (
          <div className="flex !w-[160px] gap-4">
            <div className="flex flex-col items-center">
              <h4 className="font-semibold text-white">{days}</h4>
              <p className="text-xs font-bold text-gray-shade-7">Days</p>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="font-semibold text-white">{hours}</h4>
              <p className="text-xs font-bold text-gray-shade-7">Hrs</p>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="font-semibold text-white">{minutes}</h4>
              <p className="text-xs font-bold text-gray-shade-7">Min</p>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="font-semibold text-white">{seconds}</h4>
              <p className="text-xs font-bold text-gray-shade-7">Sec</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineTotal;
