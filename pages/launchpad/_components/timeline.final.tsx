import React from "react";

import { formatNum2DispNum } from "@/utils/format.address";
import { ContributionInfo } from "@/web3/constants/types";

interface Props {
  contributionInfo: ContributionInfo;
}

interface SingleCardProps {
  title: string;
  amount: number;
}

const TimelineFinal: React.FC<Props> = ({ contributionInfo }) => {
  return (
    <div className="flex w-full items-center gap-4 ">
      <div className="!h-11 !min-w-[44px] rounded-full "></div>
      <div className="scrollSetLight2 flex max-w-full flex-grow gap-10 overflow-x-auto">
        {/* <SingleCard
          title="Total Amount can Receive"
          amount={contributionInfo.totalClaimableTokenAmountForBusd}
        /> */}
        <SingleCard
          title="Total Claimable Now"
          amount={contributionInfo.claimableTokenAmountForBusd}
        />
        <SingleCard
          title="Total Locked"
          amount={
            contributionInfo.totalClaimableTokenAmountForBusd -
            contributionInfo.claimedTokenAmountForBusd
          }
        />
        <SingleCard
          title="Total Claimed"
          amount={contributionInfo.claimedTokenAmountForBusd}
        />
      </div>
    </div>
  );
};

export default TimelineFinal;

const SingleCard: React.FC<SingleCardProps> = ({ title, amount }) => {
  return (
    <div className="h-[100px] min-w-[259px] rounded-[14px] bg-elevation-1 p-6">
      <p className="text-sm text-gray-shade-7">{title}</p>
      <h4 className="text-sm font-semibold text-white">
        {formatNum2DispNum(amount)}
      </h4>
    </div>
  );
};
