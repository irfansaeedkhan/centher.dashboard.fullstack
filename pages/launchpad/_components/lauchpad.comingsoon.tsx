import React from "react";
import Link from "next/link";
import { IoMdLock } from "react-icons/io";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { AppRoutes } from "@/constants/app.routes";
import FinalButton from "@/components/button/final.button";

const LaunchpadComingSoon: NextPageWithLayout = () => {
  return (
    <div className="m-auto mb-5 flex max-w-[1150px] flex-col">
      <div className="flex items-center gap-4 pb-6">
        <h3 className="text-base font-medium text-white">
          Token Contract Address
        </h3>{" "}
        <FinalButton
          className="h-[28px] w-[100px] p-1 text-sm"
          title="Locked"
          variant="primary"
          borderRounded="8px"
          IconEnd={<IoMdLock className="z-50 h-5 w-5 text-white" />}
        />
      </div>
      <div className="height-0 relative flex rounded-2xl bg-[url(/images/launchpad-banner-sm.png)] bg-cover bg-no-repeat  pb-[75%] fmd:bg-[url(/images/launchpad-banner-bg.png)] fmd:pb-[16%]">
        <div className="absolute left-[50%] w-full translate-x-[-50%] p-[8%] text-center text-[17px] font-semibold text-white fsm:p-[12%] fsm:text-[24px] fmd:left-[5%] fmd:top-[50%] fmd:max-w-[473px] fmd:translate-x-[0] fmd:translate-y-[-50%] fmd:p-0 fmd:text-left fmd:text-clamp25 flg:max-w-[617px] [@media(min-width:390px)]:text-[21px]">
          <h3 className="mb-3 flg:mb-2">
            Our First Token Is About To Be Launched! Don&apos;t Miss The First
            Rounds Of Pre Sale!
          </h3>
          <Link
            href={AppRoutes.launchpad_pre_booking.index}
            className="block w-fit"
          >
            <FinalButton
              className="w-fit rounded-lg px-4 py-2 text-sm font-semibold"
              title="Book Now"
              variant="primary"
              borderRounded="14px"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

LaunchpadComingSoon.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Coming Soon">{page}</AllPagesWrapper>;
};

export default LaunchpadComingSoon;
