import React from "react";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";

const V2: NextPageWithLayout = () => {
  return (
    <div className="flex h-[calc(100vh-60px-64px)] w-full items-center ">
      <div className="justify-cente flex h-full w-full items-center justify-center bg-[url('/images/comingsoon.png')] bg-top bg-no-repeat ">
        <div className="flex flex-col items-center justify-center gap-7 sm:pt-[7.8rem]">
          <div className="text-[20px] font-medium text-white sm:text-[24px] md:text-[28px]">
            V2
          </div>
          <div className="text-center text-[22px] font-medium tracking-[1rem] text-white sm:text-[30px] md:text-[34px] md:tracking-[1.4rem]">
            COMING SOON
          </div>
          <div className="max-w-[300px] text-center text-sm text-gray-shade-7 md:max-w-[534px] ">
            More interesting things are coming soon to our platform, in the
            meantime you can explore for great things with us.
          </div>
          <Link
            href={AppRoutes.marketplace.explore}
            className="w-[137px] rounded-lg bg-brand-primary py-3 text-center text-sm font-bold text-black-shade-3 hover:bg-brand-primary-dark"
          >
            Explore NFT
          </Link>
        </div>
      </div>
    </div>
  );
};

V2.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Coming Soon V2">{page}</AllPagesWrapper>;
};

export default V2;
