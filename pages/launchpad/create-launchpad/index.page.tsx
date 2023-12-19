import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import toast from "react-hot-toast";
import Button from "@/components/button";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { FormState, ProgressModal } from "./_components/shared-types";
import {
  AdditionalInfoForm,
  Preview,
  RoundCard,
  RoundsSettingsForm,
  VerifyTokenForm,
  roundCardData,
} from "./_components";
import {
  UploadToIPFSResponse,
  ValidJSON,
  uploadMetadataToIPFS,
} from "@/lib/ipfs";
import { BlockchainWrite } from "@/web3/blockchain";
import { useWallet } from "@/web3/hooks/use.wallet";
import { parseEther } from "ethers/lib/utils";
import { SmartContractProvider } from "@/web3/blockchain/providers/smart.contract.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import { BigNumber, ethers } from "ethers";
import { AppError } from "@/utils/app-error";
import { CreateLaunchpadStepsEnum } from "./_components/shared-enum";
import { MainComp } from "./_components/main-comp";
import { ProgressModalShared } from "@/components/shared/progress-modal";

const CreateLaunchpad: NextPageWithLayout = () => {
  const { getSigner, connectedAddress } = useWallet();
  const signer = getSigner();
  const [isApproved, setisApproved] = useState(false);
  // const [totalSellingAmount, setTotalSellingAmount] = useState(0);

  const [ipfsResponse, setIpfsResponse] = useState<UploadToIPFSResponse>({
    cid: "",
    gateway_url: "",
    ipfs_url: "",
  });
  const [modalTitle, setModalTitle] = useState("");
  const [progressModel, setProgressModel] = useState(false);
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
      fee_option: 5, //max: 10000
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
  const totalPresaleSellingAmount = useMemo(() => {
    return formState.rounds_settings.round.reduce((prev, current) => {
      return prev + Number(current.total_selling_amount);
    }, 0);
  }, [formState.rounds_settings.round]);
  // const totalPresaleSellingAmount = formState.rounds_settings.round.reduce(
  //   (prev, current) => {
  //     return prev + Number(current.total_selling_amount);
  //   },
  //   0
  // );

  const uploadMetaData = async () => {
    try {
      setProgressModel(true);
      setModalTitle(CreateLaunchpadStepsEnum.metadata);
      let metaDataFinal = {};

      const { memberData: _, ...metaData } = formState.add_additional_info;
      if (formState.add_additional_info.memberData.length > 0) {
        const memberData: ValidJSON = formState.add_additional_info.memberData;
        const response = await uploadMetadataToIPFS(memberData);
        metaDataFinal = {
          ...metaData,
          memberData: response.ipfs_url,
        };
      }

      const res = await uploadMetadataToIPFS(
        formState.add_additional_info.memberData.length > 0
          ? metaDataFinal
          : metaData
      );

      console.log("Metadata Uploaded to IPFS", res);

      setIpfsResponse(res);
      // setProgressModel(false);
    } catch (error: any) {
      let errorMessage = "Metadata not Uploaded to IPFS";

      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "uploadMetaData"
      );
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

      console.log("_allowance: ", _allowance);
      console.log(
        "totalPresaleSellingAmount: ",
        parseEther(totalPresaleSellingAmount.toString())
      );
      console.log(
        "condition status: ",
        _allowance.gt(parseEther(totalPresaleSellingAmount + ""))
      );

      if (flag) {
        setisApproved(
          _allowance.gt(parseEther(totalPresaleSellingAmount + ""))
        );
      }
    },
    [
      signer,
      formState.verify_token.token_address,
      launchpadContract.address,
      totalPresaleSellingAmount,
    ]
  );

  const getApproval = async () => {
    if (!signer) return;

    setProgressModel(true);
    setModalTitle(CreateLaunchpadStepsEnum.launchpad_approval);

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

      setProgressModel(false);
    } catch (error: any) {
      let errorMessage = "Approval tx failed";

      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "getApproval"
      );
    }
  };

  const createPresaleOnLaunchpad = async () => {
    if (!signer) return;

    setProgressModel(true);
    setModalTitle(CreateLaunchpadStepsEnum.contract);

    try {
      let presaleInfoParams = {
        owner: connectedAddress,
        token: formState.verify_token.token_address,
        minTokensToSell: parseEther("1").toString(),
        maxTokensToSell: parseEther("1").toString(),
        roundDeep: formState.verify_token.sale_rounds,
        coinFeeRate:
          formState.verify_token.fee_option === "Other"
            ? formState.verify_token.add_fee
            : formState.verify_token.fee_option,
        tokenFeeRate:
          formState.verify_token.fee_option === "Other"
            ? formState.verify_token.add_fee
            : formState.verify_token.fee_option,
        releaseMonth: 10,
        isRefSupport: false,
        fundType: formState.verify_token.currency === "BNB" ? 0 : 1,
        metadata: ipfsResponse.ipfs_url,
      };

      const roundParams = [];
      for (let i = 0; i < formState.verify_token.sale_rounds; i++) {
        let roundData = {
          startTime:
            Number(formState.rounds_settings.round[i].start_time) / 1000,
          endTime: Number(formState.rounds_settings.round[i].end_time) / 1000,
          lockMonths: Number(formState.verify_token.liquidity_lockup) / 30,
          minContribution: parseEther(
            formState.rounds_settings.round[i].min_contribution + ""
          ).toString(),
          maxContribution: parseEther(
            formState.rounds_settings.round[i].max_contribution + ""
          ).toString(),
          tokensToSell: parseEther(
            formState.rounds_settings.round[i].total_selling_amount + ""
          ).toString(),
          pricePerToken: parseEther(
            formState.rounds_settings.round[i].token_price + ""
          ).toString(),
        };
        roundParams.push(roundData);
      }

      presaleInfoParams.maxTokensToSell = parseEther(
        totalPresaleSellingAmount.toString()
      ).toString();

      if (signer == null) return;

      await BlockchainWrite.createLaunchpad(
        signer,
        presaleInfoParams,
        roundParams
      );
      setProgressModel(false);
    } catch (error: any) {
      let errorMessage = "createPresale tx failed";

      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "createPresaleOnLaunchpad"
      );
    }
  };

  useEffect(() => {
    getAllowance();
  }, [getAllowance]);

  const handleOnSubmit = async () => {
    try {
      if (signer == null) return;

      await uploadMetaData();

      // await getAllowance();

      if (!isApproved && formState.verify_token.currency !== "BNB") {
        await getApproval();
      }

      await createPresaleOnLaunchpad();
    } catch (error: any) {
      let errorMessage = "Presale not created";

      throw new AppError(
        error,
        error.response?.data?.message ?? errorMessage,
        "handleOnSubmit"
      );
    }
  };

  return (
    <>
      <MainComp
        handleOnSubmit={handleOnSubmit}
        formState={formState}
        setFormState={setFormState}
      />
      {progressModel && <ProgressModalShared title={modalTitle} />}
    </>
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
