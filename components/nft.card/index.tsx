// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ctl from "@netlify/classnames-template-literals";
import { BNBIcon, YellowTick } from "@/assets/svgs";
import { NTRIcon } from "@/assets/svgs/ntr.icon";
import { NFT } from "@/store/explore.store";
import axios from "axios";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";
import { formatAddress, formatBNB2USD, formatEther2Number } from "@/utils/format.address";

export interface NFTCardProps {
  data: NFT;
}

const NFTCard: React.FC<NFTCardProps> = ({data}) => {
  const [name, setName] = useState("")
  const [collection, setCollection] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    const fetchMetadata = async (ipfs: string) => {
      try {
        const metadata = await axios.get(ipfs)
        setName(metadata.data.name)
        setDescription(metadata.data.description)
        setCollection(metadata.data.collection)
        setImageUrl(metadata.data.image)
      } catch (error) {
        
      }
    }
    if(data && data.ipfs) {
      fetchMetadata(data.ipfs)
    }
  }, [data])

  return (
    <Link href={`/nfts/${collection}/${data.tokenId}`}
    >
      <div className={nftCardWrapper}>
        <div className="w-full absolute bg-gray-shade-15 top-0 left-0 rounded-t-[10px] px-[18px] py-4 backdrop-blur-[20px]">
          <div className={ownerDpWrapper}>
            <Image src="/images/a1.png" alt="profile" height={28} width={28} />
            <span className={nftOwnerName}>{formatAddress(data.creator)}</span>
            <YellowTick />
          </div>
        </div>
        <div className={nftImageWrapper}>
          {imageUrl ? <Image src={imageUrl} alt="nft" height={210} width={286} /> : <p className="h-[220px] text-grey pt-5">Invalid Image</p>}
        </div>
        <div className={nftDetailWrapper}>
          <div className={nftName}>{name}</div>
        </div>
        <div className={nftOwnerWrapper}>
          {/* <div className={ownerDpWrapper}>
            <Image src={props.nftOwnerDp} alt="profile" height={28} width={28} />
            <span className={nftOwnerName}>{props.nftOwnerName}</span>
            <YellowTick />
          </div> */}
          <div className={nftPriceWrapper}>
            <span className={nftPrice}>
              <BNBIcon />
              <span>{formatEther2Number(data.price)} BNB</span>
            </span>
          </div>
          {/* ) : (
            <span className={nftPrice}>
              <NTRIcon />
              <span>{props.nftPriceNether.toLocaleString()} NTR</span>
            </span>
          )} */}

          <span className={textSimple}>
            ${formatBNB2USD(data.price)}
          </span>
        </div>
      </div>
    </Link>
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
