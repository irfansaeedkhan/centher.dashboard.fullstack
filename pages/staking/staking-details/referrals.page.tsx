import React from "react";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ClaimableReward, StakingUsers } from "@/assets/svgs";

import StakingDetailsWrapper from "./_components/staking-details-wrapper";
import ReferralsTable from "./_components/referrals-table";

const StakingReferrals: NextPageWithLayout = () => {
  return (
    <>
      <div className="flex w-full flex-col gap-5 rounded-xl border border-gray-shade-3 bg-black-shade-9 p-6">
        <div className="text-[min(10vw, 20px)] textGradient font-semibold">
          Referrals Overview
        </div>
        <div className="scrollSetLight2 flex max-w-full flex-grow gap-5 overflow-x-auto">
          <div className="flex h-[96px] min-w-[352px] gap-4 rounded-xl bg-elevation-1 px-5 py-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-brand-primary/60 bg-brand-primary/10">
              <ClaimableReward />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-shade-14">
                Total Claimed Rewards
              </p>
              <p className="mt-[6px] font-semibold text-white">11.1162 BUSD</p>
            </div>
          </div>
          <div className="flex h-[96px] min-w-[352px] gap-4 rounded-xl bg-elevation-1 px-5 py-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[#D35DB9]/60 bg-[#D35DB9]/10">
              <ClaimableReward />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-shade-14">
                Total Claimable Rewards
              </p>
              <p className="mt-[6px] font-semibold text-white">179 BUSD</p>
            </div>
          </div>
          <div className="flex h-[96px] min-w-[352px] gap-4 rounded-xl bg-elevation-1 px-5 py-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[#5F97FF]/60 bg-[#5F97FF]/10">
              <StakingUsers />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-shade-14">
                Total Referrals
              </p>
              <p className="mt-[6px] font-semibold text-white">20000000</p>
            </div>
          </div>
        </div>
      </div>
      <ReferralsTable />
    </>
  );
};

StakingReferrals.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Staking Details">
      <StakingDetailsWrapper>{page}</StakingDetailsWrapper>
    </AllPagesWrapper>
  );
};

export default StakingReferrals;
