// React, Next, NPM Packages
import React, { useEffect } from "react";
import Link from "next/link";
import ctl from "@netlify/classnames-template-literals";
// App imports

import { HotNftEmptyIcon } from "@/assets/svgs";

import NftsSkeleton from "@/components/loading.skeletons/nfts";
import { useExploreStore } from "@/store/explore.store";
import { NFTCard } from "@/components/nft.card";
import { AppRoutes } from "@/constants/app.routes";

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
      <div className="flex max-w-[1300px] items-center justify-between">
        <div className={hotNftAnimation}>Hot NFTs</div>
        <Link
          href={{
            pathname: AppRoutes.marketplace.all_nfts,
          }}
          className="block w-[172px] min-w-fit cursor-pointer rounded-xl border border-gray-shade-12 bg-gray-shade-3 py-3 px-4 text-center text-white hover:bg-brand-primary hover:text-black-shade-3"
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

      {loadingHotNFTs === "loaded" && hotNFTs.length === 0 && (
        <>
          <div className="flex items-center justify-center text-white">
            <HotNftEmptyIcon />
          </div>
          <div className="flex items-center justify-center text-[16px] font-semibold text-white">
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
