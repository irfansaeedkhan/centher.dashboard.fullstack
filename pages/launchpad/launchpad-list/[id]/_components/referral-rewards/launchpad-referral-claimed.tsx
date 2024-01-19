import React from "react";
import { ReferralClaimedCard } from "./";
import { LaunchpadGridWrapper } from "../launchpad-grid-wrapper";
import { ClaimedData } from "../data";

export const LaunchpadReferralsClaimed: React.FC<{
  open: boolean;
}> = ({ open }) => {
  return (
    <LaunchpadGridWrapper open={open}>
      {ClaimedData?.map((data, i) => (
        <ReferralClaimedCard {...data} key={i} />
      ))}
    </LaunchpadGridWrapper>
  );
};
