import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";

import { ModalState, StandardModal } from "@/components/modal/standard.modal";
import { ClaimCentherFrom, claimNtrTokens } from "@/web3/utils/call.helpers";
import { ContributionInfo, RoundInfo } from "@/web3/constants/types";
import { DAY, MONTH } from "@/web3/constants/common";

import Timeline from "./timeline";
import TimelineFinal from "./timeline.final";
import TimelineTotal from "./timeline.total";

interface Props {
  roundInfo: RoundInfo;
  contributionInfo: ContributionInfo;
  refetchContributionInfo: () => void;
}

const TimelinePeriod: React.FC<Props> = ({
  roundInfo,
  contributionInfo,
  refetchContributionInfo,
}) => {
  const { library } = useWeb3React();

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
      const result = await claimNtrTokens(library, roundInfo.round, claimFrom);
      refetchContributionInfo();
      if (result.success) {
        setModal((prev) => ({
          ...prev,
          status: "success",
          subtitle: `Successfully Claimed DXC!`,
          bodyText: `You claimed DXC. Please check your balance.`,
          onClickConfirm: () => {},
        }));
      } else {
        toast.error("Claim Transaction Failed");
        setModal((prev) => ({
          ...prev,
          status: "error",
          confirmButtonText: "Try Again",
        }));
      }
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

  const numbers = Array.from({ length: 10 }, (_, index) => index + 1);
  console.log(numbers); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  return (
    <div className="mt-6 space-y-6">
      <TimelineTotal
        title1={`${roundInfo.lockMonths} months Lock Period will be finished in`}
        title2={`${roundInfo.lockMonths} months Lock Period was already finished, DXC tokens will be released 10% monthly`}
        endTime={
          contributionInfo.purchaseTimeForBusd + roundInfo.lockMonths * MONTH
        }
      />
      {Array.from({ length: 20 }, (_, index) => index + 1).map(
        (index: number) => {
          const title =
            index === 0
              ? "1st"
              : index === 1
              ? "2nd"
              : index === 2
              ? "3rd"
              : `${index + 1}th`;
          const nowTime = Math.floor(Date.now() / 1000);
          const startTime = contributionInfo.purchaseTimeForBusd;
          const endTime =
            startTime + roundInfo.lockMonths * MONTH + (index + 1) * MONTH;
          const claimablePerMonth =
            contributionInfo.totalClaimableTokenAmountForBusd / 20;
          const claimedMonths = Math.floor(
            contributionInfo.claimedTokenAmountForBusd / claimablePerMonth
          );
          const claimed = claimedMonths > index ? claimablePerMonth : 0;
          const claimable =
            claimedMonths > index || endTime > nowTime ? 0 : claimablePerMonth;
          const lock = claimable === 0 && claimed === 0 ? claimablePerMonth : 0;

          return (
            <div className="relative" key={index}>
              <div className="absolute top-[-46px] left-[22px] h-[68px] border-l bg-yellow-shade-1"></div>
              <Timeline
                index={index}
                title={title}
                endTime={endTime}
                claimablePerMonth={claimablePerMonth}
                claimable={claimable}
                claimed={claimed}
                lock={lock}
                openClaimModal={openClaimModal}
              />
            </div>
          );
        }
      )}
      <div className="relative">
        <div className="absolute top-[-46px] left-[22px] h-[68px] border-l bg-yellow-shade-1"></div>
        <TimelineTotal
          title1={`Total ${contributionInfo.totalClaimableTokenAmountForBusd} DXC will be released in`}
          title2="Lock period already finished."
          endTime={
            contributionInfo.purchaseTimeForBusd +
            (roundInfo.lockMonths + 10) * MONTH
          }
        />
      </div>
      <div className="relative">
        <TimelineFinal contributionInfo={contributionInfo} />
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

export default TimelinePeriod;
