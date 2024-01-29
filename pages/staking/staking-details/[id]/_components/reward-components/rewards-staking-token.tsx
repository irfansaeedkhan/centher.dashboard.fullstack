import React from "react";
import { DataCardStaking, GridWrapper } from "../shared";
import { UserStakingTransfers } from "@/staking/types/get.projects.interface";

export const RewardsStakingToken: React.FC<{
  data: UserStakingTransfers[] | undefined;
  tokenName: string;
  tokenDecimal: number;
  nonRefundable: boolean;
  unstake: any;
  unstakeInProgresses: number[];
  reload: any;
}> = ({
  data,
  tokenDecimal,
  tokenName,
  nonRefundable,
  unstakeInProgresses,
  unstake,
  reload,
}) => {
  return (
    <GridWrapper open={true}>
      {data?.map((e, index) => (
        <DataCardStaking
          key={index}
          data={e}
          tokenDecimal={tokenDecimal}
          tokenName={tokenName}
          nonRefundable={nonRefundable}
          unstake={unstake}
          unstakeInProgress={
            unstakeInProgresses.findIndex((s) => s == e.id) != -1
          }
          reload={reload}
        />
      ))}
    </GridWrapper>
  );
};
