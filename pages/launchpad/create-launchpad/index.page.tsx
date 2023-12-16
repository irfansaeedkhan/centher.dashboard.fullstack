import React, { useCallback, useEffect, useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import toast from "react-hot-toast";
import Button from "@/components/button";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { FormState } from "./_components/shared-types";
import {
  AdditionalInfoForm,
  Preview,
  RoundCard,
  RoundsSettingsForm,
  VerifyTokenForm,
  roundCardData,
} from "./_components";
import { ValidJSON, uploadMetadataToIPFS } from "@/lib/ipfs";
import { BlockchainWrite } from "@/web3/blockchain";
import { useWallet } from "@/web3/hooks/use.wallet";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { SmartContractProvider } from "@/web3/blockchain/providers/smart.contract.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import { BigNumber, ethers } from "ethers";

const CreateLaunchpad: NextPageWithLayout = () => {
  const { getSigner, connectedAddress } = useWallet();

  const signer = getSigner();

  const [isApproved, setisApproved] = useState(false);

  const launchpadContract = SmartContractProvider.getContract(
    SmartContractName.LAUNCHPAD,
    signer || undefined
  );

  const [formState, setFormState] = useState<FormState>({
    current_round: "verify_token",
    verify_token: {
      token_address: "",
      sale_rounds: 0,
      currency: "BNB",
      fee_option: 5,
      liquidity_lockup: 30,
      release_month: 3,
      add_fee: 0,
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

  const handleUploadMetadata = async () => {
    try {
      let metaDataFinal = {};
      let response: any = {};
      const { memberData: _, ...metaData } = formState.add_additional_info;
      if (formState.add_additional_info.memberData.length > 0) {
        const memberData: ValidJSON = formState.add_additional_info.memberData;
        response = await uploadMetadataToIPFS(memberData);
        metaDataFinal = {
          ...metaData,
          memberData: response.ipfs_url ?? "",
        };
      }

      const res = await uploadMetadataToIPFS(
        formState.add_additional_info.memberData.length > 0
          ? metaDataFinal
          : metaData
      );

      console.log("Metadata Uploaded to IPFS", res);

      const presaleInfoParams = {
        owner: connectedAddress,
        token: formState.verify_token.token_address,
        minTokensToSell: parseEther("1").toString(),
        maxTokensToSell: parseEther("100000000000000000000").toString(),
        roundDeep: formState.verify_token.sale_rounds,
        coinFeeRate: Number(100), //formState.verify_token.add_fee,
        tokenFeeRate: Number(100), //formState.verify_token.add_fee,
        releaseMonth: 10,
        isRefSupport: false,
        fundType: formState.verify_token.currency === "BNB" ? 0 : 1,
        metadata: res.ipfs_url,
      };

      // const roundOneStart = Math.floor(Date.now() / 1000) + 600;
      // const roundOneEnd = Math.floor(Date.now() / 1000) + 28800;

      const roundParams = [
        {
          startTime:
            Number(formState.rounds_settings.round[0].start_time) / 1000,
          endTime: Number(formState.rounds_settings.round[0].end_time) / 1000,
          lockMonths: 3, //Number(formState.verify_token.liquidity_lockup),
          minContribution: parseEther(
            formState.rounds_settings.round[0].min_contribution + ""
          ).toString(),
          maxContribution: parseEther(
            formState.rounds_settings.round[0].max_contribution + ""
          ).toString(),
          tokensToSell: parseEther(
            formState.rounds_settings.round[0].total_selling_amount + ""
          ).toString(),
          pricePerToken: parseEther(
            formState.rounds_settings.round[0].token_price + ""
          ).toString(),
        },
      ];

      // const roundParams = [];
      // for (let i = 0; i < formState.verify_token.sale_rounds; i++) {
      //   let roundData = {
      //     startTime:
      //       Number(formState.rounds_settings.round[i].start_time) / 1000,
      //     endTime: Number(formState.rounds_settings.round[i].end_time) / 1000,
      //     lockMonths: Number(formState.verify_token.liquidity_lockup),
      //     minContribution: parseEther(
      //       formState.rounds_settings.round[i].min_contribution + ""
      //     ).toString(),
      //     maxContribution: parseEther(
      //       formState.rounds_settings.round[i].max_contribution + ""
      //     ).toString(),
      //     tokensToSell: parseEther(
      //       formState.rounds_settings.round[i].total_selling_amount + ""
      //     ).toString(),
      //     pricePerToken: parseEther(
      //       formState.rounds_settings.round[i].token_price + ""
      //     ).toString(),
      //   };
      //   roundParams.push(roundData);
      // }

      if (signer == null) return;

      await BlockchainWrite.createLaunchpad(
        signer,
        presaleInfoParams,
        roundParams
      );
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const getAllowance = useCallback(
    async (flag = true) => {
      if (!signer) return;

      if (!formState.verify_token.token_address) {
        return;
      }

      const tokenContract = SmartContractProvider.getErc20Contract(
        formState.verify_token.token_address
      );

      const _allowance: BigNumber = await tokenContract.allowance(
        signer.getAddress(),
        launchpadContract.address
      );

      if (flag) {
        setisApproved(
          _allowance.gt(parseEther("100000000000000000000").toString())
        );
      }
    },
    [signer, formState.verify_token.token_address, launchpadContract.address]
  );

  useEffect(() => {
    let flag = true;

    getAllowance(flag);

    return () => {
      flag = false;
    };
  }, [getAllowance]);

  const getApproval = async () => {
    if (!signer) return;

    try {
      const tokenContract = SmartContractProvider.getErc20Contract(
        formState.verify_token.token_address,
        signer
      );

      const tx = await tokenContract.approve(
        launchpadContract.address,
        ethers.constants.MaxUint256
      );

      await tx.wait();

      getAllowance();
    } catch (e) {
      console.log("error: ", e);
    }
  };

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
          <Preview formState={formState} setFormState={setFormState} />
        ) : (
          <VerifyTokenForm formState={formState} setFormState={setFormState} />
        )}
        <Button
          title={
            formState.current_round === "finish"
              ? !isApproved && formState.verify_token.currency !== "BNB"
                ? "Approval"
                : "Submit"
              : "Next"
          }
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
            // if (formState.current_round === "finish") {
            //   //calling
            // }
            if (formState.verify_token.sale_rounds === 0) {
              toast.error("Please select sale rounds");
              return;
            }

            if (formState.current_round === "finish") {
              if (!isApproved && formState.verify_token.currency !== "BNB") {
                getApproval();
                return;
              }

              handleUploadMetadata();
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

CreateLaunchpad.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Create Launchpad">
    <div className="mx-auto min-h-screen w-full max-w-[1112px] bg-black-shade-3 pb-10 font-monto">
      {page}
    </div>
  </AllPagesWrapper>
);

export default CreateLaunchpad;
