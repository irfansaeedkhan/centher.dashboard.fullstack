import React, { useState } from "react";
import toast from "react-hot-toast";
import { ClaimCentherFrom } from "@/web3/blockchain/types";
import { BlockchainWrite } from "@/web3/blockchain";
import { ContributionInfo, RoundInfo } from "@/web3/constants/types";
import { ModalState, StandardModal } from "@/components/modal/standard.modal";
import { Timeline } from "./timeline";
import { TimelineFinal } from "./timeline-final";
import { TimelineTotal } from "./timeline-total";

interface Props {
  roundInfo: RoundInfo;
  library: any;
  contributionInfo: ContributionInfo;
  refetchContributionInfo: () => void;
  isBUSD: boolean;
}

export const TimelinePeriod: React.FC<Props> = ({
  roundInfo,
  library,
  contributionInfo,
  refetchContributionInfo,
  isBUSD,
}) => {
  let monthInEpoch = 2592000;
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    status: "warning",
    title: "Claim DXC",
    subtitle: `Do you want to claim DXC?`,
    bodyText: `Click the button below to claim DXC.`,
    confirmButtonText: "Claim Now",
    onClose: () => {
      setModal((prev) => ({
        ...prev,
        isOpen: false,
      }));
    },
    onClickConfirm: () => {},
  });

  const handleClaim = async (claimFrom: ClaimCentherFrom) => {
    try {
      setModal((prev) => ({ ...prev, status: "progress" }));
      await BlockchainWrite.claimTokens(library, roundInfo.round, claimFrom);
      refetchContributionInfo();
      setModal((prev) => ({
        ...prev,
        status: "success",
        subtitle: `Successfully Claimed DXC!`,
        bodyText: `You claimed DXC. Please check your balance.`,
        onClickConfirm: () => {},
      }));
    } catch (error) {
      toast.error("Claim Transaction Failed");
      setModal((prev) => ({
        ...prev,
        status: "error",
        confirmButtonText: "Try Again",
      }));
    }
  };

  const openClaimModal = (claimFrom: ClaimCentherFrom) => {
    setModal((prev) => ({
      ...prev,
      isOpen: true,
      status: "warning",
      title: "Claim DXC",
      subtitle: `Do you want to claim DXC?`,
      bodyText: `Click the button below to claim DXC.`,
      confirmButtonText: "Claim Now",
      onClickConfirm: () => handleClaim(claimFrom),
    }));
  };

  return (
    <div className="mt-6 space-y-6">
      <TimelineTotal
        title1={`${roundInfo.lockMonths} months Lock Period will be finished in`}
        title2={`4 months Lock Period will End in`}
        endTime={
          isBUSD
            ? contributionInfo.purchaseTimeForBusd +
              roundInfo.lockMonths * monthInEpoch
            : contributionInfo.purchaseTimeForNtr +
              roundInfo.lockMonths * monthInEpoch
        }
      />
      {Array.from({ length: 10 }, (_, index) => index).map((index: number) => {
        const title =
          index === 0
            ? "1st"
            : index === 1
            ? "2nd"
            : index === 2
            ? "3rd"
            : `${index + 1}th`;
        const nowTime = Math.floor(Date.now() / 1000);
        const startTime = isBUSD
          ? contributionInfo.purchaseTimeForBusd
          : contributionInfo.purchaseTimeForNtr;
        const endTime =
          startTime +
          roundInfo.lockMonths * monthInEpoch +
          (index + 1) * monthInEpoch;
        const claimablePerMonth = isBUSD
          ? contributionInfo.totalClaimableTokenAmountForBusd / 10
          : contributionInfo.totalClaimableTokenAmountForNtr / 10;
        const claimedMonths = Math.floor(
          isBUSD
            ? contributionInfo.claimedTokenAmountForBusd / claimablePerMonth
            : contributionInfo.claimedTokenAmountForNtr / claimablePerMonth
        );
        const claimed = claimedMonths > index ? claimablePerMonth : 0;
        const claimable =
          claimedMonths > index || endTime > nowTime ? 0 : claimablePerMonth;
        const lock = claimable === 0 && claimed === 0 ? claimablePerMonth : 0;

        return (
          <div className="relative" key={index}>
            <div className="absolute left-[22px] top-[-46px] h-[68px] border-l border-gray-shade-12"></div>
            <Timeline
              isBUSD={isBUSD}
              index={index}
              title={title}
              endTime={endTime}
              claimablePerMonth={claimablePerMonth}
              claimable={claimable}
              claimed={claimed}
              lock={lock}
              lockMonths={roundInfo.lockMonths}
              purchaseTimeForBusd={contributionInfo.purchaseTimeForBusd}
              purchaseTimeForNtr={contributionInfo.purchaseTimeForNtr}
              openClaimModal={openClaimModal}
            />
          </div>
        );
      })}
      <div className="relative">
        <div className="absolute left-[22px] top-[-46px] h-[68px] border-l border-gray-shade-12"></div>
        <TimelineTotal
          title1={`Total ${
            isBUSD
              ? contributionInfo.totalClaimableTokenAmountForBusd
              : contributionInfo.totalClaimableTokenAmountForNtr
          } DXC will be released in`}
          title2="Lock period already finished."
          endTime={
            isBUSD
              ? contributionInfo.purchaseTimeForBusd +
                (roundInfo.lockMonths + 10) * monthInEpoch
              : contributionInfo.purchaseTimeForNtr +
                (roundInfo.lockMonths + 10) * monthInEpoch
          }
        />
      </div>
      <div className="relative">
        <TimelineFinal contributionInfo={contributionInfo} isBUSD={isBUSD} />
      </div>
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
  );
};
