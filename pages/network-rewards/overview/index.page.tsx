import React, { useEffect } from "react";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import WalletSectionSkeleton from "@/components/loading.skeletons/network.overview.wallet";
import useUser from "@/hooks/use.user";
import { useGenealogyStore } from "@/store/network.genealogy";
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
    if (loggedInUser?._id) {
      fetchGeealogyBaseData(loggedInUser?._id);
    }
  }, [fetchGenealogy, loggedInUser?._id]);

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
      <div className="mx-auto w-full max-w-[1136px]">
        <NetworkTabs />
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default NetworkRewards;
