import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { useProfileNFTStore } from "@/store/profile.nft.store";
import { NextPageWithLayout } from "@/pages/_app.page";
import { NFTImageCard } from "@/components/nft.image.card";
import { HotNftEmptyIcon } from "@/assets/svgs";
import ProfileNftsLayout from "@/layouts/profile.nfts.layout";
import { LoadingStatus } from "@/utils/enums/loading.status.enum";
import { NFTLockedDetailsProps } from "@/lib/get-user-by-id";

const ListedNFTS: NextPageWithLayout = () => {
  const router = useRouter();
  const account = useMemo(() => {
    return router.query.user_id as string;
  }, [router.query.user_id]);
  const { listedNFTs, fetchListedNFTs, loadingListedNFTs } = useProfileNFTStore(
    (state) => ({
      listedNFTs: state.listedNfts,
      fetchListedNFTs: state.fetchListedNFTs,
      loadingListedNFTs: state.loadingListedNFTs,
    })
  );

  useEffect(() => {
    if (account) {
      fetchListedNFTs(account, 0, 1000);
    }
  }, [account, fetchListedNFTs]);

  const [displayNFTs, setDisplayNFTs] = useState<NFTLockedDetailsProps[]>([]);

  useEffect(() => {
    if (loadingListedNFTs == LoadingStatus.loaded) {
      setDisplayNFTs([...listedNFTs]);
    }
  }, [loadingListedNFTs, listedNFTs]);

  return (
    <>
      {loadingListedNFTs == LoadingStatus.loaded && displayNFTs?.length ? (
        <div className={clsx(`grid grid-cols-[1fr,1fr,1fr] gap-2`)}>
          {displayNFTs.map((nft) => (
            <NFTImageCard data={nft} key={nft.id} />
          ))}
        </div>
      ) : (
        loadingListedNFTs == LoadingStatus.loading && (
          <div className="!h-[104px] !w-full animate-pulse rounded-xl bg-[#3C3F4A] [@media(min-width:768px)]:!h-[275px] [@media(min-width:768px)]:!w-[275px]"></div>
        )
      )}
      {loadingListedNFTs == LoadingStatus.loaded && !listedNFTs?.length && (
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

ListedNFTS.getLayout = (page) => (
  <ProfileNftsLayout>
    <div>{page}</div>
  </ProfileNftsLayout>
);

export default ListedNFTS;
