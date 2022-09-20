// React, Next, NPM Packages
import { NextPage } from "next";

// App imports
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current directory imports
import { HotNFTs } from "@/pages.components/explore";

const Home: NextPage = () => {
  return (
    <AllPagesWrapper pageTitle="Explore - Nether NFT">
      <div>
        <HotNFTs />
        <div></div>
        <div></div>
      </div>
    </AllPagesWrapper>
  );
};

export default Home;
