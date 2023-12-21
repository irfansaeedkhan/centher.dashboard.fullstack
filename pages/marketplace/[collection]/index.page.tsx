import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useShallow } from "zustand/react/shallow";
import { NextPageWithLayout } from "@/pages/_app.page";
import { useCollectionStore } from "@/store/collection.store";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { CollectionHeader } from "./_components/collection-header";
import { CollectionNfts } from "./_components/collection-nfts";

const Collection: NextPageWithLayout = () => {
  const router = useRouter();
  const {
    collection,
    collectionAdditionalInfo,
    nfts,
    offset,
    filter,
    orderDir,
    loadingCollection,
    loadingNfts,
  } = useCollectionStore(
    useShallow((state) => ({
      collection: state.collection,
      collectionAdditionalInfo: state.collectionAdditionalInfo,
      nfts: state.nfts,
      offset: state.offset,
      filter: state.filter,
      orderDir: state.orderDir,
      loadingCollection: state.loadingCollection,
      loadingNfts: state.loadingNfts,
    }))
  );
  const {
    fetchCollection,
    fetchCollectionAdditionalInfo,
    fetchNFTs,
    updateFilter,
    updateOrderDir,
    updateOffset,
    resetStore,
  } = useCollectionStore(useShallow((state) => state.actions));

  useEffect(() => {
    if (router.query.collection) {
      resetStore(router.query.collection.toString(), "loading", "loading");
      fetchCollection().then(() => {
        fetchCollectionAdditionalInfo();
      });
      fetchNFTs();
    }
    return () => {
      resetStore("", "idle", "idle");
    };
  }, [
    router.query.collection,
    fetchNFTs,
    fetchCollection,
    fetchCollectionAdditionalInfo,
    resetStore,
  ]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1144px] bg-black-shade-3 pb-10 font-monto">
      <div className="flex flex-col gap-5">
        {/* Collection Header */}
        <CollectionHeader
          collection={collection}
          collectionAdditionalInfo={collectionAdditionalInfo}
          loadingCollection={loadingCollection}
        />

        {/* NFTs Section */}
        <CollectionNfts
          nfts={nfts}
          loadingNfts={loadingNfts}
          offset={offset}
          filter={filter}
          orderDir={orderDir}
          fetchNFTs={fetchNFTs}
          updateOffset={updateOffset}
          updateFilter={updateFilter}
          updateOrderDir={updateOrderDir}
        />
      </div>
    </div>
  );
};

Collection.getLayout = (page) => (
  <AllPagesWrapper pageTitle="NFT Collection">{page}</AllPagesWrapper>
);

export default Collection;
