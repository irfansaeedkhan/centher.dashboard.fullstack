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
    if (loadingCollections === "loaded" && collections) {
      setDisplayNFTs([...collections]);
    }
  }, [loadingCollections, collections]);

  return (
    <>
      {displayNFTs.length > 0 && (
        <div
          className={clsx(
            ` grid gap-2  `,
            displayNFTs.length > 2
              ? "grid-cols-[repeat(auto-fit,_minmax(104px,_1fr))]  [@media(min-width:768px)]:grid-cols-[repeat(auto-fit,_minmax(260px,_1fr))]"
              : "grid-cols-[1fr,1fr,1fr] [@media(min-width:768px)]:grid-cols-[1fr,1fr] [@media(min-width:1440px)]:grid-cols-[1fr,1fr,1fr]"
          )}
        >
          {displayNFTs.map((collection) => (
            <NFTCollectionImageCard data={collection} key={collection.id} />
          ))}
        </div>
      )}
      {loadingCollections === "loaded" &&
        collections &&
        collections.length === 0 && (
          <>
            <div className="flex items-center justify-center text-white">
              <HotNftEmptyIcon />
            </div>
            <div className="flex items-center justify-center text-[16px] font-semibold text-white">
              No NFTs found yet
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
