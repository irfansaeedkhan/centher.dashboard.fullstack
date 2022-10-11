// React, Next, NPM Packages
import ctl from "@netlify/classnames-template-literals";

export const DiscoverCard = () => {
  return (
    <div className={DiscoverCardContainer}>
      <h5 className={DCTitle}>Discover</h5>
      <h6 className={DCTags}>#NFTprofile</h6>
      <h6 className={DCTags}>#Blockchainwebsite</h6>
      <h6 className={DCTags}>#NFT</h6>
    </div>
  );
};

// styling
const DiscoverCardContainer = ctl(`
   w-[272px] max-w-[272px] px-4 pt-4   rounded-10px bg-background-shade-3
`);
const DCTitle = ctl(`
  text-14px font-semibold text-white pb-4
`);
const DCTags = ctl(`
  text-12px font-medium text-gray-shade-7 pb-3
`);
