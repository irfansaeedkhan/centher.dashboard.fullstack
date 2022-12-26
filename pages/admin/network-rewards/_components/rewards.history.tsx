import React, { useState } from "react";
import clsx from "clsx";
import ctl from "@netlify/classnames-template-literals";

import HistoryTableSkeleton from "@/components/loading.skeletons/admin.network.history";

const RewardsHistory = () => {
  const [historyState, setHistoryState] = useState<"purchase" | "claim">(
    "purchase"
  );
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center fsm:gap-10 gap-4">
        <h3
          onClick={() => setHistoryState("purchase")}
          className={clsx(
            `font-semibold fsm:text-xl cursor-pointer`,
            historyState === "purchase"
              ? "text-white text-sm"
              : "text-gray-shade-7 text-xs"
          )}
        >
          Purchase History
        </h3>
        <h3
          onClick={() => setHistoryState("claim")}
          className={clsx(
            `font-semibold fsm:text-xl cursor-pointer`,
            historyState === "claim"
              ? "text-white text-sm"
              : "text-gray-shade-7 text-xs"
          )}
        >
          Claim History
        </h3>
      </div>
      <div>
        {historyState === "purchase" && (
          <div className={TableContainer}>
            <table className={table}>
              <thead className={thead}>
                <tr>
                  <th scope="col" className={th}>
                    Public Key
                  </th>
                  <th scope="col" className={th}>
                    Date
                  </th>
                  <th scope="col" className={th}>
                    Amount
                  </th>
                  <th scope="col" className={th}>
                    Round
                  </th>
                  <th scope="col" className={th}>
                    Core team (10%)
                  </th>
                  <th scope="col" className={th}>
                    Referral network <br /> (6,4,2,2,2%)
                  </th>
                  <th scope="col" className={th}>
                    Company
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className={tbodyTR}>
                  <td className={td}>0x866...8fAc</td>
                  <td className={td}>21 Sep 2022</td>
                  <td className={td}>200 BUSD</td>
                  <td className={td}>1</td>
                  <td className={td}>50 BUSD</td>
                  <td className={td}>60 BUSD</td>
                  <td className={td}>390 BUSD</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {historyState === "claim" && (
          <div className={TableContainer}>
            <table className={table}>
              <thead className={thead}>
                <tr>
                  <th scope="col" className={th}>
                    Public Key
                  </th>
                  <th scope="col" className={th}>
                    Date
                  </th>
                  <th scope="col" className={th}>
                    Paid Amount
                  </th>
                  <th scope="col" className={th}>
                    Round
                  </th>
                  <th scope="col" className={th}>
                    Rate
                  </th>
                  <th scope="col" className={th}>
                    Claim amount
                  </th>
                  <th scope="col" className={th}>
                    State
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className={tbodyTR}>
                  <td className={td}>0x866...8fAc</td>
                  <td className={td}>21 Sep 2022</td>
                  <td className={td}>200 BUSD</td>
                  <td className={td}>1</td>
                  <td className={td}>1:40</td>
                  <td className={td}>200000 CTHR</td>
                  <td className={td}>Claimed</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      <HistoryTableSkeleton />
    </div>
  );
};

export default RewardsHistory;

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
