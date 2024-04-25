import React from "react";
import { PresaleDataType } from "../../../_components/launchpad-card-data";

export const ReferralsProgram: React.FC<PresaleDataType> = ({
  isRefSupport,
  levelOne,
  levelTwo,
  levelThree,
  levelFour,
  levelFive,
  levelSix,
}) => {
  const percents: number[] = [
    (+levelOne * 100) / 10000,
    (+levelTwo * 100) / 10000,
    (+levelThree * 100) / 10000,
    (+levelFour * 100) / 10000,
    (+levelFive * 100) / 10000,
    (+levelSix * 100) / 10000,
  ];
  return (
    <>
      {isRefSupport ? (
        <div className="col-span-1 flex h-auto w-full flex-col gap-6 rounded-xl bg-black-shade-9 p-4 fxm:p-6">
          <div className="flex flex-col gap-6">
            <div className="flex w-full items-center justify-between gap-4">
              <h2 className="text-sm font-medium leading-6 text-white">
                Referrals Program
              </h2>
              <span className="rounded-10px bg-brand-primary/[0.16] px-3 text-xs font-semibold leading-6 text-brand-primary">
                {Number(percents[0]) +
                  Number(percents[1]) +
                  Number(percents[2]) +
                  Number(percents[3]) +
                  Number(percents[4]) +
                  Number(percents[5])}{" "}
                %
              </span>
            </div>

            {percents.map((item, i) => {
              if (item > 0) {
                return (
                  <>
                    <div className={mainDiv}>
                      <div className={textLeft}>Level {i + 1}</div>
                      <div className={textRight}>{item}%</div>
                    </div>
                  </>
                );
              }
            })}
          </div>
        </div>
      ) : null}
    </>
  );
};

const mainDiv = "flex w-full items-center justify-between gap-3";
const textLeft = "text-sm font-medium text-gray-shade-14";
const textRight =
  "text-sm font-medium text-white flex flex-shrink-0 items-center gap-1";
