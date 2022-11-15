// React, Next, NPM Packages
import React, { useEffect } from "react";
import ctl from "@netlify/classnames-template-literals";
// App imports
import NFTCard from "@/components/nft.card";
import { NFT, useExploreStore } from "@/store/explore.store";
import { HotNftEmptyIcon } from "@/assets/svgs";
import { LoadingState } from "@/models/common";

import NftsSkeleton from "@/components/loading.skeletons/nfts";

const MAX_HOT_NFTS = 10;

export const HotNFTs: React.FC = () => {
  const { hotNFTs, fetchHotNFTs, loadingHotNFTs } = useExploreStore(
    (state) => ({
      hotNFTs: state.hotNFTs,
      fetchHotNFTs: state.fetchHotNFTs,
      loadingHotNFTs: state.loadingHotNFTs,
    })
  );

  useEffect(() => {
    fetchHotNFTs(0, MAX_HOT_NFTS);
  }, [fetchHotNFTs]);

  return (
    <div className={hotNftPageWrapper}>
      <div className={hotNftAnimation}>Hot NFTs</div>

      {hotNFTs.length > 0 && (
        <div className={`${nftCardWrapper} nftCardContainer`}>
          {hotNFTs.map((nft) => (
            <NFTCard data={nft} key={nft.id} />
          ))}
        </div>
      )}
      {(loadingHotNFTs === "loading" || loadingHotNFTs === "idle") && (
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
