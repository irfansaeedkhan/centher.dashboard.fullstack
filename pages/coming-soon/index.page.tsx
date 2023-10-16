import React from "react";
import Link from "next/link";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { AppRoutes } from "@/constants/app.routes";
import Button from "@/components/button";

const ComingSoonPage: NextPageWithLayout = () => {
  return (
    <div className="flex h-[calc(100vh-60px-64px)] items-center">
      <div className="flex w-full flex-col items-center justify-center gap-8">
        <div className="animationTextHeading sm:!text-[30px] md:!text-[34px] lg:!text-[56px]">
          COMING SOON
        </div>
        <div className="text-center text-gray-shade-7 sm:max-w-[300px] sm:text-sm md:max-w-[534px] md:text-base">
          More interesting things are coming soon to our platform, in the
          meantime you can explore for great things with us.
        </div>
        <Link href={AppRoutes.feed.index} className="text-center">
          <Button
            title={"Go to Feed"}
            variant="primary"
            className="w-[197px] text-sm"
          />
        </Link>
      </div>
    </div>
  );
};

ComingSoonPage.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Coming Soon">{page}</AllPagesWrapper>;
};

export default ComingSoonPage;
