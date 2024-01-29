import React from "react";
import { GridWrapper } from "../shared";
import { RefDataCardStaking } from "../shared/ref-data-card-staking";
import { ReferralStake } from "@/staking/types/get.projects.interface";
import { CoinDetails } from "@/staking/types/coin.info.interface";

export const ReferralsStakingToken: React.FC<{
  data: ReferralStake[];
  open: boolean;
  coin?: CoinDetails;
  nonRefundable: boolean;
}> = ({ open, data, coin, nonRefundable }) => {
  return (
    <GridWrapper open={open}>
      {data.map((e, i) => (
        <RefDataCardStaking
          key={i}
          data={e}
          tokenName={coin?.symbol || ""}
          tokenDecimal={coin?.decimals ? +coin?.decimals : 18}
          nonRefundable={nonRefundable}
        />
      ))}
    </GridWrapper>
  );
};
