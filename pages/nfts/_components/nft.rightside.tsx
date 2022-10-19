// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// same directory imports
import { NFTDescription } from "./nft.description";
import { NFTListing } from "./nft.listing";
import { NFTOffers } from "./nft.offers";
import { NFTHistory } from "./nft.history";

export const NFTRightSideComponent = () => {
  return (
    <div className={rightSideContainer}>
      <NFTDescription />
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
