import React from "react";
import dayjs from "dayjs";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { sliceAccountAddress } from "@/utils/user.helpers";
import { TableCell, TableRow } from "@/components/shared";
import { bookingsData } from "./data";

interface Props {
  bookingsTab: "my-bookings" | "recent-bookings";
}

export const MyBookingsTable: React.FC<Props> = ({ bookingsTab }) => {
  return (
    <div className="scrollSetLight3 overflow-x-auto">
      <table className="w-full table-auto rounded-lg">
        <thead>
          <TableRow className="h-[64px] w-full !bg-elevation-1 px-4 text-sm font-semibold text-gray-shade-14">
            <TableCell element={"th"}>Account Address</TableCell>
            <TableCell element={"th"}>Payment</TableCell>
            <TableCell element={"th"}>Receivable</TableCell>
            <TableCell element={"th"}>DXC Price</TableCell>
            <TableCell element={"th"}>Round</TableCell>
            <TableCell element={"th"}>Trx Hash</TableCell>
            <TableCell element={"th"}>Date</TableCell>
            {bookingsTab === "my-bookings" && (
              <TableCell element={"th"}>Rewards</TableCell>
            )}
          </TableRow>
        </thead>
        <tbody>
          {bookingsData.map((booking, i) => {
            return (
              <TableRow key={i}>
                <TableCell element={"td"}>
                  <a
                    href={`${BlockchainConfig.scanner.url}/address/${booking.account_address}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-gradient"
                  >
                    {sliceAccountAddress(booking.account_address)}
                  </a>
                </TableCell>
                <TableCell element={"td"}>{booking.payment}</TableCell>
                <TableCell element={"td"}>{booking.receiveable}</TableCell>
                <TableCell element={"td"}>{booking.dxc_price}</TableCell>
                <TableCell element={"td"}>{booking.round}</TableCell>
                <TableCell element={"td"}>
                  {sliceAccountAddress(booking.trx_hash)}
                </TableCell>
                <TableCell element={"td"}>
                  {dayjs(booking.date).format("DD-MMM-YYYY")}
                </TableCell>
                {bookingsTab === "my-bookings" && (
                  <TableCell
                    element={"td"}
                    // onClick={() => setRoundNo(Number(booking.round) - 1)}
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
