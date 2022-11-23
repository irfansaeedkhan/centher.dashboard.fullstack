// React, Next, NPM Packages
import React, { useEffect } from "react";
import Link from "next/link";
import ctl from "@netlify/classnames-template-literals";
// App imports
import NFTCard from "@/components/nft.card";
import { HotNftEmptyIcon } from "@/assets/svgs";

import NftsSkeleton from "@/components/loading.skeletons/nfts";
import { useExploreStore } from "@/store/explore.store";

export const HotNFTs: React.FC = () => {
  const { hotNFTs, fetchHotNFTs, loadingHotNFTs } = useExploreStore(
    (state) => ({
      hotNFTs: state.hotNFTs,
      fetchHotNFTs: state.fetchHotNFTs,
      loadingHotNFTs: state.loadingHotNFTs,
    })
  );

  useEffect(() => {
    fetchHotNFTs();
  }, [fetchHotNFTs]);

  return (
    <div className={hotNftPageWrapper}>
      <div className="flex justify-between items-center max-w-[1300px]">
        <div className={hotNftAnimation}>Hot NFTs</div>
        <Link
          href={"/explore/nfts"}
          className="block py-3 text-white bg-gray-shade-3 w-[172px] min-w-fit px-4 rounded-xl text-center border border-gray-shade-12"
        >
          View All
        </Link>
      </div>

      {hotNFTs.length > 0 && (
        <div className={`${nftCardWrapper} nftCardContainer`}>
          {hotNFTs.map((nft) => (
            <NFTCard data={nft} key={nft.id} />
          ))}
        </div>
      )}
      {(loadingHotNFTs === "loading" || loadingHotNFTs === "idle") && (
        <div className="flex flex-wrap gap-5 items-center">
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

      {loadingHotNFTs === "loaded" && hotNFTs.length === 0 && (
        <>
          <div className="flex justify-center items-center text-white">
            <HotNftEmptyIcon />
          </div>
          <div className="flex justify-center items-center font-semibold text-[16px] text-white">
            No HOT NFTs found yet
          </div>
        </>
      )}
    </div>
  );
};

const hotNftPageWrapper = ctl(`flex flex-col gap-8`);

const hotNftAnimation = ctl(`animationTextHeading`);

// const nftCardWrapper = ctl(`flex gap-10 flex-wrap`);
const nftCardWrapper = ctl(``);
