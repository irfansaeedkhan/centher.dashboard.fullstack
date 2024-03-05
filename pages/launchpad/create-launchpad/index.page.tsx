import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber, ethers } from "ethers";
import toast from "react-hot-toast";
import { isAddress, parseEther } from "ethers/lib/utils";
import { UploadToIPFSResponse, uploadMetadataToIPFS } from "@/lib/ipfs";
import { NextPageWithLayout } from "@/pages/_app.page";
import { BlockchainRead, BlockchainWrite } from "@/web3/blockchain";
import { useWallet } from "@/web3/hooks/use.wallet";
import { SmartContractProvider } from "@/web3/blockchain/providers/smart.contract.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import { customLog } from "@/utils/custom.log";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { ProgressModalShared } from "@/components/shared/progress-modal";
import { StandardModal } from "@/components/modal/standard.modal";
import {
  FormState,
  TokenDetail,
  initialFormState,
} from "./_components/shared-types";
import { CreateLaunchpadStepsEnum } from "./_components/shared-enum";
import { MainComp } from "./_components/main-comp";
import { useLaunchpad } from "@/hooks/launchpad";

const CreateLaunchpad: NextPageWithLayout = () => {
  const { getSigner, connectedAddress } = useWallet();
  const signer = getSigner();
  const launchpadContract = SmartContractProvider.getContract(
    SmartContractName.LAUNCHPAD,
    signer || undefined
  );
  const [isApproved, setisApproved] = useState(false);
  const [ipfsResponse, setIpfsResponse] = useState<UploadToIPFSResponse>({
    cid: "",
    gateway_url: "",
    ipfs_url: "",
  });
  const [modalTitle, setModalTitle] = useState("");
  const [progressModel, setProgressModel] = useState(false);
  const [errorModal, setErrorModal] = useState<false | string>(false);
  const [successModal, setSuccessModal] = useState<false | string>(false);
  const [validTokenAddress, setValidTokenAddress] = useState(false);
  const [tokenDetails, setTokenDetails] = useState<TokenDetail | null>(null);
  const [presaleCreationFees, setPresaleCreationFees] = useState<
    number | string | null
  >(null);
  const [formState, setFormState] = useState<FormState>(initialFormState);

  const [presaleDetails, setPresaleDetails] = useState<any>([]);

  const { sdk } = useLaunchpad();

  const totalPresaleSellingAmount = useMemo(() => {
    return formState.rounds_settings.round.reduce((prev, current) => {
      return prev + Number(current.total_selling_amount);
    }, 0);
  }, [formState.rounds_settings.round]);

  const getAllowance = useCallback(
    async (flag = true) => {
      if (!signer) return;
      if (
        !formState.verify_token.token_address ||
        !isAddress(formState.verify_token.token_address)
      ) {
        return;
      }

      const isValidContract = await BlockchainRead.checkAddress(
        formState.verify_token.token_address,
        signer
      );

      if (!isValidContract) return;

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

  useEffect(() => {
    (async () => {
      try {
        if (!signer) return;
        const createFees = await BlockchainRead.launchpadCreateFee(signer);
        setPresaleCreationFees(createFees);
      } catch (e) {
        customLog(["development", "staging"], e);
      }
    })();
  }, [signer]);

  useEffect(() => {
    getAllowance();
  }, [getAllowance]);

  useEffect(() => {
    if (
      !formState.verify_token.token_address ||
      !isAddress(formState.verify_token.token_address)
    ) {
      return;
    }

    if (!signer) return;

    (async () => {
      try {
        setValidTokenAddress(false);
        const isValidContract = await BlockchainRead.checkAddress(
          formState.verify_token.token_address,
          signer
        );

        if (!isValidContract) {
          setValidTokenAddress(true);
          toast.error("Invalid token address");
          return;
        }

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

        setFormState((prev) => {
          return {
            ...prev,
            add_additional_info: {
              ...prev.add_additional_info,
              token_name: token_name as string,
              token_symbol: token_symbol as string,
            },
          };
        });
      } catch (e) {
        customLog(["development", "staging"], e);
      }
    })();
  }, [formState.verify_token.token_address, signer, totalPresaleSellingAmount]);

  useEffect(() => {
    if (formState.verify_token.token_address === "") return;
    (async () => {
      try {
        if (sdk) {
          let result = await sdk.getPresale(
            formState.verify_token.token_address
          );

          setPresaleDetails(result);
        }
      } catch (e) {
        customLog(["development", "staging"], e);
      }
    })();
  }, [formState.verify_token.token_address, sdk]);

  const uploadMetaData = async () => {
    try {
      setProgressModel(true);
      setModalTitle(CreateLaunchpadStepsEnum.metadata);
      const res = await uploadMetadataToIPFS(formState.add_additional_info);
      setIpfsResponse(res);
      setProgressModel(false);
      return res.ipfs_url;
    } catch (error: any) {
      let errorMessage = "Metadata not Uploaded to IPFS";
      setProgressModel(false);
      throw new Error(errorMessage);
    }
  };

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

  const createPresaleOnLaunchpad = async (ipfsMetadataUrl: string) => {
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
        releaseMonth: formState.verify_token.release_month,
        isRefSupport:
          formState.verify_token.multilevel_reward === "recurring_return"
            ? true
            : false,
        fundType: formState.verify_token.currency === "BNB" ? 0 : 1,
        metadata: ipfsMetadataUrl,
      };

      presaleInfoParams.coinFeeRate =
        Number(presaleInfoParams.coinFeeRate) * 100;

      presaleInfoParams.tokenFeeRate =
        Number(presaleInfoParams.tokenFeeRate) * 100;

      const roundParams = [];
      for (let i = 0; i < formState.verify_token.sale_rounds; i++) {
        let roundData = {
          startTime: (
            Number(formState.rounds_settings.round[i].start_time) / 1000
          ).toFixed(),
          endTime: (
            Number(formState.rounds_settings.round[i].end_time) / 1000
          ).toFixed(),
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
      // setSuccessModal("Token Presale created successfully");
      setFormState(initialFormState);
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

  const setRefSettings = async () => {
    setProgressModel(true);
    setModalTitle(CreateLaunchpadStepsEnum.affiliate);
    try {
      if (!signer) return;

      const percents = [];

      for (
        let i = 0;
        i < formState.verify_token.multilevel_reward_system.length;
        i++
      ) {
        percents.push(
          Number(formState.verify_token.multilevel_reward_system[i].reward) *
            100
        );
      }
      await BlockchainWrite.setAffiliateSetting(
        signer,
        formState.verify_token.token_address,
        percents
      );
      setProgressModel(false);
      // setSuccessModal("Presale referrer settings updated successfully");
      setFormState(initialFormState);
    } catch (error: any) {
      setProgressModel(false);
      let errorMessage = "Presale referrer settings failed";
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

  const handleOnSubmit = async () => {
    try {
      if (signer == null) return;
      if (!sdk) return;
      const ipfsUrl = await uploadMetaData();
      if (!isApproved) {
        await getApproval();
      }

      const isAlreadyExist = await BlockchainRead.presaleAlreadyCreated(
        formState.verify_token.token_address
      );

      if (!isAlreadyExist) {
        await createPresaleOnLaunchpad(ipfsUrl);
      }

      if (
        formState.verify_token.multilevel_reward === "recurring_return" &&
        !presaleDetails.isActive
      ) {
        await setRefSettings();
      }

      setSuccessModal("Token Presale created successfully");
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
        presaleCreationFees={presaleCreationFees}
        validTokenAddress={validTokenAddress}
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
      {successModal && (
        <StandardModal
          confirmButtonText="OK"
          isOpen={successModal ? true : false}
          title="Transaction Successful"
          subtitle="Transaction Successful"
          bodyText={successModal ? successModal : ""}
          status="success"
          onClickClose={() => setSuccessModal(false)}
          onClickConfirm={() => setSuccessModal(false)}
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
