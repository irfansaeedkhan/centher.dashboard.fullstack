// React, Next, NPM Packages
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";

import { Collection } from "@/models/nft";
import { useProfileNFTStore } from "@/store/profile.nft.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { HotNftEmptyIcon } from "@/assets/svgs";
import ProfileNftsLayout from "@/layouts/profile.nfts.layout";
import { NFTCollectionImageCard } from "@/components/nft.collection.image.card";
import { LoadingStatus } from "@/utils/enums/loading.status.enum";

const CollectionNFTS: NextPageWithLayout = () => {
  const router = useRouter();
  const account = useMemo(() => {
    return router.query.account_address as string;
  }, [router.query.account_address]);
  const { collections, fetchCollections, loadingCollections } =
    useProfileNFTStore((state) => ({
      collections: state.collections,
      fetchCollections: state.fetchCollections,
      loadingCollections: state.loadingCollections,
    }));

  useEffect(() => {
    if (account) {
      fetchCollections(account);
    }
  }, [account, fetchCollections]);

  const [displayNFTs, setDisplayNFTs] = useState<Collection[]>([]);

  useEffect(() => {
    if (loadingCollections == LoadingStatus.loaded && collections?.length) {
      setDisplayNFTs([...collections]);
    }
  }, [loadingCollections, collections]);

  return (
    <>
      {loadingCollections == LoadingStatus.loaded && displayNFTs?.length ? (
        <div className={clsx(`grid grid-cols-[1fr,1fr,1fr] gap-2`)}>
          {displayNFTs.map((collection) => (
            <NFTCollectionImageCard data={collection} key={collection.id} />
          ))}
        </div>
      ) : (
        loadingCollections == LoadingStatus.loading && (
          <div className="!h-[104px] !w-full animate-pulse rounded-xl bg-[#3C3F4A] [@media(min-width:768px)]:!h-[275px] [@media(min-width:768px)]:!w-[275px]"></div>
        )
      )}
      {loadingCollections == LoadingStatus.loaded &&
        collections &&
        !collections?.length && (
          <>
            <div className="flex items-center justify-center text-white">
              <HotNftEmptyIcon />
            </div>
            <div className="flex items-center justify-center text-[16px] font-semibold text-white">
              No Collections found yet
            </div>
          </>
        )}
    </>
  );
};

CollectionNFTS.getLayout = (page) => (
  <ProfileNftsLayout>
    <div>{page}</div>
  </ProfileNftsLayout>
);

export default CollectionNFTS;
