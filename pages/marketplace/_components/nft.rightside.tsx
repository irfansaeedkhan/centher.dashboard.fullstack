// React, Next, NPM Packages
import React, { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useOnClickOutside } from "usehooks-ts";
import { useWeb3React } from "@web3-react/core";
import { SiWhatsapp } from "react-icons/si";
import { TwitterShareButton, WhatsappShareButton } from "react-share";
import toast from "react-hot-toast";
import clsx from "clsx";
import ctl from "@netlify/classnames-template-literals";

import { useGetNFTOwner } from "@/web3/hooks/use.contracts.functions";
import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
import useGetUser from "@/hooks/use.get.user";
import { copyText } from "@/utils/copy.text";
import { formatAddress } from "@/utils/format.address";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";
import { AppRoutes } from "@/constants/app.routes";
import { ShareBigIcon, LinkIcon, TwitterSvg } from "@/assets/svgs";

import { NFTListing } from "./nft.listing";
import { NFTOffers } from "./nft.offers";
import { NFTHistory } from "./nft.history";
import { FixedPriceNFTDescription } from "./fixed.price.nft.description";
import { NonNFTDescription } from "./non.nft.description";
import { NonNFTBuyerDescription } from "./non.nftbuyer.description";
import { FixedPriceNFTBuyerDescription } from "./fixed.price.nftbuyer.description";
import { AuctionNFTBuyerDescription } from "./auction.nftbuyer.description";
import { AuctionNftDescription } from "./auction.nft.description";

interface NFTRightSideComponentProps {
  data: INFTDetailData | undefined;
  reload: boolean;
  setReload: any;
}
export const NFTRightSideComponent = ({
  data,
  reload,
  setReload,
}: NFTRightSideComponentProps) => {
  // states of nfts: nonNFT  nonNFTBuyer, fixedPriceNFT  fixedPriceNFTBuyer  timeAuctionedNFT auctionNFTBuyer
  const { library, account } = useWeb3React();
  const router = useRouter();
  const { user } = useGetUser(data?.creator);
  // const { user: creatorProfile } = useGetUser(router.query.account_address?.toString());
  const [nftState, setNftState] = useState("auctionNFTBuyer");
  const [togglePop, setTogglePop] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${router.asPath}`;
    }
    return "";
  }, [router.asPath]);

  // Copy nft share url to clipboard
  const copyShareUrl = async () => {
    await copyText(shareUrl);
    toast.success("NFT link copied!");
  };

  const nftOwnerAddress = useGetNFTOwner(
    data?.collection,
    data?.nftId,
    data?.owner
  );
  const { user: nftOwner } = useGetUser(nftOwnerAddress);
  useEffect(() => {
    if (data) {
      if (
        account &&
        account.toLocaleLowerCase() === nftOwnerAddress.toLocaleLowerCase()
      ) {
        if (data.saleState === "Auction") setNftState("timeAuctionedNFT");
        else if (data.saleState === "List") setNftState("fixedPriceNFT");
        else if (data.saleState === "NON") setNftState("nonNFT");
      } else {
        if (data.saleState === "Auction") setNftState("timeAuctionedNFTBuyer");
        else if (data.saleState === "List") setNftState("fixedPriceNFTBuyer");
        else if (data.saleState === "NON") setNftState("nonNFTBuyer");
      }
    }
  }, [account, data, nftOwnerAddress]);
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
    <div className={rightSideContainer}>
      <div className={titleContainer}>
        <h1 className={title}>{data?.name}</h1>
        <div ref={toggleContainerRef} className={toggleContainer}>
          <button onClick={togglePopFunc}>
            <ShareBigIcon />
          </button>
          <div className={`${toggleList} ${togglePop && "z-50 !block"}`}>
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
                <TwitterSvg className={toggleListIcons} /> Share on twitter
              </span>
            </TwitterShareButton>
          </div>
        </div>
      </div>

      <div className={desNameContainer}>
        <div className={clsx(`basis-[37.7%]`, nameBox)}>
          {user ? (
            <Image
              src={user?.profile_image.path}
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
            {user ? (
              <Link
                href={{
                  pathname: AppRoutes.profile.owned,
                  query: {
                    account_address: data?.creator,
                  },
                }}
                className={nameBoxZValue}
                title={user.display_name}
              >
                {sliceDisplayName(user.display_name)}
              </Link>
            ) : (
              <div className="mt-1 h-4 w-full animate-pulse rounded-sm bg-gray-shade-3"></div>
            )}
          </div>
        </div>
        <div className={clsx(`basis-[37.7%]`, nameBox)}>
          {nftOwner ? (
            <Image
              src={nftOwner?.profile_image.path}
              width={48}
              height={48}
              alt="profile"
              className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 flex-shrink-0 animate-pulse rounded-full bg-gray-shade-3"></div>
          )}
          <div className="flex flex-grow flex-col gap-1">
            <h5 className={nameBoxTitle}>Owner</h5>
            {nftOwner ? (
              <Link
                href={{
                  pathname: AppRoutes.profile.owned,
                  query: {
                    account_address: nftOwnerAddress,
                  },
                }}
                className={nameBoxZValue}
                title={nftOwner.display_name}
              >
                {sliceDisplayName(nftOwner.display_name)}
              </Link>
            ) : (
              <div className="mt-1 h-4 w-full animate-pulse rounded-sm bg-gray-shade-3"></div>
            )}
          </div>
        </div>
        <div className={clsx(`basis-1/4`, nameBox)}>
          <div className="flex flex-grow flex-col gap-1">
            <h5 className={nameBoxTitle}>Collection</h5>
            {data?.collection ? (
              <Link
                href={{
                  pathname: AppRoutes.marketplace.collection,
                  query: {
                    collection: data?.collection,
                  },
                }}
                className={nameBoxZValue}
              >
                {formatAddress(data?.collection)}
              </Link>
            ) : (
              <div className="mt-1 h-4 w-full animate-pulse rounded-sm bg-gray-shade-3"></div>
            )}
          </div>
        </div>
      </div>
      {nftState === "nonNFT" && <NonNFTDescription data={data} />}
      {nftState === "nonNFTBuyer" && <NonNFTBuyerDescription data={data} />}
      {nftState === "fixedPriceNFT" && <FixedPriceNFTDescription data={data} />}
      {nftState === "fixedPriceNFTBuyer" && (
        <FixedPriceNFTBuyerDescription data={data} />
      )}
      {/* {nftState === "timeAuctionedNFT" && <AuctionNftDescription data={data} />}
      {nftState === "timeAuctionedNFTBuyer" && (
        <AuctionNFTBuyerDescription data={data} />
      )} */}
      <NFTListing data={data?.listingHistory} />
      {/* {data?.saleState === "Auction" && (
        <NFTOffers data={data?.auctionInfo.bids} />
      )} */}
      {data?.saleState === "List" && <NFTOffers data={data?.listInfo.bids} />}
      {data?.saleState === "NON" && <NFTOffers data={data?.listInfo.bids} />}
      {/* <NFTHistory prices={data?.priceHistory} /> */}
    </div>
  );
};
// styling
const rightSideContainer = ctl(`
w-full flex flex-col gap-6
`);
const titleContainer = ctl(`
flex items-center justify-between 
`);
const title = ctl(`
textGradient  font-semibold leading-[42px]  animationTextHeading text-34px
`);
const toggleContainer = ctl(`
relative
`);
const toggleList = ctl(`
 hidden absolute right-0 top-6 rounded-10px bg-black-shade-12 shadow-sm overflow-hidden w-[240px]
`);
const toggleListBtn = ctl(`
w-full text-14px font-medium text-white  flex items-center gap-3 px-5 py-4 transition hover:bg-[#1f1f1f]
`);
const toggleListIcons = ctl(`
w-[24px] h-[24px] stroke-white
`);
const nameBox = ctl(`
flex items-start gap-3 flex-grow
`);
const nameBoxTitle = ctl(`
text-12px font-normal text-gray-shade-2
`);
const nameBoxZValue = ctl(`
text-14px font-semibold text-white hover:text-brand-primary-dark text-ellipsis line-clamp-1
`);
const desNameContainer = ctl(`
flex gap-6 [@media(max-width:600px)]:flex-wrap
`);
