import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useShallow } from "zustand/react/shallow";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";
import { HotNftEmptyIcon } from "@/assets/svgs";
import { NFTImageCard } from "@/components/nft.image.card";
import { useProfileOwnedNftsStore } from "@/store/profile-owned-nfts.store";

const OwnedPage = () => {
  const router = useRouter();
  const userId = useMemo(() => {
    return router.query.user_id as string;
  }, [router.query.user_id]);
  const { ownedNfts, offset, loading } = useProfileOwnedNftsStore(
    useShallow((state) => ({
      ownedNfts: state.ownedNfts,
      offset: state.offset,
      loading: state.loading,
    }))
  );
  const { fetchOwnedNFTs, updateOffset, resetOwnedNfts } =
    useProfileOwnedNftsStore(useShallow((state) => state.actions));

  const [lastNftRef, _lastNftInView, lastNftEntry] = useInView();

  useEffect(() => {
    if (lastNftEntry?.isIntersecting) {
      updateOffset();
    }
  }, [lastNftRef, lastNftEntry, updateOffset]);

  useEffect(() => {
    if (offset > 0) {
      fetchOwnedNFTs();
    }
  }, [offset, fetchOwnedNFTs]);

  useEffect(() => {
    if (userId) {
      resetOwnedNfts(userId, "loading");
      fetchOwnedNFTs();
    }
    return () => {
      resetOwnedNfts("", "idle");
    };
  }, [userId, resetOwnedNfts, fetchOwnedNFTs]);

  return (
    <>
      <div className={clsx(`grid grid-cols-[1fr,1fr,1fr] gap-2`)}>
        {ownedNfts.map((nft) => (
          <NFTImageCard data={nft} key={nft.id} />
        ))}

        {(loading === "loading" || loading === "idle") && (
          <div className="!h-[104px] !w-full animate-pulse rounded-xl bg-[#3C3F4A] [@media(min-width:768px)]:!h-[275px] [@media(min-width:768px)]:!w-[275px]"></div>
        )}

        <div ref={lastNftRef} />
      </div>

      {loading === "loaded" && ownedNfts.length === 0 && (
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
