import React from "react";
import { BiLockAlt } from "react-icons/bi";
import { IoWalletOutline } from "react-icons/io5";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import StakingDetailsWrapper from "./_components/staking-details-wrapper";

const StakingDetails: NextPageWithLayout = () => {
  return (
    <div className="w-full rounded-xl border border-gray-shade-3 bg-black-shade-9 p-6">
      <div className="text-[min(10vw, 20px)] textGradient font-semibold">
        My Staking overview
      </div>
      <div className="scrollSetLight2 mt-5 flex max-w-full flex-grow gap-5 overflow-x-auto">
        <div className="flex h-[96px] min-w-[352px] gap-4 rounded-xl bg-elevation-1 px-5 py-6">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-brand-primary/60 bg-brand-primary/10">
            <IoWalletOutline className="h-[18px] w-[18px] text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-shade-14">
              Wallet Balance
            </p>
            <p className="mt-[6px] font-semibold text-white">11.1162 BUSD</p>
          </div>
        </div>
        <div className="flex h-[96px] min-w-[352px] gap-4 rounded-xl bg-elevation-1 px-5 py-6">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[#D35DB9]/60 bg-[#D35DB9]/10">
            <BiLockAlt className="h-[18px] w-[18px] text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-shade-14">
              Locked Token
            </p>
            <p className="mt-[6px] font-semibold text-white">179 BUSD</p>
          </div>
        </div>
        <div className="flex h-[96px] min-w-[352px] gap-4 rounded-xl bg-elevation-1 px-5 py-6">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[#5F97FF]/60 bg-[#5F97FF]/10">
            <BiLockAlt className="h-[18px] w-[18px] text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-shade-14">
              Locker Expiration
            </p>
            <p className="mt-[6px] font-semibold text-white">
              4 Years : 2 Months : 28 Days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

StakingDetails.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Staking Details">
      <StakingDetailsWrapper>{page}</StakingDetailsWrapper>
    </AllPagesWrapper>
  );
};

export default StakingDetails;
