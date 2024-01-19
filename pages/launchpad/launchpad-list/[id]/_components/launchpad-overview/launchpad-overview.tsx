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
  metaData: { token_name: string; token_symbol: string; website: string };
  launchpadData: PresaleDataType;
}

export const LaunchpadOverview: React.FC<Props> = ({
  metaData,
  launchpadData,
}) => {
  return (
    <div className="flex flex-col gap-6 flg:flex-row">
      <div className="flex flex-grow flex-col gap-4">
        <PresaleData {...launchpadData} {...metaData} />
        <BuyToken />
      </div>
      <div className="grid-col-1 grid w-full flex-shrink-0 flex-col gap-4 fsm:flex-row fmd:grid-cols-2 flg:flex flg:w-[360px] flg:flex-col">
        <RoundsBooking {...launchpadData} />
        <PresaleStatus {...launchpadData} />
        <ReferralsProgram {...launchpadData} />
      </div>
    </div>
  );
};
