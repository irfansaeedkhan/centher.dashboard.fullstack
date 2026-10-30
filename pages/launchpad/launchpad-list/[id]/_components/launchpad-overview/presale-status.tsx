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
  roundInfos,
  fundType,
  currentRound,
}) => {
  const purchasesThrough = fundType === 0 ? "BNB" : "USDT";

  const roundDetails = roundInfos[currentRound - 1];

  // Portfolio-library fix (Sociaket item 3): the backend has no min/max
  // buy values, so the adapter passes empty strings. An empty (or
  // unparseable) value is genuinely unknown — render "Not available",
  // never a misleading 0 or a soft-cap-derived tiny maximum buy.
  // BigInt("") throws, so guard before parsing.
  const formatBuyLimit = (value: string | undefined): string | null => {
    if (!value) return null;
    try {
      return formatUnits(BigInt(value), 18);
    } catch {
      return null;
    }
  };

  if (currentRound < 0 || !roundDetails) return null;

  const minBuy = formatBuyLimit(roundDetails.minContribution);
  const maxBuy = formatBuyLimit(roundDetails.maxContribution);

  return (
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
            {minBuy === null ? (
              "Not available"
            ) : (
              <>
                {minBuy} {purchasesThrough}
              </>
            )}
          </div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Maximum Buy</div>
          <div className={textRight}>
            {maxBuy === null ? (
              "Not available"
            ) : (
              <>
                {maxBuy} {purchasesThrough}
              </>
            )}
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
