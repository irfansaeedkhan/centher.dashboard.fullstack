import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import LaunchpadSkeleton from "@/components/loading.skeletons/launchpad.skeleton";
import NetworkDownlineSkeleton from "@/components/loading.skeletons/network.overview.downline";
import WalletSectionSkeleton from "@/components/loading.skeletons/network.overview.wallet";
import useUser from "@/hooks/use.user";
import { useGenealogyStore } from "@/store/network.genealogy";
import React, { useEffect } from "react";
import { NextPageWithLayout } from "../../_app.page";
import NetworkDownline from "../_components/network.downline";
import NetworkTabs from "../_components/network.tabs";
import WalletSection from "../_components/wallet.section";

const NetworkRewards: NextPageWithLayout = () => {
  const { user: loggedInUser } = useUser();
  const { genealogies, rewardsTotal, fetchGenealogy, loading, updating } =
    useGenealogyStore((state) => ({
      genealogies: state.genealogies,
      rewardsTotal: state.rewardsTotal,
      fetchGenealogy: state.fetchGenealogy,
      loading: state.loading,
      updating: state.updating,
    }));

  useEffect(() => {
    const fetchGeealogyBaseData = async (account: string) => {
      await fetchGenealogy(account);
    };
    if (loggedInUser?.account_address) {
      fetchGeealogyBaseData(loggedInUser?.account_address);
    }
  }, [fetchGenealogy, loggedInUser?.account_address]);

  return (
    <div>
      {rewardsTotal ? (
        <WalletSection data={rewardsTotal} />
      ) : (
        <WalletSectionSkeleton />
      )}

      <NetworkDownline genealogy={genealogies} />
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
