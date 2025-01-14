import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { AppRoutes } from "@/constants/app.routes";
import Button from "@/components/button";

const ArbitrageComingSoon: NextPageWithLayout = () => {
  return (
    <div className="flex min-h-[calc(100vh-60px-64px)] w-full items-center">
      <div className="relative flex h-full w-full items-center justify-center bg-[url('/images/comingsoon.png')] bg-top bg-no-repeat">
        <div className="flex flex-col items-center justify-center gap-4 pt-[13rem] fsm:mt-0 fsm:gap-7">
          <div>
            <Image
              src="/images/arbitrage-bot.png"
              alt="chat"
              width={300}
              height={300}
              className="absolute inset-0 top-0 mx-auto"
            />
          </div>
          <div className="text-center text-[16px] font-medium tracking-[6px] text-white sm:text-[20px] md:text-[28px] md:tracking-[10px]">
            Arbitrage Coming Soon
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            In economics and finance,Arbitrage is the practice of taking
            advantage of a difference in prices in two or more markets; striking
            a combination of matching deals to capitalise on the difference, the
            profit being the difference between the market prices at which the
            unit is traded.
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px]">
            Only for {process.env.NEXT_PUBLIC_BRAND_NAME} Citizens. You{" "}
            {"haven't"} gotten your {process.env.NEXT_PUBLIC_BRAND_NAME}{" "}
            Passport yet?{" "}
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

ArbitrageComingSoon.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Arbitrage Coming Soon">{page}</AllPagesWrapper>
  );
};

export default ArbitrageComingSoon;
