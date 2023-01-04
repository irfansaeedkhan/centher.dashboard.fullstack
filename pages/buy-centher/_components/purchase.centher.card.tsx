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
import { buyCenther, getTokenApproval } from "@/web3/utils/call.helpers";
import { RoundInfo } from "@/web3/constants/types";
import { StandardModal, ModalState } from "@/components/modal/standard.modal";
import { BUSDIconBG, LockedIcon, CentherIconBG } from "@/assets/svgs";

import { ConversionContainer } from "./conversion.container";
import { SelectedTokenA, SelectedTokenB } from "./types";
import { CentherTable } from "./centher.table";

interface Props {
  roundInfo: RoundInfo;
  refreshRoundsInfo: () => void;
}

export const PurchaseCentherCard: React.FC<Props> = ({
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
    tokenIcon: <BUSDIconBG className="w-10 h-10" />,
    tokenBalance: 0,
    minContribution: roundInfo.minContributionForBusd,
    maxContribution: roundInfo.maxContributionForBusd,
    rate: roundInfo.priceForBusd,

    inputValue: roundInfo.minContributionForBusd,
    inputMinValue: roundInfo.minContributionForBusd,
    inputMaxValue: roundInfo.maxContributionForBusd,
  });

  const [selectedTokenB, setSelectedTokenB] = useState<SelectedTokenB>({
    tokenName: "CTHR",
    tokenIcon: <CentherIconBG className="w-10 h-10" />,
    tokenBalance: 0,
    inputValue: roundInfo.minContributionForBusd / roundInfo.priceForBusd,
  });

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    status: "warning",
    title: "Authorization Contract",
    subtitle: `Allow Centher to use your ${selectedTokenA.tokenName} token`,
    bodyText: `Confirmation of the ${selectedTokenA.tokenName} token to interact with the Centher contract.`,
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
      subtitle: `Allow Centher to use your ${selectedTokenA.tokenName} token`,
      bodyText: `Confirmation of the ${selectedTokenA.tokenName} token to interact with the Centher contract.`,
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
    const tx = await getTokenApproval(selectedTokenA.tokenName, library);
    if (tx.success) {
      toast.success("Authorization successful");
      setModal((prev) => ({
        ...prev,
        isOpen: false,
      }));
      checkSelectedTokenAllowance();
    } else {
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
      subtitle: `Do you want to buy CENTHER?`,
      bodyText: `Confirm that you pay ${selectedTokenA.inputValue} ${selectedTokenA.tokenName} to buy ${selectedTokenB.inputValue} ${selectedTokenB.tokenName}.`,
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

      const result = await buyCenther(
        selectedTokenA.tokenName,
        selectedTokenA.inputValue,
        library
      );

      if (result.success) {
        refreshContributionInfo();
        refreshRoundsInfo();
        setModal((prev) => ({
          ...prev,
          title: "Success",
          subtitle: "Purchase Successful",
          bodyText: `You have bought CENTHER tokens. CENTHER will be locked for ${roundInfo.lockMonths} months. You can claim when unlocked.`,
          status: "success",
        }));
      } else {
        toast.error("Purchase Transaction Failed");
        setModal((prev) => ({
          ...prev,
          status: "error",
          confirmButtonText: "Try Again",
        }));
      }
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
    <div className="relative">
      {roundInfo.status === "not-started" && (
        <div
          className={`absolute z-10 top-0 left-0 w-full h-full flex items-center justify-center`}
        >
          <div className={`flex flex-col justify-center items-center gap-10`}>
            <LockedIcon className="w-[80px] h-[80px]" />
            <h6 className={`text-20px font-semibold text-white`}>
              Wait for the presale to start
            </h6>
          </div>
        </div>
      )}

      <div
        className={clsx(
          roundInfo.status === "not-started" &&
            "blur-xl bg-black-shade-3/60 pointer-events-none"
        )}
      >
        <div className={`bg-background-shade-3 rounded-xl`}>
          <h1
            className={`text-sm fsm:text-xl flg:text-2xl text-white text-center font-semibold px-5 py-6 fsm:px-8 fmd:py-8 border-b-2 border-b-gray-shade-3`}
          >
            Please Enter CENTHER amount to you&apos;d like to purchase
          </h1>

          <div className="px-3 py-6 fsm:px-6 fsm:py-8 flg:p-12">
            <ConversionContainer
              selectedTokenA={selectedTokenA}
              setSelectedTokenA={setSelectedTokenA}
              selectedTokenB={selectedTokenB}
              setSelectedTokenB={setSelectedTokenB}
              roundInfo={roundInfo}
            />

            {roundInfo.status === "active" && (
              <div
                className={`pt-8 lg:pt-12 max-w-[442px] mx-auto text-center`}
              >
                <h6
                  className={`text-xs fmd:text-sm font-semibold text-gray-shade-7 pb-4`}
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

            {roundInfo.status === "ended" && (
              <div
                className={`mt-8 lg:mt-12 text-center mx-auto py-2 px-5 bg-[#E6535A]/10 w-fit rounded-xl`}
              >
                <p
                  className={`text-[#E6535A] text-sm fmd:text-base fsm:text-base font-semibold`}
                >
                  Round {roundInfo.round + 1} is over! Buy another availabe or
                  wait for the next round.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {!contributionInfo ||
      (!contributionInfo.contributedBusdAmount &&
        !contributionInfo.contributedNtrAmount) ? null : (
        <CentherTable
          roundInfo={roundInfo}
          contributionInfo={contributionInfo}
          refetchContributionInfo={refreshContributionInfo}
        />
      )}
    </div>
  );
};
