import React from "react";
import PaginationDropdown from "./pagination-dropdown";
import { TableCell, TableRow } from "./table-types";

const RewardsTable = () => {
  return (
    <div className="space-y-4">
      <div className="flex w-full flex-col rounded-xl border border-gray-shade-3 bg-black-shade-9">
        <div className="text-[min(10vw, 20px)] rounded-t-xl bg-elevation-1 px-8 pt-8 pb-4 font-semibold text-white">
          Claim Rewards History
        </div>
        <div className="scrollSetLight2 overflow-x-auto">
          <table className={`w-full max-w-full table-auto`}>
            <thead
              className={`bg-elevation-1 text-left text-sm text-gray-shade-7`}
            >
              <tr>
                <TableCell element={"th"}>Date</TableCell>
                <TableCell element={"th"}>Transaction Hash</TableCell>
                <TableCell element={"th"}>Claimed Amount</TableCell>
              </tr>
            </thead>
            <tbody className="">
              <TableRow>
                <TableCell element={"td"}>12th, Aug 2022</TableCell>
                <TableCell element={"td"}>0xab9...8cxz</TableCell>
                <TableCell element={"td"}>01156 BUSD0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell element={"td"}>12th, Aug 2022</TableCell>
                <TableCell element={"td"}>0xab9...8cxz</TableCell>
                <TableCell element={"td"}>01156 BUSD0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell element={"td"}>12th, Aug 2022</TableCell>
                <TableCell element={"td"}>0xab9...8cxz</TableCell>
                <TableCell element={"td"}>01156 BUSD0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell element={"td"}>12th, Aug 2022</TableCell>
                <TableCell element={"td"}>0xab9...8cxz</TableCell>
                <TableCell element={"td"}>01156 BUSD0</TableCell>
              </TableRow>
            </tbody>
          </table>
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

export default RewardsTable;
