// React, Next, NPM Packages
import React, { useEffect } from "react";
import ctl from "@netlify/classnames-template-literals";
import { useInView } from "react-intersection-observer";

// App imports
import NFTCard from "@/components/nft.card";
import { NFT, useExploreStore } from "@/store/explore.store";

// Current directory imports

interface ExploreProps {
  allNFTs: NFT[];
}

export const Explore: React.FC<ExploreProps> = ({ allNFTs }) => {
  return (
    <div className={pageWrapper}>
      <div className={nameButtonWrapper}>
        <div className={sectionName}>Explore</div>
        <div className={sectionNameStyle}>
          <button className={allButtonWrapper}>All</button>
          <button className={categoryButtonWrapper}>Category</button>
        </div>
      </div>
      <div className="nftCardContainer">
        {allNFTs.map((nft) => (
          <NFTCard data={nft} key={nft.id} />
        ))}
      </div>
    </div>
  );
};

const Data = {
  nftImage: "/images/nft.png",
  nftToken: "MARA Token",
  nftName: "Barack Obama",
  nftOwnerName: "Ricky Ammeandola",
  nftOwnerDp: "/images/a1.png",
  nftPriceNether: 65000,
  nftPriceDollar: 650000,
};

const pageWrapper = ctl(`flex flex-col gap-8`);

const nameButtonWrapper = ctl(
  `flex md:flex-row sm:flex-col md:items-center justify-between md:gap-10 sm:gap-5`
);

const sectionName = ctl(`animationTextHeading`);

const sectionNameStyle = ctl(`flex gap-2 items-center`);

const allButtonWrapper = ctl(
  `block py-3 text-white bg-gray-shade-3 w-[172px] min-w-fit px-4 rounded-xl text-center border border-gray-shade-12`
);

const categoryButtonWrapper = ctl(
  `block py-3 text-white bg-gray-shade-3 w-[172px] min-w-fit px-4 rounded-xl text-center border border-gray-shade-12`
);
