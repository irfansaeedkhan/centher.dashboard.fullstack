import React, { HTMLAttributes } from "react";
import clsx from "clsx";

import { RoundInfo } from "@/web3/constants/types";
import { BUSDIconBG, CentherIconBG } from "@/assets/svgs";

import { truncateTokenAmount } from "../shared";
import Arrow from "./arrow.svg";

interface Props {
  roundInfo: RoundInfo;
}

export const RoundStats: React.FC<Props> = ({ roundInfo }) => {
  return (
    <div className="flex flex-col justify-center gap-5 rounded-xl bg-elevation-1 p-2 fsm:flex-row fmd:gap-8">
      <div className="relative flex w-full max-w-full gap-x-4 md:max-w-[300px]">
        <Arrow className="relative top-[16%] hidden md:block" />
        <AmountCard
          icon={<BUSDIconBG className="h-10 w-10" />}
          title="BUSD Raised Amount"
          amount={roundInfo.busdRaised}
          tokenName="BUSD"
        />
      </div>
      <div className="relative flex w-full max-w-full gap-x-4 md:max-w-[300px]">
        <AmountCard
          icon={<CentherIconBG className="h-10 w-10" />}
          title="CTHR To Be Distributed"
          amount={
            roundInfo.priceForBusd !== 0
              ? roundInfo.busdRaised / roundInfo.priceForBusd
              : 0
          }
          tokenName="CTHR"
        />
        {/* Flip the arrow vertically */}
        <Arrow className="relative top-[16%] hidden -scale-x-100 transform md:block" />
      </div>
    </div>
  );
};

interface AmountCardProps extends HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  amount: number;
  tokenName: "BUSD" | "CTHR";
}

const AmountCard: React.FC<AmountCardProps> = ({
  icon,
  title,
  amount,
  tokenName,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "flex w-full max-w-full gap-x-4 rounded-xl bg-elevation-3 px-3 py-2.5 md:max-w-[245px]",
        className
      )}
      {...props}
    >
      {/* Icon */}
      {icon}

      {/* Data */}
      <div>
        <div className="text-sm font-normal text-gray-shade-7">{title}</div>
        <div
          className="mt-0.5 text-sm font-semibold text-white"
          title={`${amount.toString()} ${tokenName}`}
        >
          <span>{truncateTokenAmount(amount, 9999999999999)}</span>{" "}
          <span>{tokenName}</span>
        </div>
      </div>
    </div>
  );
};

export default AmountCard;
