import React from "react";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";

const LaunchpadList: NextPageWithLayout = () => {
  return <div>LaunchpadList</div>;
};

LaunchpadList.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Launchpad List">
    <div className="mx-auto min-h-screen w-full max-w-[1112px] bg-black-shade-3 pb-10 font-monto">
      {page}
    </div>
  </AllPagesWrapper>
);

export default LaunchpadList;
