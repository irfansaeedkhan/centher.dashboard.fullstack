import React from "react";
import { DataCardClaimed, GridWrapper } from "../shared";
import { ClaimedRewards } from "@/staking/types/rewards.interface";

export const RewardsClaimed: React.FC<{
  data: ClaimedRewards[];
  tax: number;
  tokenDecimals: number;
  tokenName: string;
}> = ({ data, tax, tokenDecimals, tokenName }) => {
  return (
    <GridWrapper open={true}>
      {data.map((data, index) => (
        <DataCardClaimed
          key={index}
          data={data}
          index={index + 1}
          tax={tax}
          tokenDecimals={tokenDecimals}
          tokenName={tokenName}
        />
      ))}
    </GridWrapper>
  );
};
