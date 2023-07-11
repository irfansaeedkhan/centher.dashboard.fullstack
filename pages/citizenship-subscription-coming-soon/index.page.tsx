import React from "react";
import Link from "next/link";
import Image from "next/image";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { AppRoutes } from "@/constants/app.routes";
import FinalButton from "@/components/button/final.button";

const CitizenshipComingSoon: NextPageWithLayout = () => {
  return (
    <div className="flex min-h-[calc(100vh-60px-64px)] w-full items-center">
      <div className="relative flex h-full w-full items-center justify-center bg-[url('/images/comingsoon.png')] bg-top bg-no-repeat">
        <div className="flex flex-col items-center justify-center gap-7 pt-[13rem] fsm:mt-0">
          <div>
            <Image
              src="/images/contract-bot.png"
              alt="chat"
              width={300}
              height={300}
              className="absolute inset-0 top-0 mx-auto"
            />
          </div>
          <div className="text-center text-[20px] font-medium tracking-[6px] text-white sm:text-[20px] md:text-[28px] md:tracking-[8px]">
            Subscription plan
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            It will be soon possible to become a Citizen and obtain a Centher
            Passport, to take advantage of our new exclusive services.
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            Save 2 months payment with yearly subscription and start making an
            impact with your brand! You shall be able to access the purchase
            page within the next couple of weeks. Stay tuned!
          </div>
          <Link href={AppRoutes.feed.index}>
            <FinalButton
              title="Back to feed"
              variant="primary"
              className="h-10 w-[150px] text-[14px]"
              borderRounded="14px"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

CitizenshipComingSoon.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Centher Citizenship Coming Soon">
      {page}
    </AllPagesWrapper>
  );
};

export default CitizenshipComingSoon;
