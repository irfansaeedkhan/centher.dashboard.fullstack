import React, { useState, useEffect, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import toast from "react-hot-toast";
import clsx from "clsx";

import {
  getTokenBalance,
  getTokenAllowance,
  useGetContributionInfo,
} from "@/web3/hooks/use.contracts.functions";
import Button from "@/components/button";
import { RoundInfo } from "@/web3/constants/types";
import { StandardModal, ModalState } from "@/components/modal/standard.modal";
import {
  BUSDIconBG,
  LockedIcon,
  CentherIconBG,
  DXCIconBG,
} from "@/assets/svgs";

import { SelectedTokenA, SelectedTokenB } from "./types";
import { CentherTable } from "./centher.table";
import { ConversionContainerV2 } from "./conversion.containerv2";
import TimelinePeriod from "./timeline.period";
import { BlockchainWrite } from "@/web3/blockchain";

interface Props {
  roundInfo: RoundInfo;
  refreshRoundsInfo: () => void;
}

export const PurchaseCentherCardV2: React.FC<Props> = ({
  roundInfo,
  refreshRoundsInfo,
}) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const [isApproved, setIsApproved] = useState(false);
  const { contributionInfo, refreshContributionInfo } = useGetContributionInfo(
    account,
    roundInfo
  );

  const [selectedTokenA, setSelectedTokenA] = useState<SelectedTokenA>({
    tokenName: "BUSD",
    tokenIcon: <BUSDIconBG className="h-10 w-10" />,
    tokenBalance: 0,
    minContribution: roundInfo ? roundInfo.minContributionForBusd : 0,
    maxContribution: roundInfo ? roundInfo.maxContributionForBusd : 0,
    rate: roundInfo ? roundInfo.priceForBusd : 0,

    inputValue: roundInfo ? roundInfo.minContributionForBusd : 0,
    inputMinValue: roundInfo ? roundInfo.minContributionForBusd : 0,
    inputMaxValue: roundInfo ? roundInfo.maxContributionForBusd : 0,
  });

  useEffect(() => {
    if (!account || !library || !roundInfo) return;
    setSelectedTokenA((prev) => ({
      ...prev,
      tokenName: "BUSD",
      tokenIcon: <BUSDIconBG className="h-10 w-10" />,
      minContribution: roundInfo?.minContributionForBusd,
      maxContribution: roundInfo?.maxContributionForBusd,
      rate: roundInfo?.priceForBusd,

      inputValue: roundInfo?.minContributionForBusd,
      inputMinValue: roundInfo?.minContributionForBusd,
      inputMaxValue: roundInfo?.maxContributionForBusd,
    }));
  }, [account, library, roundInfo]);

  const [selectedTokenB, setSelectedTokenB] = useState<SelectedTokenB>({
    tokenName: "CTHR",
    tokenIcon: <DXCIconBG className="h-10 w-10" />,
    tokenBalance: 0,
    inputValue: roundInfo
      ? roundInfo.minContributionForBusd / roundInfo.priceForBusd
      : 0,
  });

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    status: "warning",
    title: "Authorization Contract",
    subtitle: `Allow BUSD to use your ${selectedTokenA.tokenName} token`,
    bodyText: `Confirmation of the ${selectedTokenA.tokenName} token to interact with the DeXa contract.`,
    confirmButtonText: "Authorize",
    onClose: () => {
      setModal((prev) => ({
        ...prev,
        isOpen: false,
      }));
    },
    onClickConfirm: () => {},
  });

  // Get selectedTokenA balance
  useEffect(() => {
    if (!account || !library) return;
    const getSelectedTokenBalance = async () => {
      getTokenBalance(selectedTokenA.tokenName, 18, account, library).then(
        (tokenBalanace) =>
          setSelectedTokenA((prev) => ({
            ...prev,
            tokenBalance: tokenBalanace,
          }))
      );
    };
    getSelectedTokenBalance();
  }, [account, selectedTokenA.tokenName, library]);

  // Get selectedTokenB balance
  useEffect(() => {
    if (!account || !library) return;
    const getSelectedTokenBalance = async () => {
      getTokenBalance(selectedTokenB.tokenName, 18, account, library).then(
        (tokenBalanace) =>
          setSelectedTokenB((prev) => ({
            ...prev,
            tokenBalance: tokenBalanace,
          }))
      );
    };
    getSelectedTokenBalance();
  }, [account, selectedTokenB.tokenName, library]);

  const checkSelectedTokenAllowance = useCallback(async () => {
    if (!account || !library) return;
    const tokenAllowance = await getTokenAllowance(
      selectedTokenA.tokenName,
      account,
      library
    );
    if (
      tokenAllowance !== 0 &&
      tokenAllowance >= selectedTokenA.minContribution
    ) {
      setIsApproved(true);
    } else {
      setIsApproved(false);
    }
  }, [
    account,
    selectedTokenA.minContribution,
    selectedTokenA.tokenName,
    library,
  ]);

  // Get selected token allowance
  useEffect(() => {
    checkSelectedTokenAllowance();
  }, [checkSelectedTokenAllowance]);

  const openAuthorizeModal = () => {
    setModal((prev) => ({
      ...prev,
      isOpen: true,
      status: "warning",
      title: "Authorization Contract",
      subtitle: `Allow BUSD to use your ${selectedTokenA.tokenName} token`,
      bodyText: `Confirmation of the ${selectedTokenA.tokenName} token to interact with the DeXa contract.`,
      confirmButtonText: "Authorize",
      onClickConfirm: handleClickAuthorize,
    }));
  };

  const handleClickAuthorize = async () => {
    if (!account || !library) return;
    setModal((prev) => ({
      ...prev,
      status: "progress",
    }));

    try {
      await BlockchainWrite.getTokenApproval(selectedTokenA.tokenName, library);
      toast.success("Authorization successful");
      setModal((prev) => ({
        ...prev,
        isOpen: false,
      }));
      checkSelectedTokenAllowance();
    } catch (error) {
      toast.error("Token authorization failed");
      setModal((prev) => ({
        ...prev,
        status: "warning",
      }));
    }
  };

  const openBuyModal = () => {
    if (
      !selectedTokenA.inputValue ||
      selectedTokenA.inputValue < selectedTokenA.minContribution
    ) {
      toast.error(
        `Minimum contribution is ${selectedTokenA.minContribution} ${selectedTokenA.tokenName}`
      );
      return;
    }

    if (selectedTokenA.inputValue > selectedTokenA.tokenBalance) {
      toast.error(`You do not have enough ${selectedTokenA.tokenName}`);
      return;
    }

    setModal((prev) => ({
      ...prev,
      isOpen: true,
      status: "buy-cthr",
      title: "Buy Now",
      subtitle: `Do you want to buy DXC?`,
      bodyText: `Confirm that you pay ${selectedTokenA.inputValue} ${selectedTokenA.tokenName} to buy ${selectedTokenB.inputValue} DXC.`,
      confirmButtonText: "Buy Now",
      onClickConfirm: handleBuyCenther,
    }));
  };

  const handleBuyCenther = async () => {
    try {
      if (!account || !library || !selectedTokenA.inputValue) return;

      setModal((prev) => ({
        ...prev,
        status: "progress",
      }));

      await BlockchainWrite.buyCenther(
        selectedTokenA.tokenName,
        selectedTokenA.inputValue,
        library
      );

      refreshContributionInfo();
      refreshRoundsInfo();
      setModal((prev) => ({
        ...prev,
        title: "Success",
        subtitle: "Purchase Successful",
        bodyText: `You have bought DXC. DXC will be locked for ${roundInfo?.lockMonths} months. You can claim when unlocked.`,
        status: "success",
      }));
    } catch (error) {
      toast.error("Purchase Transaction Failed");
      setModal((prev) => ({
        ...prev,
        status: "error",
        confirmButtonText: "Try Again",
      }));
    }
  };

  return (
    <div className="relative mt-4">
      {roundInfo?.status === "not-started" && (
        <div
          className={`absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center`}
        >
          <div className={`flex flex-col items-center justify-center gap-10`}>
            <LockedIcon className="h-[80px] w-[80px]" />
            <h6 className={`text-20px font-semibold text-white`}>
              Wait for the presale to start
            </h6>
          </div>
        </div>
      )}

      <div
        className={clsx(
          roundInfo?.status === "not-started" &&
            "pointer-events-none bg-black-shade-3/60 blur-xl"
        )}
      >
        <div className={`rounded-xl bg-background-shade-3`}>
          <h1
            className={`border-b-2 border-b-gray-shade-3 px-5 py-6 text-center text-sm font-semibold text-white fsm:px-8 fsm:text-xl fmd:py-8 flg:text-2xl`}
          >
            Please Enter DXC amount to you&apos;d like to purchase
          </h1>

          <div className="px-3 py-6 fsm:px-6 fsm:py-8 flg:p-12">
            <ConversionContainerV2
              selectedTokenA={selectedTokenA}
              setSelectedTokenA={setSelectedTokenA}
              selectedTokenB={selectedTokenB}
              setSelectedTokenB={setSelectedTokenB}
              roundInfo={roundInfo}
            />

            {roundInfo?.status === "active" && (
              <div
                className={`mx-auto max-w-[442px] pt-8 text-center lg:pt-12`}
              >
                <h6
                  className={`pb-4 text-xs font-semibold text-gray-shade-7 fmd:text-sm`}
                >
                  Minimum Buy:{" "}
                  <span className={`text-white`}>
                    {selectedTokenA.minContribution} {selectedTokenA.tokenName}
                  </span>
                </h6>
                <Button
                  title={isApproved ? "Buy now" : "Authorize"}
                  variant="v1"
                  onClick={
                    !account
                      ? () => {
                          toast.error("Please connect your wallet");
                        }
                      : isApproved
                      ? openBuyModal
                      : openAuthorizeModal
                  }
                  className="py-3"
                />

                <StandardModal
                  isOpen={modal.isOpen}
                  status={modal.status}
                  title={modal.title}
                  subtitle={modal.subtitle}
                  bodyText={modal.bodyText}
                  onClickClose={modal.onClose}
                  confirmButtonText={modal.confirmButtonText}
                  onClickConfirm={modal.onClickConfirm}
                />
              </div>
            )}

            {roundInfo?.status === "ended" && (
              <div
                className={`mx-auto mt-8 w-fit rounded-xl bg-[#E6535A]/10 py-2 px-5 text-center lg:mt-12`}
              >
                <p
                  className={`text-sm font-semibold text-[#E6535A] fsm:text-base fmd:text-base`}
                >
                  Round {roundInfo?.round + 1} is over! Buy another available or
                  wait for the next round.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* {!contributionInfo ||
      (!contributionInfo.contributedBusdAmount &&
        !contributionInfo.contributedNtrAmount) ? null : (
        <CentherTable
          roundInfo={roundInfo}
          contributionInfo={contributionInfo}
          refetchContributionInfo={refreshContributionInfo}
        />
      )} */}
      {!contributionInfo ||
      (!contributionInfo.contributedBusdAmount &&
        !contributionInfo.contributedNtrAmount) ? null : (
        <TimelinePeriod
          roundInfo={roundInfo}
          contributionInfo={contributionInfo}
          refetchContributionInfo={refreshContributionInfo}
        />
      )}
    </div>
  );
};
