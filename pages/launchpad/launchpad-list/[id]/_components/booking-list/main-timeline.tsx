import React, { useEffect } from "react";
import { dummyDataArray } from "./data";
import { FirstLastTimeline, NumberTimeline } from "./";
import { PresaleDataType } from "../../../_components/launchpad-card-data";
import { useGetContributionInfoForLaunchpad } from "@/web3/hooks/use.contracts.functions";
import useUser from "@/hooks/use.user";

interface Props extends PresaleDataType {
  roundNumber: number;
  lockMonths: number;
  purchaseTime: number;
}

export const MainTimeline: React.FC<Props> = ({
  token,
  roundNumber,
  releaseMonth,
  lockMonths,
  purchaseTime,
}) => {
  const { user } = useUser();
  const { contributionInfo, refreshContributionInfo, loadingState } =
    useGetContributionInfoForLaunchpad(user?._id, token, roundNumber - 1);

  if (!contributionInfo) return;

  const monthInEpoch = 2592000;
  // const currentTime = Date.now();
  // console.log("currentTime: ", Math.floor(currentTime / 1000));

  // const lockPeriod = new Date(
  //   currentTime + Number(roundInfos[0].lockMonths) * 1000
  // );

  // useEffect(() => {
  //   if (!user) return;
  //   (async () => {
  //     try {
  //       const data = await useGetContributionInfoForLaunchpad(user, token, 0);
  //       console.log(data);
  //     } catch (e) {}
  //   })();
  // }, [token, user]);

  // fundType === 0
  //           ? contributionInfo.purchaseTimeForBusd +
  //             roundInfo.lockMonths * monthInEpoch
  //           : contributionInfo.purchaseTimeForNtr +
  //             roundInfo.lockMonths * monthInEpoch
  console.log("MainTimeline -> contributionInfo", contributionInfo);
  console.log("PurchaseTime: ", purchaseTime);
  console.log(
    "endtime: ",
    new Date(contributionInfo.purchaseTime + lockMonths * monthInEpoch)
  );

  return (
    <div className="flex flex-col gap-3">
      <FirstLastTimeline
        title="4 months Lock Period will End in"
        para="DXC tokens will be released 12,5% monthly."
        endTime={
          new Date(
            (contributionInfo.purchaseTime + lockMonths * monthInEpoch) * 1000
          )
        }
      />
      <div className="flex flex-col gap-1">
        {dummyDataArray.map((data, index) => (
          <NumberTimeline key={index} {...data} />
        ))}
      </div>
      <FirstLastTimeline
        title="Total 20000CTHR will be released in"
        para="Calculated on the total DXC tokens that is expected to be released within the given time frame."
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
