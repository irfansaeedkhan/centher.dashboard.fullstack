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
import useGetUser from "@/hooks/use.get.user";
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
  const { user } = useGetUser(data?.creator);
  const [nftState, setNftState] = useState("auctionNFTBuyer");
  const [togglePop, setTogglePop] = useState(false);

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

  let dummyData = [
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1668417655",
      seller: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
      price: "100000000000000",
      buyer: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    },
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1668417655",
      seller: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
      price: "100000000000000",
      buyer: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    },
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1668417655",
      seller: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
      price: "100000000000000",
      buyer: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    },
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1668417655",
      seller: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
      price: "100000000000000",
      buyer: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    },
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1668387940",
      seller: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
      price: "3000000000000000",
      buyer: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
    },
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1668416740",
      seller: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
      price: "50000000000000000",
      buyer: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    },
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1668301540",
      seller: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
      price: "150000000000000000",
      buyer: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    },
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1668337540",
      seller: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
      price: "155000000000000000",
      buyer: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    },
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1668251140",
      seller: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
      price: "85000000000000000",
      buyer: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    },
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1668164740",
      seller: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
      price: "15000000000000000",
      buyer: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    },
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1668175540",
      seller: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
      price: "105000000000000000",
      buyer: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    },
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1668702055",
      seller: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
      price: "125000000000000000",
      buyer: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    },
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1668042340",
      seller: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
      price: "135000000000000000",
      buyer: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    },
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1668089140",
      seller: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
      price: "70000000000000000",
      buyer: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    },
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1669245655",
      seller: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
      price: "45000000000000000",
      buyer: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    },
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1667743540",
      seller: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
      price: "65000000000000000",
      buyer: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    },
    {
      __typename: "MarketplaceSaleHistory",
      type: "BuyItem",
      txTime: "1667657140",
      seller: "0x891d324f205d919ebdf5b88124db9f491c3bc6b1",
      price: "98000000000000000",
      buyer: "0xcbe3a6b073d1460cc642fc686769a2eb6af32fa7",
    },
  ];

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
              {user?.display_name}
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
                  account_address: nftOwnerAddress,
                },
              }}
              className={nameBoxZValue}
            >
              {nftOwner?.display_name}
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
      {/* <NFTHistory prices={data?.priceHistory} /> */}
      <NFTHistory prices={dummyData} />
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
