import React from "react";
import { stakeReward } from "@/staking/types";
import { DataCardClaimable, GridWrapper } from "../shared";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import Image from "next/image";

export const RewardsClaimable: React.FC<{
  data: stakeReward[];
  coin?: CoinDetails;
  isLoading: boolean;
  claim: any;
  restake: any;
  claimInProcess: number[];
  restakeInProgress: number[];
  reload: any;
}> = ({
  data,
  coin,
  isLoading,
  claim,
  restake,
  restakeInProgress,
  claimInProcess,
  reload,
}) => {
  return (
    <>
      {isLoading ? (
        <div className="flex w-full items-center justify-center">
          <Image
            src="/images/preloader.png"
            alt="preloader"
            width={64}
            height={64}
            className="h-16 w-16 flex-shrink-0 object-cover"
          />
        </div>
      ) : (
        <GridWrapper open={true}>
          {data.map((e, i) => (
            <DataCardClaimable
              key={i}
              item={e}
              coin={coin}
              claim={claim}
              restake={restake}
              restakeInProgress={restakeInProgress}
              claimInProcess={claimInProcess}
              reload={reload}
            />
          ))}
        </GridWrapper>
      )}
    </>
  );
};
