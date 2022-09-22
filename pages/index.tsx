// React, Next, NPM Packages
import { NextPage } from "next";

// App imports
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current directory imports
import { HotNFTs, HotCollections, Explore } from "@/pages.components/explore";

const Home: NextPage = () => {
  return (
    /* A wrapper for the page. */
    <AllPagesWrapper pageTitle="Explore - Nether NFT">
      <div className="flex flex-col gap-10 max-w-[1360px] mx-auto">
        <HotNFTs />
        <HotCollections />
        <Explore />
      </div>
    </AllPagesWrapper>
  );
};

export default Home;
