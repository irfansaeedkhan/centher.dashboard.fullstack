// React, Next, NPM Packages
import React, { useEffect, useState } from "react";
import ctl from "@netlify/classnames-template-literals";

// App imports
import NFTCard from "@/components/nft.card";
import { NFT } from "@/models/nft";
import { HotNftEmptyIcon } from "@/assets/svgs";
import { LoadingState } from "@/models/common";
import NftsSkeleton from "@/components/loading.skeletons/nfts";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import SortByDropdown from "./sortby.dropdown";

// Current directory imports

interface ExploreProps {
  allNFTs: NFT[];
  loading: LoadingState;
}

export const Explore: React.FC<ExploreProps> = ({ allNFTs, loading }) => {
  const sortByDropdownOpenerRef = React.useRef<HTMLButtonElement>(null);
  const [sortByOpen, setSortByOpen] = useState(false);

  return (
    <div className={pageWrapper}>
      <div className={nameButtonWrapper}>
        <div className={sectionName}>All NFTs</div>
        <div className={sectionNameStyle}>
          <div className="relative">
            <button
              ref={sortByDropdownOpenerRef}
              className={allButtonWrapper}
              onClick={() => setSortByOpen((prev: any) => !prev)}
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
              openerRef={sortByDropdownOpenerRef}
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

      {(loading === "loading" || loading === "idle") && (
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

      {loading !== "loaded" && (
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
