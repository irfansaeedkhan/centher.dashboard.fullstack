import React from "react";
import { ClaimableRewardsProps } from "./launchpad.claimable.rewards";

const SingleLevelReward: React.FC<ClaimableRewardsProps> = ({
  rewardState,
}) => {
  return (
    <div className="w-full f2xl:max-w-[338px] fxl:max-w-[288px] flg:max-w-[285px] fmd:max-w-[200px] fsm:max-w-[232px] max-w-[338px]">
      <div className="text-xs font-semibold text-gray-shade-7">
        From Level 1
      </div>
      {rewardState === "lunchpad-rewards" ? (
        <>
          <div className="mt-4 mb-3 flex items-center text-sm font-semibold gap-2">
            <p className="text-white">00 NTR</p>
            <p className="text-gray-shade-7">($ 1.000,00)</p>
          </div>
          <div className="flex items-center text-sm font-semibold gap-2">
            <p className="text-white">00 BUSD</p>
            <p className="text-gray-shade-7">($ 1.000,00)</p>
          </div>
        </>
      ) : rewardState === "marketplace-rewards" ? (
        <div className="mt-4 flex items-center text-sm font-semibold gap-2">
          <p className="text-white">00 BNB</p>
          <p className="text-gray-shade-7">($ 1.000,00)</p>
        </div>
      ) : null}
    </div>
  );
};

export default SingleLevelReward;
