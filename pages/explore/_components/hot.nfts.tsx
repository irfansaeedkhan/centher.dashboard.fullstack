// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";
// App imports
import NFTCard from "@/components/nft.card";
import { NFT } from "@/store/explore.store";

// Current directory imports
interface HotNFTsProps {
  hotNFTs: NFT[];
}

export const HotNFTs: React.FC<HotNFTsProps> = ({ hotNFTs }) => {
  return (
    <div className={hotNftPageWrapper}>
      <div className={hotNftAnimation}>Hot NFTs</div>
      <div className={`${nftCardWrapper} nftCardContainer`}>
        {hotNFTs.map((nft) => (
          <NFTCard data={nft} key={nft.id} />
        ))}
      </div>
    </div>
  );
};

const hotNftPageWrapper = ctl(`flex flex-col gap-8`);

const hotNftAnimation = ctl(`animationTextHeading`);

// const nftCardWrapper = ctl(`flex gap-10 flex-wrap`);
const nftCardWrapper = ctl(``);
