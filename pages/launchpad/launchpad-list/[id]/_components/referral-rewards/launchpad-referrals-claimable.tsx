import React from "react";
import { ReferralClaimableCard } from "./";
import { LaunchpadGridWrapper } from "../launchpad-grid-wrapper";
import { PresaleDataType } from "../../../_components/launchpad-card-data";
import { ClaimableDataType } from "../data";

interface Props {
  metaData: { token_name: string; token_symbol: string; website: string };
  launchpadData: PresaleDataType;
  claimableRefData: ClaimableDataType[];
  open: boolean;
}

export const LaunchpadReferralsClaimable: React.FC<Props> = ({
  open,
  claimableRefData,
}) => {
  return (
    <LaunchpadGridWrapper open={open}>
      {claimableRefData?.map((data, i) => (
        <ReferralClaimableCard {...data} key={i} />
      ))}
    </LaunchpadGridWrapper>
  );
};
