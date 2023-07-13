import React from "react";
import FinalButton from "@/components/button/final.button";
import { TableCell, TableRow } from "./table-types";

const ListReferralsTable = () => {
  return (
    <table className={`w-full max-w-full table-auto`}>
      <thead className={`bg-elevation-1 text-left text-sm text-gray-shade-7`}>
        <tr>
          <TableCell element={"th"}>User Adress</TableCell>
          <TableCell element={"th"}>Claimable Amount</TableCell>
          <TableCell element={"th"}>Staked Amount</TableCell>
          <TableCell element={"th"}>Action</TableCell>
        </tr>
      </thead>
      <tbody className="">
        <TableRow>
          <TableCell element={"td"}>12th, Aug 2022</TableCell>
          <TableCell element={"td"}>0xab9...8cxz</TableCell>
          <TableCell element={"td"}>236 BUSD</TableCell>
          <TableCell element={"td"}>
            <FinalButton title="Claim Rewards" variant="primary" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell element={"td"}>12th, Aug 2022</TableCell>
          <TableCell element={"td"}>0xab9...8cxz</TableCell>
          <TableCell element={"td"}>236 BUSD</TableCell>
          <TableCell element={"td"}>14 Hours : 42 Mints : 56 Seconds</TableCell>
        </TableRow>
        <TableRow>
          <TableCell element={"td"}>12th, Aug 2022</TableCell>
          <TableCell element={"td"}>0xab9...8cxz</TableCell>
          <TableCell element={"td"}>236 BUSD</TableCell>
          <TableCell element={"td"}>
            <FinalButton title="Claim Rewards" variant="primary" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell element={"td"}>12th, Aug 2022</TableCell>
          <TableCell element={"td"}>0xab9...8cxz</TableCell>
          <TableCell element={"td"}>236 BUSD</TableCell>
          <TableCell element={"td"}>
            <FinalButton title="Claim Rewards" variant="primary" />
          </TableCell>
        </TableRow>
      </tbody>
    </table>
  );
};

export default ListReferralsTable;
