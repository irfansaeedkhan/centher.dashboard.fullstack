import React, { useEffect, useState } from "react";

import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import HistoryTableSkeleton from "@/components/loading.skeletons/admin.network.history";
import RewardsTableSkeleton from "@/components/loading.skeletons/admin.network.rewards";

import AdminOverviewCardsSkeleton from "@/components/loading.skeletons/admin.registration.cards";
import { useAdminRegistration } from "@/store/admin.registration";
import RegistrationOverviewCards from "./_components/registration.overview.card";
import RegistrationRewards from "./_components/registration.rewards";
import RegistrationHistory from "./_components/registration.history";
import { useWeb3React } from "@web3-react/core";
import RegistrationTabs from "./_components/registration.tabs";

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

  useEffect(() => {
    fetchRegistrationInfo();
  }, [fetchRegistrationInfo, reload]);

  return (
    <div className="flex flex-col gap-6">
      <RegistrationTabs />
      {loading === "loaded" ? (
        <RegistrationOverviewCards
          totalMembers={totalMembers}
          membersWithoutReferrer={totalMembersWithoutReferrer}
          membersWithReferrer={totalMembersWithReferrer}
        />
      ) : (
        <AdminOverviewCardsSkeleton />
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
      {loading === "loaded" ? (
        <RegistrationHistory data={registrationHistory} />
      ) : (
        <HistoryTableSkeleton />
      )}
    </div>
  );
};

AdminRegistration.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Admin Network Rewards">
      <div className="w-full max-w-[1136px] mx-auto">{page}</div>
    </AllPagesWrapper>
  );
};

export default AdminRegistration;
