import React from "react";
import { GridWrapper } from "../shared";
import { RefDataCardClaimed } from "../shared/ref-data-card-claimed";
import { CoinDetails } from "@/staking/types/coin.info.interface";

export const ReferralsClaimed: React.FC<{
  open: boolean;
  data: any[];
  coin: CoinDetails | undefined;
  tax: number;
}> = ({ open, data, coin, tax }) => {
  return (
    <GridWrapper open={open}>
      {data.map((e, i) => (
        <RefDataCardClaimed
          key={i}
          data={e}
          index={i + 1}
          tokenName={coin?.symbol || ""}
          tokenDecimals={coin?.decimals ? +coin.decimals : 18}
          tax={tax}
        />
      ))}
    </GridWrapper>
  );
};
