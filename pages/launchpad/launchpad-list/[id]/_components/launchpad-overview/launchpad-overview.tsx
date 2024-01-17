import React from "react";
import { PresaleData } from "./presale-data";
import { ReferralData } from "./referral-data";
import { ReferralsProgram } from "./referrals-program";
import { PresaleStatus } from "./presale-status";
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
        <ReferralData {...launchpadData} />
      </div>
      <div className="flex w-full flex-shrink-0 flex-col gap-4 fsm:flex-row flg:w-[312px] flg:flex-col">
        <ReferralsProgram {...launchpadData} />
        <PresaleStatus {...launchpadData} />
      </div>
    </div>
  );
};
