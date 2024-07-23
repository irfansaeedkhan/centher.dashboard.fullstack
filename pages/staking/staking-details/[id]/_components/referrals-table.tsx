import React from "react";
import { RefReward } from "@/staking/types/ref.rewards.interface";
import { Referral } from "@/staking/types/referrals.interface";
import { OptionalType } from "@/staking/types";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { ListCardDataOBj } from "@/pages/staking/_components/list-card-data";
import PaginationDropdown from "./pagination-dropdown";
import LargeScreenReferralTable from "./large-screen-referral-table";
import SmallScreenReferralTable from "./small-screen-referral-table";

const ReferralsTable: React.FC<{
  isClaiming: string;
  rewards: RefReward[];
  pageSize: string;
  setPageSize: (val: string) => void;
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
  pageSize,
  setPageSize,
  currentTab,
  setCurrentTab,
  referrals,
  claimRefReward,
  coins,
  pool,
  claimable,
}) => {
  return (
    <div className="space-y-4">
      <div className="hidden flg:block">
        <LargeScreenReferralTable
          isClaiming={isClaiming}
          rewards={rewards}
          referrals={referrals}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          claimRefReward={claimRefReward}
          pool={pool}
          coins={coins}
          claimable={claimable}
        />
      </div>
      <div className="mt-3 block flg:hidden">
        <SmallScreenReferralTable
          isClaiming={isClaiming}
          rewards={rewards}
          referrals={referrals}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          claimRefReward={claimRefReward}
          pool={pool}
          coins={coins}
          claimable={claimable}
        />
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
