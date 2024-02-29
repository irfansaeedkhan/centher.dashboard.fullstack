import React from "react";
import {
  PresaleData,
  ReferralsProgram,
  PresaleStatus,
  RoundsBooking,
  BuyToken,
} from "./";
import { PresaleDataType } from "../../../_components/launchpad-card-data";

interface Props {
  metaData: {
    token_name: string;
    token_symbol: string;
    website: string;
    description: string;
  };
  launchpadData: PresaleDataType;
}

export const LaunchpadOverview: React.FC<Props> = ({
  metaData,
  launchpadData,
}) => {
  let currentRound = -1;
  const nowTime = Number((Date.now() / 1000).toFixed());

  const roundInfos = launchpadData.roundInfos;

  if (roundInfos[0]) {
    if (nowTime < Number(roundInfos[0].startTime)) {
      currentRound = -1; // any round is not started
    } else if (
      nowTime >= Number(roundInfos[0].startTime) &&
      nowTime < Number(roundInfos[0].endTime)
    ) {
      currentRound = 1; // in round 1
    }
  }
  if (roundInfos[0] && roundInfos[1]) {
    if (
      nowTime >= Number(roundInfos[0].endTime) &&
      nowTime < (roundInfos[1] && Number(roundInfos[1].startTime))
    ) {
      currentRound = -2; // round 2 is not started
    } else if (
      nowTime >= (roundInfos[1] && Number(roundInfos[1].startTime)) &&
      nowTime < Number(roundInfos[1].endTime)
    ) {
      currentRound = 2; // in round 2
    }
  }

  if (roundInfos[0] && roundInfos[1] && roundInfos[2]) {
    if (
      nowTime >= Number(roundInfos[1].endTime) &&
      nowTime < Number(roundInfos[2].startTime)
    ) {
      currentRound = -3; // round 3 is not started
    } else if (
      nowTime >= Number(roundInfos[2].startTime) &&
      nowTime < Number(roundInfos[2].endTime)
    ) {
      currentRound = 3; // in round 3
    }
  } else if (roundInfos[2] && nowTime >= Number(roundInfos[2].endTime)) {
    currentRound = -4; // all round is ended
  }

  return (
    <div className="flex flex-col gap-6 flg:flex-row">
      <div className="flex flex-grow flex-col gap-4">
        <PresaleData
          {...launchpadData}
          {...metaData}
          presaleActive={currentRound > 0 ? true : false}
        />
        <BuyToken
          {...launchpadData}
          {...metaData}
          currentRound={currentRound}
        />
      </div>
      <div className="grid-col-1 grid w-full flex-shrink-0 flex-col gap-4 fsm:flex-row fmd:grid-cols-2 flg:flex flg:w-[360px] flg:flex-col">
        <RoundsBooking
          {...launchpadData}
          {...metaData}
          currentRound={currentRound}
        />
        <PresaleStatus {...launchpadData} {...metaData} />
        <ReferralsProgram {...launchpadData} />
      </div>
    </div>
  );
};
