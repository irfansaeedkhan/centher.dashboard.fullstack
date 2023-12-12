import React from "react";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "@/pages/_app.page";
import { TabsWrapper } from "./_components";
import { LaunchpadCard } from "./_components/launchpad-card";
import { LaunchpadData } from "./_components/launchpad-card-data";

const LaunchpadListLive: NextPageWithLayout = () => {
  return (
    <div className="grid grid-cols-1 gap-5 fmd:grid-cols-2 flg:grid-cols-3">
      {LaunchpadData.filter((e) => e.status === "live").map((data, index) => (
        <LaunchpadCard key={index} {...data} />
      ))}
    </div>
  );
};

LaunchpadListLive.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Launchpad List">
    <div className="mx-auto min-h-screen w-full max-w-[1112px] bg-black-shade-3 pb-10 font-monto">
      <TabsWrapper>{page}</TabsWrapper>
    </div>
  </AllPagesWrapper>
);

export default LaunchpadListLive;
