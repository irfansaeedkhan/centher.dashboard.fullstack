// React, Next, NPM Packages
import React from "react";
import ctl from "@netlify/classnames-template-literals";
// App imports
import NFTCard from "@/components/nft.card";

// Current directory imports

export const HotNFTs: React.FC = () => {
  return (
    <div className={hotNftPageWrapper}>
      <div className={hotNftAnimation}>Hot NFTs</div>
      <div className={nftCardWrapper}>
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

const hotNftPageWrapper = ctl(`flex flex-col gap-8`);

const hotNftAnimation = ctl(`animationTextHeading`);

const nftCardWrapper = ctl(`flex gap-10 flex-wrap`);
