import React from "react";

import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import RewardsTableSkeleton from "@/components/loading.skeletons/admin.network.rewards";

import NetworkTabs from "../_components/network.tabs";
import OverviewCards from "../_components/overview.card";
import TeamRewards from "../_components/team.rewards";
import CompanyRewards from "../_components/company.rewards";
import RewardsHistory from "../_components/rewards.history";
import OverviewCardsSkeleton from "@/components/loading.skeletons/admin.network.cards";

const AdminNetworkRewards: NextPageWithLayout = () => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-18px font-semibold text-white ">Overview</h1>
      <OverviewCards />
      <OverviewCardsSkeleton />
      <TeamRewards />
      <CompanyRewards />
      <RewardsTableSkeleton />
      <RewardsHistory />
    </div>
  );
};

AdminNetworkRewards.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Admin Network Rewards">
      <div className="w-full max-w-[1136px] mx-auto">
        <NetworkTabs />
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default AdminNetworkRewards;
