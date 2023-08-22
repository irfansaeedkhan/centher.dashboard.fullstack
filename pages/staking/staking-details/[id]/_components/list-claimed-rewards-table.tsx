import React from "react";
import FinalButton from "@/components/button/final.button";
import { TableCell, TableRow } from "./table-types";
import { RefReward } from "@/staking/types/ref.rewards.interface";
import { formatUnits } from "ethers/lib/utils";
import { BlockchainConfig } from "@/web3/blockchain/config";

const ListClaimedRewardsTable: React.FC<{
  data: RefReward[];
  token: string;
  decimals: string;
}> = ({ data, token, decimals }) => {
  const Check_Reward_Form_TransactionHash = (reward: RefReward) => {
    return (
      <a
        href={`${BlockchainConfig.scanner.url}/tx/${
          reward.transactionHash.endsWith("-1")
            ? reward.transactionHash.slice(0, -2)
            : reward.transactionHash
        }`}
        target="_blank"
        rel="noreferrer noopener"
        className="hover:text-brand-primary"
      >
        {reward.transactionHash.slice(0, 6)}...
        {reward.transactionHash.endsWith("-1")
          ? reward.transactionHash.slice(-6, -2)
          : reward.transactionHash.slice(-4)}
      </a>
    );
  };

  return (
    <table className={`w-full max-w-full table-auto`}>
      <thead className={`bg-elevation-1 text-left text-sm text-gray-shade-7`}>
        <tr>
          <TableCell element={"th"}>Date</TableCell>
          <TableCell element={"th"}>Amount</TableCell>
          <TableCell element={"th"}>Referral</TableCell>
          <TableCell element={"th"}>Transaction</TableCell>
        </tr>
      </thead>
      <tbody className="">
        {!data?.length ? (
          <TableRow>
            <p className="m-8 text-gray-shade-7">No record available</p>
          </TableRow>
        ) : (
          data.map((e: RefReward, i: number) => (
            <TableRow key={i}>
              <TableCell element={"td"}>
                {new Date(e.blockTimestamp * 1000).toLocaleDateString()}
              </TableCell>
              <TableCell element={"td"}>
                {formatUnits(e.reward, decimals)} {token}
              </TableCell>
              <TableCell element={"td"}>
                {" "}
                {e.staker.slice(0, 6)}...
                {e.staker.slice(-4)}
              </TableCell>
              <TableCell element={"td"}>
                {Check_Reward_Form_TransactionHash(e)}
              </TableCell>
            </TableRow>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ListClaimedRewardsTable;
