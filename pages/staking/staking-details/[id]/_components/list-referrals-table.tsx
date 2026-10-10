import React from "react";
import dayjs from "dayjs";
import { formatUnits } from "ethers/lib/utils";
import Button from "@/components/button";
import { Referral } from "@/staking/types/referrals.interface";
import { OptionalType } from "@/staking/types";
import { eqAddress } from "@/lib/chat/utils";
import { CgSpinner } from "react-icons/cg";
import { TableCell, TableRow } from "./table-types";

const ListReferralsTable: React.FC<{
  isClaiming: string;
  data: OptionalType<Referral[]>;
  token: string;
  rewardToken: string;
  claimRefReward: (user: string) => void;
  rewardTokenDecimals: string;
  decimals: string;
  claimable: boolean;
}> = ({
  isClaiming,
  data,
  token,
  claimRefReward,
  rewardToken,
  rewardTokenDecimals,
  decimals,
  claimable,
}) => {
  return (
    <>
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
          {data?.length
            ? data.map((e: Referral, i: number) => (
                <TableRow key={i}>
                  <TableCell element={"td"}>
                    {" "}
                    {e.id.split("-")[0].slice(0, 6)}...
                    {e.id.split("-")[0].slice(-4)}
                  </TableCell>
                  <TableCell element={"td"}>
                    {dayjs(new Date(Number(+e.joinedAt) * 1000)).format(
                      "DD-MMM-YYYY"
                    )}
                  </TableCell>
                  <TableCell element={"td"}>{e.level}</TableCell>
                  <TableCell element={"td"}>
                    {Number(
                      formatUnits(
                        e.stakedAmount ? e.stakedAmount + "" : "0",
                        decimals
                      )
                    )}{" "}
                    {token}
                  </TableCell>
                  {claimable ? (
                    <TableCell element={"td"}>
                      {Number(
                        formatUnits(
                          e.claimableReward ? e.claimableReward + "" : "0",
                          rewardTokenDecimals
                        )
                      ).toFixed(3)}{" "}
                      {rewardToken}
                    </TableCell>
                  ) : null}

                  {claimable ? (
                    <TableCell element={"td"}>
                      {e.claimableReward && e.claimableReward != "0" ? (
                        <Button
                          title="Claim"
                          variant="primary"
                          onClick={() => claimRefReward(e.id.split("-")[0])}
                          loaderIcon={
                            eqAddress(isClaiming, e.id.split("-")[0]) ? (
                              <CgSpinner className="h-5 animate-spin text-white" />
                            ) : undefined
                          }
                        />
                      ) : (
                        "Not available to claim"
                      )}
                    </TableCell>
                  ) : null}
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

export default ListReferralsTable;
