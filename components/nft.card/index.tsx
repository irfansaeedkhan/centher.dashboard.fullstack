// React, Next, NPM Packages
import React from "react";
import Image from "next/future/image";
import ctl from "@netlify/classnames-template-literals";

export interface NFTCardProps {
  nftImage: string;
  nftToken: string;
  nftName: string;
  nftOwnerName: string;
  nftOwnerDp: string;
  nftPriceNether: number;
  nftPriceDollar: number;
}

const NFTCard: React.FC<NFTCardProps> = (props) => {
  return (
    <div>
      <div className={nftCardWrapper}>
        <div className={nftImageWrapper}>
          <Image src={props.nftImage} alt="nft" height={210} width={286} />
        </div>
        <div className={nftDetailWrapper}>
          <div className={textSimple}>{props.nftToken}</div>
          <div className={nftName}>{props.nftName}</div>
        </div>
        <div className={nftOwnerWrapper}>
          <div className={ownerDpWrapper}>
            <Image
              src={props.nftOwnerDp}
              alt="profile"
              height={28}
              width={28}
            />
            <span className={nftOwnerName}>{props.nftOwnerName}</span>
          </div>
          <div className={nftPriceWrapper}>
            <span className={nftPrice}>
              {props.nftPriceNether.toLocaleString()} NETHER
            </span>
            <span className={textSimple}>
              ${props.nftPriceDollar.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;

const nftCardWrapper = ctl(
  `w-[310px] h-auto border border-gray-shade-3 rounded-[10px] flex flex-col gap-3 bg-transparent`
);

const nftImageWrapper = ctl(`w-full flex justify-center p-3`);

const textSimple = ctl(`text-gray-shade-7 text-xs font-medium`);

const nftDetailWrapper = ctl(`flex flex-col gap-1 px-3`);

const nftName = ctl(`font-semibold text-white`);

const nftOwnerWrapper = ctl(
  `bg-background-shade-3 flex justify-between items-center p-3 gap-10 rounded-b-[10px]`
);

const nftOwnerName = ctl(`text-white text-xs font-medium`);

const nftPriceWrapper = ctl(`flex flex-col gap-1 items-end`);

const nftPrice = ctl(`animationTextHeading !text-xs !font-medium`);

const ownerDpWrapper = ctl(`flex items-center gap-2 w-1/2`);
