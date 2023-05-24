import React from "react";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

import DetailsProject from "./_components/details-project";
import PreBookingWrapper from "./_components/pre-booking-wrapper";

const ProjectDetails: NextPageWithLayout = () => {
  return <DetailsProject />;
};

ProjectDetails.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Project Deatails">
    <div className="mx-auto min-h-screen w-full max-w-[1144px] bg-black-shade-3 pb-10 font-monto">
      <PreBookingWrapper>{page}</PreBookingWrapper>
    </div>
  </AllPagesWrapper>
);

export default ProjectDetails;
