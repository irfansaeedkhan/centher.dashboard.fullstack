import React, { HTMLAttributes, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import clsx from "clsx";

import { ClaimCentherFrom, claimNtrTokens } from "@/web3/utils/call.helpers";
import { ContributionInfo, RoundInfo } from "@/web3/constants/types";

import { StandardModal, ModalProps } from "@/components/modal/standard.modal";

interface CentherTableProps {
  roundInfo: RoundInfo;
  contributionInfo: ContributionInfo;
  refetchContributionInfo: () => void;
}

export const CentherTable: React.FC<CentherTableProps> = ({
  roundInfo,
  contributionInfo,
  refetchContributionInfo,
}) => {
  const { library } = useWeb3React();

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    status: "warning",
    title: "Claim CENTHER",
    subtitle: `Do you want to claim CENTHER?`,
    bodyText: `Click the button below to claim CENTHER.`,
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
          subtitle: `Successfully Claimed CTHR!`,
          bodyText: `You claimed CTHR. Please check your balance.`,
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
      title: "Claim CENTHER",
      subtitle: `Do you want to claim CENTHER?`,
      bodyText: `Click the button below to claim CTHR.`,
      confirmButtonText: "Claim Now",
      onClickConfirm: () => handleClaim(claimFrom),
    }));
  };

  return (
    <div
      className={`mt-5 overflow-x-auto rounded-2xl border border-gray-shade-3`}
    >
      <table className={`w-full min-w-[1024px]`}>
        <thead className={`bg-elevation-1 text-left text-sm text-gray-shade-7`}>
          <tr>
            <TableCell element={"th"}>Type</TableCell>
            <TableCell element={"th"}>Purchase Date</TableCell>
            <TableCell element={"th"}>Paid Amount</TableCell>
            <TableCell element={"th"}>Lock Months</TableCell>
            <TableCell element={"th"}>Total Claimable</TableCell>
            <TableCell element={"th"}>Claimed</TableCell>
            <TableCell element={"th"}>Claimable Now</TableCell>
            <TableCell element={"th"}>Action</TableCell>
          </tr>
        </thead>
        <tbody>
          {!!contributionInfo.contributedBusdAmount && (
            <TableRow>
              <TableCell element={"td"}>BUSD</TableCell>
              <TableCell element={"td"}>
                {contributionInfo.purchaseTimeForBusd}
              </TableCell>
              <TableCell element={"td"}>
                {contributionInfo.contributedBusdAmount} BUSD
              </TableCell>
              <TableCell element={"td"}>{roundInfo.lockMonths}</TableCell>
              <TableCell element={"td"}>
                {contributionInfo.totalClaimableTokenAmountForBusd}
              </TableCell>
              <TableCell element={"td"}>
                {contributionInfo.claimedTokenAmountForBusd}
              </TableCell>
              <TableCell element={"td"}>
                {contributionInfo.claimableTokenAmountForBusd}
              </TableCell>
              <TableCell element={"td"}>
                <button
                  className={clsx(
                    `block rounded px-4 py-2 text-sm font-semibold`,
                    contributionInfo.isClaimableForBusd &&
                      `bg-brand-primary text-black-shade-3`,
                    !contributionInfo.isClaimableForBusd &&
                      `bg-background-shade-2 text-gray-shade-7`
                  )}
                  disabled={!contributionInfo.isClaimableForBusd}
                  onClick={
                    !contributionInfo.isClaimableForBusd
                      ? undefined
                      : () => openClaimModal("BUSD")
                  }
                >
                  Claim
                </button>
              </TableCell>
            </TableRow>
          )}

          {!!contributionInfo.contributedNtrAmount && (
            <TableRow>
              <TableCell element={"td"}>NTR</TableCell>
              <TableCell element={"td"}>
                {contributionInfo.purchaseTimeForNtr}
              </TableCell>
              <TableCell element={"td"}>
                {contributionInfo.contributedNtrAmount} NTR
              </TableCell>
              <TableCell element={"td"}>{roundInfo.lockMonths}</TableCell>
              <TableCell element={"td"}>
                {contributionInfo.totalClaimableTokenAmountForNtr}
              </TableCell>
              <TableCell element={"td"}>
                {contributionInfo.claimedTokenAmountForNtr}
              </TableCell>
              <TableCell element={"td"}>
                {contributionInfo.claimableTokenAmountForNtr}
              </TableCell>
              <TableCell element={"td"}>
                <button
                  className={clsx(
                    `block rounded px-4 py-2 text-sm font-semibold`,
                    contributionInfo.isClaimableForNtr &&
                      `bg-brand-primary text-black-shade-3`,
                    !contributionInfo.isClaimableForNtr &&
                      `bg-background-shade-2 text-gray-shade-7`
                  )}
                  disabled={!contributionInfo.isClaimableForNtr}
                  onClick={
                    !contributionInfo.isClaimableForNtr
                      ? undefined
                      : () => openClaimModal("NTR")
                  }
                >
                  Claim
                </button>
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </table>

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

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

const TableRow: React.FC<TableRowProps> = ({ className, ...props }) => {
  return (
    <tr
      className={clsx(
        `border-b border-gray-shade-3 text-left text-sm text-white last:border-none odd:bg-black-shade-3 even:bg-black-shade-11`,
        className
      )}
      {...props}
    />
  );
};

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  element: "td" | "th";
}

const TableCell: React.FC<TableCellProps> = ({
  element,
  className,
  ...props
}) => {
  if (element === "th") {
    return (
      <th
        className={clsx(
          `min-w-[157px] py-4 px-5 font-semibold flg:py-7 flg:px-3`,
          className
        )}
        {...props}
      />
    );
  }
  return (
    <td
      className={clsx(`py-2 px-5 font-medium flg:py-5 flg:px-3`, className)}
      {...props}
    />
  );
};
