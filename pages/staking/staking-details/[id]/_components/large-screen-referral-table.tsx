import React from "react";
import clsx from "clsx";
import Button from "@/components/button";
import { eqAddress } from "@/live/utils/address.utils";
import { OptionalType } from "@/staking/types";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { RefReward } from "@/staking/types/ref.rewards.interface";
import { Referral } from "@/staking/types/referrals.interface";
import { ListCardDataOBj } from "@/pages/staking/_components/list-card-data";
import ListReferralsTable from "./list-referrals-table";
import ListClaimedRewardsTable from "./list-claimed-rewards-table";

const LargeScreenReferralTable: React.FC<{
  isClaiming: string;
  rewards: RefReward[];
  currentTab: string;
  setCurrentTab: (val: "rewards" | "referrals") => void;
  claimRefReward: (user: string) => void;
  referrals: OptionalType<Referral[]>;
  coins: Array<CoinDetails | undefined>;
  pool: ListCardDataOBj | null;
  claimable: boolean;
}> = ({
  isClaiming,
  rewards,
  currentTab,
  setCurrentTab,
  referrals,
  claimRefReward,
  coins,
  pool,
  claimable,
}) => {
  return (
    <div className="flex w-full flex-col rounded-xl border border-gray-shade-3 bg-black-shade-9">
      <div className="flex items-center justify-between gap-5 rounded-t-xl bg-elevation-1 px-8 pb-4  pt-8">
        <div className="flex items-center gap-5">
          <p
            className={clsx(
              currentTab === "rewards" && "myBox font-medium",
              "w-fit flex-shrink-0 cursor-pointer py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
            )}
            onClick={() => setCurrentTab("rewards")}
          >
            List of Claimed Rewards
          </p>
          <p
            className={clsx(
              currentTab === "referrals" && "myBox font-medium",
              "w-fit flex-shrink-0 cursor-pointer py-1.5 text-xs leading-5 text-white fxm:text-sm fxm:leading-6"
            )}
            onClick={() => setCurrentTab("referrals")}
          >
            List of Referrals
          </p>
        </div>
        {/* <Button
          title="Claim All"
          onClick={() => claimRefReward("")}
          disabled={!claimable}
          className="w-fit text-xs font-medium"
          borderRounded="10px"
        /> */}
      </div>
      <div className="scrollSetLight2 overflow-x-auto rounded-b-xl">
        {currentTab === "rewards" ? (
          <ListClaimedRewardsTable
            data={rewards}
            decimals={
              coins.find((e) =>
                eqAddress(e?.contractAddress, pool?.reward_token_address)
              )?.decimals as string
            }
            token={
              coins.find((e) =>
                eqAddress(e?.contractAddress, pool?.reward_token_address)
              )?.symbol as string
            }
          />
        ) : (
          currentTab === "referrals" && (
            <ListReferralsTable
              isClaiming={isClaiming}
              claimable={claimable}
              data={referrals}
              token={
                coins.find((e) =>
                  eqAddress(e?.contractAddress, pool?.token_address)
                )?.symbol as string
              }
              rewardToken={
                coins.find((e) =>
                  eqAddress(e?.contractAddress, pool?.reward_token_address)
                )?.symbol as string
              }
              rewardTokenDecimals={
                coins.find((e) =>
                  eqAddress(e?.contractAddress, pool?.reward_token_address)
                )?.decimals as string
              }
              decimals={
                coins.find((e) =>
                  eqAddress(e?.contractAddress, pool?.token_address)
                )?.decimals as string
              }
              claimRefReward={claimRefReward}
            />
          )
        )}
      </div>
    </div>
  );
};

export default LargeScreenReferralTable;
