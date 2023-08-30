import React from "react";
import { formatUnits } from "ethers/lib/utils";
import FinalButton from "@/components/button/final.button";
import { Referral } from "@/staking/types/referrals.interface";
import { OptionalType } from "@/staking/types";
import { TableCell, TableRow } from "./table-types";

const ListReferralsTable: React.FC<{
  data: OptionalType<Referral[]>;
  token: string;
  rewardToken: string;
  claimRefReward: (user: string) => void;
  rewardTokenDecimals: string;
  decimals: string;
  claimable: boolean;
}> = ({
  data,
  token,
  claimRefReward,
  rewardToken,
  rewardTokenDecimals,
  decimals,
  claimable,
}) => {
  return (
    <table className={`w-full max-w-full table-auto`}>
      <thead className={`bg-elevation-1 text-left text-sm text-gray-shade-7`}>
        <tr>
          <TableCell element={"th"}>User Adress</TableCell>
          <TableCell element={"th"}>Join Date</TableCell>
          <TableCell element={"th"}>Level</TableCell>
          <TableCell element={"th"}>Staked Amount</TableCell>
          {claimable ? (
            <TableCell element={"th"}>Claimable Reward</TableCell>
          ) : null}
          {claimable ? <TableCell element={"th"}>Action</TableCell> : null}
        </tr>
      </thead>
      <tbody className="">
        {!data?.length ? (
          <TableRow>
            <p className="m-8 text-gray-shade-7">No record found</p>
          </TableRow>
        ) : (
          data.map((e: Referral, i: number) => (
            <TableRow key={i}>
              <TableCell element={"td"}>
                {" "}
                {e.id.split("-")[0].slice(0, 6)}...
                {e.id.split("-")[0].slice(-4)}
              </TableCell>
              <TableCell element={"td"}>
                {new Date(+e.joinedAt * 1000).toLocaleDateString()}
              </TableCell>
              <TableCell element={"td"}>{e.level}</TableCell>
              <TableCell element={"td"}>
                {formatUnits(
                  e.stakedAmount ? e.stakedAmount + "" : "0",
                  decimals
                )}{" "}
                {token}
              </TableCell>
              {claimable ? (
                <TableCell element={"td"}>
                  {formatUnits(
                    e.claimableReward ? e.claimableReward + "" : "0",
                    rewardTokenDecimals
                  )}{" "}
                  {rewardToken}
                </TableCell>
              ) : null}

              {claimable ? (
                <TableCell element={"td"}>
                  {e.claimableReward && e.claimableReward != "0" ? (
                    <FinalButton
                      title="Claim Rewards"
                      variant="primary"
                      onClick={() => claimRefReward(e.id.split("-")[0])}
                    />
                  ) : (
                    "Not available to claim"
                  )}
                </TableCell>
              ) : null}
            </TableRow>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ListReferralsTable;
