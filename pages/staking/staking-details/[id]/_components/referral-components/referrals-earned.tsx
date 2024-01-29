import React from "react";
import { GridWrapper } from "../shared";
import { RefDataCardEarned } from "../shared/ref-data-card-earned";
import { CoinDetails } from "@/staking/types/coin.info.interface";

export const ReferralsEarned: React.FC<{
  open: boolean;
  data: any[];
  coin?: CoinDetails;
}> = ({ open, data, coin }) => {
  return (
    <GridWrapper open={open}>
      {data.map((e, i) => (
        <RefDataCardEarned key={i} item={e} coin={coin} />
      ))}
    </GridWrapper>
  );
};
