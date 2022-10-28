// React, Next, NPM Packages
import React, { useState } from "react";
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
} from "@/assets/svgs";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import Button from "@/components/button";
import NFTCard from "@/components/nft.card";

const Collection: NextPageWithLayout = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [nftList, setNftList] = useState<"All" | "BuyNow" | "Auction">("All");
  const menuRef = React.useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setIsMenuVisible(false));
  const toggleMenu = async () => {
    setIsMenuVisible((prev) => !prev);
  };
  const Data = {
    nftImage: "/images/nft.png",
    nftToken: "MARA Token",
    nftName: "NFT Name",
    nftOwnerName: "nft Owner Name",
    nftOwnerDp: "/images/a1.png",
    nftPriceNether: 32.9,
    nftPriceDollar: 650000,
    TokenIcon: "BNB",
  };
  return (
    <div className={dashboardContentContainer}>
      <div className={MainContentContainer}>
        <div className={coverCard}>
          <div
            className={coverImageContainer}
            style={{
              backgroundImage: "url(/images/collectionNFTCover.png)",
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

            <div className={profileImage}>
              <Image
                src={"/images/collectionNFTProfile.png"}
                alt={"profile image"}
                width={112}
                height={112}
                className={collectionProfileImage}
                sizes={"512px"}
              />
            </div>
          </div>
          <div className={coverDetails}>
            <div className={topDetais}>
              <div>
                <h5 className={collectionName}>Name of Collection</h5>
                <h6 className="text-gray-shade-18 text-14px font-semibold">
                  Created by @John wedson
                </h6>
              </div>
              <div className={detailsCard}>
                <div className="text-center">
                  <h4 className={detailsCardTitle}>Items</h4>
                  <h5 className={detailsCardValue}>10.2k</h5>
                </div>
                <div className="text-center">
                  <h4 className={detailsCardTitle}>Owner</h4>
                  <h5 className={detailsCardValue}>2.1k</h5>
                </div>
                <div className="text-center">
                  <h4 className={detailsCardTitle}>Floor Price</h4>
                  <h5 className={detailsCardValue}>$108.56</h5>
                </div>
                <div className="text-center">
                  <h4 className={detailsCardTitle}>Market Price</h4>
                  <h5 className={detailsCardValue}>$1.56M</h5>
                </div>
                <div className="text-center">
                  <h4 className={detailsCardTitle}>Total Volum</h4>
                  <h5 className={detailsCardValue}>10.56k</h5>
                </div>
              </div>
            </div>
            <div className={textContent}>
              <p className={profileDescription}>
                An NFT is a digital asset that exists completely in the digital
                universe—you can&apos;t touch it, but you can own it. An NFT can
                be any type of digital file: an artwork, an article, music or
                even a meme such as “Disaster Girl”, the original photo of which
                sold for $500k earlier this year.
              </p>
            </div>
          </div>
        </div>
        {/* nft tabs */}
        <div className="mt-6">
          <div className={tabsContainer}>
            <div className={title}>NFTS</div>
            <div className={buttonList}>
              <Button
                title={"All"}
                variant={nftList === "All" ? "v1" : "v2"}
                className="py-4"
                onClick={() => {
                  setNftList("All");
                }}
              />
              <Button
                title={"Buy now"}
                variant={nftList === "BuyNow" ? "v1" : "v2"}
                className="py-4"
                onClick={() => {
                  setNftList("BuyNow");
                }}
              />
              <Button
                title={"Auction"}
                variant={nftList === "Auction" ? "v1" : "v2"}
                className="py-4"
                onClick={() => {
                  setNftList("Auction");
                }}
              />
              <select className={inputField}>
                <option value="Lowtohigh">Low to high</option>
                <option value="Lowtohigh1">Low to high 1</option>
                <option value="Lowtohigh2">Low to high 2</option>
              </select>
            </div>
          </div>
          <div className="tabsContent mt-10">
            {nftList === "All" && (
              <div className={`${nftCardWrapper} nftCardContainer`}>
                <NFTCard
                  nftImage={Data.nftImage}
                  nftToken={Data.nftToken}
                  nftName={Data.nftName}
                  nftOwnerName={Data.nftOwnerName}
                  nftOwnerDp={Data.nftOwnerDp}
                  nftPriceDollar={Data.nftPriceDollar}
                  nftPriceNether={Data.nftPriceNether}
                  TokenIcon={Data.TokenIcon}
                />
              </div>
            )}
            {nftList === "BuyNow" && (
              <div className={`${nftCardWrapper} nftCardContainer`}>
                <NFTCard
                  nftImage={Data.nftImage}
                  nftToken={Data.nftToken}
                  nftName={Data.nftName}
                  nftOwnerName={Data.nftOwnerName}
                  nftOwnerDp={Data.nftOwnerDp}
                  nftPriceDollar={Data.nftPriceDollar}
                  nftPriceNether={Data.nftPriceNether}
                  TokenIcon={Data.TokenIcon}
                />
                <NFTCard
                  nftImage={Data.nftImage}
                  nftToken={Data.nftToken}
                  nftName={Data.nftName}
                  nftOwnerName={Data.nftOwnerName}
                  nftOwnerDp={Data.nftOwnerDp}
                  nftPriceDollar={Data.nftPriceDollar}
                  nftPriceNether={Data.nftPriceNether}
                  TokenIcon={Data.TokenIcon}
                />
                <NFTCard
                  nftImage={Data.nftImage}
                  nftToken={Data.nftToken}
                  nftName={Data.nftName}
                  nftOwnerName={Data.nftOwnerName}
                  nftOwnerDp={Data.nftOwnerDp}
                  nftPriceDollar={Data.nftPriceDollar}
                  nftPriceNether={Data.nftPriceNether}
                  TokenIcon={Data.TokenIcon}
                />
                <NFTCard
                  nftImage={Data.nftImage}
                  nftToken={Data.nftToken}
                  nftName={Data.nftName}
                  nftOwnerName={Data.nftOwnerName}
                  nftOwnerDp={Data.nftOwnerDp}
                  nftPriceDollar={Data.nftPriceDollar}
                  nftPriceNether={Data.nftPriceNether}
                  TokenIcon={Data.TokenIcon}
                />
              </div>
            )}
            {nftList === "Auction" && (
              <div className={`${nftCardWrapper} nftCardContainer`}>
                <NFTCard
                  nftImage={Data.nftImage}
                  nftToken={Data.nftToken}
                  nftName={Data.nftName}
                  nftOwnerName={Data.nftOwnerName}
                  nftOwnerDp={Data.nftOwnerDp}
                  nftPriceDollar={Data.nftPriceDollar}
                  nftPriceNether={Data.nftPriceNether}
                  TokenIcon={Data.TokenIcon}
                />
                <NFTCard
                  nftImage={Data.nftImage}
                  nftToken={Data.nftToken}
                  nftName={Data.nftName}
                  nftOwnerName={Data.nftOwnerName}
                  nftOwnerDp={Data.nftOwnerDp}
                  nftPriceDollar={Data.nftPriceDollar}
                  nftPriceNether={Data.nftPriceNether}
                  TokenIcon={Data.TokenIcon}
                />
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
