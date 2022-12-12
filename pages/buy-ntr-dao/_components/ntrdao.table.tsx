import React, { HTMLAttributes } from "react";
import { useWeb3React } from "@web3-react/core";
import clsx from "clsx";

import { useGetContributionInfo } from "@/web3/hooks/use.contracts.functions";
import { RoundInfo } from "@/web3/constants/types";

interface NTRDAOTableProps {
  roundInfo: RoundInfo;
}

export const NTRDAOTable: React.FC<NTRDAOTableProps> = ({ roundInfo }) => {
  const { account } = useWeb3React();

  const contributionInfo = useGetContributionInfo(account, roundInfo.round);

  if (
    !contributionInfo ||
    (!contributionInfo.contributedBusdAmount &&
      !contributionInfo.contributedNtrAmount)
  )
    return null;

  return (
    <div
      className={`overflow-x-auto border border-gray-shade-3 rounded-2xl mt-5`}
    >
      <table className={`w-full`}>
        <thead className={`text-sm text-left text-gray-shade-7 bg-elevation-1`}>
          <tr>
            <TableCell element={"th"}>Type</TableCell>
            <TableCell element={"th"}>Purchase Date</TableCell>
            <TableCell element={"th"}>Paid Amount</TableCell>
            <TableCell element={"th"}>Lock Months</TableCell>
            <TableCell element={"th"}>Total Claimable</TableCell>
            <TableCell element={"th"}>Claimed</TableCell>
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
                <button className="block max-w-[80px] bg-brand-primary px-4 py-2 rounded text-black-shade-3 font-semibold text-sm">
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
                <button className="block max-w-[80px] bg-brand-primary px-4 py-2 rounded text-black-shade-3 font-semibold text-sm">
                  Claim
                </button>
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </table>
    </div>
  );
};

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

const TableRow: React.FC<TableRowProps> = ({ className, ...props }) => {
  return (
    <tr
      className={clsx(
        `text-sm text-left text-white border-b last:border-none border-gray-shade-3 odd:bg-black-shade-3 even:bg-black-shade-11`,
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
        className={clsx(`py-4 flg:py-7 px-5 flg:px-3 font-semibold`, className)}
        {...props}
      />
    );
  }
  return (
    <td
      className={clsx(`py-2 flg:py-5 px-5 flg:px-3 font-medium`, className)}
      {...props}
    />
  );
};
