import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import clsx from "clsx";
import toast from "react-hot-toast";
import { formatEther } from "ethers/lib/utils";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { LockedIcon, DXCIconBG, USDTIcon } from "@/assets/svgs";
import {
  getTokenBalance,
  getTokenAllowance,
  useGetContributionInfo,
} from "@/web3/hooks/use.contracts.functions";
import { BlockchainWrite } from "@/web3/blockchain";
import { RoundInfo } from "@/web3/constants/types";
import { StandardModal, ModalState } from "@/components/modal/standard.modal";
import Button from "@/components/button";
import DetailsProject from "@/pages/launchpad/pre-booking/_components/details-project";
import BookingMain from "@/pages/launchpad/pre-booking/_components/booking-main";
import { SelectedTokenA, SelectedTokenB } from "./types";
import { ConversionContainer } from "./conversion-container";
import { TimelinePeriod } from "./timeline-period";

interface Props {
  roundInfo: RoundInfo;
  refreshRoundsInfo: () => void;
  currentUserAddress: string | undefined;
}

export const PurchaseCentherCard: React.FC<Props> = ({
  roundInfo,
  refreshRoundsInfo,
  currentUserAddress,
}) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const [currentTab, setCurrentTab] = useState<
    "rewards" | "details" | "booking"
  >("rewards");

  const [isApproved, setIsApproved] = useState(false);
  const { contributionInfo, refreshContributionInfo } = useGetContributionInfo(
    currentUserAddress,
    roundInfo
  );
  const [selectedTokenA, setSelectedTokenA] = useState<SelectedTokenA>({
    tokenName: "USDT",
    tokenIcon: (
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/5">
        <USDTIcon />
      </span>
    ),
    tokenBalance: 0,
    minContribution: roundInfo ? roundInfo.minContributionForBusd : 0,
    maxContribution: roundInfo ? roundInfo.maxContributionForBusd : 0,
    rate: roundInfo ? roundInfo.priceForBusd : 0,

    inputValue: roundInfo ? roundInfo.minContributionForBusd : 0,
    inputMinValue: roundInfo ? roundInfo.minContributionForBusd : 0,
    inputMaxValue: roundInfo ? roundInfo.maxContributionForBusd : 0,
  });
  const [selectedTokenB, setSelectedTokenB] = useState<SelectedTokenB>({
    tokenName: "CTHR",
    tokenIcon: <DXCIconBG className="h-10 w-10" />,
    tokenBalance: 0,
    inputValue: roundInfo
      ? roundInfo.minContributionForBusd /
        Number(formatEther(roundInfo.priceForBusd.toString()))
      : 0,
  });
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    status: "warning",
    title: "Authorization Contract",
    subtitle: `Allow launchpad to use your ${selectedTokenA.tokenName} token`,
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

  useEffect(() => {
    if (
      contributionInfo &&
      (contributionInfo.contributedBusdAmount > 0 ||
        contributionInfo.contributedNtrAmount > 0)
    ) {
      setCurrentTab("rewards");
    } else {
      setCurrentTab("details");
    }
  }, [contributionInfo]);

  useEffect(() => {
    if (!currentUserAddress || !library || !roundInfo) return;
    setSelectedTokenA((prev) => ({
      ...prev,
      tokenName: "USDT",
      tokenIcon: (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/5">
          <USDTIcon />
        </span>
      ),
      minContribution: roundInfo?.minContributionForBusd,
      maxContribution: roundInfo?.maxContributionForBusd,
      rate: roundInfo?.priceForBusd,

      inputValue: roundInfo?.minContributionForBusd,
      inputMinValue: roundInfo?.minContributionForBusd,
      inputMaxValue: roundInfo?.maxContributionForBusd,
    }));
  }, [currentUserAddress, library, roundInfo]);

  // Get selectedTokenA balance
  useEffect(() => {
    if (!currentUserAddress || !library) return;
    const getSelectedTokenBalance = async () => {
      getTokenBalance(
        selectedTokenA.tokenName,
        18,
        currentUserAddress,
        library
      ).then((tokenBalanace) =>
        setSelectedTokenA((prev) => ({
          ...prev,
          tokenBalance: tokenBalanace,
        }))
      );
    };
    getSelectedTokenBalance();
  }, [currentUserAddress, selectedTokenA.tokenName, library]);

  // Get selectedTokenB balance
  useEffect(() => {
    if (!currentUserAddress || !library) return;
    const getSelectedTokenBalance = async () => {
      getTokenBalance(
        selectedTokenB.tokenName,
        18,
        currentUserAddress,
        library
      ).then((tokenBalanace) =>
        setSelectedTokenB((prev) => ({
          ...prev,
          tokenBalance: tokenBalanace,
        }))
      );
    };
    getSelectedTokenBalance();
  }, [currentUserAddress, selectedTokenB.tokenName, library]);

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
      subtitle: `Allow launchpad to use your ${selectedTokenA.tokenName} token`,
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

      await BlockchainWrite.buyToken(
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
      {roundInfo.status === "not-started" && (
        <div className="absolute left-0 top-0 z-[1000] flex h-[390px] w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-10">
            <LockedIcon className="h-[80px] w-[80px]" />
            <h6 className="text-base font-semibold text-white f2xl:text-xl">
              Coming Soon
            </h6>
          </div>
        </div>
      )}
      <div
        className={clsx(
          (roundInfo.status === "not-started" ||
            (contributionInfo &&
              (contributionInfo.contributedBusdAmount > 0 ||
                contributionInfo.contributedNtrAmount > 0) &&
              roundInfo.status !== "ended")) &&
            "pointer-events-none relative bg-black-shade-3/60 blur-xl"
        )}
      >
        <div className="rounded-xl bg-background-shade-3">
          <h1 className="border-b-2 border-b-gray-shade-3 px-5 py-6 text-center text-sm font-semibold text-white fsm:px-8 fsm:text-xl fmd:py-8 flg:text-2xl">
            Enter DXC amount you&apos;d like to purchase
          </h1>
          <div className="px-3 py-6 fsm:px-6 fsm:py-8 flg:p-12">
            <ConversionContainer
              selectedTokenA={selectedTokenA}
              setSelectedTokenA={setSelectedTokenA}
              selectedTokenB={selectedTokenB}
              setSelectedTokenB={setSelectedTokenB}
              roundInfo={roundInfo}
            />
            {roundInfo?.status === "active" && (
              <div className="mx-auto max-w-[442px] pt-8 text-center lg:pt-12">
                <h6 className="pb-4 text-xs font-semibold text-gray-shade-7 fmd:text-sm">
                  Minimum Buy:{" "}
                  <span className={`text-white`}>
                    {selectedTokenA.minContribution} {selectedTokenA.tokenName}
                  </span>
                </h6>
                <Button
                  title={isApproved ? "Buy now" : "Authorize"}
                  variant="primary"
                  onClick={
                    !account
                      ? () => {
                          toast.error("Please connect your wallet");
                        }
                      : isApproved
                      ? openBuyModal
                      : openAuthorizeModal
                  }
                  className="w-full py-3"
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
              <div className="mx-auto mt-8 w-fit rounded-xl bg-[#E6535A]/10 px-5 py-2 text-center lg:mt-12">
                <p className="text-sm font-semibold text-[#E6535A] fsm:text-base fmd:text-base">
                  Round {roundInfo?.round + 1} is over!{" "}
                </p>
              </div>
            )}

            <div className="mx-auto mt-6 w-fit text-center">
              <p className="text-xs text-gray-shade-7">
                <span className="text-[#E6535A]">Terms & Conditions:</span>{" "}
                Purchased tokens will be automatically locked for the first 4
                months, after which 10% of the purchased tokens will be released
                every month for the next 10 months and can be claimed. The
                vesting contract will then last a total of 14 months.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="my-4 flex items-center gap-2">
        {contributionInfo &&
          (contributionInfo.contributedBusdAmount > 0 ||
            contributionInfo.contributedNtrAmount > 0) && (
            <Button
              title="Claim Rewards"
              variant={currentTab === "rewards" ? "primary" : "secondary"}
              className="rounded-[10px]"
              onClick={() => setCurrentTab("rewards")}
            />
          )}
        <Button
          title="Project Details"
          variant={currentTab === "details" ? "primary" : "secondary"}
          className="rounded-[10px]"
          onClick={() => setCurrentTab("details")}
        />
        <Button
          title="Booking"
          variant={currentTab === "booking" ? "primary" : "secondary"}
          className="rounded-[10px]"
          onClick={() => setCurrentTab("booking")}
        />
      </div>
      {currentTab === "rewards" ? (
        contributionInfo &&
        (contributionInfo.contributedBusdAmount > 0 ||
          contributionInfo.contributedNtrAmount > 0) ? (
          <TimelinePeriod
            isBUSD={contributionInfo.contributedBusdAmount > 0}
            roundInfo={roundInfo}
            library={library}
            contributionInfo={contributionInfo}
            refetchContributionInfo={refreshContributionInfo}
          />
        ) : !contributionInfo && account ? (
          <div className="mt-5 flex w-full items-center justify-center">
            <Image
              src="/images/preloader.png"
              alt="Preloader"
              width={64}
              height={64}
              className="h-16 w-16 flex-shrink-0 object-cover"
            />
          </div>
        ) : (
          !account && (
            <div className="mt-5 flex w-full items-center justify-center">
              <p className="text-xl font-semibold text-white">
                Please Connect your Wallet
              </p>
            </div>
          )
        )
      ) : currentTab === "details" ? (
        <DetailsProject />
      ) : currentTab === "booking" ? (
        <BookingMain />
      ) : null}
    </div>
  );
};
