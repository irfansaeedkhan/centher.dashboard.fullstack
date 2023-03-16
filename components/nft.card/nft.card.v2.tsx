import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { NFT } from "@/models/nft";
import { User } from "@/models/user";
import { formatAddress, formatEther2Number } from "@/utils/format.address";
import { AppRoutes } from "@/constants/app.routes";
import { BNBIcon } from "@/assets/svgs";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import useGetUser from "@/hooks/use.get.user";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { LockIcon, MoonIcon } from "@/assets/svgs";
import { LockedNftModal } from "../modal/locked.nft.modal";
import clsx from "clsx";
export interface NFTCardProps {
  data: NFTCardData;
}

export const NFTCardV2: React.FC<NFTCardProps> = ({ data }) => {
  const [locked, setLocked] = useState(true);
  const [showLockedDetails, setShowLockedDetails] = useState<boolean>();
  const [imageUrl, setImageUrl] = useState(data.imageUrl);
  const { user } = useGetUser(data.owner.account_address);
  const verificationTick = useVerificationTick(user);
  return (
    <div
      className={clsx(`cursor-pointer`)}
      onClick={() => {
        locked && setShowLockedDetails(true);
      }}
    >
      <div
        className={clsx(
          `relative flex max-w-[300px] flex-col overflow-hidden rounded-xl border border-gray-shade-3 bg-transparent`,
          locked && "pointer-events-none"
        )}
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
            <div className="flex items-center ">
              {data.owner.is_registered ? (
                <Link
                  className="flex w-full  cursor-pointer items-center  text-white"
                  href={`/profile/${data.owner.account_address}`}
                >
                  <span
                    className={`max-w-[150px] truncate text-xs font-medium text-white`}
                  >
                    {data.owner.display_name ??
                      formatAddress(data.owner.account_address)}
                  </span>
                  {!!verificationTick && (
                    <span className="verifiedIcon ml-1 h-5 w-5 min-w-[1.25rem]">
                      <Image
                        src={"/images/rainbow-last-frame.png"}
                        alt={"Verified"}
                        width={20}
                        height={20}
                      />
                    </span>
                  )}
                </Link>
              ) : (
                <div className="flex items-center text-white">
                  <span
                    className={`max-w-[200px] truncate text-xs font-medium text-white`}
                  >
                    {formatAddress(data.owner.account_address)}
                  </span>
                  {!!verificationTick && (
                    <span className="verifiedIcon ml-1 h-5 w-5 min-w-[1.25rem]">
                      <Image
                        src={"/images/rainbow-last-frame.png"}
                        alt={"Verified"}
                        width={20}
                        height={20}
                      />
                    </span>
                  )}
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
          className={` mt-10 block w-full px-2`}
        >
          <Image
            src={imageUrl}
            alt={data.name}
            height={222}
            width={293}
            className="!h-[222px] !w-[293px] rounded-md object-cover"
            onError={() => setImageUrl("/images/placeholder-square.svg")}
          />
          {locked && (
            <div
              className={`absolute top-[70px] right-5 flex h-[24px] w-[74px] items-center justify-center  rounded-md bg-white/20 text-[10px] text-white backdrop-blur-lg`}
            >
              <div className="flex items-center gap-1">
                <LockIcon className="h-[16px] w-[16px]" />
                LOCKED
              </div>
            </div>
          )}
          {locked && (
            <div
              className={`text-12px absolute top-[55%] left-[50%] flex h-[42px]  w-[174px] translate-x-[-50%] items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-lg`}
            >
              <div className="flex items-center gap-3">
                <MoonIcon className="scale-75" />
                <div className="flex flex-col items-center ">
                  <span className="text-[13px] font-semibold text-white">
                    77
                  </span>
                  <span className="text-[8px] font-medium text-white">
                    DAYS
                  </span>
                </div>
                <div className="flex flex-col items-center ">
                  <span className="text-[13px] font-semibold text-white">
                    22
                  </span>
                  <span className="text-[8px] font-medium text-white">
                    HOURS
                  </span>
                </div>
                <div className="flex flex-col items-center ">
                  <span className="text-[13px] font-semibold text-white">
                    24
                  </span>
                  <span className="text-[8px] font-medium text-white">MIN</span>
                </div>
              </div>
            </div>
          )}
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
            <span className={`text-sm font-medium text-white`}>
              {data.name}
            </span>
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
              <span>
                {`${normalizeValue(formatEther2Number(data.price))} BNB`}
              </span>
            </span>
          </div>
        </div>
        {showLockedDetails && (
          <LockedNftModal
            title="Lock NFT Details"
            isOpen={showLockedDetails}
            onClickClose={() => {
              setShowLockedDetails(false);
            }}
          >
            <div className="p-5 fmd:p-10">
              {/* head */}
              <div className="flex flex-col items-center gap-4 fsm:flex-row">
                <Image
                  src={"/images/locknft.png"}
                  alt={"locknft"}
                  height={120}
                  width={120}
                  className="h-[120px] w-[120px] rounded-xl object-cover"
                />
                <div className="max-w-[274px]">
                  <div className="flex w-full items-center  gap-4 p-3">
                    <h5 className="text-18px font-semibold text-white">
                      A man free always smoke cigrets
                    </h5>
                    <Image
                      src={"/images/lockicon.png"}
                      alt={"lockicon"}
                      height={40}
                      width={32}
                      className="h-[32px] w-[40px]"
                    />
                  </div>
                  <div
                    className={`text-12px mt-2 mb-4 flex h-[42px] w-full items-center justify-center rounded-xl text-white fsm:m-0`}
                  >
                    <div className="mt-[2px] flex w-full items-center justify-between gap-3 rounded-2xl border border-gray-shade-3 bg-black-shade-9 px-4 py-2">
                      <MoonIcon className="h-9 w-9" />
                      <div className="flex flex-col items-center ">
                        <span className="text-[14px] font-semibold text-white">
                          77
                        </span>
                        <span className="text-[10px] font-medium text-white">
                          DAYS
                        </span>
                      </div>
                      <div className="flex flex-col items-center ">
                        <span className="text-[14px] font-semibold text-white">
                          22
                        </span>
                        <span className="text-[10px] font-medium text-white">
                          HOURS
                        </span>
                      </div>
                      <div className="flex flex-col items-center ">
                        <span className="text-[14px] font-semibold text-white">
                          24
                        </span>
                        <span className="text-[10px] font-medium text-white">
                          MIN
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* description */}
              <div className="mt-4 flex flex-col gap-6 fmd:mt-6">
                <div className="flex flex-col gap-2">
                  <h5 className="text-14px font-normal text-gray-shade-18">
                    Collection Description
                  </h5>
                  <h6 className="text-14px font-semibold text-white">
                    Maradona sport&quot; version of Paracelsus. It is a tribute
                    to the great Alchemist Paracelsus as Bismuth is one of the
                    minerals with which the Philosopher&quot;s Stone can be
                    made.
                  </h6>
                </div>
                <div className="flex flex-col gap-2">
                  <h5 className="text-14px font-normal text-gray-shade-18">
                    Collection Address
                  </h5>
                  <h6 className="text-14px font-semibold text-white">
                    0x018rhf63hjj7763kuxx098nbvxx90cc23BBK99KXX028
                  </h6>
                </div>
                <div className="flex flex-col gap-2">
                  <h5 className="text-14px font-normal text-gray-shade-18">
                    Token ID
                  </h5>
                  <h6 className="text-14px font-semibold text-white">
                    887737623758521793849282245
                  </h6>
                </div>
              </div>
            </div>
          </LockedNftModal>
        )}
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
