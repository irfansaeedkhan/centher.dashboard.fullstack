import { AllUserReward } from "@/staking/types";
import React from "react";
import { DataCardEarned, GridWrapper } from "../shared";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import Image from "next/image";

export const RewardsEarned: React.FC<{
  rewards: AllUserReward[];
  coin: CoinDetails | undefined;
  isLoading: boolean;
}> = ({ rewards, coin, isLoading }) => {
  return (
    <GridWrapper open={true}>
      {rewards.map((data, index) => (
        <DataCardEarned key={index} item={data} coin={coin} />
      ))}
    </GridWrapper>
  );
};
