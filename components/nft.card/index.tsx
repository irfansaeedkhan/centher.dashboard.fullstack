// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import ctl from "@netlify/classnames-template-literals";

import { NFT } from "@/store/explore.store";
// import useGetUser from "@/hooks/use.get.user";
import useGetNftOwnerDb from "@/hooks/use.get.nft.owner.db";
import {
  formatAddress,
  formatBNB2USD,
  formatEther2Number,
  formatIPFSUrl,
} from "@/utils/format.address";
import { BNBIcon, YellowTick } from "@/assets/svgs";
import { useGetNFTOwner } from "@/web3/hooks/use.contracts.functions";
import HotNftsHeaderSkeleton from "@/components/loading.skeletons/hot.nft.header";

export interface NFTCardProps {
  data: NFT;
}

const NFTCard: React.FC<NFTCardProps> = ({ data }) => {
  const [name, setName] = useState("");
  const nftOwner = useGetNFTOwner(data.collection, data.tokenId);
  const { user, notRegistered, imgSrc, loading } = useGetNftOwnerDb(
    nftOwner.toLowerCase()
  );
  const [collection, setCollection] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    const fetchMetadata = async (ipfs: string) => {
      try {
        const metadata = await axios.get(formatIPFSUrl(ipfs));
        setName(metadata.data.name);
        setDescription(metadata.data.description);
        setCollection(metadata.data.collection);
        setImageUrl(formatIPFSUrl(metadata.data.image));
      } catch (error) {}
    };
    if (data && data.ipfs) {
      fetchMetadata(data.ipfs);
    }
  }, [data]);

  return (
    <div className={nftCardWrapper}>
      <div className="w-full absolute bg-gray-shade-15 top-0 left-0 rounded-t-[10px] px-[18px] py-4 backdrop-blur-[20px]">
        {loading !== "loading" && loading !== "idle" ? (
          <div className={ownerDpWrapper}>
            {user?.account_address ? (
              <Link href={`/profile/${user?.account_address}`}>
                <Image
                  className="cursor-pointer"
                  src={user?.profile_image.path ?? imgSrc}
                  alt="profile"
                  height={28}
                  width={28}
                />
              </Link>
            ) : (
              <Image
                src={user?.profile_image.path ?? imgSrc}
                alt="profile"
                height={28}
                width={28}
              />
            )}
            {user?.account_address ? (
              <Link
                className="cursor-pointer"
                href={`/profile/${user?.account_address}`}
              >
                <span className={nftOwnerName}>
                  {formatAddress(user.account_address)}
                </span>
              </Link>
            ) : (
              <div>
                <span className={nftOwnerName}>
                  {formatAddress(notRegistered)}
                </span>
              </div>
            )}
            <YellowTick />
          </div>
        ) : (
          <HotNftsHeaderSkeleton />
        )}
      </div>
      <div className={nftImageWrapper}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="nft"
            height={222}
            width={293}
            className="!w-[293px] !h-[222px] object-cover rounded-md"
          />
        ) : (
          <p className="h-[220px] text-grey pt-5">Invalid Image</p>
        )}
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

        {/* <span className={textSimple}>${formatBNB2USD(data.price)}</span> */}
      </div>
    </div>
  );
};

export default NFTCard;

const nftCardWrapper = ctl(
  `w-[310px] nftCardStyling h-[380px] border border-gray-shade-3 rounded-[10px] flex flex-col bg-transparent relative`
);

const nftImageWrapper = ctl(`w-full flex justify-center px-2 mt-10`);

const textSimple = ctl(`text-gray-shade-7 text-xs font-medium`);

const nftDetailWrapper = ctl(`flex flex-col gap-1 px-2 py-3`);

const nftName = ctl(`font-semibold text-white`);

const nftOwnerWrapper = ctl(
  `bg-background-shade-3 flex flex-col py-[20px] px-2 gap-2 rounded-b-[10px] mt-2`
);

const nftOwnerName = ctl(`text-white text-xs font-medium`);

const nftPriceWrapper = ctl(`flex justify-between gap-2 items-center`);

const nftPrice = ctl(
  `!text-sm !font-medium flex items-center gap-2 text-white`
);

const ownerDpWrapper = ctl(`flex items-center gap-2`);
