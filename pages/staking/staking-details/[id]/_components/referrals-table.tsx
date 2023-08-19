import React, { useState } from "react";
import clsx from "clsx";
import PaginationDropdown from "./pagination-dropdown";
import ListClaimedRewardsTable from "./list-claimed-rewards-table";
import ListReferralsTable from "./list-referrals-table";
import { RefReward } from "@/staking/types/ref.rewards.interface";
import { Referral } from "@/staking/types/referrals.interface";
import { OptionalType } from "@/staking/types";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { eqAddress } from "@/live/utils/address.utils";
import { ListCardDataOBj } from "@/pages/staking/_components/list-card-data";

const ReferralsTable: React.FC<{
  rewards: RefReward[];
  pageSize: string;
  setPageSize: (val: string) => void;
  currentTab: string;
  setCurrentTab: (val: "rewards" | "referrals") => void;
  claimRefReward: (user: string) => void;
  referrals: OptionalType<Referral[]>;
  coins: Array<CoinDetails | undefined>;
  pool: ListCardDataOBj | null;
}> = ({
  rewards,
  pageSize,
  setPageSize,
  currentTab,
  setCurrentTab,
  referrals,
  claimRefReward,
  coins,
  pool,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex w-full flex-col rounded-xl border border-gray-shade-3 bg-black-shade-9">
        <div className="flex items-center gap-8 rounded-t-xl bg-elevation-1 px-8 pb-4 pt-8">
          <p
            className={clsx(
              "text-[min(10vw, 20px)] hover:textGradient cursor-pointer font-semibold",
              currentTab === "rewards" ? "textGradient" : "text-white"
            )}
            onClick={() => setCurrentTab("rewards")}
          >
            List of Claimed Rewards
          </p>
          <p
            className={clsx(
              "text-[min(10vw, 20px)] hover:textGradient cursor-pointer font-semibold",
              currentTab === "referrals" ? "textGradient" : "text-white"
            )}
            onClick={() => setCurrentTab("referrals")}
          >
            List of Referrals
          </p>
        </div>
        <div className="scrollSetLight2 overflow-x-auto">
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
      <div>
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-white">Show list</p>
          <PaginationDropdown pageSize={pageSize} setPageSize={setPageSize} />
        </div>
      </div>
    </div>
  );
};

export default ReferralsTable;
