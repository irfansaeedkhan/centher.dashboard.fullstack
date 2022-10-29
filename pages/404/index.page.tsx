import React from "react";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";
import Image from "next/image";

const ErrorPage: NextPageWithLayout = () => {
  return (
    <div className="h-[calc(100vh-60px-64px)] flex items-center">
      <div className="flex md:flex-col sm:flex-col-reverse w-full justify-center items-center">
        <div className="w-full flex flex-col gap-3 items-center justify-center">
          <div className="text-white font-semibold md:!text-[34px] sm:!text-[30px]">
            Page not found
          </div>
          <div className="md:max-w-[412px] sm:max-w-[300px] md:text-base sm:text-sm text-center text-gray-shade-7">
            Seems our developers forgot to manage the delivery of a certain URL
            here.
          </div>
          <Link
            href={AppRoutes.feed.index}
            className="bg-brand-primary hover:bg-brand-primary-dark py-2 text-center w-[197px] rounded-lg text-black-shade-3 text-sm font-bold my-7"
          >
            Back to home
          </Link>
        </div>
        <Image
          src={"/images/404.png"}
          alt="404"
          width={967}
          height={340}
          className="!max-w-[967px] !max-h-[340px] md:!h-[340px] md:!w-[767px] sm:!w-[300px] sm:!h-[190px] mb-10"
        />
      </div>
    </div>
  );
};

ErrorPage.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="404 No Page">{page}</AllPagesWrapper>;
};

export default ErrorPage;
