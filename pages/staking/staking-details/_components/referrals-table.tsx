import React, { useState } from "react";
import clsx from "clsx";
import PaginationDropdown from "./pagination-dropdown";
import ListClaimedRewardsTable from "./list-claimed-rewards-table";
import ListReferralsTable from "./list-referrals-table";

const ReferralsTable = () => {
  const [currentTable, setCurrentTable] = useState<"rewards" | "referrals">(
    "rewards"
  );
  return (
    <div className="space-y-4">
      <div className="flex w-full flex-col rounded-xl border border-gray-shade-3 bg-black-shade-9">
        <div className="flex items-center gap-8 rounded-t-xl bg-elevation-1 px-8 pt-8 pb-4">
          <p
            className={clsx(
              "text-[min(10vw, 20px)] hover:textGradient cursor-pointer font-semibold",
              currentTable === "rewards" ? "textGradient" : "text-white"
            )}
            onClick={() => setCurrentTable("rewards")}
          >
            List of Claimed Rewards
          </p>
          <p
            className={clsx(
              "text-[min(10vw, 20px)] hover:textGradient cursor-pointer font-semibold",
              currentTable === "referrals" ? "textGradient" : "text-white"
            )}
            onClick={() => setCurrentTable("referrals")}
          >
            List of Referrals
          </p>
        </div>
        <div className="scrollSetLight2 overflow-x-auto">
          {currentTable === "rewards" ? (
            <ListClaimedRewardsTable />
          ) : (
            currentTable === "referrals" && <ListReferralsTable />
          )}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-white">Show list</p>
          <PaginationDropdown />
        </div>
      </div>
    </div>
  );
};

export default ReferralsTable;
