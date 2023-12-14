import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useShallow } from "zustand/react/shallow";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";
import { HotNftEmptyIcon } from "@/assets/svgs";
import { NFTImageCard } from "@/components/nft.image.card";
import { useProfileCreatedNftsStore } from "@/store/profile-created-nfts.store";
import useGetUser from "@/hooks/use.get.user";
import { AppRoutes } from "@/constants/app.routes";

const CreatedPage = () => {
  const router = useRouter();
  const userId = useMemo(() => {
    return router.query.user_id as string;
  }, [router.query.user_id]);
  const { user } = useGetUser(userId);
  const { createdNfts, offset, loading } = useProfileCreatedNftsStore(
    useShallow((state) => ({
      createdNfts: state.createdNfts,
      offset: state.offset,
      loading: state.loading,
    }))
  );
  const { fetchCreatedNFTs, updateOffset, resetCreatedNfts } =
    useProfileCreatedNftsStore(useShallow((state) => state.actions));

  const [lastNftRef, _lastNftInView, lastNftEntry] = useInView();

  useEffect(() => {
    if (lastNftEntry?.isIntersecting) {
      updateOffset();
    }
  }, [lastNftRef, lastNftEntry, updateOffset]);

  useEffect(() => {
    if (offset > 0) {
      fetchCreatedNFTs();
    }
  }, [offset, fetchCreatedNFTs]);

  useEffect(() => {
    if (userId) {
      resetCreatedNfts(userId, "loading");
      fetchCreatedNFTs();
    }
    return () => {
      resetCreatedNfts("", "idle");
    };
  }, [userId, resetCreatedNfts, fetchCreatedNFTs]);

  useEffect(() => {
    if (user && user?.membership.status !== "citizen") {
      // Redirect to the owned page if the user is not a citizen
      router.push({
        pathname: AppRoutes.profile.owned,
        query: { user_id: router.query.user_id },
      });
    }
  }, [user, router]);

  return (
    <>
      <div className={clsx(`grid grid-cols-[1fr,1fr,1fr] gap-2`)}>
        {createdNfts.map((nft) => (
          <NFTImageCard data={nft} key={nft.id} />
        ))}

        {(loading === "loading" || loading === "idle") && (
          <div className="!h-[104px] !w-full animate-pulse rounded-xl bg-[#3C3F4A] [@media(min-width:768px)]:!h-[275px] [@media(min-width:768px)]:!w-[275px]"></div>
        )}

        <div ref={lastNftRef} />
      </div>

      {loading === "loaded" && createdNfts.length === 0 && (
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

export default CreatedPage;
