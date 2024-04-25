import React from "react";
import { ReferralEarnedCard } from "./";
import { LaunchpadGridWrapper } from "../launchpad-grid-wrapper";
import { EarnedData } from "../data";

export const LaunchpadReferralsEarned: React.FC<{
  open: boolean;
}> = ({ open }) => {
  return (
    <LaunchpadGridWrapper open={open}>
      {EarnedData?.map((data, i) => (
        <ReferralEarnedCard {...data} key={i} />
      ))}
    </LaunchpadGridWrapper>
  );
};
