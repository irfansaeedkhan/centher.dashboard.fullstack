// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";
// App imports
import NFTCard from "@/components/nft.card";
import { NFT } from "@/store/explore.store";
import { HotNftEmptyIcon } from "@/assets/svgs";

// Current directory imports
interface HotNFTsProps {
  hotNFTs: NFT[];
}

export const HotNFTs: React.FC<HotNFTsProps> = ({ hotNFTs }) => {
  return (
    <div className={hotNftPageWrapper}>
      <div className={hotNftAnimation}>Hot NFTs</div>

      {hotNFTs.length !== 0 ? (
        <div className={`${nftCardWrapper} nftCardContainer`}>
          {hotNFTs.map((nft) => (
            <NFTCard data={nft} key={nft.id} />
          ))}
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center text-white">
            <HotNftEmptyIcon />
          </div>
          <div className="flex justify-center items-center font-semibold text-[16px] text-white">
            No HOT NFTs found yet
          </div>
        </>
      )}
    </div>
  );
};

const hotNftPageWrapper = ctl(`flex flex-col gap-8`);

const hotNftAnimation = ctl(`animationTextHeading`);

// const nftCardWrapper = ctl(`flex gap-10 flex-wrap`);
const nftCardWrapper = ctl(``);
