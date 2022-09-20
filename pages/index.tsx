// React, Next, NPM Packages
import { NextPage } from "next";

// App imports
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current directory imports
import { HotNFTs } from "@/pages.components/Explore";

const Home: NextPage = () => {
  return (
    <AllPagesWrapper tabTitle="Explore">
      <div>
        <HotNFTs />
        <div></div>
        <div></div>
      </div>
    </AllPagesWrapper>
  );
};

export default Home;
