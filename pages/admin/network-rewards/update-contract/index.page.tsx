import React from "react";

import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";

import NetworkTabs from "../_components/network.tabs";
import { useGetRoundsInfo } from "@/web3/hooks/use.contracts.functions";
import { ContractCard } from "./_components/ContractCard";

const UpdateContract: NextPageWithLayout = () => {
  const { roundsInfo, refreshRoundsInfo } = useGetRoundsInfo();

  return (
    <div className="flex flex-col gap-6">
      <div className="contractContainer grid grid-cols-[repeat(auto-fit,_minmax(470px,_1fr))] gap-4 ">
        {roundsInfo &&
          roundsInfo.map((round: any) => {
            return (
              <ContractCard
                data={round}
                refreshRoundsInfo={refreshRoundsInfo}
                key={round.round}
              />
            );
          })}
      </div>
    </div>
  );
};

UpdateContract.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Admin Metaverse">
      <div className="w-full max-w-[1136px] mx-auto">
        <NetworkTabs />
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default UpdateContract;
