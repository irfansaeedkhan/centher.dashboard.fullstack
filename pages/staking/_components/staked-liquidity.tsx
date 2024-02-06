import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { eqAddress } from "@/live/utils/address.utils";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { ListCardDataOBj } from "./list-card-data";

interface Props {
  stakingPool: ListCardDataOBj | null;
  coins: Array<CoinDetails | undefined>;
  card: ListCardDataOBj;
}
const StakedLiquidity: React.FC<Props> = ({ stakingPool, card, coins }) => {
  const [totalRewards, setTotalRewards] = useState<BigNumber>(
    BigNumber.from(0)
  );

  useEffect(() => {
    if (!stakingPool) return;

    setTotalRewards(
      BigNumber.from(stakingPool.totalPaidReward).add(
        BigNumber.from(stakingPool.totalRestakedAmount)
      )
    );
  }, [stakingPool]);

  return (
    <div className={main}>
      <div className={mainSection}>
        <span className={label}>Staking Holders</span>
        <span className={value}>
          {stakingPool?.users?.length ? stakingPool.users.length : 0}
        </span>
      </div>
      <div className={mainSection}>
        <span className={label}>Total Paid Rewards</span>
        <span className={value}>
          {Number(
            formatUnits(
              totalRewards,
              coins.find((e) =>
                eqAddress(e?.contractAddress, stakingPool?.reward_token_address)
              )?.decimals || 18
            )
          )?.toFixed(2)}{" "}
          {
            coins.find((e) =>
              eqAddress(e?.contractAddress, stakingPool?.reward_token_address)
            )?.symbol
          }
        </span>
      </div>
      <div className={mainSection}>
        <span className={label}>Total Claimed Rewards</span>
        <span className={value}>
          {Number(
            formatUnits(
              stakingPool?.totalPaidReward + "",
              coins.find((e) =>
                eqAddress(e?.contractAddress, stakingPool?.reward_token_address)
              )?.decimals || 18
            )
          )?.toFixed(2)}{" "}
          {
            coins.find((e) =>
              eqAddress(e?.contractAddress, stakingPool?.reward_token_address)
            )?.symbol
          }
        </span>
      </div>
      <div className={mainSection}>
        <span className={label}>Total ReStaked Rewards</span>
        <span className={value}>
          {" "}
          {Number(
            formatUnits(
              stakingPool?.totalRestakedAmount + "",
              coins.find((e) =>
                eqAddress(e?.contractAddress, stakingPool?.reward_token_address)
              )?.decimals || 18
            )
          )?.toFixed(2)}{" "}
          {
            coins.find((e) =>
              eqAddress(e?.contractAddress, stakingPool?.reward_token_address)
            )?.symbol
          }
        </span>
      </div>
      <div className={mainSection}>
        <span className={label}>Total Staked</span>
        <span className={value}>
          {`${Number(
            formatEther(BigNumber.from(stakingPool?.totalStakedAmount))
          ).toFixed(2)} `}{" "}
          {
            coins.find((e) =>
              eqAddress(e?.contractAddress, stakingPool?.reward_token_address)
            )?.symbol
          }{" "}
        </span>
      </div>
    </div>
  );
};

export default StakedLiquidity;

const label = `text-sm text-gray-shade-14`;
const value = `text-sm font-medium text-white flex-shrink-0`;
const mainSection = `flex w-full items-center justify-between gap-5`;
const main = `flex w-full flex-col gap-3.5 rounded-[10px] border border-gray-shade-3 p-4`;
