// React, Next, NPM Packages
import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import ctl from "@netlify/classnames-template-literals";
import { useOnClickOutside } from "usehooks-ts";

import { INFTDetailData } from "@/hooks/use.get.nft.data.ts";
// same directory imports
import { NFTListing } from "./nft.listing";
import { NFTOffers } from "./nft.offers";
import { NFTHistory } from "./nft.history";
import { FixedPriceNFTDescription } from "./fixed.price.nft.description";
import { FixedPriceNFTBuyerDescription } from "./fixed.price.nftbuyer.description";
import { AuctionNFTBuyerDescription } from "./auction.nftbuyer.description";
import { AuctionNftDescription } from "./auction.nft.description";
import {
  ShareBigIcon,
  FacebookCircleIcon,
  LinkIcon,
  TwitterSvg,
} from "@/assets/svgs";
import { useWeb3React } from "@web3-react/core";
import { NonNFTDescription } from "./non.nft.description";
import { NonNFTBuyerDescription } from "./non.nftbuyer.description";
import { formatAddress } from "@/utils/format.address";
import { useGetNFTOwner } from "@/web3/hooks/use.contracts.functions";
import { AppRoutes } from "@/constants/app.routes";
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
  const [nftState, setNftState] = useState("auctionNFTBuyer");
  const [togglePop, setTogglePop] = useState(false);

  const nftOwner = useGetNFTOwner(data?.collection, data?.nftId, data?.owner);

  useEffect(() => {
    if (data) {
      if (
        account &&
        account.toLocaleLowerCase() === nftOwner.toLocaleLowerCase()
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
  }, [account, data, nftOwner]);
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
          <div className={`${toggleList} ${togglePop && "!block z-50"}`}>
            <button className={toggleListBtn}>
              <FacebookCircleIcon className={toggleListIcons} /> Share on
              facebook
            </button>
            <button className={toggleListBtn}>
              <TwitterSvg className={toggleListIcons} /> Share on twitter
            </button>
            <button className={toggleListBtn}>
              <LinkIcon className={toggleListIcons} /> Copy link
            </button>
          </div>
        </div>
      </div>

      <div className={desNameContainer}>
        <div className={nameBox}>
          <div className="linearCircle1"></div>
          <div className="flex flex-col gap-1">
            <h5 className={nameBoxTitle}>Creator</h5>
            <Link
              href={{
                pathname: AppRoutes.profile.nfts,
                query: {
                  account_address: data?.creator,
                },
              }}
              className={nameBoxZValue}
            >
              {formatAddress(data?.creator)}
            </Link>
          </div>
        </div>
        <div className={nameBox}>
          <div className="linearCircle2"></div>
          <div className="flex flex-col gap-1">
            <h5 className={nameBoxTitle}>Owner</h5>
            <Link
              href={{
                pathname: AppRoutes.profile.nfts,
                query: {
                  account_address: nftOwner,
                },
              }}
              className={nameBoxZValue}
            >
              {formatAddress(nftOwner)}
            </Link>
          </div>
        </div>
        <div className={nameBox}>
          <div className="flex flex-col gap-1">
            <h5 className={nameBoxTitle}>Collection</h5>
            <Link
              href={{
                pathname: AppRoutes.profile.nfts,
                query: {
                  account_address: data?.collection,
                },
              }}
              className={nameBoxZValue}
            >
              {formatAddress(data?.collection)}
            </Link>
          </div>
        </div>
      </div>
      {nftState === "nonNFT" && <NonNFTDescription data={data} />}
      {nftState === "nonNFTBuyer" && <NonNFTBuyerDescription data={data} />}
      {nftState === "fixedPriceNFT" && <FixedPriceNFTDescription data={data} />}
      {nftState === "fixedPriceNFTBuyer" && (
        <FixedPriceNFTBuyerDescription data={data} />
      )}
      {nftState === "timeAuctionedNFT" && <AuctionNftDescription data={data} />}
      {nftState === "timeAuctionedNFTBuyer" && (
        <AuctionNFTBuyerDescription data={data} />
      )}
      <NFTListing data={data?.listingHistory} />
      {data?.saleState === "Auction" && (
        <NFTOffers data={data?.auctionInfo.bids} />
      )}
      {data?.saleState === "List" && <NFTOffers data={data?.listInfo.bids} />}
      {data?.saleState === "NON" && <NFTOffers data={data?.listInfo.bids} />}
      <NFTHistory prices={data?.priceHistory} />
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
flex items-start gap-3
`);
const nameBoxTitle = ctl(`
text-12px font-normal text-gray-shade-2
`);
const nameBoxZValue = ctl(`
text-14px font-semibold text-white
`);
const desNameContainer = ctl(`
flex gap-6 [@media(max-width:600px)]:flex-wrap
`);
