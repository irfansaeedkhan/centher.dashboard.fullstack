import React from "react";

import { Booking, PreBookingRounds } from "@/lib/get-pre-bookings-stats/types";
import { BlockchainConfig } from "@/web3/blockchain/config";

interface Props {
  recievableTokenSymbol: string;
  bookings: Booking[];
  rounds: PreBookingRounds;
}

export const BookingList: React.FC<Props> = ({
  recievableTokenSymbol,
  bookings,
  rounds,
}) => {
  return (
    <div className="scrollSetLight2 overflow-x-auto">
      <table className="w-full table-auto rounded-lg">
        <thead>
          <tr className="h-[64px] w-full bg-elevation-1 px-4 text-sm font-semibold text-gray-shade-14">
            <th className="whitespace-nowrap px-4 py-2 text-start fsm:px-8">
              Account Address
            </th>
            <th className="whitespace-nowrap px-4 py-2 text-start">Payment</th>
            <th className="whitespace-nowrap px-4 py-2 text-start">
              Receivable
            </th>
            <th className="whitespace-nowrap px-4 py-2 text-start">
              {recievableTokenSymbol} Price
            </th>
            <th className="whitespace-nowrap px-4 py-2 text-start">Round</th>
            <th className="whitespace-nowrap px-4 py-2 text-start">Trx Hash</th>
            <th className="whitespace-nowrap px-4 py-2 text-start">Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            return (
              <tr
                key={booking.id}
                className="h-[64px] border-b border-gray-shade-3 bg-transparent text-sm font-medium text-white last:border-none"
              >
                <td className="whitespace-nowrap px-4 py-2 fsm:px-8">
                  <a
                    href={`${BlockchainConfig.scanner.url}/address/${booking.sender_address}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-brand-primary"
                  >
                    {booking.sender_address.slice(0, 6)}...
                    {booking.sender_address.slice(-4)}
                  </a>
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  {booking.payment_token_amount.toString().includes(".")
                    ? booking.payment_token_amount.toFixed(2)
                    : booking.payment_token_amount}{" "}
                  {booking.payment_token_symbol}
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  {booking.receivable_token_amount.toString().includes(".")
                    ? booking.receivable_token_amount.toFixed(2)
                    : booking.receivable_token_amount}{" "}
                  {booking.receivable_token_symbol}
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  {
                    rounds[booking.round]
                      .receivable_token_price_in_payment_token
                  }{" "}
                  {booking.payment_token_symbol}
                </td>
                <td className="whitespace-nowrap px-4 py-2">{booking.round}</td>
                <td className="whitespace-nowrap px-4 py-2">
                  <a
                    href={`${BlockchainConfig.scanner.url}/tx/${
                      booking.trx_hash.endsWith("-1")
                        ? booking.trx_hash.slice(0, -2)
                        : booking.trx_hash
                    }`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-brand-primary"
                  >
                    {booking.trx_hash.slice(0, 6)}...
                    {booking.trx_hash.endsWith("-1")
                      ? booking.trx_hash.slice(-6, -2)
                      : booking.trx_hash.slice(-4)}
                  </a>
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  {new Date(booking.createdAt * 1000).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
