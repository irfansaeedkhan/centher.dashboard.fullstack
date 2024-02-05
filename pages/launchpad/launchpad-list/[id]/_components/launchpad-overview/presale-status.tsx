import React from "react";
import { PresaleDataType } from "../../../_components/launchpad-card-data";
import { formatUnits } from "viem";

interface PresaleDataProps extends PresaleDataType {
  token_name: string;
  token_symbol: string;
  website: string;
}

export const PresaleStatus: React.FC<PresaleDataProps> = ({
  minTokensToSell,
  maxTokensToSell,
  token_symbol,
}) => {
  return (
    <div className="col-span-1 h-auto w-full rounded-xl bg-black-shade-9 p-4 fxm:p-6">
      <div className="flex flex-col gap-4">
        <div className={mainDiv}>
          <div className={textLeft}>Presale Status</div>
          <div className={textRight}>Live</div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Minimum Buy</div>
          <div className={textRight}>
            {formatUnits(BigInt(minTokensToSell), 18)} {token_symbol}
          </div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Maximum Buy</div>
          <div className={textRight}>
            {formatUnits(BigInt(maxTokensToSell), 18)} {token_symbol}
          </div>
        </div>
      </div>
    </div>
  );
};

const mainDiv = "flex w-full items-center justify-between gap-3";
const textLeft = "text-sm font-medium text-gray-shade-14";
const textRight =
  "text-sm font-medium text-white flex flex-shrink-0 items-center gap-1";
