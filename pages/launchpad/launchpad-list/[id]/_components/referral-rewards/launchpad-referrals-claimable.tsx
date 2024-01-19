import React from "react";
import { ReferralClaimableCard } from "./";
import { LaunchpadGridWrapper } from "../launchpad-grid-wrapper";
import { ClaimableData } from "../data";

export const LaunchpadReferralsClaimable: React.FC<{
  open: boolean;
}> = ({ open }) => {
  return (
    <LaunchpadGridWrapper open={open}>
      {ClaimableData?.map((data, i) => (
        <ReferralClaimableCard {...data} key={i} />
      ))}
    </LaunchpadGridWrapper>
  );
};
