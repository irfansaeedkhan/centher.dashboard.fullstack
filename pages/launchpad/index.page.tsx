import Image from "next/image";
import React from "react";

import { AllPagesWrapper } from "@/components/all.pages.wrapper";

import { NextPageWithLayout } from "../_app.page";

const LaunchpadComingSoon: NextPageWithLayout = () => {
  return (
    <div className="m-auto flex h-[calc(100vh-60px-64px)] max-w-[1150px] flex-col-reverse items-center justify-center  flg:flex-row flg:justify-between">
      <h1 className="font-semibold text-white fsm:text-[28px] flg:text-[32px]">
        Our Very First Token Is About To Be Launched! Don&apos;t Miss The First
        Rounds Of Pre Sale!
      </h1>
      <Image
        src={`/images/launchpad-banner.png`}
        className={`h-auto w-[450px] flg:h-[650px] flg:w-[650px]`}
        width={650}
        height={650}
        alt="Profile Image"
      />
    </div>
  );
};

LaunchpadComingSoon.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Coming Soon">{page}</AllPagesWrapper>;
};

export default LaunchpadComingSoon;
