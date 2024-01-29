import React from "react";
import { GridWrapper } from "../shared";
import { RefDataCardClaimable } from "../shared/ref-data-card-claimable";
import { CoinDetails } from "@/staking/types/coin.info.interface";

export const ReferralsClaimable: React.FC<{
  open: boolean;
  data?: any[];
  stakeCoin?: CoinDetails;
  rewardCoin?: CoinDetails;
  claim: any;
  restake: any;
  claimInProcess: string[];
  restakeInProgress: string[];
  reload: any;
}> = ({
  open,
  data,
  stakeCoin,
  rewardCoin,
  claim,
  restake,
  claimInProcess,
  restakeInProgress,
  reload,
}) => {
  return (
    <GridWrapper open={open}>
      {data?.map((e, i) =>
        +e.claimableReward > 0 || +e.nextTime > +new Date() / 1000 ? (
          <RefDataCardClaimable
            key={i}
            item={e}
            stakeCoin={stakeCoin}
            rewardCoin={rewardCoin}
            claim={claim}
            restake={restake}
            claimInProcess={claimInProcess}
            restakeInProgress={restakeInProgress}
            reload={reload}
          />
        ) : null
      )}
    </GridWrapper>
  );
};
