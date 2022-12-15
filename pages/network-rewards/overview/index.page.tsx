import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import React from "react";
import { NextPageWithLayout } from "../../_app.page";
import Liscense from "../liscense/index.page";
import LiscenseSection from "../_components/liscense.section";
import NetworkDownline from "../_components/network.downline";
import NetworkTabs from "../_components/network.tabs";
import NetworkUpline from "../_components/network.upline";
import SingleNetworkUpline from "../_components/single.network.upline";
import WalletSection from "../_components/wallet.section";

const NetworkRewards: NextPageWithLayout = () => {
  return (
    <div>
      <WalletSection />
      <LiscenseSection />
      <NetworkUpline />
      <NetworkDownline />
      <SingleNetworkUpline />
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
