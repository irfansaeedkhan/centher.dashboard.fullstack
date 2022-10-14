// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current directory imports
import { HotNFTs, HotCollections, Explore } from "./_components";

const ExplorePage: NextPageWithLayout = () => {
  return (
    <div className="AppWrapper flex flex-col gap-10">
      <HotNFTs />
      <HotCollections />
      <Explore />
    </div>
  );
};

ExplorePage.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Explore - Nether NFT">{page}</AllPagesWrapper>
  );
};

export default ExplorePage;
