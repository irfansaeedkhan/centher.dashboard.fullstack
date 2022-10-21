// React, Next, NPM Packages
import React, { useState } from "react";
import ctl from "@netlify/classnames-template-literals";

// same directory imports
import { NFTListing } from "./nft.listing";
import { NFTOffers } from "./nft.offers";
import { NFTHistory } from "./nft.history";
import { FixedPriceNFTDescription } from "./fixed.price.nft.description";
import { FixedPriceNFTBuyerDescription } from "./fixed.price.nftbuyer.description";
import { AuctionNFTBuyerDescription } from "./auction.nftbuyer.description";
import { AuctionNftDescription } from "./auction.nft.description";

export const NFTRightSideComponent = () => {
  const [nftState, setNftState] = useState("auctionNFTBuyer");
  // states of nfts: fixedPriceNFT  fixedPriceNFTBuyer  timeAuctionedNFT auctionNFTBuyer
  return (
    <div className={rightSideContainer}>
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
