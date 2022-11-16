import { useEffect, useMemo } from "react";

import { useProfileNFTStore } from "@/store/profile.nft.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { CollectionCard } from "@/components/collection.card";
import { NftsCollectionEmpty } from "@/assets/svgs";

import { ProfilePageWrapper } from "./_components";
import { useRouter } from "next/router";
import NftProfileCollectionSkeleton from "@/components/loading.skeletons/nft.profile.collection";

const NFTProfileCollections: NextPageWithLayout = () => {
  const router = useRouter();
  const account = useMemo(() => {
    return router.query.account_address as string;
  }, [router.query.account_address]);

  const { collections, fetchCollections, loading } = useProfileNFTStore(
    (state) => ({
      collections: state.collections,
      fetchCollections: state.fetchCollections,
      loading: state.loadingCollections,
    })
  );

  useEffect(() => {
    if (account) {
      fetchCollections(account);
    }
  }, [account, fetchCollections]);

  return (
    <>
      {collections && collections.length > 0 && (
        <div className="flex  gap-5 md:flex-wrap lg:flex-nowrap">
          {collections.map((collection) => {
            return <CollectionCard data={collection} key={collection.id} />;
          })}
        </div>
      )}

      {(loading === "loading" || loading === "idle") && (
        <div className="flex flex-wrap gap-10 items-center">
          <NftProfileCollectionSkeleton />
          <NftProfileCollectionSkeleton />
          <NftProfileCollectionSkeleton />
          <NftProfileCollectionSkeleton />
        </div>
      )}

      {loading === "loaded" && collections?.length === 0 && (
        <>
          <div className="flex justify-center items-center text-white">
            <NftsCollectionEmpty />
          </div>
          <div className="flex justify-center items-center font-semibold text-[16px] text-white">
            No collection found yet
          </div>
        </>
      )}
    </>
  );
};

NFTProfileCollections.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Profile">
    <ProfilePageWrapper currentTab="nft-profile">
      <div>{page}</div>
    </ProfilePageWrapper>
  </AllPagesWrapper>
);

export default NFTProfileCollections;
