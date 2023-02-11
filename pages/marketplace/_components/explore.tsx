// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import ctl from "@netlify/classnames-template-literals";
import { useInView } from "react-intersection-observer";

// App imports

import { HotNftEmptyIcon } from "@/assets/svgs";
import { LoadingState } from "@/models/common";
import NftsSkeleton from "@/components/loading.skeletons/nfts";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { Category, NFT, SortBy } from "@/models/nft";
import { useAllNFTsStore } from "@/store/all.nfts.store";
import { NFTCard } from "@/components/nft.card";
import CategoryDropdown from "./category.dropdown";
import SortByDropdown from "./sortby.dropdown";

// Current directory imports

export interface ExploreProps {
  allNFTs: NFT[];
  loading: LoadingState;
  category: Category;
  sortBy: SortBy;
  setCategory: (value: Category) => void;
  setSortBy: (value: SortBy) => void;
}

export const Explore = React.forwardRef<HTMLDivElement, ExploreProps>(
  ({ allNFTs, loading, category, sortBy, setCategory, setSortBy }, ref) => {
    const categoryDropdownOpenerRef = React.useRef<HTMLButtonElement>(null);
    const sortByDropdownOpenerRef = React.useRef<HTMLButtonElement>(null);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [sortByOpen, setSortByOpen] = useState(false);

    // console.log("allNFTs", allNFTs);
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
                <span className="text-sm font-semibold text-gray-shade-7">
                  {category}
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
                onChange={(value: any) => setCategory(value)}
                openerRef={categoryDropdownOpenerRef}
              />
            </div>
            <div className="relative">
              <button
                ref={sortByDropdownOpenerRef}
                className={allButtonWrapper2}
                onClick={() => setSortByOpen((prev) => !prev)}
              >
                <span className="text-sm font-semibold text-gray-shade-7">
                  {sortBy}
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
                onChange={(value: any) => setSortBy(value)}
                openerRef={sortByDropdownOpenerRef}
              />
            </div>
          </div>
        </div>

        {allNFTs.length > 0 && (
          <div className="nftCardContainer h-auto">
            {allNFTs.map((nft) => {
              if (nft.id === allNFTs[allNFTs.length - 1].id) {
                return (
                  <div key={nft.id} ref={ref}>
                    <NFTCard data={nft} />;
                  </div>
                );
              }
              return <NFTCard key={nft.id} data={nft} />;
            })}
          </div>
        )}

        {(loading === "loading" || loading === "idle") && (
          <div className="flex flex-wrap items-center gap-5">
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

        {loading === "loaded" && allNFTs.length === 0 && (
          <>
            <div className="flex items-center justify-center text-white">
              <HotNftEmptyIcon />
            </div>
            <div className="flex items-center justify-center text-[16px] font-semibold text-white">
              No NFTs found yet
            </div>
          </>
        )}
      </div>
    );
  }
);

Explore.displayName = "Explore";

const pageWrapper = ctl(`flex flex-col gap-8`);

const nameButtonWrapper = ctl(
  `flex md:flex-row sm:flex-col md:items-center justify-between md:gap-10 sm:gap-5`
);

const sectionName = ctl(`animationTextHeading`);

const sectionNameStyle = ctl(`flex gap-2 items-center`);

const allButtonWrapper = ctl(
  `flex items-center gap-7 justify-between p-3 text-white bg-gray-shade-3 w-[186px] min-w-fit rounded-xl border border-gray-shade-12`
);
const allButtonWrapper2 = ctl(
  `flex items-center gap-2 justify-between p-3 text-white bg-gray-shade-3 w-[186px] min-w-fit rounded-xl border border-gray-shade-12`
);
