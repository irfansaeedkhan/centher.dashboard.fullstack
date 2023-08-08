import React, { useState } from "react";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { StakingSuccessModal } from "./_components/staking-success-modal";
import { CreateStakingFormOne } from "./_components/create-staking-form-one";
import {
  citizenshipFormInterface,
  stakingFormInterface,
} from "../_components/staking-types";
import { CreateStakingFormTwo } from "./_components/create-staking-form-two";
import { StakingFailureModal } from "./_components/staking-failure-modal";

const CreateStaking: NextPageWithLayout = () => {
  const [formOneData, setFormOneData] = useState<stakingFormInterface | null>(
    null
  );
  const [initialForm, setInitialForm] = useState(true);
  const [showMsg, setshowMsg] = useState<any>(null);

  const getStakingFormOneData = (data: stakingFormInterface) => {
    console.log("data received in parent for formOne:::::::::", data);
    if (data) {
      setFormOneData(data);
      setInitialForm(false);
    }
  };

  // function which gets all data from both forms
  const getStakingFormTwoData = (data: citizenshipFormInterface) => {
    console.log("data received in parent for formTwo:::::::::", data);
    let FinalData = {
      pack: formOneData?.pack,
      token_address: formOneData?.token_address,
      multilevel_rewards: formOneData?.multilevel_rewards,
      apy: formOneData?.apy,
      staking_period: formOneData?.staking_period,
      start_time: formOneData?.start_time,
      claim_period: formOneData?.claim_period,
      show_on_centher: formOneData?.show_on_centher,
      liquidity_pool_provided: formOneData?.liquidity_pool_provided,
      is_cancelable: formOneData?.is_cancelable,
      charge_fee_on_cancel: formOneData?.charge_fee_on_cancel,
      min_staking_amount: formOneData?.min_staking_amount,
      max_staking_amount: formOneData?.max_staking_amount,
      project_metadata: formOneData?.project_metadata,
      rewards_level: formOneData?.rewards_level,
      websiteUrl: data.websiteUrl,
      facebook: data.facebook,
      twitter: data.twitter,
      github: data.github,
      telegram: data.telegram,
      instagram: data.instagram,
      discord: data.discord,
      reddit: data.reddit,
      explorers: data.explorers,
      category: data.category,
      description: data.description,
      members: data.members,
    };

    console.log("FinalData:::", FinalData);
    if (FinalData) {
      handleStaking(FinalData);
    }
  };

  const retryFunc = () => {
    setshowMsg(null);
    setInitialForm(true);
  };
  const onClickClose = () => {
    setshowMsg(null);
  };
  const handleStaking = async (data: any) => {
    try {
      setshowMsg(<StakingSuccessModal onClickClose={onClickClose} />);
    } catch (error: any) {
      setshowMsg(
        <StakingFailureModal
          onClickClose={onClickClose}
          retryFunc={retryFunc}
        />
      );
    }
  };
  return (
    <section className="flex min-h-[calc(100vh-120px)] w-full">
      <div className="flex flex-grow flex-col">
        <h1 className="textGradient pb-6 font-semibold leading-[42px] sm:text-2xl ">
          {initialForm
            ? "Submit Your Staking Project"
            : "Add details to your project"}
        </h1>
        {initialForm ? (
          <CreateStakingFormOne getStakingFormOneData={getStakingFormOneData} />
        ) : (
          <CreateStakingFormTwo getStakingFormTwoData={getStakingFormTwoData} />
        )}
      </div>

      {showMsg && showMsg}
    </section>
  );
};

CreateStaking.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Staking">
    <div className="mx-auto w-full max-w-[1144px] bg-black-shade-3 font-monto ">
      {page}
    </div>
  </AllPagesWrapper>
);

export default CreateStaking;
