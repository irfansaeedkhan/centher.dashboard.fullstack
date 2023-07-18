import React from "react";
import Link from "next/link";
import { NextPageWithLayout } from "@/pages/_app.page";
import { LockIcon } from "@/assets/svgs";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { AppRoutes } from "@/constants/app.routes";

const LaunchpadComingSoon: NextPageWithLayout = () => {
  return (
    <div className="m-auto flex max-w-[1150px] flex-col">
      <div className="flex items-center gap-4 pb-6">
        <h3 className="text-base font-medium text-white">
          Token Contract Address
        </h3>{" "}
        <div className="text-14px flex h-[28px] w-[100px] items-center justify-center rounded-lg border border-brand-primary/30 bg-brand-primary/10 text-brand-primary">
          Locked
          <LockIcon className="w-[24%] stroke-brand-primary [&>*>*]:fill-brand-primary" />
        </div>
      </div>
      <div className="height-0 relative flex rounded-2xl bg-[url(/images/launchpad-banner-sm.png)] bg-cover bg-no-repeat  pb-[75%] fmd:bg-[url(/images/launchpad-banner-bg.png)] fmd:pb-[16%]">
        <div className="absolute left-[50%] w-full translate-x-[-50%] p-[8%] text-center text-[17px] font-semibold text-white fsm:p-[12%] fsm:text-[24px] fmd:left-[5%] fmd:top-[50%] fmd:max-w-[473px] fmd:translate-x-[0] fmd:translate-y-[-50%] fmd:p-0 fmd:text-left fmd:text-clamp25 flg:max-w-[617px] [@media(min-width:390px)]:text-[21px]">
          <h3 className="mb-3 flg:mb-2">
            Our First Token Is About To Be Launched! Don&apos;t Miss The First
            Rounds Of Pre Sale!
          </h3>
          <Link
            href={AppRoutes.launchpad_pre_booking.index}
            className="mt-3 w-fit rounded-lg bg-brand-primary py-2 px-4 text-sm font-semibold text-black-shade-3"
          >
            Book Now
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
