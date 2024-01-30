import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { ListCardDataOBj } from "./list-card-data";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { eqAddress } from "@/live/utils/address.utils";
import { CoinDetails } from "@/staking/types/coin.info.interface";

interface Props {
  stakingPool: ListCardDataOBj | null;
  coins: Array<CoinDetails | undefined>;
  card: ListCardDataOBj;
}
const StakedLiquidity: React.FC<Props> = ({ stakingPool, card, coins }) => {
  const [filled, setFilled] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);

  useEffect(() => {
    if (!stakingPool) return;
    let supply = stakingPool.supply;
    let totalStakedAmount = formatUnits(
      stakingPool.totalStakedAmount ? stakingPool.totalStakedAmount + "" : "0",
      18
    );
    if (Number(stakingPool.supply) === 0) {
      supply = "999999999999999999";
    }
    const percentage = (Number(totalStakedAmount) / Number(supply)) * 100;
    setFilled(Math.ceil(percentage));
    const totalRewards =
      +stakingPool.totalPaidReward + +stakingPool.totalRestakedAmount;
    setTotalRewards(totalRewards);
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
              totalRewards + "",
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
          {`${Number(formatEther(card.totalStakedAmount.toString())).toFixed(
            2
          )} `}{" "}
          {
            coins.find((e) =>
              eqAddress(e?.contractAddress, stakingPool?.reward_token_address)
            )?.symbol
          }{" "}
        </span>
      </div>
      <div>
        <div
          className={clsx(
            "relative h-3 w-full overflow-hidden rounded-3xl",
            filled < 75 && `bg-[#76E268]/[0.16]`,
            filled >= 75 && filled < 100 && `bg-[#FEBF32]/[0.16]`,
            filled == 100 && `bg-[#E5535A]/[0.16]`
          )}
        >
          <div
            style={{ width: `${filled}%` }}
            className={clsx(
              filled < 75 && `bg-[#76E268]`,
              filled >= 75 && filled < 100 && `bg-brand-primary`,
              filled == 100 && `bg-[#EA3943]`,
              `absolute top-0 z-50 h-3 rounded-3xl`
            )}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StakedLiquidity;

const label = `text-sm text-gray-shade-14`;
const value = `text-sm font-medium text-white flex-shrink-0`;
const mainSection = `flex w-full items-center justify-between gap-5`;
const main = `flex w-full flex-col gap-3.5 rounded-[10px] border border-gray-shade-3 p-4`;
