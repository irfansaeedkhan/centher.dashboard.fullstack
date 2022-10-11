import React, { useState, useEffect } from "react";

import { getUTCNow } from "@/web3/utils/utils";
import { RoundInfo, RoundState } from "@/web3/constants/types";

interface TimeCountProps {
  deadline: number;
}

export const TimeCount: React.FC<TimeCountProps> = ({ deadline }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    getTimeUntil(deadline);
    setInterval(() => getTimeUntil(deadline), 1000);
  });
  const getTimeUntil = (deadline: number) => {
    const time = deadline * 1000 - getUTCNow();
    if (time < 0) {
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    } else {
      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / 1000 / 60) % 60);
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
      const days = Math.floor(time / (1000 * 60 * 60 * 24));
      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    }
  };

  return (
    <div className="timer flex items-center gap-8">
      <div className="box flex flex-col gap-2 items-center ">
        <div className="date bg-[#F3F4F7] border-white/25 rounded-xl xl:w-[80px] xl:h-[80px] sm:w-[60px] sm:h-[60px] flex items-center justify-center">
          <h1 className="text-black-shade-3 font-semibold text-34px">{days}</h1>
        </div>
        <p className="text-14px font-semibold text-gray-shade-7 ">Days</p>
      </div>
      <div className="box flex flex-col gap-2 items-center ">
        <div className="date bg-[#F3F4F7] border-white/25 rounded-xl xl:w-[80px] xl:h-[80px] sm:w-[60px] sm:h-[60px] flex items-center justify-center">
          <h1 className="text-black-shade-3 font-semibold text-34px">
            {hours}
          </h1>
        </div>
        <p className="text-14px font-semibold text-gray-shade-7 ">Hours</p>
      </div>
      <div className="box flex flex-col gap-2 items-center ">
        <div className="date bg-[#F3F4F7] border-white/25 rounded-xl xl:w-[80px] xl:h-[80px] sm:w-[60px] sm:h-[60px] flex items-center justify-center">
          <h1 className="text-black-shade-3 font-semibold text-34px">
            {minutes}
          </h1>
        </div>
        <p className="text-14px font-semibold text-gray-shade-7 ">Minutes</p>
      </div>
      <div className="box flex flex-col gap-2 items-center ">
        <div className="date bg-[#F3F4F7] border-white/25 rounded-xl xl:w-[80px] xl:h-[80px] sm:w-[60px] sm:h-[60px] flex items-center justify-center">
          <h1 className="text-black-shade-3 font-semibold text-34px">
            {seconds}
          </h1>
        </div>
        <p className="text-14px font-semibold text-gray-shade-7 ">Seconds</p>
      </div>
    </div>
  );
};
