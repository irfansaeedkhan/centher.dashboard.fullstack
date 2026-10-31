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
            Every CEX and DEX you use
          </div>
          <div className="text-center text-[16px] font-medium tracking-[6px] text-white sm:text-[18px] md:text-[25px] md:tracking-[8px]">
            on one platform
          </div>

          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            <ul className="space-y-2">
              <li>Many exchanges supported</li>
              <li>SPOT and FUTURES trading</li>
              <li>TradingView charts and indicators</li>
              <li>Limit and market orders</li>
              <li>Paper trading and demo accounts</li>
              <li>Several entries set by itself</li>
              <li>Several take profit and stop loss levels</li>
              <li>Trailing take profit and stop loss</li>
              <li>Stop loss moved to breakeven on its own</li>
              <li>Manage your open positions</li>
              <li>A clear dashboard for your positions</li>
            </ul>
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            Only for {process.env.NEXT_PUBLIC_BRAND_NAME || "Sociaket"}{" "}
            Citizens. You {"haven't"} gotten your{" "}
            {process.env.NEXT_PUBLIC_BRAND_NAME || "Sociaket"} Passport yet?{" "}
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
    <AllPagesWrapper
      pageTitle={`Trading ${
        process.env.NEXT_PUBLIC_BRAND_NAME || "Sociaket"
      } Coming Soon`}
    >
      {page}
    </AllPagesWrapper>
  );
};

export default TradingProductComingSoon;
