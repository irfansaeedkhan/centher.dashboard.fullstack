import React from "react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";
import { useAllCollectionsStore } from "@/store/all.collections.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { CollectionCard } from "@/components/collection.card";
import NftCollectionSkeleton from "@/components/loading.skeletons/nft.collection.skeleton";
import { NftsCollectionEmpty } from "@/assets/svgs";
import { SectionTitle } from "../_components";

const AllNFTCollection: NextPageWithLayout = () => {
  const [lastCollectionRef, _lastCollectionInView, lastCollectionEntry] =
    useInView();

  const { collections, offset, updateOffset, fetchCollections, loading } =
    useAllCollectionsStore((state) => ({
      collections: state.collections,
      offset: state.offset,
      fetchCollections: state.fetchCollections,
      loading: state.loading,
      updateOffset: state.updateOffset,
    }));

  useEffect(() => {
    if (lastCollectionEntry?.isIntersecting) {
      updateOffset();
    }
  }, [lastCollectionRef, lastCollectionEntry, updateOffset]);

  useEffect(() => {
    if (offset > 0) {
      fetchCollections();
    }
  }, [offset, fetchCollections]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return (
    <div className={`mx-auto max-w-screen-2xl space-y-4 fsm:space-y-6`}>
      <SectionTitle title="Collections" showViewAll={false} />

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
        {collections.map((collection) => {
          return <CollectionCard data={collection} key={collection.address} />;
        })}

        {(loading === "loading" || loading === "idle") && (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <NftCollectionSkeleton key={index} />
            ))}
          </>
        )}

        <div ref={lastCollectionRef} />
      </div>

      {(loading === "loaded" || loading === "failed") &&
        collections.length === 0 && (
          <>
            <div className="flex items-center justify-center text-white">
              <NftsCollectionEmpty />
            </div>
            <div className="flex items-center justify-center text-[16px] font-semibold text-white">
              No collection found yet
            </div>
          </>
        )}
    </div>
  );
};

AllNFTCollection.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="All Collections">{page}</AllPagesWrapper>;
};

export default AllNFTCollection;
