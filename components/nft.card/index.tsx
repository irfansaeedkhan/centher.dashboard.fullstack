import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

import { NFT } from "@/models/nft";
import useGetNftOwnerDb from "@/hooks/use.get.nft.owner.db";
import { useGetNFTOwner } from "@/web3/hooks/use.contracts.functions";
import {
  formatAddress,
  formatEther2Number,
  formatIPFSUrl,
} from "@/utils/format.address";
import { normalizeValue } from "@/web3/utils/call.helpers";
import HotNftsHeaderSkeleton from "@/components/loading.skeletons/hot.nft.header";
import { AppRoutes } from "@/constants/app.routes";
import {
  BNBIcon,
  // YellowTick
} from "@/assets/svgs";

export interface NFTCardProps {
  data: NFT;
}

export const NFTCard: React.FC<NFTCardProps> = ({ data }, ref) => {
  const [name, setName] = useState("");
  const nftOwner = useGetNFTOwner(data.collection, data.tokenId, data.owner);
  const { user, notRegistered, imgSrc, loading } = useGetNftOwnerDb(
    nftOwner.toLowerCase()
  );
  const [collection, setCollection] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState("");
  useEffect(() => {
    const fetchMetadata = async (ipfs: string) => {
      try {
        const formattedUrl = formatIPFSUrl(ipfs);
        const metadata = await axios.get(formattedUrl);
        setName(metadata.data.name);
        setDescription(metadata.data.description);
        setCollection(metadata.data.collection);
        const imgUrl = formatIPFSUrl(metadata.data.image);
        setImageUrl(imgUrl);
        setType(metadata.data.type);
      } catch (error) {}
    };
    if (data && data.ipfs) {
      fetchMetadata(data.ipfs);
    }
  }, [data]);

  return (
    <div
      className={`relative max-w-[300px] overflow-hidden rounded-xl border border-gray-shade-3 bg-transparent`}
    >
      <div className="absolute top-0 left-0 w-full rounded-t-[10px] bg-gray-shade-15 px-[18px] py-4 backdrop-blur-[20px]">
        {loading !== "loading" && loading !== "idle" && user ? (
          <div className={ownerDpWrapper}>
            {user.account_address ? (
              <Link href={`/profile/${user.account_address}`}>
                <Image
                  className="!h-7 !w-7 cursor-pointer rounded-full object-cover"
                  src={user.profile_image.path ?? imgSrc}
                  alt="profile"
                  height={28}
                  width={28}
                />
              </Link>
            ) : (
              <Image
                src={user.profile_image.path ?? imgSrc}
                alt={user.display_name}
                height={28}
                width={28}
              />
            )}
            <div className="flex items-center gap-2">
              {user.account_address ? (
                <Link
                  className="w-full max-w-[150px] cursor-pointer truncate text-white"
                  href={`/profile/${user.account_address}`}
                >
                  <span className={`text-xs font-medium text-white`}>
                    {user.display_name ?? formatAddress(nftOwner)}
                  </span>
                </Link>
              ) : (
                <div className="max-w-[200px] truncate text-white">
                  <span className={`text-xs font-medium text-white`}>
                    {formatAddress(notRegistered)}
                  </span>
                </div>
              )}
              {/* <YellowTick className="h-[12px] w-[12px]" /> */}
            </div>
          </div>
        ) : (
          <HotNftsHeaderSkeleton />
        )}
      </div>

      <Link
        href={{
          pathname: AppRoutes.marketplace.nft,
          query: {
            collection: data.collection,
            tokenId: data.tokenId,
          },
        }}
        className={`mt-10 block w-full px-2`}
      >
        {imageUrl ? (
          <Image
            src={
              imageUrl.includes("mp3") ? "/images/default-music.png" : imageUrl
            }
            alt="nft"
            height={222}
            width={293}
            className="!h-[222px] !w-[293px] rounded-md object-cover"
          />
        ) : (
          <div className="mt-10 !h-[222px] !w-[293px] animate-pulse rounded-md bg-[#3C3F4A]"></div>
        )}
      </Link>

      <Link
        href={{
          pathname: AppRoutes.marketplace.nft,
          query: {
            collection: data.collection,
            tokenId: data.tokenId,
          },
        }}
        className={`flex flex-col gap-1 px-2 py-4`}
      >
        <span className={`font-medium text-white`}>{name}</span>
      </Link>

      <div
        className={`flex flex-col gap-2 rounded-b-[10px] border-t border-t-gray-shade-3 bg-background-shade-3 py-5 px-2`}
      >
        {/* <div className={ownerDpWrapper}>
            <Image src={props.nftOwnerDp} alt="profile" height={28} width={28} />
            <span className={nftOwnerName}>{props.nftOwnerName}</span>
            <YellowTick />
          </div> */}
        <div className={`flex items-center justify-between gap-2`}>
          <span className={nftPrice}>
            <BNBIcon />
            <span>
              {`${normalizeValue(formatEther2Number(data.price))} (BNB)`}
            </span>
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

const nftPrice = `!text-sm !font-medium flex items-center gap-2 text-white`;

const ownerDpWrapper = `flex items-center gap-2`;
