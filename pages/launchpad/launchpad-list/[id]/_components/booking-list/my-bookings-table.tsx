import React from "react";
import dayjs from "dayjs";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { TableCell, TableRow } from "@/components/shared";

import {
  PresaleDataType,
  TokenPurchaseWithBNB,
  TokenPurchaseWithBUSD,
} from "../../../_components/launchpad-card-data";
import { formatUnits } from "viem";

interface Props extends PresaleDataType {
  bookingsTab: "my-bookings" | "recent-bookings";
  bookings: TokenPurchaseWithBNB[] | TokenPurchaseWithBUSD[];
  setRoundNumber: (roundNo: number) => void;
  setPurchaseTime: (purchaseTime: number) => void;
  tokenSymbol: string;
}

export const MyBookingsTable: React.FC<Props> = ({
  bookingsTab,
  bookings,
  setRoundNumber,
  setPurchaseTime,
  tokenSymbol,
}) => {
  return (
    <div className="scrollSetLight3 overflow-x-auto">
      <table className="w-full table-auto rounded-lg">
        <thead>
          <TableRow
            element="th"
            className="h-[64px] w-full bg-elevation-1 px-4 text-sm font-semibold text-gray-shade-14"
          >
            <TableCell element={"th"}>Account Address</TableCell>
            <TableCell element={"th"}>Payment</TableCell>
            <TableCell element={"th"}>Receivable</TableCell>
            <TableCell element={"th"}>{tokenSymbol} Price</TableCell>
            <TableCell element={"th"}>Round</TableCell>
            <TableCell element={"th"}>Trx Hash</TableCell>
            <TableCell element={"th"}>Date</TableCell>
            {bookingsTab === "my-bookings" && (
              <TableCell element={"th"}>Rewards</TableCell>
            )}
          </TableRow>
        </thead>
        <tbody>
          {bookings.map((booking, i) => {
            return (
              <TableRow element="tb" key={i}>
                <TableCell element={"td"}>
                  <a
                    href={`${BlockchainConfig.scanner.url}/address/${booking.beneficiary}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-gradient"
                  >
                    {sliceAccountAddress(booking.beneficiary)}
                  </a>
                </TableCell>
                <TableCell element={"td"}>
                  {formatUnits(BigInt(booking.amount), 18)}
                </TableCell>
                <TableCell element={"td"}>
                  {formatUnits(BigInt(Number(booking.receivable)), 18)}
                </TableCell>
                <TableCell element={"td"}>
                  {formatUnits(BigInt(Number(booking.pricePerToken)), 18)}
                </TableCell>
                <TableCell element={"td"}>{booking.round + 1}</TableCell>
                <TableCell element={"td"}>
                  {sliceAccountAddress(booking.transactionHash)}
                </TableCell>
                <TableCell element={"td"}>
                  {dayjs(Number(booking.blockTimestamp) * 1000).format(
                    "DD-MMM-YYYY"
                  )}
                </TableCell>
                {bookingsTab === "my-bookings" && (
                  <TableCell
                    element={"td"}
                    onClick={() => {
                      setRoundNumber(Number(booking.round) + 1);
                      setPurchaseTime(Number(booking.blockTimestamp));
                    }}
                  >
                    <span className="text-gradient-1 cursor-pointer">
                      Timeline
                    </span>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
