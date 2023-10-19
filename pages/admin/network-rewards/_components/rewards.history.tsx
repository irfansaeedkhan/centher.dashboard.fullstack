import React, { useState } from "react";
import clsx from "clsx";
import ctl from "@netlify/classnames-template-literals";
import { useAdminLaunchpadRewards } from "@/store/admin.network.rewards";

import HistoryTableSkeleton from "@/components/loading.skeletons/admin.network.history";
import { formatAddress } from "@/utils/format.address";

const RewardsHistory = () => {
  const [historyState, setHistoryState] = useState<
    "purchaseBusd" | "purchaseNtr" | "claim"
  >("purchaseBusd");
  const {
    purchaseWithBusdHistory,
    purchaseWithNtrHistory,
    claimHistory,
    loadingPurchaseWithBusdHistory,
    loadingPurchaseWithNtrHistory,
    loadingClaimHistory,
  } = useAdminLaunchpadRewards((state) => ({
    purchaseWithBusdHistory: state.purchaseWithBusdHistory,
    purchaseWithNtrHistory: state.purchaseWithNtrHistory,
    claimHistory: state.claimHistory,
    loadingPurchaseWithBusdHistory: state.loadingPurchaseWithBusdHistory,
    loadingPurchaseWithNtrHistory: state.loadingPurchaseWithNtrHistory,
    loadingClaimHistory: state.loadingClaimHistory,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 fsm:gap-10">
        <h3
          onClick={() => setHistoryState("purchaseBusd")}
          className={clsx(
            `cursor-pointer font-semibold fsm:text-xl`,
            historyState === "purchaseBusd"
              ? "text-sm text-white"
              : "text-xs text-gray-shade-7"
          )}
        >
          Purchase Busd History
        </h3>
        <h3
          onClick={() => setHistoryState("purchaseNtr")}
          className={clsx(
            `cursor-pointer font-semibold fsm:text-xl`,
            historyState === "purchaseNtr"
              ? "text-sm text-white"
              : "text-xs text-gray-shade-7"
          )}
        >
          Purchase Ntr History
        </h3>
        <h3
          onClick={() => setHistoryState("claim")}
          className={clsx(
            `cursor-pointer font-semibold fsm:text-xl`,
            historyState === "claim"
              ? "text-sm text-white"
              : "text-xs text-gray-shade-7"
          )}
        >
          Claim History
        </h3>
      </div>
      <div>
        {historyState === "purchaseBusd" && (
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

              {loadingPurchaseWithBusdHistory === "loaded" &&
                loadingPurchaseWithNtrHistory === "loaded" &&
                loadingClaimHistory === "loaded" && (
                  <tbody>
                    {purchaseWithBusdHistory &&
                      purchaseWithBusdHistory.map(
                        (item: any, index: number) => {
                          return (
                            <tr className={tbodyTR} key={index}>
                              <td className={td}>
                                {formatAddress(item.publicKey)}
                              </td>
                              <td className={td}>{item.date}</td>
                              <td className={td}>{item.paidAmount}</td>
                              <td className={td}>{item.round}</td>
                              <td className={td}>{item.coreTeam}</td>
                              <td className={td}>{item.referralNetwork}</td>
                              <td className={td}>{item.company}</td>
                            </tr>
                          );
                        }
                      )}
                  </tbody>
                )}
            </table>
          </div>
        )}
        {historyState === "purchaseNtr" && (
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

              {loadingPurchaseWithBusdHistory === "loaded" &&
                loadingPurchaseWithNtrHistory === "loaded" &&
                loadingClaimHistory === "loaded" && (
                  <tbody>
                    {purchaseWithNtrHistory &&
                      purchaseWithNtrHistory.map((item: any, index: number) => {
                        return (
                          <tr className={tbodyTR} key={index}>
                            <td className={td}>
                              {formatAddress(item.publicKey)}
                            </td>
                            <td className={td}>{item.date}</td>
                            <td className={td}>{item.paidAmount}</td>
                            <td className={td}>{item.round}</td>
                            <td className={td}>{item.coreTeam}</td>
                            <td className={td}>{item.referralNetwork}</td>
                            <td className={td}>{item.company}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                )}
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
                    Round
                  </th>
                  <th scope="col" className={th}>
                    Claim amount
                  </th>
                </tr>
              </thead>

              {loadingPurchaseWithBusdHistory === "loaded" &&
                loadingPurchaseWithNtrHistory === "loaded" &&
                loadingClaimHistory === "loaded" && (
                  <tbody>
                    {claimHistory &&
                      claimHistory.map((item: any, index: number) => {
                        return (
                          <tr className={tbodyTR} key={index}>
                            <td className={td}>
                              {formatAddress(item.publicKey)}
                            </td>
                            <td className={td}>{item.date}</td>
                            <td className={td}>{item.round}</td>
                            <td className={td}>{item.claimAmount}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                )}
            </table>
          </div>
        )}
      </div>
      {!(
        loadingPurchaseWithBusdHistory === "loaded" &&
        loadingPurchaseWithNtrHistory === "loaded" &&
        loadingClaimHistory === "loaded"
      ) && <HistoryTableSkeleton />}
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
text-sm text-gray-shade-7  uppercase bg-background-shade-3 
`);
const th = ctl(` 
py-4 lg:py-7 first:px-8 last:px-8 px-5 lg:px-6 capitalize
`);
const td = ctl(` 
first:px-8 last:px-8 px-5 lg:px-6 text-sm py-4 lg:py-7  text-white font-medium
`);
const tbodyTR = ctl(` 
border-b border-gray-shade-3  odd:bg-black-shade-3 even:bg-black-shade-11
`);
