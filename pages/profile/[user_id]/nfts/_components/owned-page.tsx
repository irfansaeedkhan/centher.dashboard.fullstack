import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { HotNftEmptyIcon } from "@/assets/svgs";
import { NFTImageCard } from "@/components/nft.image.card";
import { useProfileNFTStore } from "@/store/profile.nft.store";
import { LoadingStatus } from "@/utils/enums/loading.status.enum";

// FIXME: No Pagination on this page?
const OwnedPage = () => {
  const router = useRouter();
  const userId = useMemo(() => {
    return router.query.user_id as string;
  }, [router.query.user_id]);
  const { ownedNfts, fetchOwnedNFTs, loadingOwnedNFTs } = useProfileNFTStore(
    (state) => ({
      ownedNfts: state.ownedNfts,
      fetchOwnedNFTs: state.fetchOwnedNFTs,
      loadingOwnedNFTs: state.loadingOwnedNFTs,
    })
  );

  useEffect(() => {
    if (userId) {
      fetchOwnedNFTs(userId);
    }
  }, [userId, fetchOwnedNFTs]);

  return (
    <>
      {loadingOwnedNFTs == LoadingStatus.loaded && !!ownedNfts.length ? (
        <div className={clsx(`grid grid-cols-[1fr,1fr,1fr] gap-2`)}>
          {ownedNfts.map((nft) => (
            <NFTImageCard data={nft} key={nft.id} />
          ))}
        </div>
      ) : (
        loadingOwnedNFTs == LoadingStatus.loading && (
          <div className="!h-[104px] !w-full animate-pulse rounded-xl bg-[#3C3F4A] [@media(min-width:768px)]:!h-[275px] [@media(min-width:768px)]:!w-[275px]"></div>
        )
      )}

      {loadingOwnedNFTs == LoadingStatus.loaded && !ownedNfts?.length && (
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

export default OwnedPage;
