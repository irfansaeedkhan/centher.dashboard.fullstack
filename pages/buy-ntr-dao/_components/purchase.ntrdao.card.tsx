// React, Next, NPM Packages
import React, { useState, useEffect } from "react";
import { BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import ctl from "@netlify/classnames-template-literals";
import Image from "next/image";

// App imports
import {
  useGetBusdAllowance,
  useBusdBalance,
  useGetPurchasedInfo,
  useIsRegistered,
  useNtrdaoBalance,
  useGetRoundState,
  getTokenBalance,
  TokenName,
  getTokenAllowance,
} from "@/web3/hooks/use.contracts.functions";
import Button from "@/components/button";
import { CustomProgressModal } from "@/components/modal/custom.progress.modal";
import { LoadingSkeleton } from "@/web3/utils/utils";
import { buyNtrDao, getTokenApproval } from "@/web3/utils/call.helpers";
import {
  PurchasedInfo,
  PurchasedInfoResponse,
  RoundInfo,
  RoundState,
  RoundStatus,
} from "@/web3/constants/types";
import { DAY } from "@/web3/constants/common";

import {
  BUSDIconBG,
  LeftArrowIcon,
  LockedIcon,
  NTRDAOIconBG,
  NTRIconBG,
} from "@/assets/svgs";

// Current directory imports
import { NTRDAOTable } from "./ntrdao.table";
import clsx from "clsx";
import { useConnectWallet } from "@/web3/hooks/use.connect.wallet";
import { ConversionContainer } from "./conversion.container";
import { SelectedTokenA, SelectedTokenB } from "./types";
import { Web3Provider } from "@ethersproject/providers";
import { LaunchpadModal, ModalStatus, ModalProps } from "./launchpad.modal";

interface Props {
  roundStatus: RoundStatus;
  roundInfo: RoundInfo;
}

export const PurchaseNTRDAOCard: React.FC<Props> = ({
  roundStatus,
  roundInfo,
}) => {
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

  const handleBuyNtrDao = async () => {
    try {
      if (!account || !library) return;

      setModal((prev) => ({
        ...prev,
        status: "progress",
      }));

      const result = await buyNtrDao(
        selectedTokenA.tokenName,
        selectedTokenB.inputValue,
        library
      );

      if (result.success) {
        toast.success("Purchased Successful!");
        setModal((prev) => ({
          ...prev,
          subtitle: "Purchase Successful",
          bodyText: `You have bought NTRDAO tokens. NTRDAO will be locked for ${roundInfo.lockMonths} months. You can claim when unlocked.`,
          status: "success",
          confirmButtonText: "Close",
        }));
      } else {
        toast.error("Purchase transaction failed");
        setModal((prev) => ({
          ...prev,
          status: "error",
        }));
      }
    } catch (error) {
      toast.error("Purchase transaction failed");
      setModal((prev) => ({
        ...prev,
        status: "error",
      }));
    }
  };

  return (
    <div className="relative">
      {roundStatus === "not-started" && (
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
          roundStatus === "not-started" &&
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

          {roundStatus === "active" && (
            <div
              className={`pt-8 lg:pt-12 w-full lg:max-w-[428px] mx-auto text-center`}
            >
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
                    ? // ? buyNowFunc
                      () => {
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
                      }
                    : () => {
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
                      }
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

          {roundStatus === "ended" && (
            <div
              className={`mt-8 lg:mt-12 text-center mx-auto  py-2 px-5 bg-[#E6535A]/10 w-fit rounded-xl`}
            >
              <p className={`text-[#E6535A] text-16px font-semibold`}>
                This currentRound is over! Buy another availabe or wait for the
                next currentRound
              </p>
            </div>
          )}
        </div>
      </div>
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
