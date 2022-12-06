import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import React from "react";
import { NextPageWithLayout } from "../_app.page";
import Liscense from "./liscense/index.page";
import LiscenseSection from "./_components/liscense.section";
import NetworkTabs from "./_components/network.tabs";
import WalletSection from "./_components/wallet.section";

const NetworkRewards: NextPageWithLayout = () => {
  return (
    <div>
      <WalletSection />
      <LiscenseSection />
      <div className="w-full rounded-[14px] mt-4">
        <div className="bg-elevation-2"></div>
      </div>
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
