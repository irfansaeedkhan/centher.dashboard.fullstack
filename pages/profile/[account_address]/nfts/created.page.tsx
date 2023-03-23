// React, Next, NPM Packages
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";

import { NFT } from "@/models/nft";
import { useProfileNFTStore } from "@/store/profile.nft.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { NFTImageCard } from "@/components/nft.image.card";
import { HotNftEmptyIcon } from "@/assets/svgs";
import ProfileNftsLayout from "@/layouts/profile.nfts.layout";
import { LoadingStatus } from "@/utils/enums/loading.status.enum";

const CreatedNFTS: NextPageWithLayout = () => {
  const router = useRouter();
  const account = useMemo(() => {
    return router.query.account_address as string;
  }, [router.query.account_address]);
  const { createdNfts, fetchCreatedNFTs, loadingCreatedNFTs } =
    useProfileNFTStore((state) => ({
      createdNfts: state.createdNfts,
      fetchCreatedNFTs: state.fetchCreatedNFTs,
      loadingCreatedNFTs: state.loadingCreatedNFTs,
    }));

  useEffect(() => {
    if (account) {
      fetchCreatedNFTs(account, 0, 100, true);
    }
  }, [account, fetchCreatedNFTs]);

  const [displayNFTs, setDisplayNFTs] = useState<NFT[]>([]);

  useEffect(() => {
    if (loadingCreatedNFTs == LoadingStatus.loaded) {
      setDisplayNFTs([...createdNfts]);
    }
  }, [loadingCreatedNFTs, createdNfts]);

  return (
    <>
      {loadingCreatedNFTs == LoadingStatus.loaded && displayNFTs?.length ? (
        <div className={clsx(`grid grid-cols-[1fr,1fr,1fr] gap-2`)}>
          {displayNFTs.map((nft) => (
            <NFTImageCard data={nft} key={nft.id} />
          ))}
        </div>
      ) : (
        loadingCreatedNFTs == LoadingStatus.loading && (
          <div className="!h-[104px] !w-full animate-pulse rounded-xl bg-[#3C3F4A] [@media(min-width:768px)]:!h-[275px] [@media(min-width:768px)]:!w-[275px]"></div>
        )
      )}
      {loadingCreatedNFTs == LoadingStatus.loaded && !createdNfts?.length && (
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

CreatedNFTS.getLayout = (page) => (
  <ProfileNftsLayout>
    <div>{page}</div>
  </ProfileNftsLayout>
);

export default CreatedNFTS;
