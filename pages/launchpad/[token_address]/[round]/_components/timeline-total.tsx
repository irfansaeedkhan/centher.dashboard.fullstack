import React from "react";
import Countdown, { CountdownRendererFn } from "react-countdown";

interface TimelineTotalProps {
  title1: string;
  title2: string;
  endTime: number;
}

export const TimelineTotal: React.FC<TimelineTotalProps> = ({
  title1,
  title2,
  endTime,
}) => {
  const nowTime = Date.now() / 1000;

  return (
    <div className="flex w-full items-center gap-4">
      <div
        className={`!h-11 !min-w-[44px] rounded-full border-[12px] ${
          nowTime > endTime ? "border-gray-shade-16" : "border-gray-shade-12"
        }`}
      ></div>
      <div className="scrollSetLight2 gradient-border-3 flex h-[88px] max-w-full flex-grow items-center justify-between gap-10 overflow-x-auto rounded-[14px] bg-elevation-1 p-[2px] ">
        <div className="min-w-[350px] pl-6">
          <h4 className="font-semibold text-white">
            {nowTime < endTime ? title1 : title2}
          </h4>
          <p className="mt-[6px] text-sm text-gray-shade-14">
            DXC tokens will be released 12% monthly.
          </p>
        </div>
        <Countdown
          date={new Date(endTime * 1000)}
          renderer={countdownRenderer}
        />
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
    <div className="mr-6 flex !w-[160px] gap-4">
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
  );
};
