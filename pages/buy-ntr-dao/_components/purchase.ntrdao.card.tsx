import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import toast from "react-hot-toast";
import clsx from "clsx";

import {
  getTokenBalance,
  getTokenAllowance,
} from "@/web3/hooks/use.contracts.functions";
import Button from "@/components/button";
import { buyNtrDao, getTokenApproval } from "@/web3/utils/call.helpers";
import { RoundInfo } from "@/web3/constants/types";
import { BUSDIconBG, LockedIcon, NTRDAOIconBG } from "@/assets/svgs";

import { ConversionContainer } from "./conversion.container";
import { SelectedTokenA, SelectedTokenB } from "./types";
import { LaunchpadModal, ModalProps } from "./launchpad.modal";
import { NTRDAOTable } from "./ntrdao.table";

interface Props {
  roundInfo: RoundInfo;
}

export const PurchaseNTRDAOCard: React.FC<Props> = ({ roundInfo }) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const [isApproved, setIsApproved] = useState(false);

  const [selectedTokenA, setSelectedTokenA] = useState<SelectedTokenA>({
    tokenName: "BUSD",
    tokenIcon: <BUSDIconBG className="w-10 h-10" />,
    tokenBalance: 0,
    minContribution: roundInfo.minContributionForBusd,
    maxContribution: roundInfo.maxContributionForBusd,
    rate: roundInfo.rateForBusd,

    inputValue: roundInfo.minContributionForBusd,
    inputMinValue: roundInfo.minContributionForBusd,
    inputMaxValue: roundInfo.maxContributionForBusd,
  });

  const [selectedTokenB, setSelectedTokenB] = useState<SelectedTokenB>({
    tokenName: "NTRDAO",
    tokenIcon: <NTRDAOIconBG className="w-10 h-10" />,
    inputValue: roundInfo.minContributionForBusd * roundInfo.rateForBusd,
  });

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    status: "warning",
    title: "Authorization Contract",
    subtitle: `Allow Nether NFT to use your ${selectedTokenA.tokenName} token`,
    bodyText: `Confirmation of the ${selectedTokenA.tokenName} token to interact with the Nether NFT contract.`,
    confirmButtonText: "Authorize",
    onClose: () => {
      setModal((prev) => ({
        ...prev,
        isOpen: false,
      }));
    },
    onClickConfirm: () => {},
  });

  // Get selected token balance
  useEffect(() => {
    if (!account || !library) return;
    const getSelectedTokenBalance = async () => {
      const tokenBalance = await getTokenBalance(
        selectedTokenA.tokenName,
        account,
        library
      );
      setSelectedTokenA((prev) => ({
        ...prev,
        tokenBalance: tokenBalance,
      }));
    };
    getSelectedTokenBalance();
  }, [account, selectedTokenA, library]);

  // Get selected token allowance
  useEffect(() => {
    if (!account || !library) return;
    const checkSelectedTokenAllowance = async () => {
      const tokenAllowance = await getTokenAllowance(
        selectedTokenA.tokenName,
        account,
        library
      );
      if (
        tokenAllowance !== 0 &&
        tokenAllowance >= selectedTokenA.tokenBalance
      ) {
        setIsApproved(true);
      } else {
        setIsApproved(false);
      }
    };

    checkSelectedTokenAllowance();
  }, [account, selectedTokenA, library]);

  const openAuthorizeModal = () => {
    setModal((prev) => ({
      ...prev,
      isOpen: true,
      status: "warning",
      title: "Authorization Contract",
      subtitle: `Allow Nether NFT to use your ${selectedTokenA.tokenName} token`,
      bodyText: `Confirmation of the ${selectedTokenA.tokenName} token to interact with the Nether NFT contract.`,
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
    } else {
      toast.error("Token authorization failed");
      setModal((prev) => ({
        ...prev,
        status: "warning",
      }));
    }
  };

  const openBuyModal = () => {
    if (!selectedTokenA.inputValue) return;
    if (selectedTokenA.inputValue < selectedTokenA.minContribution) {
      toast.error(
        `Minimum contribution is ${selectedTokenA.minContribution} ${selectedTokenA.tokenName}`
      );
      return;
    }

    setModal((prev) => ({
      ...prev,
      isOpen: true,
      status: "buy-ntr",
      title: "Buy Now",
      subtitle: `Do you want to buy NTRDAO?`,
      bodyText: `Confirm that you pay ${selectedTokenA.inputValue} ${selectedTokenA.tokenName} to buy ${selectedTokenB.inputValue} ${selectedTokenB.tokenName}.`,
      confirmButtonText: "Buy Now",
      onClickConfirm: handleBuyNtrDao,
    }));
  };

  const handleBuyNtrDao = async () => {
    try {
      if (!account || !library) return;

      setModal((prev) => ({
        ...prev,
        status: "progress",
      }));

      const result = await buyNtrDao(
        selectedTokenA.tokenName,
        selectedTokenA.inputValue,
        library
      );

      if (result.success) {
        setModal((prev) => ({
          ...prev,
          subtitle: "Purchase Successful",
          bodyText: `You have bought NTRDAO tokens. NTRDAO will be locked for ${roundInfo.lockMonths} months. You can claim when unlocked.`,
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
        <div className={`bg-background-shade-3 p-8 lg:p-12 rounded-2xl`}>
          <h1 className={`text-24px text-white text-center font-semibold`}>
            Please Enter NTRDAO amount to you&apos;d like to purchase
          </h1>

          <div className={`h-[2px] my-8 lg:my-12 bg-gray-shade-3`} />

          <ConversionContainer
            selectedTokenA={selectedTokenA}
            setSelectedTokenA={setSelectedTokenA}
            selectedTokenB={selectedTokenB}
            setSelectedTokenB={setSelectedTokenB}
            roundInfo={roundInfo}
          />

          {roundInfo.status === "active" && (
            <div className={`pt-8 lg:pt-12 max-w-[442px] mx-auto text-center`}>
              <h6 className={`text-14px font-semibold text-gray-shade-7 pb-4`}>
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
                className="py-4"
              />

              <LaunchpadModal
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
              className={`mt-8 lg:mt-12 text-center mx-auto  py-2 px-5 bg-[#E6535A]/10 w-fit rounded-xl`}
            >
              <p className={`text-[#E6535A] text-16px font-semibold`}>
                Round {roundInfo.round + 1} is over! Buy another availabe or
                wait for the next round.
              </p>
            </div>
          )}
        </div>
      </div>

      <NTRDAOTable roundInfo={roundInfo} />
    </div>
  );
};

interface ModalState {
  isOpen: boolean;
  status: ModalProps["status"];
  title: ModalProps["title"];
  subtitle: ModalProps["subtitle"];
  bodyText: ModalProps["bodyText"];
  confirmButtonText: ModalProps["confirmButtonText"];
  onClose: ModalProps["onClickClose"];
  onClickConfirm: ModalProps["onClickConfirm"];
}
