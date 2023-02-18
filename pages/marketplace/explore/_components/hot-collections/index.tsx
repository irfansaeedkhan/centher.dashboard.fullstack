import React from "react";
import clsx from "clsx";

import { SectionTitle } from "@/pages/marketplace/_components";
import { CollectionCardV2 } from "@/components/collection.card/collection-card-v2";
import NFTCollectionSkeleton from "@/components/loading.skeletons/nft.collection.skeleton";
import { AppRoutes } from "@/constants/app.routes";
import { NftsCollectionEmpty } from "@/assets/svgs";

import { useHotCollections } from "./use-hot-collections";

export const HotCollections: React.FC = () => {
  const { hotCollections, loading } = useHotCollections();

  return (
    <div className={`mx-auto max-w-screen-2xl space-y-4 fsm:space-y-6`}>
      <SectionTitle
        title={"Collections"}
        showViewAll={true}
        href={AppRoutes.marketplace.collections}
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
        {hotCollections.map((collection) => {
          return (
            <CollectionCardV2 data={collection} key={collection.address} />
          );
        })}
        {(loading === "loading" || loading === "idle") && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <NFTCollectionSkeleton key={i} />
            ))}
          </>
        )}
      </div>

      {((loading === "loaded" && hotCollections.length === 0) ||
        loading === "failed") && (
        <>
          <div className="flex items-center justify-center text-white">
            <NftsCollectionEmpty />
          </div>
          <div
            className={`flex items-center justify-center text-[16px] font-semibold text-white`}
          >
            No collections yet
          </div>
        </>
      )}
    </div>
  );
};
