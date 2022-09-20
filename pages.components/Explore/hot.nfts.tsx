// React, Next, NPM Packages
import React from "react";

// App imports
import NFTCard from "@/components/nft.card";

// Current directory imports

export const HotNFTs: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="animationTextHeading">Hot NFTs</div>
      <NFTCard />
    </div>
  );
};
