import React, { useEffect, useState } from "react";

import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import RewardsTableSkeleton from "@/components/loading.skeletons/admin.network.rewards";

import NetworkTabs from "../_components/network.tabs";
import OverviewCardsSkeleton from "@/components/loading.skeletons/admin.network.cards";
import { useAdminRegistration } from "@/store/admin.registration";
import RegistrationOverviewCards from "../_components/registration.overview.card";
import RegistrationRewards from "../_components/registration.rewards";
import RegistrationHistory from "../_components/registration.history";
import { useWeb3React } from "@web3-react/core";

const AdminRegistration: NextPageWithLayout = () => {
  const { library } = useWeb3React();
  const {
    totalMembersWithoutReferrer,
    totalMembersWithReferrer,
    totalMembers,
    registrationHistory,
    claimableBNB,
    claimedBNB,
    fetchRegistrationInfo,
    loading,
  } = useAdminRegistration((state) => ({
    totalMembersWithoutReferrer: state.totalMembersWithoutReferrer,
    totalMembersWithReferrer: state.totalMembersWithReferrer,
    totalMembers: state.totalMembers,
    registrationHistory: state.registrationHistory,
    claimableBNB: state.claimableBNB,
    claimedBNB: state.claimedBNB,
    fetchRegistrationInfo: state.fetchRegistrationInfo,
    loading: state.loading,
  }));

  const [reload, setReload] = useState(false);

  console.log(
    "sniper: registration: ",
    totalMembersWithoutReferrer,
    totalMembersWithReferrer,
    totalMembers,
    registrationHistory,
    claimableBNB,
    claimedBNB
  );

  useEffect(() => {
    fetchRegistrationInfo();
  }, [fetchRegistrationInfo, reload]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-18px font-semibold text-white ">Overview</h1>
      {loading === "loaded" ? (
        <RegistrationOverviewCards
          totalMembers={totalMembers}
          membersWithoutReferrer={totalMembersWithoutReferrer}
          membersWithReferrer={totalMembersWithReferrer}
        />
      ) : (
        <OverviewCardsSkeleton />
      )}
      {loading === "loaded" ? (
        <RegistrationRewards
          claimableBNB={claimableBNB}
          claimedBNB={claimedBNB}
          reload={reload}
          setReload={setReload}
        />
      ) : (
        <RewardsTableSkeleton />
      )}
      <RegistrationHistory data={registrationHistory} />
    </div>
  );
};

AdminRegistration.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Admin Network Rewards">
      <div className="w-full max-w-[1136px] mx-auto">
        <NetworkTabs />
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default AdminRegistration;
