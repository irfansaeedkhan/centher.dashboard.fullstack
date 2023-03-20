import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

import { NFT } from "@/models/nft";
import { User } from "@/models/user";
import {
  formatAddress,
  formatEther2Number,
  formatIPFSUrl,
} from "@/utils/format.address";
import { AppRoutes } from "@/constants/app.routes";
import { BNBIcon } from "@/assets/svgs";
import { normalizeValue } from "@/web3/blockchain/helpers/math.helper";
import useGetUser from "@/hooks/use.get.user";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { LockIcon } from "@/assets/svgs";
import { getUTCNow } from "@/web3/utils/utils";
import { LockedNftModal } from "../modal/locked.nft.modal";
export interface NFTCardProps {
  data: NFTCardData;
}

export const NFTCardV2: React.FC<NFTCardProps> = ({ data }) => {
  const locked = Number(data.unlock) * 1000 - getUTCNow() > 0 ? true : false;
  const [showLockedDetails, setShowLockedDetails] = useState(false);
  const [imageUrl, setImageUrl] = useState(data.imageUrl);
  const { user } = useGetUser(data.owner.account_address);
  const verificationTick = useVerificationTick(user);

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

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
    const _seconds = Math.floor((deadline / 1000) % 60);

    setDays(_days <= 0 ? 0 : _days);
    setHours(_hours <= 0 ? 0 : _hours);
    setMinutes(_minutes <= 0 ? 0 : _minutes);
    setSeconds(_seconds <= 0 ? 0 : _seconds);
  };
  const onClickClose = () => {
    setShowLockedDetails(false);
  };
  const onClickOpen = () => {
    setShowLockedDetails(true);
  };
  return (
    <div className={`cursor-pointer`}>
      <div
        className={clsx(
          `relative flex max-w-[300px] flex-col overflow-hidden rounded-xl border border-gray-shade-3 bg-transparent`
        )}
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
          className={clsx(
            ` mt-10 block w-full px-2`,
            locked && "pointer-events-none"
          )}
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
              className={`absolute top-[70px] right-5 flex h-[24px] w-[77px] items-center justify-center rounded-md bg-black/20 text-[10px] text-white backdrop-blur-[20px]`}
            >
              <div className="flex items-center gap-[6px]">
                <LockIcon className="w-[28%]" />
                LOCKED
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
        {locked ? (
          <div className="px-[6px] pb-[8px]">
            <div className="h-[56px] w-full overflow-hidden rounded-xl border border-gray-shade-3 bg-[url('/images/backcolouredshadow.png')] bg-center bg-no-repeat">
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
                src={formatIPFSUrl(data.imageUrl)}
                alt={"locknft"}
                height={120}
                width={120}
                className="h-[120px] w-[120px] rounded-xl object-cover"
              />
              <div className="flex w-full max-w-[240px] flex-col gap-2 fmd:gap-4">
                <h5 className="text-18px text-center font-semibold text-white fmd:text-left">
                  {data.name}
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
                  {data.description}
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
  description: string;
  imageUrl: string;
  type: "image" | "video" | "audio";
  unlock: NFT["unlock"];
}
