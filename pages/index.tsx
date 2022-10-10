// App imports
import { NextPageWithLayout } from "@/pages/_app";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current directory imports
import { HotNFTs, HotCollections, Explore } from "@/pages.components/explore";

const Home: NextPageWithLayout = () => {
  return (
    <div className="AppWrapper flex flex-col gap-10">
      <HotNFTs />
      <HotCollections />
      <Explore />
    </div>
  );
};

Home.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Explore - Nether NFT">{page}</AllPagesWrapper>
  );
};

export default Home;
