import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import React from "react";
import { NextPageWithLayout } from "../../_app.page";
import NetworkDownline from "../_components/network.downline";
import NetworkTabs from "../_components/network.tabs";
import WalletSection from "../_components/wallet.section";

const NetworkRewards: NextPageWithLayout = () => {
  return (
    <div>
      <WalletSection />
      <NetworkDownline />
    </div>
  );
};

NetworkRewards.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Network Rewards">
      <div className="w-full max-w-[1136px] mx-auto">
        <NetworkTabs />
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default NetworkRewards;
