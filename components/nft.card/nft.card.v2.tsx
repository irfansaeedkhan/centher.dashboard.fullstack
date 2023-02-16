import React from "react";
import Link from "next/link";
import Image from "next/image";

import { NFT } from "@/models/nft";
import { User } from "@/models/user";
import { formatAddress, formatEther2Number } from "@/utils/format.address";
import { AppRoutes } from "@/constants/app.routes";
import { BNBIcon } from "@/assets/svgs";

export interface NFTCardProps {
  data: NFTCardData;
}

export const NFTCardV2: React.FC<NFTCardProps> = ({ data }) => {
  return (
    <div
      className={`relative flex max-w-[300px] flex-col overflow-hidden rounded-xl border border-gray-shade-3 bg-transparent`}
    >
      <div className="absolute top-0 left-0 w-full rounded-t-[10px] bg-gray-shade-15 px-[18px] py-4 backdrop-blur-[20px]">
        <div className={`flex items-center gap-2`}>
          {data.owner.is_registered ? (
            <Link href={`/profile/${data.owner.account_address}`}>
              <Image
                className="!h-7 !w-7 cursor-pointer rounded-full object-cover"
                src={data.owner.profile_image.path}
                alt={data.owner.display_name}
                height={28}
                width={28}
              />
            </Link>
          ) : (
            <Image
              className="!h-7 !w-7 cursor-pointer rounded-full object-cover"
              src={data.owner.profile_image.path}
              alt={data.owner.display_name}
              height={28}
              width={28}
            />
          )}
          <div className="flex items-center gap-2">
            {data.owner.is_registered ? (
              <Link
                className="w-full max-w-[150px] cursor-pointer truncate text-white"
                href={`/profile/${data.owner.account_address}`}
              >
                <span className={`text-xs font-medium text-white`}>
                  {data.owner.display_name ??
                    formatAddress(data.owner.account_address)}
                </span>
              </Link>
            ) : (
              <div className="max-w-[200px] truncate text-white">
                <span className={`text-xs font-medium text-white`}>
                  {formatAddress(data.owner.account_address)}
                </span>
              </div>
            )}
          </div>
        </div>
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
        <Image
          src={data.imageUrl}
          alt={data.name}
          height={222}
          width={293}
          className="!h-[222px] !w-[293px] rounded-md object-cover"
        />
      </Link>

      <div className="flex-grow">
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
          <span className={`text-sm font-medium text-white`}>{data.name}</span>
        </Link>
      </div>

      <div
        className={`flex flex-col gap-2 rounded-b-[10px] border-t border-t-gray-shade-3 bg-background-shade-3 py-5 px-2`}
      >
        <div className={`flex items-center justify-between gap-2`}>
          <span
            className={`flex items-center gap-2 text-sm font-medium text-white`}
          >
            <BNBIcon />
            <span>{formatEther2Number(data.price)} BNB</span>
          </span>
        </div>
      </div>
    </div>
  );
};

interface NFTOwner
  extends Pick<User, "account_address" | "display_name" | "profile_image"> {
  is_registered: boolean;
}

export interface NFTCardData {
  owner: NFTOwner;
  id: NFT["id"];
  collection: NFT["collection"];
  tokenId: NFT["tokenId"];
  price: NFT["price"];
  name: string;
  imageUrl: string;
  type: "image" | "video" | "audio";
}
