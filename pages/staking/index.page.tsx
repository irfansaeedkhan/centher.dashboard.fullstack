import React from "react";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

const ProjectDetails: NextPageWithLayout = () => {
  return <h1>Staking</h1>;
};

ProjectDetails.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Project Details">
    <div className="mx-auto min-h-screen w-full max-w-[1144px] bg-black-shade-3 pb-10 font-monto">
      {page}
    </div>
  </AllPagesWrapper>
);

export default ProjectDetails;
