import React from "react";
import { formatUnits } from "ethers/lib/utils";
import { ClaimedRewards } from "@/staking/types/rewards.interface";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import PaginationDropdown from "./pagination-dropdown";
import { TableCell, TableRow } from "./table-types";

const RewardsTable: React.FC<{
  data: ClaimedRewards[];
  token: string;
  decimals: string;
  pageSize: string;
  setPageSize: (val: string) => void;
}> = ({ data, token, pageSize, setPageSize, decimals }) => {
  const Check_Reward_Form_TransactionHash = (reward: ClaimedRewards) => {
    return (
      <a
        href={`${BlockchainConfig.scanner.url}/tx/${
          reward.transactionHash.endsWith("-1")
            ? reward.transactionHash.slice(0, -2)
            : reward.transactionHash
        }`}
        target="_blank"
        rel="noreferrer noopener"
        className="text-gradient-hover"
      >
        {reward.transactionHash.slice(0, 6)}...
        {reward.transactionHash.endsWith("-1")
          ? reward.transactionHash.slice(-6, -2)
          : reward.transactionHash.slice(-4)}
      </a>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex w-full flex-col rounded-xl border border-gray-shade-3 bg-black-shade-9">
        <div className="text-[min(10vw, 20px)] rounded-t-xl bg-elevation-1 px-8 pb-4 pt-8 font-semibold text-white">
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
                <TableCell element={"th"}>Total Amount</TableCell>
                {+data?.[0]?.paidTax > 0 && (
                  <TableCell element={"th"}>Tax Amount</TableCell>
                )}
                {+data?.[0]?.paidTax > 0 && (
                  <TableCell element={"th"}>Profit</TableCell>
                )}
              </tr>
            </thead>
            <tbody className="">
              {!data?.length ? (
                <p className="m-8 w-full text-gray-shade-7">No record found!</p>
              ) : (
                data.map((e: ClaimedRewards, i: number) => (
                  <TableRow key={i}>
                    <TableCell element={"td"}>
                      {" "}
                      {new Date(+e.blockTimestamp * 1000).toLocaleDateString()}
                    </TableCell>
                    <TableCell element={"td"}>
                      {Check_Reward_Form_TransactionHash(e)}
                    </TableCell>
                    <TableCell element={"td"}>
                      {normalizeValue(
                        formatUnits(+e.amount + +e.paidTax + "", decimals)
                      )}{" "}
                      {token}
                    </TableCell>
                    {+e?.paidTax > 0 && (
                      <TableCell element={"td"}>
                        {normalizeValue(formatUnits(e.paidTax, decimals))}{" "}
                        {token}
                      </TableCell>
                    )}
                    {+e?.paidTax > 0 && (
                      <TableCell element={"td"}>
                        {normalizeValue(formatUnits(e.amount, decimals))}{" "}
                        {token}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-white">Show list</p>
          <PaginationDropdown pageSize={pageSize} setPageSize={setPageSize} />
        </div>
      </div>
    </div>
  );
};

export default RewardsTable;
