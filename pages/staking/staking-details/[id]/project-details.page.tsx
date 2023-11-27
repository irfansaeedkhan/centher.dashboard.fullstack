import React from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import StakingDetailsWrapper from "./_components/staking-details-wrapper";

const ProjectDetails: NextPageWithLayout = () => {
  return null;
};

ProjectDetails.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Project Details">
      <StakingDetailsWrapper>{page}</StakingDetailsWrapper>
    </AllPagesWrapper>
  );
};

export default ProjectDetails;
