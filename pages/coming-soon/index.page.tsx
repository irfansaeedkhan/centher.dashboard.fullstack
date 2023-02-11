import React from "react";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";

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
        <Link
          href={AppRoutes.feed.index}
          className="w-[197px] rounded-lg bg-brand-primary py-2 text-center text-sm font-bold text-black-shade-3 hover:bg-brand-primary-dark"
        >
          Go to Feed
        </Link>
      </div>
    </div>
  );
};

ComingSoonPage.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Coming Soon">{page}</AllPagesWrapper>;
};

export default ComingSoonPage;
