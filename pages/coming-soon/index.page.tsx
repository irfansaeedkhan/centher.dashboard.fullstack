import React from "react";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";

const ComingSoonPage: NextPageWithLayout = () => {
  return (
    <div className="h-[calc(100vh-60px-64px)] flex items-center">
      <div className="w-full flex flex-col gap-8 items-center justify-center">
        <div className="animationTextHeading lg:!text-[56px] md:!text-[34px] sm:!text-[30px]">
          COMING SOON
        </div>
        <div className="md:max-w-[534px] sm:max-w-[300px] md:text-base sm:text-sm text-center text-gray-shade-7">
          More interesting things are coming soon to our platform, in the
          meantime you can explore for great things with us.
        </div>
        <Link
          href={AppRoutes.feed.index}
          className="bg-brand-primary hover:bg-brand-primary-dark py-2 text-center w-[197px] rounded-lg text-black-shade-3 text-sm font-bold"
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
