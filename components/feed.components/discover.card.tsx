// React, Next, NPM Packages

export const DiscoverCard = () => {
  return (
    <div
      className={`
   w-[272px] max-w-[272px] rounded-10px bg-background-shade-3   px-4 pt-4
`}
    >
      <h5
        className={`
  text-14px pb-4 font-semibold text-white
`}
      >
        Discover
      </h5>
      <h6 className={DCTags}>#NFTprofile</h6>
      <h6 className={DCTags}>#Blockchainwebsite</h6>
      <h6 className={DCTags}>#NFT</h6>
    </div>
  );
};

// styling

const DCTags = `
  text-12px font-medium text-gray-shade-7 pb-3
`;
