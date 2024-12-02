import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

import { HotNFTs, HotCollections, Banner, TopCreators } from "./_components";

const ExplorePage: NextPageWithLayout = () => {
  return (
    <div className="mx-auto max-w-screen-2xl space-y-10">
      <Banner />
      <TopCreators />
      <HotNFTs />
      <HotCollections />
    </div>
  );
};

ExplorePage.getLayout = (page) => {
  return (
    <AllPagesWrapper
      pageTitle={`Explore - ${process.env.NEXT_PUBLIC_BRAND_NAME}`}
    >
      {page}
    </AllPagesWrapper>
  );
};

export default ExplorePage;
