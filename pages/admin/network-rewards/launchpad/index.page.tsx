import React, { useEffect, useState } from "react";

import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import RewardsTableSkeleton from "@/components/loading.skeletons/admin.network.rewards";

import NetworkTabs from "../_components/network.tabs";
import OverviewCards from "../_components/overview.card";
import TeamRewards from "../_components/team.rewards";
import CompanyRewards from "../_components/company.rewards";
import RewardsHistory from "../_components/rewards.history";
import OverviewCardsSkeleton from "@/components/loading.skeletons/admin.network.cards";
import { useAdminLaunchpadRewards } from "@/store/admin.network.rewards";

const AdminNetworkRewards: NextPageWithLayout = () => {
  const {
    coreTeamRewards,
    companyRewards,
    overview,
    purchaseWithBusdHistory,
    purchaseWithNtrHistory,
    claimHistory,
    fetchPurchaseWithBusdHistoryInLaunchpad,
    fetchPurchaseWithNtrHistoryInLaunchpad,
    fetchClaimHistoryInLaunchpad,
    loadingPurchaseWithBusdHistory,
    loadingPurchaseWithNtrHistory,
    loadingClaimHistory,
  } = useAdminLaunchpadRewards((state) => ({
    coreTeamRewards: state.coreTeamRewards,
    companyRewards: state.companyRewards,
    overview: state.overview,
    purchaseWithBusdHistory: state.purchaseWithBusdHistory,
    purchaseWithNtrHistory: state.purchaseWithNtrHistory,
    claimHistory: state.claimHistory,
    fetchPurchaseWithBusdHistoryInLaunchpad:
      state.fetchPurchaseWithBusdHistoryInLaunchpad,
    fetchPurchaseWithNtrHistoryInLaunchpad:
      state.fetchPurchaseWithNtrHistoryInLaunchpad,
    fetchClaimHistoryInLaunchpad: state.fetchClaimHistoryInLaunchpad,
    loadingPurchaseWithBusdHistory: state.loadingPurchaseWithBusdHistory,
    loadingPurchaseWithNtrHistory: state.loadingPurchaseWithNtrHistory,
    loadingClaimHistory: state.loadingClaimHistory,
  }));

  const [reload, setReload] = useState(false);

  useEffect(() => {
    fetchPurchaseWithBusdHistoryInLaunchpad();
    fetchPurchaseWithNtrHistoryInLaunchpad();
    fetchClaimHistoryInLaunchpad();
  }, [
    fetchClaimHistoryInLaunchpad,
    fetchPurchaseWithBusdHistoryInLaunchpad,
    fetchPurchaseWithNtrHistoryInLaunchpad,
    reload,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base font-semibold text-white f2xl:text-lg ">
        Overview
      </h1>
      {loadingPurchaseWithBusdHistory === "loaded" &&
      loadingPurchaseWithNtrHistory === "loaded" &&
      loadingClaimHistory === "loaded" ? (
        <OverviewCards data={overview} />
      ) : (
        <OverviewCardsSkeleton />
      )}
      {loadingPurchaseWithBusdHistory === "loaded" &&
      loadingPurchaseWithNtrHistory === "loaded" &&
      loadingClaimHistory === "loaded" ? (
        <TeamRewards
          data={coreTeamRewards}
          reload={reload}
          setReload={setReload}
        />
      ) : (
        <RewardsTableSkeleton />
      )}
      {loadingPurchaseWithBusdHistory === "loaded" &&
      loadingPurchaseWithNtrHistory === "loaded" &&
      loadingClaimHistory === "loaded" ? (
        <CompanyRewards
          data={companyRewards}
          reload={reload}
          setReload={setReload}
        />
      ) : (
        <RewardsTableSkeleton />
      )}
      <RewardsHistory />

      {/* <OverviewCards data={overview}/>  
      <OverviewCardsSkeleton/>
      <TeamRewards  data={coreTeamRewards}/>
      <CompanyRewards data={companyRewards}/>
      <RewardsTableSkeleton />
      <RewardsHistory/> */}
    </div>
  );
};

AdminNetworkRewards.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Admin Network Rewards">
      <div className="mx-auto w-full max-w-[1136px]">
        <NetworkTabs />
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default AdminNetworkRewards;
