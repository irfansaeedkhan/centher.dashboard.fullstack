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
import HotNftsHeaderSkeleton from "@/components/loading.skeletons/hot.nft.header";
import { AppRoutes } from "@/constants/app.routes";
import {
  BNBIcon,
  LockIcon,
  // YellowTick
} from "@/assets/svgs";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import { getUTCNow } from "@/web3/utils/utils";
import { LockedNftModal } from "../modal/locked.nft.modal";
import clsx from "clsx";

export interface NFTCardProps {
  data: NFT;
}

export const NFTCard: React.FC<NFTCardProps> = ({ data }, ref) => {
  const locked = Number(data.unlock) * 1000 - getUTCNow() > 0 ? true : false;

  const [showLockedDetails, setShowLockedDetails] = useState(false);

  const nftOwner = useGetNFTOwner(data.collection, data.tokenId, data.owner);
  const { user, notRegistered, imgSrc, loading } = useGetNftOwnerDb(
    nftOwner.toLowerCase()
  );
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  useEffect(() => {
    const fetchMetadata = async (ipfs: string) => {
      try {
        const formattedUrl = formatIPFSUrl(ipfs);
        const metadata = await axios.get(formattedUrl);
        setName(metadata.data.name);
        setDescription(metadata.data.description);
        setImageUrl(formatIPFSUrl(metadata.data.image));
      } catch (error) {}
    };
    if (data && data.ipfs) {
      fetchMetadata(data.ipfs);
    }
  }, [data]);

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    let timeRemaining = Number(data.unlock) * 1000 - getUTCNow();
    if (timeRemaining <= 0) return;

    const interval = setInterval(() => {
      if (timeRemaining > 1000) {
        timeRemaining -= 1000;
        setCountdownFor(timeRemaining);
      }

      if (timeRemaining <= 1000) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [data]);

  const setCountdownFor = (deadline: number) => {
    const _days = Math.floor(deadline / (1000 * 60 * 60 * 24));
    const _hours = Math.floor((deadline / (1000 * 60 * 60)) % 24);
    const _minutes = Math.floor((deadline / 1000 / 60) % 60);

    setDays(_days <= 0 ? 0 : _days);
    setHours(_hours <= 0 ? 0 : _hours);
    setMinutes(_minutes <= 0 ? 0 : _minutes);
  };
  const onClickClose = () => {
    setShowLockedDetails(false);
  };
  const onClickOpen = () => {
    setShowLockedDetails(true);
  };

  return (
    <div
      className={`relative max-w-[300px] cursor-pointer overflow-hidden rounded-xl border border-gray-shade-3 bg-transparent`}
    >
      <div
        className={clsx(` flex max-w-[300px] flex-col bg-transparent`)}
        onClick={() => {
          locked && onClickOpen();
        }}
      >
        <div
          className={clsx(
            `absolute top-0 left-0 w-full rounded-t-[10px] bg-gray-shade-15 px-[18px] py-4 backdrop-blur-[20px]`,
            locked && "pointer-events-none"
          )}
        >
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
          className={clsx(
            ` mt-10 block w-full px-2`,
            locked && "pointer-events-none"
          )}
        >
          {imageUrl ? (
            <Image
              src={
                imageUrl.includes("mp3")
                  ? "/images/default-music.png"
                  : imageUrl
              }
              alt="nft"
              height={222}
              width={293}
              className="!h-[222px] !w-[293px] rounded-md object-cover"
              onError={() => setImageUrl("/images/placeholder-square.svg")}
            />
          ) : (
            <div className="mt-10 !h-[222px] !w-[293px] animate-pulse rounded-md bg-[#3C3F4A]"></div>
          )}

          {locked && (
            <div
              className={`absolute top-[70px] right-5 flex h-[24px] w-[77px] items-center justify-center rounded-md bg-black/20 text-[10px] text-white backdrop-blur-[20px]`}
            >
              <div className="flex items-center gap-[6px]">
                <LockIcon className="w-[28%]" />
                LOCKED
              </div>
            </div>
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
          className={clsx(
            `flex flex-col gap-1 px-2 py-4`,
            locked && "pointer-events-none"
          )}
        >
          <span className={`font-medium text-white`}>{name}</span>
        </Link>

        {locked ? (
          <div className="h-[56px] px-[6px] pb-[8px]">
            <div className="absolute bottom-2 left-[50%] h-[56px] w-[95%] translate-x-[-50%] overflow-hidden rounded-xl border border-gray-shade-3 bg-[url('/images/backcolouredshadow.png')] bg-center bg-no-repeat">
              <div
                className={`text-12px bg-[rgba(20, 20, 22, 0.08)] flex h-full w-full items-center justify-center rounded-xl text-white backdrop-blur-[20px]`}
              >
                <div className="flex w-full items-center justify-evenly">
                  <span className="text-10px max-w-[112px] font-medium text-white">
                    Time remaining to unlock
                  </span>
                  <div className="flex flex-col items-center ">
                    <span className="text-[13px] font-semibold text-white">
                      {days}
                    </span>
                    <span className="text-[8px] font-medium text-white">
                      DAYS
                    </span>
                  </div>
                  <div className="flex flex-col items-center ">
                    <span className="text-[13px] font-semibold text-white">
                      {hours}
                    </span>
                    <span className="text-[8px] font-medium text-white">
                      HOURS
                    </span>
                  </div>
                  <div className="flex flex-col items-center ">
                    <span className="text-[13px] font-semibold text-white">
                      {minutes}
                    </span>
                    <span className="text-[8px] font-medium text-white">
                      MIN
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`flex h-[56px] flex-col gap-2 rounded-b-[10px] border-t border-t-gray-shade-3 bg-background-shade-3 py-5 px-2`}
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
        )}
      </div>

      {showLockedDetails && (
        <LockedNftModal
          title="Lock NFT Details"
          isOpen={showLockedDetails}
          onClickClose={onClickClose}
        >
          <div className="p-5 fmd:p-10">
            {/* head */}
            <div className="flex flex-col items-center gap-4 fsm:flex-row">
              <Image
                src={imageUrl}
                alt={"locknft"}
                height={120}
                width={120}
                className="h-[120px] w-[120px] rounded-xl object-cover"
              />
              <div className="flex w-full max-w-[240px] flex-col gap-2 fmd:gap-4">
                <h5 className="text-18px text-center font-semibold text-white fmd:text-left">
                  {name}
                </h5>
                <div className="my-2 h-[47px] w-full overflow-hidden rounded-xl border border-gray-shade-3 bg-[url('/images/backcolouredshadow.png')] bg-center bg-no-repeat fmd:mt-0">
                  {" "}
                  <div className="text-12px bg-[rgba(20, 20, 22, 0.08)]  flex h-full w-full items-center justify-evenly gap-5 px-4 py-2 text-white backdrop-blur-[20px] fsm:m-0 fmd:mb-0 fmd:text-left ">
                    <div className="flex flex-col items-center ">
                      <span className="text-[14px] font-semibold text-white">
                        {days}
                      </span>
                      <span className="text-[10px] font-medium text-white">
                        DAYS
                      </span>
                    </div>
                    <div className="flex flex-col items-center ">
                      <span className="text-[14px] font-semibold text-white">
                        {hours}
                      </span>
                      <span className="text-[10px] font-medium text-white">
                        HOURS
                      </span>
                    </div>
                    <div className="flex flex-col items-center ">
                      <span className="text-[14px] font-semibold text-white">
                        {minutes}
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
                  {description}
                </h6>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-14px font-normal text-gray-shade-18">
                  Collection Address
                </h5>
                <h6 className="text-14px inline-block break-words font-semibold text-white">
                  {data.collection}
                </h6>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-14px font-normal text-gray-shade-18">
                  Token ID
                </h5>
                <h6 className="text-14px inline-block break-words font-semibold text-white">
                  {data.tokenId}
                </h6>
              </div>
            </div>
          </div>
        </LockedNftModal>
      )}
    </div>
  );
};

const nftPrice = `!text-sm !font-medium flex items-center gap-2 text-white`;

const ownerDpWrapper = `flex items-center gap-2`;
