import React from "react";
import clsx from "clsx";
import { SectionTitle } from "@/pages/marketplace/_components";
import NFTsSkeleton from "@/components/loading.skeletons/nfts";
import { NFTCard } from "@/components/nft.card";
import { AppRoutes } from "@/constants/app.routes";
import { HotNftEmptyIcon } from "@/assets/svgs";
import { useHotNFTs } from "./use-hot-nfts";

export const HotNFTs: React.FC = () => {
  const { hotNFTs, loading } = useHotNFTs();

  return (
    <div className={`mx-auto max-w-screen-2xl space-y-4 fsm:space-y-6`}>
      <SectionTitle
        title={"Hot NFTs"}
        showViewAll={true}
        href={AppRoutes.marketplace.nfts}
      />

      <div
        className={clsx(
          `mx-auto grid max-w-max gap-5`,
          `[@media(min-width:1780px)]:grid-cols-[repeat(5,_minmax(280px,_1fr))]`,
          `[@media(min-width:1480px)_and_(max-width:1779px)]:grid-cols-[repeat(4,_minmax(280px,_1fr))]`,
          `[@media(min-width:1280px)_and_(max-width:1479px)]:grid-cols-[repeat(3,_minmax(280px,_1fr))]`,
          `[@media(min-width:1230px)_and_(max-width:1279px)]:grid-cols-[repeat(4,_minmax(280px,_1fr))]`,
          `[@media(min-width:930px)_and_(max-width:1229px)]:grid-cols-[repeat(3,_minmax(280px,_1fr))]`,
          `[@media(min-width:620px)_and_(max-width:929px)]:grid-cols-[repeat(2,_minmax(280px,_1fr))]`,
          `[@media(max-width:619px)]:grid-cols-[repeat(1,_minmax(280px,_1fr))]`
        )}
      >
        {hotNFTs.map((nft) => (
          <NFTCard data={nft} key={nft.id} />
        ))}

        {(loading === "loading" || loading === "idle") && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <NFTsSkeleton key={i} />
            ))}
          </>
        )}
      </div>

      {((loading === "loaded" && hotNFTs.length === 0) ||
        loading === "failed") && (
        <>
          <div className="flex items-center justify-center text-white">
            <HotNftEmptyIcon />
          </div>
          <div className="flex items-center justify-center text-[16px] font-semibold text-white">
            No Hot NFTs Found
          </div>
        </>
      )}
    </div>
  );
};
