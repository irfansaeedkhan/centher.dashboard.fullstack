import React from "react";
import Countdown, { CountdownRendererFn } from "react-countdown";

interface Props {
  title: string;
  para: string;
  endTime: Date;
}

export const FirstLastTimeline: React.FC<Props> = ({
  title,
  para,
  endTime,
}) => {
  const nowTime = Date.now() / 1000;
  return (
    <div className="flex w-full items-center gap-4">
      <div
        className={`size-11 rounded-full border-[12px] ${
          Number(endTime) > nowTime
            ? "border-gray-shade-16"
            : "border-gray-shade-12"
        }`}
      ></div>
      <div className="rainbow-scroll gradient-border-3 flex h-[88px] max-w-full flex-grow items-center justify-between gap-10 overflow-x-auto rounded-[14px] bg-elevation-1 p-[2px] ">
        <div className="min-w-[360px] pl-6">
          <h4 className="font-semibold text-white">{title}</h4>
          <p className="mt-[6px] text-sm text-gray-shade-14">{para}</p>
        </div>
        <Countdown date={endTime} renderer={countdownRenderer} />
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
      <div className={mainClass}>
        <h4 className={titleClass}>{days}</h4>
        <p className={paraClass}>Days</p>
      </div>
      <div className={mainClass}>
        <h4 className={titleClass}>{hours}</h4>
        <p className={paraClass}>Hrs</p>
      </div>
      <div className={mainClass}>
        <h4 className={titleClass}>{minutes}</h4>
        <p className={paraClass}>Min</p>
      </div>
      <div className={mainClass}>
        <h4 className={titleClass}>{seconds}</h4>
        <p className={paraClass}>Sec</p>
      </div>
    </div>
  );
};

const mainClass = "flex flex-col items-center";
const titleClass = "font-semibold text-white text-base";
const paraClass = "text-sm text-gray-shade-7";
