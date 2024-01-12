import React from "react";
import { PresaleDataType } from "../../_components/launchpad-card-data";
import clsx from "clsx";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { copyText } from "@/utils/copy.text";
import toast from "react-hot-toast";
import { GradientCopy } from "@/assets/svgs";
import dayjs from "dayjs";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { formatUnits } from "ethers/lib/utils";

interface PresaleDataProps extends PresaleDataType {
  token_name: string;
  token_symbol: string;
  website: string;
}

export const PresaleData: React.FC<PresaleDataProps> = ({
  token_name,
  token_symbol,
  token,
  website,
  roundInfos,
  maxTokensToSell,
  minTokensToSell,
}) => {
  return (
    <div className="flex h-auto w-full flex-col gap-6 rounded-xl bg-black-shade-9 p-4 fxm:p-6">
      <div className="flex w-full items-center justify-between gap-4">
        <h2 className="text-xl font-semibold leading-7 text-white">
          {token_name} Presale
        </h2>
        <span className="rounded-10px bg-brand-primary/[0.16] px-3 text-xs font-semibold leading-6 text-brand-primary">
          Upcoming
        </span>
      </div>
      <p className="text-sm font-medium text-gray-shade-14">
        At Dexagon we want to open the gates to the Virtual Life on the
        metaverse, revealing a new way of approaching the virtual world.
      </p>
      <div className="flex flex-col gap-4">
        <div className={mainDiv}>
          <div className={textLeft}>Token Name</div>
          <div className={textRight}>{token_name}</div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Token Address</div>
          <div className={clsx(textRight, "group")}>
            <span className="group-hover:textGradient">
              {sliceAccountAddress(token)}
            </span>
            <GradientCopy
              className="cursor-pointer"
              onClick={async () => {
                await copyText(token ?? "");
                toast.success("Token address copied!");
              }}
            />
          </div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Symbol</div>
          <div className={textRight}>{token_symbol}</div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Total supply</div>
          <div className={textRight}>
            {normalizeValue(formatUnits(maxTokensToSell, 18))}
          </div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Soft cap</div>
          <div className={textRight}>
            {normalizeValue(formatUnits(maxTokensToSell, 18))}
          </div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Hard cap</div>
          <div className={textRight}>
            {normalizeValue(formatUnits(maxTokensToSell, 18))}
          </div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Presale start time</div>
          <div className={textRight}>
            {dayjs(roundInfos[0].startTime).format("DD-MMM-YYYY HH:mm:A")}
          </div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Presale end time</div>
          <div className={textRight}>
            {dayjs(roundInfos[roundInfos.length - 1].endTime).format(
              "DD-MMM-YYYY HH:mm:A"
            )}
          </div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Liquidity lockup time</div>
          <div className={textRight}>
            {roundInfos[0].lockMonths}{" "}
            {roundInfos[0].lockMonths === "1" ? "Month" : "Months"}
          </div>
        </div>
        <div className={mainDiv}>
          <div className={textLeft}>Listing on</div>
          <div className={clsx(textRight, "text-gradient-1 cursor-pointer")}>
            {website}
          </div>
        </div>
      </div>
    </div>
  );
};

const mainDiv = "flex w-full items-center justify-between gap-3";
const textLeft = "text-sm font-medium text-gray-shade-14";
const textRight =
  "text-sm flex-shrink-0 font-medium text-white flex items-center gap-1";
