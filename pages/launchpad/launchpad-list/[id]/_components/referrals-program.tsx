import React from "react";
import { PresaleDataType } from "../../_components/launchpad-card-data";
import Countdown, { CountdownRendererFn } from "react-countdown";
import clsx from "clsx";

export const ReferralsProgram: React.FC<PresaleDataType> = ({}) => {
  return (
    <div className="flex h-auto w-full flex-col gap-6 rounded-xl bg-black-shade-9 p-4 fxm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex w-full items-center justify-between gap-4">
          <h2 className="text-sm font-medium leading-6 text-white">
            Referrals Program
          </h2>
          <span className="rounded-10px bg-brand-primary/[0.16] px-3 text-xs font-semibold leading-6 text-brand-primary">
            3%
          </span>
        </div>
        <Countdown
          date={new Date().getTime() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30 * 60}
          renderer={countdownRenderer}
        />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium leading-6 text-white">Bookings</h2>
        <div className="flex flex-col gap-2">
          <div
            className={clsx(
              "relative h-3 w-full overflow-hidden rounded-3xl",
              // status === "live" &&
              `bg-green-shade-1/[0.16]`
              // status === "upcoming" && `bg-brand-primary/[0.16]`,
              // status === "ended" && `bg-red-shade-1/[0.16]`
            )}
          >
            <div
              style={{ width: `20%` }}
              className={clsx(
                `absolute top-0 z-50 h-3 rounded-3xl`,
                // status === "live" &&
                `bg-green-shade-1`
                // status === "upcoming" && `bg-brand-primary`,
                // status === "ended" && `bg-red-shade-1`
              )}
            ></div>
          </div>
          <div className="flex items-center justify-between gap-3 text-xs font-medium text-gray-shade-14">
            <p>0 DXC</p>
            <p>100 DXC</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const countdownRenderer: CountdownRendererFn = ({
  days,
  hours,
  minutes,
  seconds,
}) => {
  return (
    <div className="bg-white-gradient flex items-center justify-center gap-4 rounded-2xl px-4 py-2">
      <p className="text-[11px] font-semibold text-gray-shade-24">
        The Presale will Start in
      </p>
      <div className="flex flex-shrink-0 items-center gap-4">
        <div className="flex flex-col items-center">
          <h6 className={textActive}>{days}</h6>
          <p className={textDays}>Days</p>
        </div>
        <div className="flex flex-col items-center">
          <h6 className={textActive}>{hours}</h6>
          <p className={textDays}>Hours</p>
        </div>
        <div className="flex flex-col items-center">
          <h6 className={textActive}>{minutes}</h6>
          <p className={textDays}>Min</p>
        </div>
        <div className="flex flex-col items-center">
          <h6 className={textActive}>{seconds}</h6>
          <p className={textDays}>Sec</p>
        </div>
      </div>
    </div>
  );
};

const textDays = "text-[8px] font-medium text-gray-shade-24";
const textActive = "text-xs font-semibold text-gray-shade-24";
