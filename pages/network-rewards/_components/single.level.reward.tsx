import { RewardsEachAsset } from "@/models/referral";
import React from "react";
import { formatPriceInUSD } from "@/utils/format.address";
import { normalizeValue } from "@/web3/utils/call.helpers";

interface SingleLevelRewardPProps {
  rewardState: "lunchpad-rewards" | "marketplace-rewards";
  rewards: RewardsEachAsset;
  bnbPrice: number;
  ntrPrice: number;
  level: number;
}

const SingleLevelReward: React.FC<SingleLevelRewardPProps> = ({
  rewardState,
  rewards,
  bnbPrice,
  ntrPrice,
  level,
}) => {
  return (
    <div className="w-[43%] max-w-[338px] fsm:max-w-[232px] fmd:max-w-[200px] flg:max-w-[285px] fxl:max-w-[288px] f2xl:max-w-[338px]">
      <div className="text-xs font-semibold text-gray-shade-7">
        {`From Level ${level}`}
      </div>
      {rewardState === "lunchpad-rewards" ? (
        <>
          <div className="mt-4 mb-3 flex items-center gap-2 text-sm font-semibold">
            <p className="text-white">{`${rewards.ntr} NTR`}</p>
            <p className="text-gray-shade-7">{`($${formatPriceInUSD(
              rewards.ntr,
              ntrPrice
            )})`}</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <p className="text-white">{`${rewards.busd} BUSD`}</p>
            <p className="text-gray-shade-7">{`($${rewards.busd})`}</p>
          </div>
        </>
      ) : rewardState === "marketplace-rewards" ? (
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
          <p className="text-white">{`${normalizeValue(rewards.bnb)} BNB`}</p>
          <p className="text-gray-shade-7">{`($${formatPriceInUSD(
            rewards.bnb,
            bnbPrice
          )})`}</p>
        </div>
      ) : null}
    </div>
  );
};

export default SingleLevelReward;
