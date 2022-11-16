// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import { useInView } from "react-intersection-observer";

// App imports
import NFTCard from "@/components/nft.card";
import { NFT } from "@/store/explore.store";
import { HotNftEmptyIcon } from "@/assets/svgs";
import { LoadingState } from "@/models/common";
import NftsSkeleton from "@/components/loading.skeletons/nfts";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import CategoryDropdown from "./category.dropdown";
import SortByDropdown from "./sortby.dropdown";

// Current directory imports

interface ExploreProps {
  allNFTs: NFT[];
  loadingAllNFTs: LoadingState;
}

export const Explore: React.FC<ExploreProps> = ({
  allNFTs,
  loadingAllNFTs,
}) => {
  const categoryDropdownOpenerRef = React.useRef<HTMLButtonElement>(null);
  const sortByDropdownOpenerRef = React.useRef<HTMLButtonElement>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortByOpen, setSortByOpen] = useState(false);

  return (
    <div className={pageWrapper}>
      <div className={nameButtonWrapper}>
        <div className={sectionName}>All NFTs</div>
        <div className={sectionNameStyle}>
          <div className="relative">
            <button
              ref={categoryDropdownOpenerRef}
              className={allButtonWrapper}
              onClick={() => setCategoryOpen((prev) => !prev)}
            >
              <span className="text-gray-shade-7 text-sm font-semibold">
                Category
              </span>{" "}
              {categoryOpen ? (
                <HiChevronUp className="text-2xl" />
              ) : (
                <HiChevronDown className="text-2xl" />
              )}
            </button>
            <CategoryDropdown
              isOpen={categoryOpen}
              onClose={() => setCategoryOpen(false)}
              openerRef={categoryDropdownOpenerRef}
            />
          </div>
          <div className="relative">
            <button
              ref={sortByDropdownOpenerRef}
              className={allButtonWrapper}
              onClick={() => setSortByOpen((prev) => !prev)}
            >
              <span className="text-gray-shade-7 text-sm font-semibold">
                Sort by
              </span>{" "}
              {sortByOpen ? (
                <HiChevronUp className="text-2xl" />
              ) : (
                <HiChevronDown className="text-2xl" />
              )}
            </button>
            <SortByDropdown
              isOpen={sortByOpen}
              onClose={() => setSortByOpen(false)}
              openerRef={categoryDropdownOpenerRef}
            />
          </div>
        </div>
      </div>

      {allNFTs.length > 0 && (
        <div className="nftCardContainer">
          {allNFTs.map((nft) => (
            <NFTCard data={nft} key={nft.id} />
          ))}
        </div>
      )}

      {(loadingAllNFTs === "loading" || loadingAllNFTs === "idle") && (
        <div className="flex flex-wrap gap-10 items-center">
          {/* we are showing 12 skeletons while reloading the page to users */}
          <NftsSkeleton />
          <NftsSkeleton />
          <NftsSkeleton />
          <NftsSkeleton />
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

      {loadingAllNFTs !== "loaded" && (
        <>
          <div className="flex justify-center items-center text-white">
            <HotNftEmptyIcon />
          </div>
          <div className="flex justify-center items-center font-semibold text-[16px] text-white">
            No NFTs found yet
          </div>
        </>
      )}
    </div>
  );
};

const pageWrapper = ctl(`flex flex-col gap-8`);

const nameButtonWrapper = ctl(
  `flex md:flex-row sm:flex-col md:items-center justify-between md:gap-10 sm:gap-5`
);

const sectionName = ctl(`animationTextHeading`);

const sectionNameStyle = ctl(`flex gap-2 items-center`);

const allButtonWrapper = ctl(
  `flex items-center gap-7 justify-center py-3 text-white bg-gray-shade-3 w-[186px] min-w-fit px-6 rounded-xl text-center border border-gray-shade-12`
);
