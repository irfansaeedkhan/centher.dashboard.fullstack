// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import NFTCard from "@/components/nft.card";

// Current directory imports

export const Explore: React.FC = () => {
  return (
    <div className={pageWrapper}>
      <div className={nameButtonWrapper}>
        <div className={sectionName}>Explore</div>
        <div className="flex gap-2 items-center">
          <button className="block py-3 text-white bg-gray-shade-3 w-[172px] min-w-fit px-4 rounded-xl text-center border border-gray-shade-12">
            All
          </button>
          <button className="block py-3 text-white bg-gray-shade-3 w-[172px] min-w-fit px-4 rounded-xl text-center border border-gray-shade-12">
            Category
          </button>
        </div>
      </div>
      <div className="flex gap-10 flex-wrap">
        <NFTCard
          nftImage={Data.nftImage}
          nftToken={Data.nftToken}
          nftName={Data.nftName}
          nftOwnerName={Data.nftOwnerName}
          nftOwnerDp={Data.nftOwnerDp}
          nftPriceDollar={Data.nftPriceDollar}
          nftPriceNether={Data.nftPriceNether}
        />
        <NFTCard
          nftImage={Data.nftImage}
          nftToken={Data.nftToken}
          nftName={Data.nftName}
          nftOwnerName={Data.nftOwnerName}
          nftOwnerDp={Data.nftOwnerDp}
          nftPriceDollar={Data.nftPriceDollar}
          nftPriceNether={Data.nftPriceNether}
        />
        <NFTCard
          nftImage={Data.nftImage}
          nftToken={Data.nftToken}
          nftName={Data.nftName}
          nftOwnerName={Data.nftOwnerName}
          nftOwnerDp={Data.nftOwnerDp}
          nftPriceDollar={Data.nftPriceDollar}
          nftPriceNether={Data.nftPriceNether}
        />
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

const nameButtonWrapper = ctl(`flex items-center justify-between gap-10`);

const sectionName = ctl(`animationTextHeading`);
