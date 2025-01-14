import React from "react";
import Link from "next/link";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { AppRoutes } from "@/constants/app.routes";
import Button from "@/components/button";

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
            We are in the process of releasing Launchpad 2.0. Stay tuned for
            more exciting projects to come on
          </div>
          <Link
            href={AppRoutes.auth.login}
            className="w-[137px] text-center text-sm"
          >
            <Button
              title={`${process.env.NEXT_PUBLIC_BRAND_DOMAIN}!`}
              variant="primary"
              className="w-full py-3 font-bold"
            />
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
