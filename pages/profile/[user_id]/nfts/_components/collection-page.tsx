import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { HotNftEmptyIcon } from "@/assets/svgs";
import { NFTCollectionImageCard } from "@/components/nft.collection.image.card";
import { useProfileNFTStore } from "@/store/profile.nft.store";
import { LoadingStatus } from "@/utils/enums/loading.status.enum";
import useGetUser from "@/hooks/use.get.user";
import { AppRoutes } from "@/constants/app.routes";

// FIXME: No Pagination on this page?
const CollectionPage = () => {
  const router = useRouter();
  const userId = useMemo(() => {
    return router.query.user_id as string;
  }, [router.query.user_id]);
  const { user } = useGetUser(userId);
  const { collections, fetchCollections, loadingCollections } =
    useProfileNFTStore((state) => ({
      collections: state.collections,
      fetchCollections: state.fetchCollections,
      loadingCollections: state.loadingCollections,
    }));

  useEffect(() => {
    if (userId) {
      fetchCollections(userId);
    }
  }, [userId, fetchCollections]);

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
      {loadingCollections == LoadingStatus.loaded && !!collections.length ? (
        <div className={clsx(`grid grid-cols-[1fr,1fr,1fr] gap-2`)}>
          {collections.map((collection) => (
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
        !collections.length && (
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

export default CollectionPage;
