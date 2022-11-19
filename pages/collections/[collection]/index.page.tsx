// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ctl from "@netlify/classnames-template-literals";
import Image from "next/image";
import { useOnClickOutside } from "usehooks-ts";
import clsx from "clsx";

// App imports
import {
  DotsIcon,
  FacebookCircleIcon,
  CopyIcon,
  TwitterSvg,
  NftsCollectionEmpty,
} from "@/assets/svgs";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import Button from "@/components/button";
import NFTCard from "@/components/nft.card";
import { useInView } from "react-intersection-observer";
import { Filter, useCollectionStore } from "@/store/collection.store";
import { useRouter } from "next/router";
import axios from "axios";
import { ICollectionData } from "@/pages/nfts/_components/create.collection.form";
import {
  formatAddress,
  formatBNB2USD,
  formatIPFSUrl,
} from "@/utils/format.address";
import { ethers } from "ethers";
import { AppRoutes } from "@/constants/app.routes";
import {useBNBPrice} from "@/hooks/use.get.bnb.price";
import NftCollectionProfileSkeleton from "@/components/loading.skeletons/nft.collection.profile";
import NftsSkeleton from "@/components/loading.skeletons/nfts";
import useGetUser from "@/hooks/use.get.user";

const Collection: NextPageWithLayout = () => {
  const router = useRouter();
  const collection = router.query.collection;
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [filterInView, setFilter] = useState<Filter>("All");
  const menuRef = React.useRef<HTMLDivElement>(null);

  const bnbPrice = useBNBPrice();

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

  useEffect(() => {
    const fetchMetadata = async (ipfs: string) => {
      try {
        console.log("sniper: formatIPFSUrl(ipfs): ", formatIPFSUrl(ipfs))
        const _metadata = await axios.get(formatIPFSUrl(ipfs));
        console.log("sniper: _metadata: ", _metadata)
        setMetadata(_metadata.data);
        // setName(metadata.data.name)
        // setDescription(metadata.data.description)
        // setCollection(metadata.data.collection)
        // setImageUrl(metadata.data.image)
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
  }, [lastNotiEntry, updateOffset]);

  useEffect(() => {
    updateFilter(filterInView)
  }, [filterInView, updateFilter])

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

  useOnClickOutside(menuRef, () => setIsMenuVisible(false));
  const toggleMenu = async () => {
    setIsMenuVisible((prev) => !prev);
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
              className={coverImageContainer}
              style={{
                backgroundImage: `url(${formatIPFSUrl(
                  metadata?.coverIPFSHash
                )})`,
              }}
            >
              <div className={shareBtn}>
                <div ref={menuRef} className={`relative`}>
                  <button className={threeDotsBtn} onClick={toggleMenu}>
                    <DotsIcon className="[&>*]:stroke-white [&>*]:fill-white" />
                  </button>
                  <div
                    className={clsx(
                      `absolute right-0 top-10 rounded-10px bg-black-shade-12 shadow-sm overflow-hidden w-[229px]`,
                      isMenuVisible ? "block z-40" : "hidden"
                    )}
                  >
                    <button className={menuButton}>
                      <FacebookCircleIcon className={icon} /> Share on facebook
                    </button>
                    <button className={menuButton}>
                      <TwitterSvg className={icon} /> Share on twitter
                    </button>

                    <button className={menuButton}>
                      <CopyIcon className={icon} /> Copy link
                    </button>
                  </div>
                </div>
              </div>

              {metadata && metadata.profileIPFSHash && <div className={profileImage}>
                <Image
                  src={formatIPFSUrl(metadata?.profileIPFSHash)}
                  alt={"profile image"}
                  width={112}
                  height={112}
                  className={collectionProfileImage}
                  sizes={"512px"}
                />
              </div>}
            </div>
            <div className={coverDetails}>
              <div className={topDetais}>
                <div>
                  <h5 className={collectionName}>{metadata?.name}</h5>
                  <Link
                    href={{
                      pathname: AppRoutes.profile.nfts,
                      query: {
                        account_address: info?.creator,
                      },
                    }}
                    className="text-gray-shade-18 text-14px font-semibold"
                  >
                    Created by {user?.display_name}
                  </Link>
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
                    <h4 className={detailsCardTitle}>Total Volum</h4>
                    <h5 className={detailsCardValue}>
                      $
                      {info?.tradingVolumn
                        ? formatBNB2USD(info?.tradingVolumn, bnbPrice)
                        : 0}
                    </h5>
                  </div>
                </div>
              </div>
              <div className={textContent}>
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
              <Button
                title={"All"}
                variant={filter === "All" ? "v1" : "v2"}
                className="py-4"
                onClick={() => {
                  setFilter("All");
                }}
              />
              <Button
                title={"Buy now"}
                variant={filter === "List" ? "v1" : "v2"}
                className="py-4"
                onClick={() => {
                  setFilter("List");
                }}
              />
              <Button
                title={"Auction"}
                variant={filter === "Auction" ? "v1" : "v2"}
                className="py-4"
                onClick={() => {
                  setFilter("Auction");
                }}
              />
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

            {(loadingNFTs === "loading" || loadingNFTs === "idle") && (
              <div className="flex flex-wrap gap-10 items-center">
                {/* we are showing 8 skeletons while reloading the page to users */}
                <NftsSkeleton />
                <NftsSkeleton />
                <NftsSkeleton />
                <NftsSkeleton />
                <NftsSkeleton />
                <NftsSkeleton />
                <NftsSkeleton />
                <NftsSkeleton />
              </div>
            )}

            {loadingNFTs === "loaded" && nfts.length === 0 && (
              <NftsCollectionEmpty />
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
  textGradient leading-[42px]  animationTextHeading lg:text-[34px] sm:text-2xl 
`);
const MainContentContainer = ctl(`
flex flex-col gap-5
`);
const coverCard = ctl(`
bg-background-shade-3 rounded-xl
`);
const coverImageContainer = ctl(`
coverImageContainer relative rounded-2xl bg-center bg-cover bg-no-repeat w-full h-[31vh] bg-[url('/images/coverImage.png')]
`);
const profileImage = ctl(`
cursor-pointer absolute left-6 -bottom-12
`);
const coverDetails = ctl(`
mt-8 lg:mt-10 px-7 pt-7 pb-2
`);
const topDetais = ctl(`
 flex flex-col lg:flex-row gap-5 items-baseline justify-between
`);
const collectionName = ctl(`
text-white text-20px font-semibold
`);
const textContent = ctl(`
mt-6
`);
const profileDescription = ctl(`
text-16px font-normal leading-6 text-gray-shade-16
`);
const collectionProfileImage = ctl(`
rounded-xl h-[112px] w-[112px] object-cover border-2 border-background-shade-3
`);
const menuButton = ctl(
  `w-full text-14px font-semibold text-white  flex items-center gap-3 px-5 py-4 transition hover:bg-[#1f1f1f]`
);
const icon = ctl(`w-[24px] h-[24px] [&>*]:stroke-white`);
const threeDotsBtn = ctl(`
w-[44px] h-[44px] !bg-[#17171A]/30 flex items-center justify-center rounded-10px `);
const inputField = ctl(`
  w-full 
  py-3 
  px-5 
  bg-black-shade-7 
  text-white 
  rounded-lg
  border-0
  focus:outline-none 
  focus:ring-brand-primary
`);
const nftCardWrapper = ctl(``);
const shareBtn = ctl(`
text-14px absolute right-6 bottom-4
`);
const detailsCard = ctl(`
flex flex-col sm:flex-row w-full items-center justify-center gap-8 sm:w-auto max-w-[578px]  bg-gray-shade-9 border-2 border-gray-shade-3 rounded-2xl px-7 py-4
`);
const detailsCardTitle = ctl(`
text-12px font-semibold text-gray-shade-7 mb-2
`);
const detailsCardValue = ctl(`
text-14px font-semibold text-white
`);
const tabsContainer = ctl(`
flex gap-5 flex-col sm:flex-row justify-between items-center
`);
const buttonList = ctl(`
w-full max-w-[640px] flex flex-col sm:flex-row items-center gap-5
`);
