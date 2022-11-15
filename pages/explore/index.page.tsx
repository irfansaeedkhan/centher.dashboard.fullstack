// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current directory imports
import { HotNFTs, HotCollections, Explore } from "./_components";
import Banner from "./_components/banner";
import TopCreators from "./_components/top.creators";


const ExplorePage: NextPageWithLayout = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="AppWrapper flex flex-col gap-10">
        <Banner />
        <TopCreators />
        <HotNFTs />
        <HotCollections />
        {/* <Explore loadingAllNFTs={loadingAllNFTs} allNFTs={allNFTs} /> */}
      </div>
    </div>
  );
};

ExplorePage.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Explore - Nether NFT">{page}</AllPagesWrapper>
  );
};

export default ExplorePage;
