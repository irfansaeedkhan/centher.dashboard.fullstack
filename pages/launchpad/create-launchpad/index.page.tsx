import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { isAddress, parseEther } from "ethers/lib/utils";
import { UploadToIPFSResponse, uploadMetadataToIPFS } from "@/lib/ipfs";
import { NextPageWithLayout } from "@/pages/_app.page";
import { BlockchainWrite } from "@/web3/blockchain";
import { useWallet } from "@/web3/hooks/use.wallet";
import { SmartContractProvider } from "@/web3/blockchain/providers/smart.contract.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import { customLog } from "@/utils/custom.log";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ProgressModalShared } from "@/components/shared/progress-modal";
import { StandardModal } from "@/components/modal/standard.modal";
import { FormState, TokenDetail } from "./_components/shared-types";
import { CreateLaunchpadStepsEnum } from "./_components/shared-enum";
import { MainComp } from "./_components/main-comp";

const CreateLaunchpad: NextPageWithLayout = () => {
  const { getSigner, connectedAddress } = useWallet();
  const signer = getSigner();
  const [isApproved, setisApproved] = useState(false);
  const [ipfsResponse, setIpfsResponse] = useState<UploadToIPFSResponse>({
    cid: "",
    gateway_url: "",
    ipfs_url: "",
  });
  const [modalTitle, setModalTitle] = useState("");
  const [progressModel, setProgressModel] = useState(false);
  const [errorModal, setErrorModal] = useState<false | string>(false);
  const launchpadContract = SmartContractProvider.getContract(
    SmartContractName.LAUNCHPAD,
    signer || undefined
  );

  const [tokenDetails, setTokenDetails] = useState<TokenDetail | null>(null);

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
  const totalPresaleSellingAmount = useMemo(() => {
    return formState.rounds_settings.round.reduce((prev, current) => {
      return prev + Number(current.total_selling_amount);
    }, 0);
  }, [formState.rounds_settings.round]);

  const uploadMetaData = async () => {
    try {
      setProgressModel(true);
      setModalTitle(CreateLaunchpadStepsEnum.metadata);
      const res = await uploadMetadataToIPFS(formState.add_additional_info);
      setIpfsResponse(res);
      console.log("response: ", res);
      setProgressModel(false);
    } catch (error: any) {
      let errorMessage = "Metadata not Uploaded to IPFS";
      setProgressModel(false);
      throw new Error(errorMessage);
    }
  };

  const getAllowance = useCallback(
    async (flag = true) => {
      if (!signer) return;
      if (
        !formState.verify_token.token_address ||
        !isAddress(formState.verify_token.token_address)
      ) {
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
      await getAllowance();
      setProgressModel(false);
    } catch (error: any) {
      setProgressModel(false);
      let errorMessage = "Approval tx failed";
      if (error.reason?.toLowerCase().includes("user rejected")) {
        errorMessage = "User rejected the transaction";
      } else if (error.reason) {
        errorMessage = error.reason;
      } else {
        errorMessage = error?.message ?? errorMessage;
      }
      throw new Error(errorMessage);
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

      presaleInfoParams.coinFeeRate =
        Number(presaleInfoParams.coinFeeRate) * 100;

      presaleInfoParams.tokenFeeRate =
        Number(presaleInfoParams.tokenFeeRate) * 100;

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
      setProgressModel(false);
      let errorMessage = "Presale creation failed";
      if (error.reason?.toLowerCase().includes("user rejected")) {
        errorMessage = "User rejected the transaction";
      } else if (error.reason) {
        errorMessage = error.reason;
      } else {
        errorMessage = error.message ?? errorMessage;
      }
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    // if(formState.verify_token.currency !== "USDT") return;
    getAllowance();
  }, [getAllowance]);

  useEffect(() => {
    if (
      !formState.verify_token.token_address ||
      !isAddress(formState.verify_token.token_address)
    ) {
      return;
    }

    (async () => {
      try {
        const tokenContract = SmartContractProvider.getErc20Contract(
          formState.verify_token.token_address
        );

        const [token_name, token_symbol, token_decimal] = await Promise.all([
          tokenContract.name(),
          tokenContract.symbol(),
          tokenContract.decimals(),
        ]);

        setTokenDetails({
          token_name,
          token_symbol,
          token_decimal,
          total_selling: totalPresaleSellingAmount,
        });
      } catch (e) {
        customLog(["development", "staging"], e);
      }
    })();
  }, [formState.verify_token.token_address, totalPresaleSellingAmount]);

  const handleOnSubmit = async () => {
    try {
      if (signer == null) return;

      await uploadMetaData();
      if (!isApproved) {
        await getApproval();
      }
      await createPresaleOnLaunchpad();
    } catch (error: any) {
      setErrorModal(error?.message ?? "Something went wrong!");
    }
  };

  return (
    <>
      <MainComp
        handleOnSubmit={handleOnSubmit}
        formState={formState}
        setFormState={setFormState}
        tokenDetails={tokenDetails}
        totalPresaleSellingAmount={totalPresaleSellingAmount}
      />
      {progressModel && <ProgressModalShared title={modalTitle} />}
      {errorModal && (
        <StandardModal
          confirmButtonText="OK"
          isOpen={errorModal ? true : false}
          title="Transaction Failed"
          subtitle="Transaction Failed"
          bodyText={errorModal ? errorModal : ""}
          status="error"
          onClickClose={() => setErrorModal(false)}
          onClickConfirm={() => setErrorModal(false)}
        />
      )}
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
