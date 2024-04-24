import React from "react";
import { FirstLastTimeline, NumberTimeline } from "./";
import { PresaleDataType } from "../../../_components/launchpad-card-data";
import { useGetContributionInfoForLaunchpad } from "@/web3/hooks/use.contracts.functions";
import useUser from "@/hooks/use.user";

interface Props extends PresaleDataType {
  roundNumber: number;
  lockMonths: number;
  purchaseTime: number;
  tokenSymbol: string;
}

export const MainTimeline: React.FC<Props> = ({
  token,
  roundNumber,
  releaseMonth,
  lockMonths,
  tokenSymbol,
}) => {
  const { user } = useUser();
  const { contributionInfo, refreshContributionInfo, loadingState } =
    useGetContributionInfoForLaunchpad(user?._id, token, roundNumber - 1);

  if (!contributionInfo) return;
  const eachMonthAmount =
    Number(contributionInfo.totalClaimableToken) / Number(releaseMonth);
  const percentPerMonth = (
    (eachMonthAmount / Number(contributionInfo.totalClaimableToken)) *
    100
  ).toFixed(2);

  const monthInEpoch =
    process.env.NEXT_PUBLIC_APP_ENV === "production" ? 2592000 : 1800;

  return (
    <div className="flex flex-col gap-3">
      <FirstLastTimeline
        title={`${lockMonths} months Lock Period will End in`}
        para={`${tokenSymbol} tokens will be released ${percentPerMonth}% monthly.`}
        endTime={
          new Date(
            (contributionInfo.purchaseTime + lockMonths * monthInEpoch) * 1000
          )
        }
      />
      <div className="flex flex-col gap-1">
        {/* {dummyDataArray.map((data, index) => (
          <NumberTimeline key={index} {...data} />
        ))} */}

        {Array.from({ length: Number(releaseMonth) }, (_, index) => index).map(
          (index: number) => {
            const nowTime = Math.floor(Date.now() / 1000);
            // const claimable = contributionInfo.totalClaimableToken;
            const startTime = contributionInfo.purchaseTime;
            const endTime =
              startTime +
              lockMonths * monthInEpoch +
              (index + 1) * monthInEpoch;

            const claimablePerMonth =
              contributionInfo.totalClaimableToken / Number(releaseMonth);

            const claimedMonths =
              contributionInfo.claimedToken / claimablePerMonth;
            const claimed = claimedMonths > index ? claimablePerMonth : 0;

            const claimable =
              claimedMonths > index || endTime > nowTime
                ? 0
                : claimablePerMonth;
            const lock =
              claimable === 0 && claimed === 0 ? claimablePerMonth : 0;

            return (
              <NumberTimeline
                key={index}
                index={index + 1}
                nowTime={nowTime}
                startTime={startTime}
                endTime={endTime}
                claimablePerMonth={claimablePerMonth}
                claimedMonths={claimedMonths}
                claimed={claimed}
                claimable={claimable}
                lock={lock}
                purchaseAmount={contributionInfo.contributedFund}
                tokenSymbol={tokenSymbol}
                token={token}
                roundNumber={roundNumber}
                percentPerMonth={percentPerMonth}
                refreshContributionInfo={refreshContributionInfo}
              />
            );
          }
        )}
      </div>
      <FirstLastTimeline
        title={`Total ${contributionInfo.totalClaimableToken} ${tokenSymbol} will be released in`}
        para={`Calculated on the total ${tokenSymbol} tokens that is expected to be released within the given time frame.`}
        endTime={
          new Date(
            (contributionInfo.purchaseTime +
              (lockMonths + Number(releaseMonth)) * monthInEpoch) *
              1000
          )
        }
      />
    </div>
  );
};
