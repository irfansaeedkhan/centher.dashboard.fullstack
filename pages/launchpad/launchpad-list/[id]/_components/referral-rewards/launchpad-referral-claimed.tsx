import React from "react";
import { ReferralClaimedCard } from "./";
import { LaunchpadGridWrapper } from "../launchpad-grid-wrapper";
import { ClaimedDataType } from "../data";

interface Props {
  claimedRefData: ClaimedDataType[];
  open: boolean;
}

export const LaunchpadReferralsClaimed: React.FC<Props> = ({
  open,
  claimedRefData,
}) => {
  return (
    <LaunchpadGridWrapper open={open}>
      {claimedRefData?.map((data, i) => (
        <ReferralClaimedCard {...data} key={i} />
      ))}
    </LaunchpadGridWrapper>
  );
};
