import React from "react";

import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";

const ComingSoonPage: NextPageWithLayout = () => {
  return (
    <div>
      <h1 className="text-2xl text-center text-brand-primary font-bold">
        Coming Soon...
      </h1>
      <Link href={AppRoutes.feed.index}>
        <a className="text-brand-primary underline my-8 text-center w-max block mx-auto">
          Go to Feed
        </a>
      </Link>
    </div>
  );
};

ComingSoonPage.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Coming Soon">{page}</AllPagesWrapper>;
};

export default ComingSoonPage;
