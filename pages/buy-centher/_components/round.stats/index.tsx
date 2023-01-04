import React, { HTMLAttributes } from "react";
import clsx from "clsx";

import { RoundInfo } from "@/web3/constants/types";
import { BUSDIconBG, CentherIconBG } from "@/assets/svgs";

import Arrow from "./arrow.svg";

interface Props {
  roundInfo: RoundInfo;
}

export const RoundStats: React.FC<Props> = ({ roundInfo }) => {
  return (
    <div className="flex fsm:flex-row flex-col justify-center gap-5 fmd:gap-8 bg-elevation-1 p-2 rounded-xl">
      <div className="flex gap-x-4 relative w-full md:max-w-[300px] max-w-full">
        <Arrow className="relative top-[16%] md:block hidden" />
        <AmountCard
          icon={<BUSDIconBG className="w-10 h-10" />}
          title="BUSD Raised Amount"
          amount={`${roundInfo.busdRaised} BUSD`}
        />
      </div>
      <div className="flex gap-x-4 relative w-full md:max-w-[300px] max-w-full">
        <AmountCard
          icon={<CentherIconBG className="w-10 h-10" />}
          title="CTHR To Be Distributed"
          amount={`${roundInfo.busdRaised / roundInfo.priceForBusd} CTHR`}
        />
        {/* Flip the arrow vertically */}
        <Arrow className="relative top-[16%] transform -scale-x-100 md:block hidden" />
      </div>
    </div>
  );
};

interface AmountCardProps extends HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  amount: string;
}

const AmountCard: React.FC<AmountCardProps> = ({
  icon,
  title,
  amount,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "flex gap-x-4 bg-elevation-3 px-3 py-2.5 rounded-xl w-full md:max-w-[245px] max-w-full",
        className
      )}
      {...props}
    >
      {/* Icon */}
      {icon}

      {/* Data */}
      <div>
        <div className="text-sm font-normal text-gray-shade-7">{title}</div>
        <div className="text-sm font-semibold text-white mt-0.5">{amount}</div>
      </div>
    </div>
  );
};

export default AmountCard;
