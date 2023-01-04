import React, { useState } from "react";
import ctl from "@netlify/classnames-template-literals";

import { formatAddress } from "@/utils/format.address";

const RegistrationHistory = ({ data }: any) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className={TableContainer}>
          <table className={table}>
            <thead className={thead}>
              <tr>
                <th scope="col" className={th}>
                  Date
                </th>
                <th scope="col" className={th}>
                  Public Key
                </th>
                <th scope="col" className={th}>
                  Referrer Address
                </th>
                <th scope="col" className={th}>
                  Paid Amount(BNB)
                </th>
              </tr>
            </thead>

            {data && (
              <tbody>
                {data &&
                  data.map((item: any, index: number) => {
                    return (
                      <tr className={tbodyTR} key={index}>
                        <td className={td}>{item.date}</td>
                        <td className={td}>{formatAddress(item.publicKey)}</td>
                        <td className={td}>{formatAddress(item.referrer)}</td>
                        <td className={td}>{item.paidAmount}</td>
                      </tr>
                    );
                  })}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegistrationHistory;

const TableContainer = ctl(` 
overflow-x-auto relative bg-background-shade-3 shadow-md rounded-2xl 
`);
const table = ctl(` 
overflow-hidden w-full border-2 rounded-2xl border-gray-shade-3 text-sm text-left text-gray-500 bg-background-shade-3 
`);
const thead = ctl(` 
text-14px text-gray-shade-7  uppercase bg-background-shade-3 
`);
const th = ctl(` 
py-4 lg:py-7 first:px-8 last:px-8 px-5 lg:px-6 capitalize
`);
const td = ctl(` 
first:px-8 last:px-8 px-5 lg:px-6 text-14px py-4 lg:py-7  text-white font-medium
`);
const tbodyTR = ctl(` 
border-b border-gray-shade-3  odd:bg-black-shade-3 even:bg-black-shade-11
`);
