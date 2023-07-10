import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { AppRoutes } from "@/constants/app.routes";
import FinalButton from "@/components/button/final.button";

const SignalServiceComingSoon: NextPageWithLayout = () => {
  return (
    <div className="flex min-h-[calc(100vh-60px-64px)] w-full items-center">
      <div className="relative flex h-full w-full items-center justify-center bg-[url('/images/comingsoon.png')] bg-top bg-no-repeat">
        <div className="flex flex-col items-center justify-center gap-4 pt-[13rem] fsm:mt-0 fsm:gap-7">
          <div>
            <Image
              src="/images/crypto-signals.png"
              alt="chat"
              width={300}
              height={300}
              className="absolute inset-0 top-0 mx-auto"
            />
          </div>
          <div className="text-center text-[16px] font-medium tracking-[6px] text-white sm:text-[20px] md:text-[28px] md:tracking-[10px]">
            Signal Service
          </div>
          <div className="text-center text-[16px] font-medium tracking-[6px] text-white sm:text-[18px] md:text-[25px] md:tracking-[8px]">
            Coming Soon
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            Copy profitable strategies on both CEX and DEX, while sharing
            profits
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            <ul className="space-y-2">
              <li>No minimum invest</li>
              <li>Non-custodial</li>
              <li>Stop copying anytime</li>
            </ul>
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            Only for Centher Citizens. You {"haven't"} gotten your Centher
            Passport yet?{" "}
            <Link
              className="text-brand-primary hover:text-brand-primary-dark"
              href={AppRoutes.citizenship_subscription_coming_soon}
            >
              Click Here
            </Link>
          </div>
          <Link href={AppRoutes.feed.index}>
            <FinalButton
              title="Back to feed"
              variant="primary"
              className="h-10 w-[200px] text-[14px]"
              borderRounded="14px"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

SignalServiceComingSoon.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Signal Service Coming Soon">
      {page}
    </AllPagesWrapper>
  );
};

export default SignalServiceComingSoon;
