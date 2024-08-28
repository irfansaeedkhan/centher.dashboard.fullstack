import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { AppRoutes } from "@/constants/app.routes";
import Button from "@/components/button";

const TradingProductComingSoon: NextPageWithLayout = () => {
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
            All your CEXs and DEXs
          </div>
          <div className="text-center text-[16px] font-medium tracking-[6px] text-white sm:text-[18px] md:text-[25px] md:tracking-[8px]">
            in one platform
          </div>

          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            <ul className="space-y-2">
              <li>Multiple supported exchanges</li>
              <li>SPOT and FUTURES markets</li>
              <li>TradingView Charting & Indicators</li>
              <li>Limit and Market Orders</li>
              <li>Paper Trading and Demo Account</li>
              <li>Automatic Multiple entries</li>
              <li>Multiple Take Profit & Stop Loss</li>
              <li>Trailing Take Profit & Stop Loss</li>
              <li>Auto-set Stop Loss at Breakeven</li>
              <li>Open Positions Management</li>
              <li>Insightful Positions Manager Dashboard</li>
            </ul>
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            Only for 369x Citizens. You {"haven't"} gotten your 369x Passport
            yet?{" "}
            <Link href={AppRoutes.citizenship} className="text-gradient">
              Click Here
            </Link>{" "}
          </div>
          <Link href={AppRoutes.feed.index}>
            <Button
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

TradingProductComingSoon.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Trading 369x Coming Soon">
      {page}
    </AllPagesWrapper>
  );
};

export default TradingProductComingSoon;
