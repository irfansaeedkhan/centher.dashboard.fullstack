import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/router";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-hot-toast";
import { formatIPFSUrl } from "@/utils/format.address";
import { AppRoutes } from "@/constants/app.routes";
import { HammerIconBG, LockIcon, CentherIcon, LockVector } from "@/assets/svgs";
import { getUTCNow } from "@/web3/utils/utils";
import { BlockchainRead, BlockchainWrite } from "@/web3/blockchain";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { useWallet } from "@/web3/hooks/use.wallet";
import { NFTLockedDetailsProps } from "@/lib/get-user-by-id";
import { LockedNftModal } from "../modal/locked.nft.modal";
import Button from "../button";

export interface NFTCardProps {
  data: NFTLockedDetailsProps;
}

export const NFTImageCard: React.FC<NFTCardProps> = ({ data }) => {
  const router = useRouter();
  const { getSigner, connectedAddress } = useWallet();
  const locked = Number(data.unlock) * 1000 - getUTCNow() > 0 ? true : false;
  const auction = Number(data.endTime) * 1000 - getUTCNow() > 0 ? true : false;
  const internal = !data.external;

  const [name, setName] = useState();
  const [nftType, setNftType] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [description, setDescription] = useState();
  const [swapedBefore, setSwapedBefore] = useState(false);
  const [swapIsLoading, setSwapIsLoading] = useState("loaded");
  const [showLockedDetails, setShowLockedDetails] = useState(false);
  const [showSwapingDetails, setShowSwapingDetails] = useState(false);
  const [showExternalDetails, setShowExternalDetails] = useState(false);
  const [lockedTimer, setLockedTimer] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [auctionTimer, setAuctionTimer] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchMetadata = async (ipfs: string) => {
      try {
        const formattedUrl = formatIPFSUrl(ipfs);
        const _metadata = await axios.get(formattedUrl);
        if (_metadata.data.type.includes("video")) {
          if (!_metadata.data.videoThumbnail) {
            setImageUrl("/images/placeholder-square.svg");
            return;
          }
          const formattedUrl = formatIPFSUrl(_metadata.data.videoThumbnail);
          setVideoThumbnail(formattedUrl);
        }
        const imgUrl = formatIPFSUrl(_metadata.data.image);
        setImageUrl(imgUrl);
        setName(_metadata.data.name);
        setNftType(_metadata.data.type);
        setDescription(_metadata.data.description);
      } catch (error) {
        setImageUrl("/images/placeholder-square.svg");
      }
    };

    const setSwapHistory = async () => {
      const isSwaped = await BlockchainRead.isTokenSwaped(
        getSigner()!,
        data.collection,
        data.tokenId
      );
      setSwapedBefore(isSwaped);
    };
    if (data && data.ipfs && getSigner()) {
      fetchMetadata(data.ipfs);
      setSwapHistory();
    }
  }, [data, getSigner]);

  useEffect(() => {
    if (data.endTime === 0) {
      setAuctionTimer({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      let timeRemainingLocked = Number(data.unlock) * 1000 - getUTCNow();
      if (timeRemainingLocked <= 0) return;

      const interval = setInterval(() => {
        if (timeRemainingLocked > 1000) {
          timeRemainingLocked -= 1000;
          setCountdownFor(timeRemainingLocked);
        }

        if (timeRemainingLocked <= 1000) {
          clearInterval(interval);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    } else {
      setLockedTimer({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      let timeRemainingAuction = Number(data.endTime) * 1000 - getUTCNow();
      if (timeRemainingAuction <= 0) return;

      const interval = setInterval(() => {
        if (timeRemainingAuction > 1000) {
          timeRemainingAuction -= 1000;
          setCountdownFor(timeRemainingAuction);
        }

        if (timeRemainingAuction <= 1000) {
          clearInterval(interval);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [data]);

  const setCountdownFor = (deadline: number) => {
    const _days = Math.floor(deadline / (1000 * 60 * 60 * 24));
    const _hours = Math.floor((deadline / (1000 * 60 * 60)) % 24);
    const _minutes = Math.floor((deadline / 1000 / 60) % 60);
    const _seconds = Math.floor((deadline / 1000) % 60);
    setLockedTimer({
      days: _days <= 0 ? 0 : _days,
      hours: _hours <= 0 ? 0 : _hours,
      minutes: _minutes <= 0 ? 0 : _minutes,
      seconds: _seconds <= 0 ? 0 : _seconds,
    });
    setAuctionTimer({
      days: _days <= 0 ? 0 : _days,
      hours: _hours <= 0 ? 0 : _hours,
      minutes: _minutes <= 0 ? 0 : _minutes,
      seconds: _seconds <= 0 ? 0 : _seconds,
    });
  };

  const onClickClose = () => {
    setShowLockedDetails(false);
  };

  const onViewClickClose = () => {
    setShowExternalDetails(false);
  };

  const onSwapClickClose = () => {
    setShowSwapingDetails(false);
  };

  const onClickOpen = () => {
    if (data.saleState == "SWAP") {
      setShowSwapingDetails(true);
    } else if (data.saleState == "VIEW") {
      setShowExternalDetails(true);
    } else if (locked) {
      setShowLockedDetails(true);
    } else {
      router.push({
        pathname: AppRoutes.marketplace.nft,
        query: {
          collection: data.collection,
          tokenId: data.tokenId,
        },
      });
    }
  };

  const handleSwapNft = async () => {
    try {
      setSwapIsLoading("loading");
      if (swapedBefore) {
        throw new Error("Token is already swaped");
      }

      await BlockchainWrite.swapDexagon(
        getSigner()!,
        data.collection,
        data.tokenId
      );
      setShowSwapingDetails(false);
      toast.success("Swapped successfully");
      router.reload();
    } catch (error: any) {
      toast.error(error.message);
      setShowSwapingDetails(false);
      setSwapIsLoading("loaded");
    }
  };

  return (
    <div className={`cursor-pointer`}>
      <div
        className={clsx(
          `relative h-0 overflow-hidden rounded-xl bg-transparent pb-[100%]`
        )}
        onClick={() => {
          onClickOpen();
        }}
      >
        <div
          className={clsx(
            `flex h-full w-full justify-center`,
            locked && "pointer-events-none"
          )}
        >
          {imageUrl ? (
            <Image
              src={
                nftType.includes("audio")
                  ? "/images/default-music.png"
                  : nftType.includes("video")
                  ? videoThumbnail
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
          {internal && (
            <div
              className={`absolute left-3 top-3 hidden h-[28px] w-[86px] items-center justify-center rounded-md bg-black/20 text-[10px] text-white backdrop-blur-[20px] fsm:flex`}
            >
              <div className="flex items-center gap-[6px]">
                <span className="h5 flex w-5 flex-shrink-0">
                  <CentherIcon />
                </span>
                <span className="hidden f2xl:block">CENTHER</span>
              </div>
            </div>
          )}
          {locked && (
            <div
              className={`absolute right-3 top-3 hidden h-[28px] w-[28px] items-center justify-center rounded-md bg-black/20 text-[10px] text-white backdrop-blur-[20px] fsm:flex f2xl:h-[28px] f2xl:w-[80px]`}
            >
              <div className="flex items-center gap-[6px]">
                <LockIcon className="scale-150 f2xl:w-[28%]" />
                <span className="ml-1 hidden f2xl:block">LOCKED</span>
              </div>
            </div>
          )}
          {auction && (
            <div
              className={`absolute right-3 top-3 hidden h-[28px] w-[28px] items-center justify-center rounded-md bg-black/20 text-[10px] text-white backdrop-blur-[20px] fsm:flex f2xl:h-[28px] f2xl:w-[80px]`}
            >
              <div className="flex items-center gap-[6px]">
                <HammerIconBG className="scale-150 f2xl:w-[28%]" />
                <span className="ml-1 hidden f2xl:block">AUCTION</span>
              </div>
            </div>
          )}
          {locked && (
            <div
              className={`absolute bottom-2 left-[50%] hidden h-[23%] w-[94%] translate-x-[-50%] items-center justify-center rounded-xl bg-black/20 text-xs text-white backdrop-blur-[20px] fsm:flex`}
            >
              <div className="flex w-full items-center justify-evenly">
                <span className="text-10px hidden max-w-[100px] font-medium text-white f2xl:block">
                  Time remaining to unlock
                </span>
                <div className="flex flex-col items-center ">
                  <span className="text-[13px] font-semibold text-white">
                    {lockedTimer.days}
                  </span>
                  <span className="text-[8px] font-medium text-white">
                    DAYS
                  </span>
                </div>
                <div className="flex flex-col items-center ">
                  <span className="text-[13px] font-semibold text-white">
                    {lockedTimer.hours}
                  </span>
                  <span className="text-[8px] font-medium text-white">
                    HOURS
                  </span>
                </div>
                <div className="flex flex-col items-center ">
                  <span className="text-[13px] font-semibold text-white">
                    {lockedTimer.minutes}
                  </span>
                  <span className="text-[8px] font-medium text-white">MIN</span>
                </div>
              </div>
            </div>
          )}
          {auction && (
            <div
              className={`absolute bottom-2 left-[50%] hidden h-[23%] w-[94%] translate-x-[-50%] items-center justify-center rounded-xl bg-black/20 text-xs text-white backdrop-blur-[20px] fsm:flex`}
            >
              <div className="flex w-full items-center justify-evenly">
                <span className="text-10px hidden max-w-[100px] font-medium text-white f2xl:block">
                  This auction will end in
                </span>
                <div className="flex flex-col items-center ">
                  <span className="text-[13px] font-semibold text-white">
                    {auctionTimer.days}
                  </span>
                  <span className="text-[8px] font-medium text-white">
                    DAYS
                  </span>
                </div>
                <div className="flex flex-col items-center ">
                  <span className="text-[13px] font-semibold text-white">
                    {auctionTimer.hours}
                  </span>
                  <span className="text-[8px] font-medium text-white">
                    HOURS
                  </span>
                </div>
                <div className="flex flex-col items-center ">
                  <span className="text-[13px] font-semibold text-white">
                    {auctionTimer.minutes}
                  </span>
                  <span className="text-[8px] font-medium text-white">MIN</span>
                </div>
              </div>
            </div>
          )}
          {locked && (
            <div
              className={`absolute left-[50%] top-[50%] flex h-[27px]  w-[27px] translate-x-[-50%] translate-y-[-50%] items-center justify-center rounded-md bg-black/20  bg-opacity-20 bg-gradient-to-tl from-black via-[95.53deg] to-transparent 
              text-white backdrop-blur-[20px] fsm:hidden`}
            >
              <LockVector />
            </div>
          )}
          {auction && (
            <div
              className={`absolute left-[50%] top-[50%] flex h-[27px]  w-[27px] translate-x-[-50%] translate-y-[-50%] items-center justify-center rounded-md bg-black/20  bg-opacity-20 bg-gradient-to-tl from-black via-[95.53deg] to-transparent 
              text-white backdrop-blur-[20px] fsm:hidden`}
            >
              <HammerIconBG />
            </div>
          )}
        </div>
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
              <div className="flex w-full flex-col gap-2 fsm:max-w-[280px] fmd:gap-4">
                <h5 className="word-break text-center text-base font-semibold text-white fsm:text-left f2xl:text-lg">
                  {name}
                </h5>
                <div className="my-2 h-[56px] w-full overflow-hidden rounded-xl border border-gray-shade-3 bg-[url('/images/backcolouredshadow.png')] bg-center bg-no-repeat p-[2px] fmd:mt-0">
                  <div className="bg-[rgba(20, 20, 22, 0.08)] flex  h-full w-full items-center justify-evenly gap-5 overflow-hidden px-4 py-2 text-xs text-white backdrop-blur-[20px] fsm:m-0 fmd:mb-0 fmd:text-left">
                    <h4 className="min-w-[80px] max-w-[114px] text-[11px] font-bold text-white">
                      This NFT will unlock in
                    </h4>
                    <div className="flex flex-col items-center ">
                      <span className="text-[12px] font-semibold text-white">
                        {lockedTimer.days}
                      </span>
                      <span className="text-[8px] font-medium text-white">
                        DAYS
                      </span>
                    </div>
                    <div className="flex flex-col items-center ">
                      <span className="text-[12px] font-semibold text-white">
                        {lockedTimer.hours}
                      </span>
                      <span className="text-[8px] font-medium text-white">
                        HOURS
                      </span>
                    </div>
                    <div className="flex flex-col items-center ">
                      <span className="text-[12px] font-semibold text-white">
                        {lockedTimer.minutes}
                      </span>
                      <span className="text-[8px] font-medium text-white">
                        MIN
                      </span>
                    </div>
                    <div className="flex flex-col items-center ">
                      <span className="text-[12px] font-semibold text-white">
                        {lockedTimer.seconds}
                      </span>
                      <span className="text-[8px] font-medium text-white">
                        SEC
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* description */}
            <div className="mt-6 flex w-full flex-col items-start gap-6">
              {data.creator?.display_name && (
                <div className="flex min-w-fit items-center justify-center gap-3">
                  <div className="min-h-[32px] min-w-[32px] rounded-full bg-gradient-to-r from-[#70A2FF] to-[#F76E64]"></div>
                  <div className="flex flex-col gap-1">
                    <h5 className="text-xs font-normal text-gray-shade-18">
                      Creater
                    </h5>

                    <h5 className="word-break text-sm font-semibold text-white">
                      {data.creator.display_name}
                    </h5>
                  </div>
                </div>
              )}
              {data.owner?.display_name && (
                <div className="flex min-w-fit items-center justify-center gap-3">
                  <div className="min-h-[32px] min-w-[32px] rounded-full bg-gradient-to-r from-[#70A2FF] to-[#54F0D1]"></div>
                  <div className="flex flex-col gap-1">
                    <h5 className="text-xs font-normal text-gray-shade-18">
                      Owner
                    </h5>
                    <h5 className="word-break text-sm font-semibold text-white">
                      {data.owner.display_name}
                    </h5>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h5 className="text-sm font-normal text-gray-shade-18">
                  Description
                </h5>
                <h6 className="text-sm font-semibold text-white">
                  {description}
                </h6>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-sm font-normal text-gray-shade-18">
                  Collection Address
                </h5>
                <Link
                  className="flex w-full cursor-pointer items-center text-white"
                  href={{
                    pathname: AppRoutes.marketplace.collection,
                    query: { collection: data.collection },
                  }}
                >
                  <h6 className="textGradient inline-block break-words text-sm font-semibold">
                    {data.collection}
                  </h6>
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-sm font-normal text-gray-shade-18">
                  Mint Transaction
                </h5>
                <Link
                  href={BlockchainConfig.scanner.url + "/tx/" + data.mintHash}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <h6 className="textGradient inline-block break-words text-sm font-semibold">
                    {data.mintHash}
                  </h6>
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-sm font-normal text-gray-shade-18">
                  Token ID
                </h5>
                <h6 className="inline-block break-words text-sm font-semibold text-white">
                  {data.tokenId}
                </h6>
              </div>
            </div>
          </div>
        </LockedNftModal>
      )}
      {showSwapingDetails && (
        <LockedNftModal
          title="NFT Details"
          isOpen={showSwapingDetails}
          onClickClose={onSwapClickClose}
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
              <div className="flex w-full flex-col gap-2 fsm:max-w-[280px] fmd:gap-4">
                <h5 className="word-break text-center text-base font-semibold text-white fsm:text-left f2xl:text-lg">
                  {name}
                </h5>
              </div>
            </div>
            {/* description */}
            <div className="mt-6 flex w-full flex-col items-start gap-6">
              {data.creator?.display_name && (
                <div className="flex min-w-fit items-center justify-center gap-3">
                  <div className="min-h-[32px] min-w-[32px] rounded-full bg-gradient-to-r from-[#70A2FF] to-[#F76E64]"></div>
                  <div className="flex flex-col gap-1">
                    <h5 className="text-xs font-normal text-gray-shade-18">
                      Creater
                    </h5>

                    <h5 className="word-break text-sm font-semibold text-white">
                      {data.creator.display_name}
                    </h5>
                  </div>
                </div>
              )}
              {data.owner?.display_name && (
                <div className="flex min-w-fit items-center justify-center gap-3">
                  <div className="min-h-[32px] min-w-[32px] rounded-full bg-gradient-to-r from-[#70A2FF] to-[#54F0D1]"></div>
                  <div className="flex flex-col gap-1">
                    <h5 className="text-xs font-normal text-gray-shade-18">
                      Owner
                    </h5>
                    <h5 className="word-break text-sm font-semibold text-white">
                      {data.owner.display_name}
                    </h5>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h5 className="text-sm font-normal text-gray-shade-18">
                  Description
                </h5>
                <h6 className="text-sm font-semibold text-white">
                  {description}
                </h6>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-sm font-normal text-gray-shade-18">
                  Collection Address
                </h5>
                <h6 className="textGradient inline-block break-words text-sm font-semibold">
                  {data.collection}
                </h6>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-sm font-normal text-gray-shade-18">
                  Mint Transaction
                </h5>
                <h6 className="textGradient inline-block break-words text-sm font-semibold">
                  {data.mintHash}
                </h6>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-sm font-normal text-gray-shade-18">
                  Token ID
                </h5>
                <h6 className="inline-block break-words text-sm font-semibold text-white">
                  {data.tokenId}
                </h6>
              </div>
            </div>
            {connectedAddress?.toLowerCase() ==
              data.owner?._id?.toLowerCase() &&
              swapedBefore == false &&
              (swapIsLoading == "loading" ? (
                <button className="mt-6 flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-background-shade-2 px-2 py-[10px] text-sm font-semibold text-gray-shade-7">
                  <CgSpinner className="h-5 animate-spin" />
                </button>
              ) : (
                <Button
                  title={"Swap NFT"}
                  variant="primary"
                  className="mt-6"
                  onClick={handleSwapNft}
                />
              ))}
          </div>
        </LockedNftModal>
      )}
      {showExternalDetails && (
        <LockedNftModal
          title="NFT Details"
          isOpen={showExternalDetails}
          onClickClose={onViewClickClose}
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
              <div className="flex w-full flex-col gap-2 fsm:max-w-[280px] fmd:gap-4">
                <h5 className="word-break text-center text-base font-semibold text-white fsm:text-left f2xl:text-lg">
                  {name}
                </h5>
              </div>
            </div>
            {/* description */}
            <div className="mt-6 flex w-full flex-col items-start gap-6">
              {data.creator?.display_name && (
                <div className="flex min-w-fit items-center justify-center gap-3">
                  <div className="min-h-[32px] min-w-[32px] rounded-full bg-gradient-to-r from-[#70A2FF] to-[#F76E64]"></div>
                  <div className="flex flex-col gap-1">
                    <h5 className="text-xs font-normal text-gray-shade-18">
                      Creater
                    </h5>

                    <h5 className="word-break text-sm font-semibold text-white">
                      {data.creator.display_name}
                    </h5>
                  </div>
                </div>
              )}
              {data.owner?.display_name && (
                <div className="flex min-w-fit items-center justify-center gap-3">
                  <div className="min-h-[32px] min-w-[32px] rounded-full bg-gradient-to-r from-[#70A2FF] to-[#54F0D1]"></div>
                  <div className="flex flex-col gap-1">
                    <h5 className="text-xs font-normal text-gray-shade-18">
                      Owner
                    </h5>
                    <h5 className="word-break text-sm font-semibold text-white">
                      {data.owner.display_name}
                    </h5>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h5 className="text-sm font-normal text-gray-shade-18">
                  Description
                </h5>
                <h6 className="text-sm font-semibold text-white">
                  {description}
                </h6>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-sm font-normal text-gray-shade-18">
                  Collection Address
                </h5>
                <h6 className="textGradient inline-block break-words text-sm font-semibold">
                  {data.collection}
                </h6>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-sm font-normal text-gray-shade-18">
                  Mint Transaction
                </h5>
                <h6 className="textGradient inline-block break-words text-sm font-semibold">
                  {data.mintHash}
                </h6>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-sm font-normal text-gray-shade-18">
                  Token ID
                </h5>
                <h6 className="inline-block break-words text-sm font-semibold text-white">
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
