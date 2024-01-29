import React from "react";
import dayjs from "dayjs";
import { formatUnits } from "ethers/lib/utils";
import { RefReward } from "@/staking/types/ref.rewards.interface";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { TableCell, TableRow } from "./table-types";

const ListClaimedRewardsTable: React.FC<{
  data: RefReward[];
  token: string;
  decimals: string;
}> = ({ data, token, decimals }) => {
  const Check_Reward_Form_TransactionHash = (reward: RefReward) => {
    return (
      <a
        href={`${BlockchainConfig.scanner.url}/tx/${
          reward.txId.endsWith("-1") ? reward.txId.slice(0, -2) : reward.txId
        }`}
        target="_blank"
        rel="noreferrer noopener"
        className="text-gradient-hover"
      >
        {reward.txId.slice(0, 6)}...
        {reward.txId.endsWith("-1")
          ? reward.txId.slice(-6, -2)
          : reward.txId.slice(-4)}
      </a>
    );
  };

  return (
    <>
      <table className={`w-full max-w-full table-auto`}>
        <thead className={`bg-elevation-1 text-left text-sm text-gray-shade-7`}>
          <tr>
            <TableCell element={"th"}>Date</TableCell>
            <TableCell element={"th"}>Referral</TableCell>
            <TableCell element={"th"}>Transaction</TableCell>
            <TableCell element={"th"}>Amount</TableCell>
            <TableCell element={"th"}>Tax Amount</TableCell>
            <TableCell element={"th"}>Profit</TableCell>
          </tr>
        </thead>

        <tbody className="">
          {data?.length
            ? data.map((e: RefReward, i: number) => (
                <TableRow key={i}>
                  <TableCell element={"td"}>
                    {dayjs(new Date(Number(+e.createdAt) * 1000)).format(
                      "DD-MMM-YYYY"
                    )}
                  </TableCell>

                  <TableCell element={"td"}>
                    {" "}
                    {e.user.slice(0, 6)}...
                    {e.user.slice(-4)}
                  </TableCell>
                  <TableCell element={"td"}>
                    {Check_Reward_Form_TransactionHash(e)}
                  </TableCell>
                  <TableCell element={"td"}>
                    {Number(
                      formatUnits(+e.amount + +e.paidTax + "", decimals)
                    ).toFixed(3)}{" "}
                    {token}
                  </TableCell>
                  {+e?.paidTax > 0 ? (
                    <TableCell element={"td"}>
                      {Number(formatUnits(e.paidTax, decimals)).toFixed(3)}{" "}
                      {token}
                    </TableCell>
                  ) : (
                    <TableCell element={"td"}>--</TableCell>
                  )}
                  {+e?.amount > 0 ? (
                    <TableCell element={"td"}>
                      {Number(formatUnits(e.amount, decimals)).toFixed(3)}{" "}
                      {token}
                    </TableCell>
                  ) : (
                    <TableCell element={"td"}>--</TableCell>
                  )}
                </TableRow>
              ))
            : null}
        </tbody>
      </table>
      {!data?.length && (
        <span className="flex h-20 w-full !min-w-full items-center justify-center rounded-bl-xl text-center text-gray-shade-7">
          No record found!
        </span>
      )}
    </>
  );
};

export default ListClaimedRewardsTable;
