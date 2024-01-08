import React from "react";
import clsx from "clsx";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { LaunchpadDataType } from "./launchpad-card-data";

import { BNBIcon, USDTIcon } from "@/assets/svgs";

export const LaunchpadCard: React.FC<LaunchpadDataType> = ({
  token_name,
  token_symbol,
  start_date,
  end_date,
  status,
  launchpad_title,
  liquidity,
  lockup_time,
  soft_cap,
  currentPurchasesValue,
  fundType,
  progress,
}) => {
  return (
    <div className="col-span-1 h-auto w-full rounded-3xl border border-gray-shade-3">
      <div className="flex h-[calc(100%-138px)] flex-col gap-4 bg-transparent p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <h3 className="break-words text-base font-semibold text-white fxm:text-lg fsm:text-xl">
              {`${token_name} - ${token_symbol}`}
            </h3>
            <p className="text-xs text-gray-shade-14 fxm:text-sm">
              Fair Launch
            </p>
          </div>
          <div
            className={clsx(
              "flex h-[30px] items-center justify-center rounded-[10px] px-3 py-[3px] text-xs font-semibold",
              status === "live" && "bg-green-shade-1/[0.16] text-green-shade-1",
              status === "ended" && "bg-red-shade-1/[0.16] text-red-shade-1",
              status === "upcoming" &&
                "bg-brand-primary/[0.16] text-brand-primary"
            )}
          >
            {status === "live"
              ? "Sales Live"
              : status === "upcoming"
              ? "Upcoming"
              : "Sales Ended"}
          </div>
        </div>
        <div>
          <div className="mb-2 flex flex-col">
            <p className="text-sm leading-6 text-gray-shade-14">Soft</p>
            <p className="flex items-center gap-1 text-base font-semibold leading-8 text-white">
              <span className="size-4 flex-shrink-0">
                {fundType === "BNB" ? <BNBIcon /> : <USDTIcon />}
              </span>
              <span>
                {Number(soft_cap) / 1e18} {fundType}
              </span>
            </p>
            <p className="text-sm leading-6 text-gray-shade-14">
              Progress {`${progress} %`}
            </p>
          </div>
          <div
            className={clsx(
              "relative h-3 w-full overflow-hidden rounded-3xl",
              status === "live" && `bg-green-shade-1/[0.16]`,
              status === "upcoming" && `bg-brand-primary/[0.16]`,
              status === "ended" && `bg-red-shade-1/[0.16]`
            )}
          >
            <div
              style={{ width: `${Number(soft_cap) / 1e18}%` }}
              className={clsx(
                status === "live" && `bg-green-shade-1`,
                status === "upcoming" && `bg-brand-primary`,
                status === "ended" && `bg-red-shade-1`,
                `absolute top-0 z-50 h-3 rounded-3xl`
              )}
            ></div>
          </div>
          <div className="mt-1">
            <div className="flex items-center justify-between gap-3 text-sm leading-6 text-gray-shade-14">
              <p>
                {Number(currentPurchasesValue) / 1e18} {fundType}
              </p>
              <p>
                {Number(soft_cap) / 1e18} {fundType}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {/* <div className="flex w-full items-center justify-between gap-3">
            <p className="text-sm text-gray-shade-14">Liquidity %:</p>
            <p className="text-sm font-medium text-white">{liquidity}%</p>
          </div> */}
          <div className="flex w-full items-center justify-between gap-3">
            <p className="text-sm text-gray-shade-14">Lockup Time %:</p>
            <p className="text-sm font-medium text-white">
              {Number(lockup_time) * 30} days
            </p>
          </div>
          <div className="flex w-full items-center justify-between gap-3">
            <p className="text-sm text-gray-shade-14">Rounds:</p>
            <p className="flex items-center gap-1 text-sm font-medium text-white">
              <div className="gradient-borders-2 relative flex h-[22px] w-8 cursor-pointer items-center justify-center rounded-3xl p-px">
                <span className="text-gradient-1 py-1 font-medium">1</span>
              </div>
              <div className="relative flex h-[22px] w-8 cursor-pointer items-center justify-center rounded-3xl border border-gray-shade-14 p-px">
                <span className="py-1 font-medium text-gray-shade-14">2</span>
              </div>
              <div className="relative flex h-[22px] w-8 cursor-pointer items-center justify-center rounded-3xl border border-gray-shade-14 p-px">
                <span className="py-1 font-medium text-gray-shade-14">3</span>
              </div>
            </p>
          </div>
        </div>
      </div>
      <div className="flex h-[138px] flex-col items-center gap-4 rounded-b-3xl bg-gray-shade-24 p-5">
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm text-gray-shade-14">
            {status === "live"
              ? "Sale ends in:"
              : status === "upcoming"
              ? "Sale starts in:"
              : "Sale already ended:"}
          </p>
          {status === "ended" ? (
            <p className={textActive}>--</p>
          ) : (
            <Countdown
              date={
                (status === "live" && end_date ? end_date : new Date()) ||
                (status === "upcoming" && start_date ? start_date : new Date())
              }
              renderer={countdownRenderer}
            />
          )}
        </div>
        <div className="gradient-borders-2 relative flex h-10 w-full cursor-pointer items-center justify-center rounded-3xl p-px">
          <span className="text-gradient-1 py-2 font-medium">View</span>
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
    <div className="flex">
      <h6 className={textActive}>{days}:</h6>
      <h6 className={textActive}>{hours}:</h6>
      <h6 className={textActive}>{minutes}:</h6>
      <h6 className={textActive}>{seconds}</h6>
    </div>
  );
};

const textActive = "text-sm font-semibold text-white";
