// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import ctl from "@netlify/classnames-template-literals";
import clsx from "clsx";

import { NFT } from "@/models/nft";
import { formatIPFSUrl } from "@/utils/format.address";
import { AppRoutes } from "@/constants/app.routes";
import { LockIcon, LockVector, MoonIcon } from "@/assets/svgs";
import { getUTCNow } from "@/web3/utils/utils";
import { LockedNftModal } from "../modal/locked.nft.modal";

export interface NFTCardProps {
  data: NFT;
}

export const NFTImageCard: React.FC<NFTCardProps> = ({ data }) => {
  const [imageUrl, setImageUrl] = useState("");
  const locked = Number(data.unlock) * 1000 - getUTCNow() > 0 ? true : false;

  const [showLockedDetails, setShowLockedDetails] = useState(false);
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  useEffect(() => {
    const fetchMetadata = async (ipfs: string) => {
      try {
        const formattedUrl = formatIPFSUrl(ipfs);
        const _metadata = await axios.get(formattedUrl);
        const imgUrl = formatIPFSUrl(_metadata.data.image);
        setImageUrl(imgUrl);
        setName(_metadata.data.name);
        setDescription(_metadata.data.description);
      } catch (error) {}
    };
    if (data && data.ipfs) {
      fetchMetadata(data.ipfs);
    }
  }, [data]);

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
          `relative h-0 overflow-hidden rounded-xl bg-transparent pb-[100%]`
        )}
        onClick={onClickOpen}
      >
        <Link
          href={{
            pathname: AppRoutes.marketplace.nft,
            query: {
              collection: data.collection,
              tokenId: data.tokenId,
            },
          }}
          className={clsx(
            `flex h-full w-full justify-center`,
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
              height={275}
              width={275}
              className="absolute inset-0 h-full w-full rounded-xl object-cover"
              onError={() => setImageUrl("/images/placeholder-square.svg")}
            />
          ) : (
            <div className="absolute inset-0 h-full w-full animate-pulse rounded-xl bg-[#3C3F4A] object-cover"></div>
          )}
          {locked && (
            <div
              className={`absolute top-4 right-4 hidden h-[24px] w-[77px] items-center  justify-center rounded-md bg-black/20 text-[10px] text-white  backdrop-blur-[20px] fsm:flex`}
            >
              <div className="flex items-center gap-1">
                <LockIcon className="w-[28%]" />
                LOCKED
              </div>
            </div>
          )}
          {locked && (
            <div
              className={`text-12px absolute bottom-4 left-[50%] hidden h-[42px] w-[94%] translate-x-[-50%] items-center justify-center rounded-xl bg-black/20 text-white backdrop-blur-[20px] fsm:flex f2xl:w-[174px]`}
            >
              <div className="flex w-full items-center justify-evenly">
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
                  <span className="text-[8px] font-medium text-white">MIN</span>
                </div>
              </div>
            </div>
          )}
          {locked && (
            <div
              className={`absolute top-[50%] left-[50%] flex h-[27px]  w-[27px] translate-x-[-50%] translate-y-[-50%] items-center justify-center rounded-md bg-black/20  bg-opacity-20 bg-gradient-to-tl from-black via-[95.53deg] to-transparent 
              text-white backdrop-blur-[20px] fsm:hidden`}
            >
              <LockVector />
            </div>
          )}
        </Link>
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
                <div
                  className={`text-12px lockedBackground mt-2 mb-2 flex w-full items-center justify-evenly gap-5 rounded-2xl border border-gray-shade-3 bg-black-shade-9 px-4 py-2 text-white fsm:m-0 fmd:mb-0 fmd:text-left`}
                >
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

const nftCardWrapper = ctl(
  `bg-transparent relative rounded-xl overflow-hidden h-0 pb-[100%]`
);

const nftImageWrapper = ctl(`w-full h-full flex justify-center `);
