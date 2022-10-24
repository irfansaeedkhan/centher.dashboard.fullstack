// React, Next, NPM Packages
import React, { useEffect, useState, useRef, useMemo } from "react";
import ctl from "@netlify/classnames-template-literals";
import { useOnClickOutside } from "usehooks-ts";

// same directory imports
import { NFTListing } from "./nft.listing";
import { NFTOffers } from "./nft.offers";
import { NFTHistory } from "./nft.history";
import { FixedPriceNFTDescription } from "./fixed.price.nft.description";
import { FixedPriceNFTBuyerDescription } from "./fixed.price.nftbuyer.description";
import { AuctionNFTBuyerDescription } from "./auction.nftbuyer.description";
import { AuctionNftDescription } from "./auction.nft.description";
import {
  ShareBigIcon,
  FacebookCircleIcon,
  LinkIcon,
  TwitterSvg,
} from "@/assets/svgs";

export const NFTRightSideComponent = () => {
  // states of nfts: fixedPriceNFT  fixedPriceNFTBuyer  timeAuctionedNFT auctionNFTBuyer
  const [nftState, setNftState] = useState("fixedPriceNFT");
  const [togglePop, setTogglePop] = useState(false);

  // ref for toggle function
  const toggleContainerRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(toggleContainerRef, () => {
    setTogglePop(false);
  });
  // toggle function to show/hide edit/delete popup
  const togglePopFunc = async () => {
    setTogglePop((prev) => !prev);
  };
  return (
    <div className={rightSideContainer}>
      <div className={titleContainer}>
        <h1 className={title}>Maradona sport</h1>
        <div ref={toggleContainerRef} className={toggleContainer}>
          <button onClick={togglePopFunc}>
            <ShareBigIcon />
          </button>
          <div className={`${toggleList} ${togglePop && "!block z-50"}`}>
            <button className={toggleListBtn}>
              <FacebookCircleIcon className={toggleListIcons} /> Share on
              facebook
            </button>
            <button className={toggleListBtn}>
              <TwitterSvg className={toggleListIcons} /> Share on twitter
            </button>
            <button className={toggleListBtn}>
              <LinkIcon className={toggleListIcons} /> Copy link
            </button>
          </div>
        </div>
      </div>
      {nftState === "fixedPriceNFT" && <FixedPriceNFTDescription />}
      {nftState === "fixedPriceNFTBuyer" && <FixedPriceNFTBuyerDescription />}
      {nftState === "timeAuctionedNFT" && <AuctionNftDescription />}
      {nftState === "auctionNFTBuyer" && <AuctionNFTBuyerDescription />}
      <NFTListing />
      <NFTOffers />
      <NFTHistory />
    </div>
  );
};
// styling
const rightSideContainer = ctl(`
w-full flex flex-col gap-6
`);
const titleContainer = ctl(`
flex items-center justify-between 
`);
const title = ctl(`
textGradient  font-semibold leading-[42px]  animationTextHeading text-34px
`);
const toggleContainer = ctl(`
relative
`);
const toggleList = ctl(`
 hidden absolute right-0 top-6 rounded-10px bg-black-shade-12 shadow-sm overflow-hidden w-[240px]
`);
const toggleListBtn = ctl(`
w-full text-14px font-medium text-white  flex items-center gap-3 px-5 py-4 transition hover:bg-[#1f1f1f]
`);
const toggleListIcons = ctl(`
w-[24px] h-[24px] stroke-white
`);
