import Button from "@/components/button";
import { CustomNumberInput } from "@/components/custom-number-input";
import React, { useCallback, useEffect, useState } from "react";
import { PresaleDataType } from "../../../_components/launchpad-card-data";
import { customLog } from "@/utils/custom.log";
import { BlockchainRead, BlockchainWrite } from "@/web3/blockchain";
import useUser from "@/hooks/use.user";
import { useWallet } from "@/web3/hooks/use.wallet";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { formatEther } from "viem";
import { PresaleRoundDetails } from "@/web3/blockchain/types";
import { SmartContractProvider } from "@/web3/blockchain/providers/smart.contract.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";
import { LaunchpadListEnum } from "@/pages/launchpad/create-launchpad/_components/shared-enum";
import { StandardModal } from "@/components/modal/standard.modal";
import { ProgressModalShared } from "@/components/shared";
import { BigNumber } from "ethers";

interface Props extends PresaleDataType {
  token_name: string;
  token_symbol: string;
  website: string;
  description: string;
  currentRound: number;
  loadSdk: () => void;
}

export const BuyToken: React.FC<Props> = ({
  token_symbol,
  fundType,
  token,
  currentRound,
  tokenPurchaseWithBNB,
  tokenPurchaseWithBUSD,
  loadSdk,
}) => {
  const { user } = useUser();
  const { getSigner, getProvider } = useWallet();
  const [payAmount, setPayAmount] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [purchased, setPurchased] = useState(false);

  const [tokenBalance, setTokenBalance] = useState("0");
  const [roundPrice, setroundPrice] = useState(-1);
  const [allowance, setAllowance] = useState(false);

  const [modalTitle, setModalTitle] = useState("");
  const [progressModel, setProgressModel] = useState(false);
  const [errorModal, setErrorModal] = useState<false | string>(false);
  const [successModal, setSuccessModal] = useState<false | string>(false);

  const [alreadyPurchased, setAlreadyPurchased] = useState<boolean>(false);

  currentRound = currentRound - 1;

  const checkBalance = useCallback(async () => {
    const signer = getSigner();

    if (!user || !signer) return;
    try {
      if (fundType === 0) {
        const token = await BlockchainRead.getWalletBalance(signer);

        setTokenBalance(token);
      } else {
        const token =
          process.env.NEXT_PUBLIC_APP_ENV === "production"
            ? BlockchainConfig.contracts.USDT[56]
            : BlockchainConfig.contracts.USDT[11155111];

        const balance = await BlockchainRead.getERC20Balance(
          user._id,
          token,
          signer
        );

        console.log("balance: ", balance);

        setTokenBalance(balance);
      }
    } catch (err) {
      customLog(["development", "staging"], err);
    }
  }, [user, getSigner, fundType]);

  const loadRoundDetails = useCallback(async () => {
    if (currentRound < 0) return;

    const provider = getProvider();
    if (!provider) return;

    const data: PresaleRoundDetails[] =
      await BlockchainRead.launchpadPresaleRoundDetails(provider, token);

    setroundPrice(Number(data[currentRound].pricePerToken));
  }, [currentRound, getProvider, token]);

  const checkUserPurchases = useCallback(async () => {
    if (currentRound < 0) return;
    if (!user) return;
    const data = fundType === 0 ? tokenPurchaseWithBNB : tokenPurchaseWithBUSD;

    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].beneficiary === user._id &&
          currentRound <= Number(data[i].round)
        ) {
          setAlreadyPurchased(true);
        }
      }
    }
  }, [
    currentRound,
    fundType,
    tokenPurchaseWithBNB,
    tokenPurchaseWithBUSD,
    user,
  ]);

  const checkAllowance = useCallback(async () => {
    const provider = getProvider();
    if (!user || !provider) return;

    const presaleContract = SmartContractProvider.getContract(
      SmartContractName.LAUNCHPAD,
      provider
    );
    const usdtContract = SmartContractProvider.getContract(
      SmartContractName.USDT,
      provider
    );
    const allowance = await BlockchainRead.getERC20Allowance(
      provider,
      usdtContract.address,
      user._id,
      presaleContract.address
    );

    if (payAmount < Number(allowance)) {
      setAllowance(true);
    }
  }, [getProvider, payAmount, user]);

  useEffect(() => {
    checkBalance();
  }, [checkBalance]);

  useEffect(() => {
    loadRoundDetails();
  }, [loadRoundDetails]);

  useEffect(() => {
    checkUserPurchases();
  }, [checkUserPurchases]);

  useEffect(() => {
    checkAllowance();
  }, [checkAllowance]);

  const doPurchase = async () => {
    setProgressModel(true);
    setModalTitle(LaunchpadListEnum.buy_tokens);
    const signer = getSigner();
    if (!signer) return;

    try {
      if (fundType === 0) {
        await BlockchainWrite.buyPresaleToken(true, token, payAmount, signer);
      } else {
        if (!allowance) {
          await BlockchainWrite.getTokenApprovalForLaunchpad("USDT", signer);
        }

        await BlockchainWrite.buyPresaleToken(false, token, payAmount, signer);
      }
      setPurchased(true);
      loadSdk();
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
      setErrorModal(errorMessage ?? "Something went wrong!");
    }
  };

  const handleReceiveAmount = (e: any) => {
    e.preventDefault();

    setPayAmount(Number(e.target.value));

    const receivableAmount = (Number(e.target.value) * 1e18) / roundPrice;
    setReceivedAmount(receivableAmount);
  };

  return (
    <>
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
      {!alreadyPurchased && currentRound >= 0 && !purchased && (
        <div className="flex h-auto w-full flex-col gap-6 rounded-xl bg-black-shade-9 p-4 fxm:p-6">
          <div className="flex w-full flex-shrink-0 flex-col">
            <p className="font-small ml-1 text-sm text-gray-shade-14">Pay</p>

            <div className="flex w-full flex-row gap-2">
              <div className="col-span-2 w-full text-sm font-medium text-white md:col-span-2">
                <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                  <CustomNumberInput
                    value={payAmount === 0 ? "" : payAmount}
                    placeholder="0"
                    onChange={(e) => handleReceiveAmount(e)}
                    className="block w-full rounded-lg border-0 bg-transparent px-5 py-3 text-2xl placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
              <div className="mx-1 mt-2 block w-2/6 appearance-none rounded-lg border-0 text-sm">
                {/* <DropdownSwapForm
             placeholder="Token"
             options={dropDownTokens?.base ?? []}
             selectedValue={baseToken ? baseToken : tokens.base[0]}
             onSelect={(value) => {
               setBaseToken(value);
             }}
           /> */}
              </div>
            </div>
            <p className="my-4 ml-1 text-sm font-medium text-gray-shade-14">
              Balance {tokenBalance}
            </p>
            <div className="mb-5 mt-2 border-b-2 border-gray-shade-3"></div>
            <p className="font-small ml-1 text-sm text-gray-shade-14">
              Receive
            </p>

            <div className="flex w-full flex-row gap-2">
              <div className="col-span-2 w-full text-sm font-medium text-white md:col-span-2">
                <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                  <CustomNumberInput
                    readOnly
                    value={receivedAmount === 0 ? "" : receivedAmount}
                    placeholder="0"
                    className="block w-full rounded-lg border-0 bg-transparent px-5 py-3 text-2xl placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
              <div className="mx-1 mt-2 block w-2/6 appearance-none rounded-lg border-0 text-sm">
                {/* <DropdownSwapForm
             placeholder="Token"
             options={dropDownTokens?.quote ?? []}
             selectedValue={quoteToken ? quoteToken : tokens.quote[0]}
             onSelect={(value) => {
               setQuoteToken(value);
             }}
           /> */}
              </div>
            </div>
            <p className="font-small my-4 ml-1 text-sm text-gray-shade-14">
              {token_symbol}
            </p>

            <Button
              title={"Buy"}
              // disabled={isSwapping}
              onClick={() => doPurchase()}
              variant="primary"
              className="mt-4 w-full flex-shrink-0 rounded-[10px] text-sm fsm:text-base"
            />
          </div>
        </div>
      )}
    </>
  );
};
