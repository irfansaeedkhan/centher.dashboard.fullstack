import React from "react";
import toast from "react-hot-toast";
import { BsArrowLeftShort } from "react-icons/bs";
import Button from "@/components/button";
import {
  RoundCard,
  roundCardData,
  Preview,
  VerifyTokenForm,
  RoundsSettingsForm,
  AdditionalInfoForm,
} from "./";
import { FormStateProps, TokenDetail } from "./shared-types";

interface Props extends FormStateProps {
  handleOnSubmit: () => void;
  tokenDetails: TokenDetail | null;
  totalPresaleSellingAmount: number;
}

export const MainComp: React.FC<Props> = ({
  formState,
  setFormState,
  handleOnSubmit,
  tokenDetails,
  totalPresaleSellingAmount,
}) => {
  return (
    <div>
      <div className="grid w-full grid-cols-1 gap-3 fsm:grid-cols-2 fsm:gap-5 fmd:grid-cols-3 flg:grid-cols-4">
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
                      : formState.current_round === "finish"
                      ? "add_additional_info"
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
        ) : formState.current_round === "finish" ? (
          <Preview
            totalPresaleSellingAmount={totalPresaleSellingAmount}
            formState={formState}
            setFormState={setFormState}
            tokenDetails={tokenDetails}
          />
        ) : (
          <VerifyTokenForm formState={formState} setFormState={setFormState} />
        )}
        <Button
          title={formState.current_round === "finish" ? "Submit" : "Next"}
          disabled={
            (formState.current_round === "verify_token" &&
              (formState.verify_token.token_address === "" ||
                formState.verify_token.sale_rounds === 0)) ||
            (formState.current_round === "add_additional_info" &&
              (formState.add_additional_info.description === "" ||
                formState.add_additional_info.github === "" ||
                formState.add_additional_info.website_url === "" ||
                formState.add_additional_info.logo_url === "")) ||
            (formState.current_round === "rounds_settings" &&
              Array.from(
                { length: formState.verify_token.sale_rounds },
                (_, i) => i + 1
              ).some((item) => {
                return (
                  formState.rounds_settings.round[item - 1]
                    .total_selling_amount === 0 ||
                  formState.rounds_settings.round[item - 1]
                    .total_selling_amount === "" ||
                  formState.rounds_settings.round[item - 1].soft_cap_busd ===
                    0 ||
                  formState.rounds_settings.round[item - 1].soft_cap_busd ===
                    "" ||
                  formState.rounds_settings.round[item - 1].token_price === 0 ||
                  formState.rounds_settings.round[item - 1].token_price ===
                    "" ||
                  formState.rounds_settings.round[item - 1].min_contribution ===
                    0 ||
                  formState.rounds_settings.round[item - 1].min_contribution ===
                    "" ||
                  formState.rounds_settings.round[item - 1].max_contribution ===
                    0 ||
                  formState.rounds_settings.round[item - 1].max_contribution ===
                    "" ||
                  formState.rounds_settings.round[item - 1].end_time === null ||
                  formState.rounds_settings.round[item - 1].start_time === null
                );
              }))
          }
          className="mx-auto mt-6 w-full max-w-[496px]"
          onClick={() => {
            // if (formState.current_round === "finish") {
            //   //calling
            // }
            if (formState.verify_token.sale_rounds === 0) {
              toast.error("Please select sale rounds");
              return;
            }

            if (formState.current_round === "finish") {
              handleOnSubmit();
            }

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
