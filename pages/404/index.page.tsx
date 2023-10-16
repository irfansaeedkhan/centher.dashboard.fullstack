import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import Button from "@/components/button";
import { AppRoutes } from "@/constants/app.routes";

const ErrorPage: NextPageWithLayout = () => {
  return (
    <div className="flex h-auto min-h-[calc(100vh-60px-64px)] items-center">
      <div className="flex w-full flex-col-reverse items-center justify-center gap-10 sm:gap-20 md:flex-row">
        <div className="flex flex-col text-center sm:text-left">
          <div className="mb-4 text-2xl font-semibold leading-[48px] text-white sm:!text-[30px] md:!text-[48px]">
            Page not Found
          </div>
          <div className="mb-8 text-gray-shade-7 sm:max-w-[300px] sm:text-sm md:max-w-[550px] md:text-xl">
            Seems our developers forgot to manage the delivery of a certain URL
            here.
          </div>
          <Link href={AppRoutes.feed.index}>
            <Button
              title="Back to home"
              variant={"primary"}
              className="rounded-[14px]"
            />
          </Link>
        </div>
        <Image
          src={"/images/notfound.png"}
          alt="Not Found"
          width={613}
          height={613}
          className="w-full sm:w-[370px] md:w-[513] xl:w-[613px]"
        />
      </div>
    </div>
  );
};

ErrorPage.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="404 Not Found">{page}</AllPagesWrapper>;
};

export default ErrorPage;
