import React, { useEffect, useState, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { SiWhatsapp } from "react-icons/si";
import { TwitterShareButton, WhatsappShareButton } from "react-share";
import { useRouter } from "next/router";
import { useOnClickOutside } from "usehooks-ts";
import { copyText } from "@/utils/copy.text";
import { formatAddress } from "@/utils/format.address";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { AppRoutes } from "@/constants/app.routes";
import { ShareBigIcon, LinkIcon, XIcon } from "@/assets/svgs";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { eqAddress } from "@/lib/chat/utils";
import { CFSNFTForPage } from "@/lib/get-single-nft-page-data/types";
import { LoggedInUser } from "@/models/user";
import { NFTListing } from "./nft.listing";
import { NFTOffers } from "./nft.offers";
import { FixedPriceNFTDescription } from "./fixed.price.nft.description";
import { NonNFTDescription } from "./non.nft.description";
import { NonNFTBuyerDescription } from "./non.nftbuyer.description";
import { FixedPriceNFTBuyerDescription } from "./fixed.price.nftbuyer.description";
import { AuctionNFTBuyerDescription } from "./auction.nftbuyer.description";
import { AuctionNftDescription } from "./auction.nft.description";

interface Props {
  nft: CFSNFTForPage;
  loggedInUser: LoggedInUser;
  refetchNFT: () => void;
}

export const NFTRightSideComponent: React.FC<Props> = ({
  nft,
  loggedInUser,
  refetchNFT,
}) => {
  const router = useRouter();
  const [nftState, setNftState] = useState("auctionNFTBuyer");
  const [togglePop, setTogglePop] = useState(false);
  const verificationTickCreator = useVerificationTick({
    user: nft.creator_data,
  });
  const verificationTickOwner = useVerificationTick({ user: nft.owner_data });
  const shareUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${router.asPath}`;
    }
    return "";
  }, [router.asPath]);

  useEffect(() => {
    if (loggedInUser._id && eqAddress(loggedInUser._id, nft.owner)) {
      if (nft.saleState === "Auction") setNftState("timeAuctionedNFT");
      else if (nft.saleState === "List") setNftState("fixedPriceNFT");
      else if (nft.saleState === "NON") setNftState("nonNFT");
    } else {
      if (nft.saleState === "Auction") setNftState("timeAuctionedNFTBuyer");
      else if (nft.saleState === "List") setNftState("fixedPriceNFTBuyer");
      else if (nft.saleState === "NON") setNftState("nonNFTBuyer");
    }
  }, [loggedInUser, nft]);

  // Copy nft share url to clipboard
  const copyShareUrl = async () => {
    await copyText(shareUrl);
    toast.success("NFT link copied!");
  };
  // ref for toggle function
  const toggleContainerRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(toggleContainerRef, () => {
    setTogglePop(false);
  });
  // toggle function to show/hide edit/delete popup
  const togglePopFunc = async () => {
    setTogglePop((prev) => !prev);
  };

  return (
    <div className={`flex w-full flex-col gap-6`}>
      <div className={`flex items-end justify-between fmd:items-start`}>
        <h1 className={title}>{nft.ipfs_metadata.name}</h1>
        <div ref={toggleContainerRef} className={`relative`}>
          <button onClick={togglePopFunc} className="fxl:translate-y-[14px]">
            <ShareBigIcon />
          </button>
          <div
            className={clsx(
              `absolute right-0 top-6 hidden w-[240px] overflow-hidden rounded-10px bg-black-shade-12 shadow-sm`,
              togglePop && "z-50 !block"
            )}
          >
            <button onClick={copyShareUrl} className={toggleListBtn}>
              <LinkIcon className={toggleListIcons} /> Copy link
            </button>

            <WhatsappShareButton url={shareUrl} className="w-full">
              <span className={toggleListBtn}>
                <SiWhatsapp className={toggleListIcons} /> Share on whatsapp
              </span>
            </WhatsappShareButton>

            <TwitterShareButton url={shareUrl} className="w-full">
              <span className={toggleListBtn}>
                <XIcon className={toggleListIcons} /> Share on twitter
              </span>
            </TwitterShareButton>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-6 f2xl:grid-cols-3`}>
        <div className={clsx(nameBox)}>
          {nft.creator_data ? (
            <Image
              src={nft.creator_data.profile_image}
              width={48}
              height={48}
              alt="profile"
              className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 flex-shrink-0 animate-pulse rounded-full bg-gray-shade-3"></div>
          )}
          <div className="flex flex-grow flex-col gap-1">
            <h5 className={nameBoxTitle}>Creator</h5>
            {nft.creator_data ? (
              <Link
                href={{
                  pathname: AppRoutes.profile.owned,
                  query: {
                    user_id: nft.creator,
                  },
                }}
                className={clsx(
                  "hover:text-gradient flex max-w-[230px] items-center text-sm font-semibold text-white f2xl:!max-w-[120px] [@media(min-width:400px)]:max-w-[300px] [@media(min-width:500px)]:max-w-[400px]"
                )}
                title={nft.creator_data.display_name}
              >
                <span className="block truncate break-words">
                  {sliceDisplayName(nft.creator_data.display_name)}
                </span>
                {verificationTickCreator && (
                  <span className="verifiedIcon inline-flexh-[18px] ml-0.5 w-[18px] min-w-[18px] fsm:ml-1">
                    <Image
                      src={verificationTickCreator}
                      alt={
                        nft.creator_data.membership.status === "citizen"
                          ? "Citizen"
                          : "Verified"
                      }
                      width={16}
                      height={16}
                    />
                  </span>
                )}
              </Link>
            ) : (
              <div className="mt-1 h-4 w-full animate-pulse rounded-sm bg-gray-shade-3"></div>
            )}
          </div>
        </div>
        <div className={clsx(nameBox)}>
          {nft.owner_data ? (
            <Image
              src={nft.owner_data.profile_image}
              width={48}
              height={48}
              alt={nft.owner_data.display_name}
              className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 flex-shrink-0 animate-pulse rounded-full bg-gray-shade-3"></div>
          )}
          <div className="flex flex-grow flex-col gap-1">
            <h5 className={nameBoxTitle}>Owner</h5>
            {nft.owner_data ? (
              <Link
                href={{
                  pathname: AppRoutes.profile.owned,
                  query: {
                    user_id: nft.owner,
                  },
                }}
                className={`hover:text-gradient flex max-w-[230px] items-center text-sm font-semibold text-white f2xl:!max-w-[120px] [@media(min-width:400px)]:max-w-[300px] [@media(min-width:500px)]:max-w-[400px]`}
                title={nft.owner_data.display_name}
              >
                <span className="block truncate break-words ">
                  {sliceDisplayName(nft.owner_data.display_name)}
                </span>
                {verificationTickOwner && (
                  <span className="verifiedIcon ml-0.5 inline-flex h-[18px] w-[18px] min-w-[18px] fsm:ml-1">
                    <Image
                      src={verificationTickOwner}
                      alt={
                        nft.owner_data.membership.status === "citizen"
                          ? "Citizen"
                          : "Verified"
                      }
                      width={16}
                      height={16}
                    />
                  </span>
                )}
              </Link>
            ) : (
              <div className="mt-1 h-4 w-full animate-pulse rounded-sm bg-gray-shade-3"></div>
            )}
          </div>
        </div>
        <div className={clsx(nameBox)}>
          <div className="flex flex-grow flex-col gap-1">
            <h5 className={nameBoxTitle}>Collection</h5>
            <Link
              href={{
                pathname: AppRoutes.marketplace.collection,
                query: {
                  collection: nft.collection,
                },
              }}
              className={
                "hover:text-gradient line-clamp-1 text-ellipsis text-sm font-semibold text-white"
              }
            >
              {formatAddress(nft.collection)}
            </Link>
          </div>
        </div>
      </div>
      {nftState === "nonNFT" && (
        <NonNFTDescription
          nft={nft}
          refetchNFT={refetchNFT}
          loggedInUser={loggedInUser}
        />
      )}
      {nftState === "nonNFTBuyer" && (
        <NonNFTBuyerDescription nft={nft} refetchNFT={refetchNFT} />
      )}
      {nftState === "fixedPriceNFT" && (
        <FixedPriceNFTDescription nft={nft} refetchNFT={refetchNFT} />
      )}
      {nftState === "fixedPriceNFTBuyer" && (
        <FixedPriceNFTBuyerDescription
          nft={nft}
          refetchNFT={refetchNFT}
          loggedInUser={loggedInUser}
        />
      )}
      {nftState === "timeAuctionedNFT" && (
        <AuctionNftDescription nft={nft} refetchNFT={refetchNFT} />
      )}
      {nftState === "timeAuctionedNFTBuyer" && (
        <AuctionNFTBuyerDescription nft={nft} refetchNFT={refetchNFT} />
      )}
      <NFTListing data={nft.marketplaceSaleHistory} />
      {nft.saleState === "Auction" && <NFTOffers bids={nft.auctionInfo.bids} />}
      {nft.saleState === "List" && <NFTOffers bids={nft.listInfo.bids} />}
      {nft.saleState === "NON" && <NFTOffers bids={nft.listInfo.bids} />}
      {/* <NFTHistory prices={nft.priceHistory} /> */}
    </div>
  );
};

const nameBox = `flex items-start gap-3 flex-grow`;
const toggleListIcons = `w-[24px] h-[24px] stroke-white`;
const nameBoxTitle = `text-xs font-normal text-gray-shade-2`;
const title = `word-break textGradient font-semibold leading-[42px] animationTextHeading text-2xl f2xl:text-4x`;
const toggleListBtn = `w-full text-sm font-medium text-white flex items-center gap-3 px-5 py-4 transition hover:bg-[#1f1f1f]`;
