import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { HotNftEmptyIcon } from "@/assets/svgs";
import { NFTImageCard } from "@/components/nft.image.card";
import { useProfileNFTStore } from "@/store/profile.nft.store";
import { LoadingStatus } from "@/utils/enums/loading.status.enum";
import useGetUser from "@/hooks/use.get.user";
import { AppRoutes } from "@/constants/app.routes";

// FIXME: No Pagination on this page?
const CreatedPage = () => {
  const router = useRouter();
  const userId = useMemo(() => {
    return router.query.user_id as string;
  }, [router.query.user_id]);
  const { user } = useGetUser(userId);
  const { createdNfts, fetchCreatedNFTs, loadingCreatedNFTs } =
    useProfileNFTStore((state) => ({
      createdNfts: state.createdNfts,
      fetchCreatedNFTs: state.fetchCreatedNFTs,
      loadingCreatedNFTs: state.loadingCreatedNFTs,
    }));

  useEffect(() => {
    if (userId) {
      fetchCreatedNFTs(userId, 0, 50);
    }
  }, [userId, fetchCreatedNFTs]);

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
      {loadingCreatedNFTs == LoadingStatus.loaded && !!createdNfts.length ? (
        <div className={clsx(`grid grid-cols-[1fr,1fr,1fr] gap-2`)}>
          {createdNfts.map((nft) => (
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

export default CreatedPage;
