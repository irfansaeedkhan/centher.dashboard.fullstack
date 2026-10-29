import React from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { BNBIcon, USDTIcon } from "@/assets/svgs";
import { LaunchpadDataType } from "./launchpad-card-data";
import { AppRoutes } from "@/constants/app.routes";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
export const LaunchpadCard: React.FC<LaunchpadDataType> = ({
  id,
  token_name,
  token_symbol,
  start_date,
  end_date,
  status,
  lockup_time,
  soft_cap,
  currentPurchasesValue,
  fundType,
  progress,
  currentRound,
}) => {
  const router = useRouter();
  // QA-fix round 2: start_date/end_date can be Invalid Date (truthy!) when the
  // API row lacks a timestamp — new Date(undefined) is truthy but invalid, and
  // <Countdown> then renders 0:0:0:0. Validate before rendering any countdown.
  const rawTargetDate =
    status === "upcoming"
      ? start_date
      : status === "live"
      ? end_date
      : undefined;
  const targetDate =
    rawTargetDate instanceof Date && !isNaN(rawTargetDate.getTime())
      ? rawTargetDate
      : undefined;
  // Portfolio-library fix (Centher item 3): the REST API returns raised /
  // soft_cap as plain numbers (e.g. "320000.00"), NOT wei. The old card
  // divided them by 1e18 (rendering ~0) and showed the "Soft" row from
  // minTokensToSell, which the list mapping hardcodes to 0. Render the
  // plain-unit values directly.
  const plainNumber = (value: unknown): string => {
    const n = Number(
      typeof value === "object" && value !== null && "toString" in value
        ? value.toString()
        : value
    );
    return Number.isFinite(n) ? String(Math.floor(n)) : "—";
  };
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
              "flex h-[30px] flex-shrink-0 items-center justify-center rounded-[10px] px-3 py-[3px] text-xs font-semibold",
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
                {plainNumber(soft_cap)} {fundType}
              </span>
            </p>
            <p className="text-sm leading-6 text-gray-shade-14">
              Progress {`${Number(progress).toFixed(2)} %`}
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
              style={{ width: `${progress}%` }}
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
                {plainNumber(currentPurchasesValue)} {fundType}
              </p>
              <p>
                {plainNumber(soft_cap)} {fundType}
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
            <p className="text-sm text-gray-shade-14">Lockup Time:</p>
            <p className="text-sm font-medium text-white">
              {/* QA-fix: lockup_time can be "-" (unknown) — never render NaN. */}
              {Number.isFinite(Number(lockup_time))
                ? `${Number(lockup_time) * 30} days`
                : "—"}
            </p>
          </div>
          <div className="flex w-full items-center justify-between gap-3">
            <p className="text-sm text-gray-shade-14">Rounds:</p>
            <p className="flex items-center gap-1 text-sm font-medium text-white">
              <span
                className={clsx(
                  currentRound === 1 ? gradientRoundMain : simpleRoundMain
                )}
              >
                <span
                  className={clsx(
                    currentRound === 1 ? gradientRoundInner : simpleRoundInner
                  )}
                >
                  1
                </span>
              </span>
              <span
                className={clsx(
                  currentRound === 2 ? gradientRoundMain : simpleRoundMain
                )}
              >
                <span
                  className={clsx(
                    currentRound === 2 ? gradientRoundInner : simpleRoundInner
                  )}
                >
                  2
                </span>
              </span>
              <span
                className={clsx(
                  currentRound === 3 ? gradientRoundMain : simpleRoundMain
                )}
              >
                <span
                  className={clsx(
                    currentRound === 3 ? gradientRoundInner : simpleRoundInner
                  )}
                >
                  3
                </span>
              </span>
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
          {status === "ended" || !targetDate ? (
            // QA-fix: no valid target date — never render a 0:0:0:0 countdown.
            <p className={textActive}>--</p>
          ) : (
            <Countdown date={targetDate} renderer={countdownRenderer} />
          )}
        </div>
        <div
          onClick={() => {
            router.push(
              `${AppRoutes.launchpad.launchpad_list.index}/${id}?list_type=launchpad_overview`
            );
          }}
          className="gradient-borders-div relative flex h-10 w-full cursor-pointer items-center justify-center !rounded-[10px] p-px"
        >
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
  completed,
}) => {
  // Portfolio-library fix (Centher item 3): a target date in the past
  // (e.g. an upcoming card whose start_date is the creation timestamp)
  // used to render a misleading 0:0:0:0 countdown. A finished countdown
  // has no target to count to, so render the unavailable marker instead.
  if (completed) {
    return <p className={textActive}>—</p>;
  }
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

const gradientRoundMain =
  "gradient-borders-div relative flex h-[22px] w-8 cursor-pointer items-center justify-center rounded-3xl p-px";
const gradientRoundInner = "text-gradient-1 py-1 font-medium";
const simpleRoundMain =
  "relative flex h-[22px] w-8 cursor-pointer items-center justify-center rounded-3xl border border-gray-shade-14 p-px";
const simpleRoundInner = "py-1 font-medium text-gray-shade-14";
