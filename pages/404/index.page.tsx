import React from "react";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";
import Image from "next/image";

const ErrorPage: NextPageWithLayout = () => {
  return (
    <div className="flex h-auto min-h-[calc(100vh-60px-64px)] items-center">
      <div className="flex w-full flex-col-reverse  items-center justify-center md:flex-col">
        <div className="flex w-full flex-col items-center justify-center gap-3">
          <div className="font-semibold text-white sm:!text-[30px] md:!text-[34px]">
            Page not found
          </div>
          <div className="text-center text-gray-shade-7 sm:max-w-[300px] sm:text-sm md:max-w-[412px] md:text-base">
            Seems our developers forgot to manage the delivery of a certain URL
            here.
          </div>
          <Link
            href={AppRoutes.feed.index}
            className="my-7 w-[197px] rounded-lg bg-brand-primary py-2 text-center text-sm font-bold text-black-shade-3 hover:bg-brand-primary-dark"
          >
            Back to home
          </Link>
        </div>
        <Image
          src={"/images/404.png"}
          alt="404"
          width={967}
          height={340}
          className="mb-10 !max-h-[340px] !w-[80%] !max-w-[967px] md:!h-[340px]  md:!w-[767px]"
        />
      </div>
    </div>
  );
};

ErrorPage.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="404 Not Found">{page}</AllPagesWrapper>;
};

export default ErrorPage;
