import React, { useState } from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import Button from "@/components/button";
import RoundCard from "./_components/round-card";
import { roundCardData } from "./_components/round-card-data";
import VerifyTokenForm from "./_components/verify-tokens/verify-token-form";
import AdditionalInfoForm from "./_components/add-additional.info/additional-info-form";

export type FormState = {
  current_round:
    | "verify_token"
    | "rounds_settings"
    | "add_additional_info"
    | "finish";
  verify_token: {
    token_address: string;
    sale_rounds: number;
    currency: string;
    fee_option: string;
    liquidity_lockup: string;
  };
  add_additional_info: {
    logo_url: string;
    website_url: string;
    facebook: string;
    twitter: string;
    github: string;
    telegram: string;
    instagram: string;
    discord: string;
    reddit: string;
    description: string;
    memberData: {
      jobTitle: string;
      walletAddress: string;
    }[];
  };
};

const CreateLaunchpad: NextPageWithLayout = () => {
  const [formState, setFormState] = useState<FormState>({
    current_round: "add_additional_info",
    verify_token: {
      token_address: "",
      sale_rounds: 1,
      currency: "MATIC",
      fee_option: "5% MATIC raised only",
      liquidity_lockup: "",
    },
    add_additional_info: {
      logo_url: "",
      website_url: "",
      facebook: "",
      twitter: "",
      github: "",
      telegram: "",
      instagram: "",
      discord: "",
      reddit: "",
      description: "",
      memberData: [],
    },
  });
  return (
    <div>
      <div className="flex w-full items-center gap-5">
        {roundCardData.map((item) => (
          <RoundCard
            key={item.round_no}
            round_no={item.round_no}
            current_round={formState.current_round}
            round={item.round}
            description={item.description}
            title={item.title}
          />
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-gray-shade-3 bg-black-shade-9 p-6">
        {formState.current_round === "add_additional_info" ? (
          <AdditionalInfoForm
            formState={formState}
            setFormState={setFormState}
          />
        ) : (
          <VerifyTokenForm formState={formState} setFormState={setFormState} />
        )}
        <Button
          title="Next"
          disabled={
            (formState.current_round === "verify_token" &&
              (formState.verify_token.token_address === "" ||
                formState.verify_token.liquidity_lockup === "")) ||
            (formState.current_round === "add_additional_info" &&
              (formState.add_additional_info.description === "" ||
                formState.add_additional_info.github === "" ||
                formState.add_additional_info.website_url === "" ||
                formState.add_additional_info.logo_url === ""))
          }
          className="mx-auto mt-6 w-full max-w-[496px]"
          onClick={() => {
            setFormState((prev) => {
              return {
                ...prev,
                current_round:
                  formState.current_round === "verify_token"
                    ? "rounds_settings"
                    : formState.current_round === "rounds_settings"
                    ? "add_additional_info"
                    : "finish",
              };
            });
          }}
        />
      </div>
    </div>
  );
};

CreateLaunchpad.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Create Launchpad">
    <div className="mx-auto min-h-screen w-full max-w-[1112px] bg-black-shade-3 pb-10 font-monto">
      {page}
    </div>
  </AllPagesWrapper>
);

export default CreateLaunchpad;
