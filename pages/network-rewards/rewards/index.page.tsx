import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import React from "react";
import NetworkTabs from "../_components/network.tabs";

const Rewards: NextPageWithLayout = () => {
  return (
    <div>
      <div className="flex items-center gap-16">
        <h3 className="text-white font-semibold text-xl">
          Your Network Rewards
        </h3>

        <h3 className="text-white font-semibold text-xl">Lunchpad Rewards</h3>

        <h3 className="text-white font-semibold text-xl">NFT Rewards</h3>
      </div>
    </div>
  );
};

Rewards.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Rewards">
      <div className="w-full max-w-[1136px] mx-auto">
        <NetworkTabs />
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default Rewards;
