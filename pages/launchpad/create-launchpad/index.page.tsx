import React, { useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import Button from "@/components/button";
import RoundCard from "./_components/round-card";
import { roundCardData } from "./_components/round-card-data";
import VerifyTokenForm from "./_components/verify-tokens/verify-token-form";
import AdditionalInfoForm from "./_components/add-additional.info/additional-info-form";
import RoundsSettingsForm from "./_components/rounds-settings/rounds-settings-form";
import { FormState } from "./_components/shared-types";

const CreateLaunchpad: NextPageWithLayout = () => {
  const [formState, setFormState] = useState<FormState>({
    current_round: "rounds_settings",
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
    rounds_settings: {
      round: [],
    },
  });

  return (
    <div>
      <div className="flex w-full gap-5">
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
      <div className="mt-6 rounded-xl border border-gray-shade-3 bg-black-shade-9 p-4 fsm:p-6">
        {formState.current_round !== "verify_token" && (
          <button
            onClick={() => {
              setFormState((prev) => {
                return {
                  ...prev,
                  current_round:
                    formState.current_round === "rounds_settings"
                      ? "verify_token"
                      : formState.current_round === "add_additional_info"
                      ? "rounds_settings"
                      : "verify_token",
                };
              });
            }}
            className="hover:gradient-border-3 group mb-3 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-shade-9 p-[1px]"
          >
            <BsArrowLeftShort className="h-6 w-6 fill-gray-shade-18 group-hover:fill-white" />
          </button>
        )}
        {formState.current_round === "add_additional_info" ? (
          <AdditionalInfoForm
            formState={formState}
            setFormState={setFormState}
          />
        ) : formState.current_round === "rounds_settings" ? (
          <RoundsSettingsForm
            formState={formState}
            setFormState={setFormState}
          />
        ) : (
          <VerifyTokenForm formState={formState} setFormState={setFormState} />
        )}
        <Button
          title="Next"
          // disabled={
          //   (formState.current_round === "verify_token" &&
          //     (formState.verify_token.token_address === "" ||
          //       formState.verify_token.liquidity_lockup === "")) ||
          //   (formState.current_round === "add_additional_info" &&
          //     (formState.add_additional_info.description === "" ||
          //       formState.add_additional_info.github === "" ||
          //       formState.add_additional_info.website_url === "" ||
          //       formState.add_additional_info.logo_url === "")) ||
          //   (formState.current_round === "rounds_settings" &&
          //     formState.rounds_settings.round.length === 0)
          // }
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
