import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import ctl from "@netlify/classnames-template-literals";
import toast from "react-hot-toast";
import clsx from "clsx";
import { useOnClickOutside } from "usehooks-ts";
import { TwitterShareButton, FacebookShareButton } from "react-share";
import { useInView } from "react-intersection-observer";
import { TiSocialFacebook, TiSocialTwitter } from "react-icons/ti";
import { RiShareForwardLine } from "react-icons/ri";
import { TbWorld } from "react-icons/tb";

import { NextPageWithLayout } from "@/pages/_app.page";
import { Filter, useCollectionStore } from "@/store/collection.store";
import { useBNBPrice } from "@/hooks/use.get.bnb.price";
import useGetUser from "@/hooks/use.get.user";
import { AppRoutes } from "@/constants/app.routes";
import { useVerificationTick } from "@/web3/hooks/use.verification.tick";
import { formatBNB2USD, formatIPFSUrl } from "@/utils/format.address";
import { copyText } from "@/utils/copy.text";
import { sliceDisplayName } from "@/utils/user.helpers/slice.display.name";

import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import Button from "@/components/button";
import NftCollectionProfileSkeleton from "@/components/loading.skeletons/nft.collection.profile";
import NftsSkeleton from "@/components/loading.skeletons/nfts";
import { NFTCard } from "@/components/nft.card";

import {
  DotsIcon,
  FacebookCircleIcon,
  CopyIcon,
  TwitterSvg,
  HotNftEmptyIcon,
} from "@/assets/svgs";

const Collection: NextPageWithLayout = () => {
  const router = useRouter();
  const collection = router.query.collection;
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const [filterInView, setFilter] = useState<Filter>("All");
  const menuRef = React.useRef<HTMLDivElement>(null);

  const bnbPrice = useBNBPrice();
  const shareUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${router.asPath}`;
    }
    return "";
  }, [router.asPath]);

  // Copy collection url to clipboard
  const copyShareUrl = async () => {
    await copyText(shareUrl);
    toast.success("Collection link copied");
  };

  const {
    info,
    nfts,
    fetchCollectionInfo,
    fetchNFTs,
    offset,
    updateOffset,
    filter,
    updateFilter,
    limit,
    loadingCollectionInfo,
    loadingNFTs,
  } = useCollectionStore((state) => ({
    info: state.info,
    nfts: state.nfts,
    fetchCollectionInfo: state.fetchCollectionInfo,
    fetchNFTs: state.fetchNFTs,
    offset: state.offset,
    updateOffset: state.updateOffset,
    filter: state.filter,
    updateFilter: state.updateFilter,
    limit: state.limit,
    loadingCollectionInfo: state.loadingCollectionInfo,
    loadingNFTs: state.loadingNFTs,
  }));

  const { user } = useGetUser(info?.creator);
  const [metadata, setMetadata] = useState<any>();
  const [orderdir, setOrderDir] = useState("desc");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const verificationTick = useVerificationTick(user);
  useEffect(() => {
    const fetchMetadata = async (ipfs: string) => {
      try {
        const _metadata = await axios.get(formatIPFSUrl(ipfs));
        setMetadata(_metadata.data);
        setCoverImageUrl(formatIPFSUrl(_metadata.data.coverIPFSHash));
        setProfileImageUrl(formatIPFSUrl(_metadata.data.profileIPFSHash));
      } catch (error) {}
    };
    if (info && info.ipfs) {
      fetchMetadata(info.ipfs);
    }
  }, [info]);
  const [lastNotiRef, _lastNotiInView, lastNotiEntry] = useInView();

  useEffect(() => {
    if (lastNotiEntry?.isIntersecting) {
      updateOffset();
    }
  }, [lastNotiRef, lastNotiEntry, updateOffset]);

  useEffect(() => {
    updateFilter(filterInView);
  }, [filterInView, updateFilter]);

  useEffect(() => {
    if (collection) {
      fetchNFTs(collection as string, filter, orderdir, offset, limit);
    }
  }, [collection, fetchNFTs, filter, limit, offset, orderdir]);

  useEffect(() => {
    if (collection) {
      fetchCollectionInfo(collection as string);
    }
  }, [collection, fetchCollectionInfo]);

  useOnClickOutside(menuRef, () => {
    setIsMenuVisible(false);
    setIsMobileMenuVisible(false);
  });
  const toggleMenu = async () => {
    setIsMenuVisible((prev) => !prev);
  };
  const toggleMobileMenu = async () => {
    setIsMobileMenuVisible((prev) => !prev);
  };

  return (
    <div className={dashboardContentContainer}>
      <div className={MainContentContainer}>
        {loadingCollectionInfo === "loading" ||
        loadingCollectionInfo === "idle" ? (
          <NftCollectionProfileSkeleton />
        ) : (
          <div className={coverCard}>
            <div
              className={`relative h-[31vh] w-full rounded-t-2xl border-b border-gray-shade-5`}
            >
              {metadata && metadata.coverIPFSHash && (
                <Image
                  src={coverImageUrl}
                  alt={metadata.name}
                  fill
                  className="rounded-t-2xl object-cover"
                  onError={() =>
                    setCoverImageUrl("/images/placeholder-rectangle.svg")
                  }
                />
              )}

              <div className={shareBtn}>
                <div ref={menuRef} className={`relative`}>
                  <div className="flex items-center justify-center gap-5">
                    {(metadata?.facebook ||
                      metadata?.twitter ||
                      metadata?.yoursite) && (
                      <div className="hidden h-[44px] w-[100px] items-center justify-center rounded-10px !bg-[#17171A]/30 fsm:flex">
                        <div className="flex items-center justify-center gap-3">
                          {metadata.facebook && (
                            <a
                              href={metadata.facebook}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <TiSocialFacebook className="text-lg text-white hover:text-brand-primary" />
                            </a>
                          )}

                          {metadata.twitter && (
                            <a
                              href={metadata.twitter}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <TiSocialTwitter className=" text-lg text-white hover:text-brand-primary" />
                            </a>
                          )}

                          {metadata.yoursite && (
                            <a
                              href={metadata.yoursite}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <TbWorld className="text-lg text-white hover:text-brand-primary" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      className={clsx(`hidden fsm:flex`, threeDotsBtn)}
                      onClick={toggleMenu}
                    >
                      <RiShareForwardLine className="h-[17px] w-[20px]   [&>*]:fill-white [&>*]:stroke-white" />
                    </button>
                    <button
                      className={clsx(`flex fsm:hidden`, threeDotsBtn)}
                      onClick={toggleMobileMenu}
                    >
                      <DotsIcon className=" [&>*]:fill-white [&>*]:stroke-white" />
                    </button>
                    <div
                      className={clsx(
                        `absolute right-0 top-10 w-[229px] overflow-hidden rounded-10px bg-black-shade-12 shadow-sm`,
                        isMenuVisible ? "z-40 block" : "hidden"
                      )}
                    >
                      <button onClick={copyShareUrl} className={menuButton}>
                        <CopyIcon className={icon} /> Copy Link
                      </button>

                      <FacebookShareButton url={shareUrl} className="w-full">
                        <span className={menuButton}>
                          <FacebookCircleIcon className={icon} /> Share on
                          Facebook
                        </span>
                      </FacebookShareButton>

                      <TwitterShareButton url={shareUrl} className="w-full">
                        <span className={menuButton}>
                          <TwitterSvg className={icon} /> Share on Twitter
                        </span>
                      </TwitterShareButton>
                    </div>
                    <div
                      className={clsx(
                        `absolute right-0 top-10 w-[229px] overflow-hidden rounded-10px bg-black-shade-12 shadow-sm`,
                        isMobileMenuVisible ? "z-40 block" : "hidden"
                      )}
                    >
                      {metadata?.facebook && (
                        <a
                          href={metadata.facebook}
                          target="_blank"
                          rel="noreferrer"
                          className={menuButton}
                        >
                          <TiSocialFacebook className={icon} /> Facebook Link
                        </a>
                      )}
                      {metadata?.twitter && (
                        <a
                          href={metadata.twitter}
                          target="_blank"
                          rel="noreferrer"
                          className={menuButton}
                        >
                          <TiSocialTwitter className={icon} /> Twitter Link
                        </a>
                      )}
                      {metadata?.yoursite && (
                        <a
                          href={metadata.yoursite}
                          target="_blank"
                          rel="noreferrer"
                          className={menuButton}
                        >
                          <TbWorld className={`h-[24px] w-[24px]`} /> Website
                          Link
                        </a>
                      )}

                      <button onClick={copyShareUrl} className={menuButton}>
                        <CopyIcon className={icon} /> Copy Link
                      </button>

                      <FacebookShareButton url={shareUrl} className="w-full">
                        <span className={menuButton}>
                          <FacebookCircleIcon className={icon} /> Share on
                          Facebook
                        </span>
                      </FacebookShareButton>

                      <TwitterShareButton url={shareUrl} className="w-full">
                        <span className={menuButton}>
                          <TwitterSvg className={icon} /> Share on Twitter
                        </span>
                      </TwitterShareButton>
                    </div>
                  </div>
                </div>
              </div>

              {metadata && metadata.profileIPFSHash && (
                <div className={profileImage}>
                  <Image
                    src={profileImageUrl}
                    alt={"profile image"}
                    width={112}
                    height={112}
                    className={collectionProfileImage}
                    sizes={"512px"}
                    onError={() =>
                      setProfileImageUrl("/images/placeholder-square.svg")
                    }
                  />
                </div>
              )}
            </div>
            <div className={coverDetails}>
              <div className={topDetais}>
                <div className="w-full">
                  <h5 className={collectionName}>{metadata?.name}</h5>
                  <div className="lg:flex-start mt-1 flex justify-center gap-1 text-left md:items-center lg:justify-start">
                    <h6 className="text-14px min-w-max text-white">
                      Created by
                    </h6>
                    <Link
                      href={{
                        pathname: AppRoutes.profile.nfts,
                        query: {
                          account_address: info?.creator,
                        },
                      }}
                      className={clsx(
                        `text-14px ml-1 flex max-w-[calc(100vw-140px)] items-center font-semibold  text-gray-shade-18 hover:text-brand-primary`
                      )}
                      title={user?.display_name}
                    >
                      <span className="block truncate break-words">
                        {user && sliceDisplayName(user?.display_name)}
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
                  </div>
                </div>
                <div className={detailsCard}>
                  <div className="text-center">
                    <h4 className={detailsCardTitle}>Items</h4>
                    <h5 className={detailsCardValue}>{info?.totalSupply}</h5>
                  </div>
                  {/* <div className="text-center">
                  <h4 className={detailsCardTitle}>Owner</h4>
                  <h5 className={detailsCardValue}>2.1k</h5>
                </div>
                <div className="text-center">
                  <h4 className={detailsCardTitle}>Floor Price</h4>
                  <h5 className={detailsCardValue}>$108.56</h5>
                </div> */}
                  {/* <div className="text-center">
                  <h4 className={detailsCardTitle}>Market Price</h4>
                  <h5 className={detailsCardValue}>${info?.tradingVolumn}</h5>
                </div> */}
                  <div className="text-center">
                    <h4 className={detailsCardTitle}>Total Volume</h4>
                    <h5 className={detailsCardValue}>
                      $
                      {info?.tradingVolumn
                        ? formatBNB2USD(info?.tradingVolumn, bnbPrice)
                        : 0}
                    </h5>
                  </div>
                </div>
              </div>
              <div className={`mt-6 mb-4`}>
                <p className={profileDescription}>{metadata?.description}</p>
              </div>
            </div>
          </div>
        )}
        {/* nft tabs */}
        <div className="mt-6">
          <div className={tabsContainer}>
            <div className={title}>NFTS</div>
            <div className={buttonList}>
              <div className="flex w-full max-w-[640px] flex-row  items-center justify-center gap-3 fsm:justify-end fsm:gap-5">
                <Button
                  title={"All"}
                  variant={filter === "All" ? "v1" : "v2"}
                  className="py-2 px-4  fsm:max-w-fit fsm:py-4"
                  onClick={() => {
                    setFilter("All");
                  }}
                />
                <Button
                  title={"Listed For Sale"}
                  variant={filter === "List" ? "v1" : "v2"}
                  className="py-2 px-4 fsm:max-w-fit fsm:py-4"
                  onClick={() => {
                    setFilter("List");
                  }}
                />
              </div>
              <select
                className={inputField}
                value={orderdir}
                onChange={(e) => setOrderDir(e.target.value)}
              >
                <option value="asc">Low to high</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
          </div>
          <div className="tabsContent mt-10">
            {nfts.length > 0 && (
              <div className={`${nftCardWrapper} nftCardContainer`}>
                {nfts.map((data) => {
                  return <NFTCard data={data} key={data.id} />;
                })}
              </div>
            )}
            <div ref={lastNotiRef} />

            {(loadingNFTs === "loading" || loadingNFTs === "idle") && (
              <div className="flex flex-wrap items-center gap-10">
                <NftsSkeleton />
                <NftsSkeleton />
                <NftsSkeleton />
              </div>
            )}

            {loadingNFTs === "loaded" && nfts.length === 0 && (
              <div>
                <div className="mt-[48px] flex justify-center">
                  <HotNftEmptyIcon />
                </div>
                <div className="mt-6 flex justify-center text-xs font-semibold text-white">
                  <p>No Nfts found yet!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Collection.getLayout = (page) => (
  <AllPagesWrapper pageTitle="NFT Collection">{page}</AllPagesWrapper>
);

export default Collection;

// styling
const dashboardContentContainer = ctl(`
  bg-black-shade-3 w-full max-w-[1144px] min-h-screen font-monto mx-auto pb-10
`);
const title = ctl(`
  textGradient leading-[42px] animationTextHeading lg:text-[24px] sm:text-xl
`);
const MainContentContainer = ctl(`
flex flex-col gap-5
`);
const coverCard = ctl(`
bg-background-shade-3 rounded-xl
`);
const profileImage = ctl(`
 h-[112px] !w-[112px] cursor-pointer absolute translate-x-[-50%] left-[50%] lg:left-6 lg:translate-x-[0] -bottom-12
`);
const coverDetails = ctl(`
mt-8 lg:mt-6 px-7 pt-7 pb-2
`);
const topDetais = ctl(`
 flex flex-col items-center justify-center text-center lg:text-left lg:flex-row gap-5 lg:items-baseline lg:justify-between
`);
const collectionName = ctl(`
text-white text-20px font-semibold
`);

const profileDescription = ctl(`
text-14px font-normal leading-6 text-gray-shade-16
`);
const collectionProfileImage = ctl(`
 h-[112px] w-[112px] object-cover border-2 border-background-shade-3 rounded-full bg-black-shade-7 
`);
const menuButton = ctl(
  `w-full text-14px font-semibold text-white  flex items-center gap-3 px-5 py-4 transition hover:bg-[#1f1f1f]`
);
const icon = ctl(`w-[24px] h-[24px] [&>*]:stroke-white`);
const threeDotsBtn = ctl(`
w-[44px] h-[44px] !bg-[#17171A]/30 flex items-center justify-center rounded-10px `);

const inputField = ctl(`
  w-full 
  
  fsm:py-3 
  fsm:px-10 
  bg-black-shade-7 
  text-white 
  rounded-lg
  border-0
  focus:outline-none 
  focus:ring-brand-primary
  fsm:max-w-max
`);
const nftCardWrapper = ctl(
  `mx-auto grid fsm:w-max fsm:grid-cols-[minmax(0,235px)_minmax(0,235px)] fmd:grid-cols-[minmax(0,255px)_minmax(0,255px)]  fmd:grid-cols-[minmax(0,235px)_minmax(0,235px)_minmax(0,235px)] flg:grid-cols-[minmax(0,310px)_minmax(0,310px)_minmax(0,310px)] flg:gap-x-6 f2xl:grid-cols-[minmax(0,267px)_minmax(0,267px)_minmax(0,267px)_minmax(0,267px)] f2xl:gap-x-6`
);
const shareBtn = ctl(`
text-14px absolute right-6 bottom-4
`);
const detailsCard = ctl(`
min-w-max flex flex-row flex-wrap w-full items-center justify-center gap-5 fsm:gap-8 fsm:w-auto  bg-gray-shade-9 border-2 border-gray-shade-3 rounded-2xl  px-7 py-4 max-w-fit
`);
const detailsCardTitle = ctl(`
text-12px font-semibold text-gray-shade-7 mb-2
`);
const detailsCardValue = ctl(`
text-14px font-semibold text-white
`);
const tabsContainer = ctl(`
flex gap-5 flex-col fsm:flex-row justify-between items-center
`);
const buttonList = ctl(`
w-full max-w-[640px] flex justify-center flex-col fsm:flex-row items-center gap-3 fsm:gap-5 fsm:justify-end
`);
