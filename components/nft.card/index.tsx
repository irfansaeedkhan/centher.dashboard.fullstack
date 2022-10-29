// React, Next, NPM Packages
import React from "react";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";
import { YellowTick, BNBIcon } from "@/assets/svgs";
import { NTRIcon } from "@/assets/svgs/ntr.icon";

export interface NFTCardProps {
  nftImage: string;
  nftToken: string;
  nftName: string;
  nftOwnerName: string;
  nftOwnerDp: string;
  nftPriceNether: number;
  nftPriceDollar: number;
  TokenIcon?: string;
}

const NFTCard: React.FC<NFTCardProps> = (props) => {
  return (
    <div className={nftCardWrapper}>
      <div className="w-full absolute bg-gray-shade-15 top-0 left-0 rounded-t-[10px] px-[18px] py-4 backdrop-blur-[20px]">
        <div className={ownerDpWrapper}>
          <Image src={props.nftOwnerDp} alt="profile" height={28} width={28} />
          <span className={nftOwnerName}>{props.nftOwnerName}</span>
          <YellowTick />
        </div>
      </div>
      <div className={nftImageWrapper}>
        <Image src={props.nftImage} alt="nft" height={210} width={286} />
      </div>
      <div className={nftDetailWrapper}>
        <div className={nftName}>{props.nftName}</div>
      </div>
      <div className={nftOwnerWrapper}>
        {/* <div className={ownerDpWrapper}>
          <Image src={props.nftOwnerDp} alt="profile" height={28} width={28} />
          <span className={nftOwnerName}>{props.nftOwnerName}</span>
          <YellowTick />
        </div> */}
        <div className={nftPriceWrapper}>
          {props?.TokenIcon === "BNB" ? (
            <span className={nftPrice}>
              <BNBIcon />
              <span>{props.nftPriceNether.toLocaleString()} BNB</span>
            </span>
          ) : (
            <span className={nftPrice}>
              <NTRIcon />
              <span>{props.nftPriceNether.toLocaleString()} NTR</span>
            </span>
          )}

          <span className={textSimple}>
            ${props.nftPriceDollar.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;

const nftCardWrapper = ctl(
  `w-[16.688rem] nftCardStyling h-auto border border-gray-shade-3 rounded-[10px]  flex flex-col gap-3 bg-transparent relative`
);

const nftImageWrapper = ctl(`w-full flex justify-center p-2 mt-10`);

const textSimple = ctl(`text-gray-shade-7 text-xs font-medium`);

const nftDetailWrapper = ctl(`flex flex-col gap-1 p-2`);

const nftName = ctl(`font-semibold text-white`);

const nftOwnerWrapper = ctl(
  `bg-background-shade-3 flex flex-col p-3 gap-2 rounded-b-[10px]`
);

const nftOwnerName = ctl(`text-white text-xs font-medium`);

const nftPriceWrapper = ctl(`flex justify-between gap-2 items-center`);

const nftPrice = ctl(
  `!text-sm !font-medium flex items-center gap-2 text-white`
);

const ownerDpWrapper = ctl(`flex items-center gap-2`);
