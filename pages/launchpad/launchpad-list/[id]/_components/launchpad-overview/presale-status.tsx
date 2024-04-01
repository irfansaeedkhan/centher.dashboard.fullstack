import React from "react";
import { PresaleDataType } from "../../../_components/launchpad-card-data";
import { formatUnits } from "viem";

interface PresaleDataProps extends PresaleDataType {
  token_name: string;
  token_symbol: string;
  website: string;
  description: string;
  currentRound: number;
}

export const PresaleStatus: React.FC<PresaleDataProps> = ({
  minTokensToSell,
  maxTokensToSell,
  token_symbol,
  roundInfos,
  fundType,
  currentRound,
}) => {
  const purchasesThrough = fundType === 0 ? "BNB" : "USDT";

  const roundDetails = roundInfos[currentRound - 1];

  return (
    <>
      {" "}
      {currentRound >= 0 ? (
        <div className="col-span-1 h-auto w-full rounded-xl bg-black-shade-9 p-4 fxm:p-6">
          <div className="flex flex-col gap-4">
            <div className={mainDiv}>
              <div className={textLeft}>Presale Status</div>
              <div className={textRight}>
                {" "}
                {currentRound >= 0 ? "Live" : "Upcoming"}
              </div>
            </div>
            <div className={mainDiv}>
              <div className={textLeft}>Minimum Buy</div>
              <div className={textRight}>
                {formatUnits(BigInt(roundDetails.minContribution), 18)}{" "}
                {purchasesThrough}
              </div>
            </div>
            <div className={mainDiv}>
              <div className={textLeft}>Maximum Buy</div>
              <div className={textRight}>
                {formatUnits(BigInt(roundDetails.maxContribution), 18)}{" "}
                {purchasesThrough}
              </div>
            </div>
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
