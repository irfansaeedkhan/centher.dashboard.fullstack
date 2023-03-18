// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import ctl from "@netlify/classnames-template-literals";

import { NFT } from "@/models/nft";
import { formatIPFSUrl } from "@/utils/format.address";
import { AppRoutes } from "@/constants/app.routes";
import { LockIcon, MoonIcon } from "@/assets/svgs";
import clsx from "clsx";
import { LockedNftModal } from "../modal/locked.nft.modal";
import { getUTCNow } from "@/web3/utils/utils";

export interface NFTCardProps {
  data: NFT;
}

export const NFTImageCard: React.FC<NFTCardProps> = ({ data }) => {
  const [imageUrl, setImageUrl] = useState("");
  const locked = Number(data.unlock) * 1000 - getUTCNow() > 0 ? true : false;
  const [showLockedDetails, setShowLockedDetails] = useState<boolean>();
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

  return (
    <div
      className={`cursor-pointer`}
      onClick={() => {
        locked && setShowLockedDetails(true);
      }}
    >
      <div
        className={clsx(
          `relative h-0 overflow-hidden rounded-xl bg-transparent pb-[100%]`,
          locked && "pointer-events-none"
        )}
      >
        <Link
          href={{
            pathname: AppRoutes.marketplace.nft,
            query: {
              collection: data.collection,
              tokenId: data.tokenId,
            },
          }}
          className={nftImageWrapper}
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
              className={`absolute top-4 right-4 flex h-[24px] w-[74px] items-center justify-center  rounded-md bg-white/20 text-[10px] text-white backdrop-blur-lg`}
            >
              <div className="flex items-center gap-1">
                <LockIcon className="h-[16px] w-[16px]" />
                LOCKED
              </div>
            </div>
          )}
          {locked && (
            <div
              className={`text-12px absolute bottom-4 left-[50%] flex h-[42px] w-[94%] translate-x-[-50%] items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-lg f2xl:w-[174px]`}
            >
              <div className="flex items-center gap-3">
                <MoonIcon className=" hidden scale-75 fmd:block" />
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
        </Link>
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
                  <h5 className="text-18px font-semibold text-white">{name}</h5>
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
                <h6 className="text-14px font-semibold text-white">
                  {data.collection}
                </h6>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-14px font-normal text-gray-shade-18">
                  Token ID
                </h5>
                <h6 className="text-14px font-semibold text-white">
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
