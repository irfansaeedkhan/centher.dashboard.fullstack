// React, Next, NPM Packages
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";

import { NFT } from "@/models/nft";
import { useProfileNFTStore } from "@/store/profile.nft.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { NFTImageCard } from "@/components/nft.image.card";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { HotNftEmptyIcon } from "@/assets/svgs";

import { ProfilePageWrapper } from "../_components";
import Link from "next/link";
import { AppRoutes } from "@/constants/app.routes";
import { ProfileNFTCollectionTabs } from "../_components/profile.nft.collection.tabs";
import ProfileNftsLayout from "@/layouts/profile.nfts.layout";

const NFTCollection: NextPageWithLayout = () => {
  const router = useRouter();
  const account = useMemo(() => {
    return router.query.account_address as string;
  }, [router.query.account_address]);
  const {
    ownedNFTs,
    fetchOwnedNFTs,
    loadingOwnedNFTs,
    listedNFTs,
    fetchListedNFTs,
    loadingListedNFTs,
  } = useProfileNFTStore((state) => ({
    ownedNFTs: state.ownedNfts,
    fetchOwnedNFTs: state.fetchOwnedNFTs,
    loadingOwnedNFTs: state.loadingOwnedNFTs,
    listedNFTs: state.listedNfts,
    fetchListedNFTs: state.fetchListedNFTs,
    loadingListedNFTs: state.loadingListedNFTs,
  }));
  useEffect(() => {
    if (account) {
      fetchOwnedNFTs(account);
    }
  }, [account, fetchOwnedNFTs]);

  useEffect(() => {
    if (account) {
      fetchListedNFTs(account, 0, 1000);
    }
  }, [account, fetchListedNFTs]);

  const [displayNFTs, setDisplayNFTs] = useState<NFT[]>([]);

  useEffect(() => {
    if (loadingListedNFTs === "loaded" && loadingOwnedNFTs === "loaded") {
      setDisplayNFTs([...listedNFTs, ...ownedNFTs]);
    }
  }, [loadingOwnedNFTs, loadingListedNFTs, listedNFTs, ownedNFTs]);

  return (
    <>
      {/* {displayNFTs.length > 0 && (
        <div
          className={clsx(
            ` grid gap-2  `,
            displayNFTs.length > 2
              ? "grid-cols-[repeat(auto-fit,_minmax(104px,_1fr))]  [@media(min-width:768px)]:grid-cols-[repeat(auto-fit,_minmax(260px,_1fr))]"
              : "grid-cols-[1fr,1fr,1fr] [@media(min-width:768px)]:grid-cols-[1fr,1fr] [@media(min-width:1440px)]:grid-cols-[1fr,1fr,1fr]"
          )}
        >
          {displayNFTs.map((nft: any) => (
            <NFTImageCard data={nft} key={nft.id} />
          ))}
        </div>
      )}
      {loadingOwnedNFTs === "loaded" &&
        loadingListedNFTs === "loaded" &&
        listedNFTs.length === 0 &&
        ownedNFTs.length === 0 && (
          <>
            <div className="flex items-center justify-center text-white">
              <HotNftEmptyIcon />
            </div>
            <div className="flex items-center justify-center text-[16px] font-semibold text-white">
              No NFTs found yet
            </div>
          </>
        )} */}
    </>
  );
};

NFTCollection.getLayout = (page) => (
  <ProfileNftsLayout>
    <div>{page}</div>
  </ProfileNftsLayout>
);

export default NFTCollection;
