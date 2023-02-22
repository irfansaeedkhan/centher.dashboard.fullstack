import React from "react";

import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import { useGetRoundsInfo } from "@/web3/hooks/use.contracts.functions";
import UpdateContractAdminPanelSkeleton from "@/components/loading.skeletons/update.contract.adminpanel";

import NetworkTabs from "../_components/network.tabs";
import { ContractCard } from "./_components/ContractCard";
import { CommonCard } from "./_components/CommonCard";

const UpdateContract: NextPageWithLayout = () => {
  const { roundsInfo, refreshRoundsInfo } = useGetRoundsInfo();

  return (
    <div className="flex flex-col gap-6">
      <div className="contractContainer max-w-auto grid grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] gap-4">
        <CommonCard refreshRoundsInfo={refreshRoundsInfo} />
        {!!roundsInfo.length ? (
          roundsInfo.map((round: any) => {
            return (
              <ContractCard
                data={round}
                refreshRoundsInfo={refreshRoundsInfo}
                key={round.round}
              />
            );
          })
        ) : (
          <>
            <UpdateContractAdminPanelSkeleton />
            <UpdateContractAdminPanelSkeleton />
          </>
        )}
      </div>
    </div>
  );
};

UpdateContract.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Admin Metaverse">
      <div className="mx-auto w-full max-w-[1136px]">
        <NetworkTabs />
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default UpdateContract;
