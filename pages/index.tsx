// React, Next, NPM Packages
import { NextPage } from "next";
import { useEffect } from "react";
import toast from "react-hot-toast";

// App imports
import { AllPagesWrapper } from "@/components/all.pages.wrapper";

// Current directory imports
import { HotNFTs, HotCollections, Explore } from "@/pages.components/explore";

const Home: NextPage = () => {
  useEffect(() => {
    toast.error("Hello Zara!");
  }, []);

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
