import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import { useShallow } from "zustand/react/shallow";
import clsx from "clsx";
import { HotNftEmptyIcon } from "@/assets/svgs";
import { NFTCollectionImageCard } from "@/components/nft.collection.image.card";
import useGetUser from "@/hooks/use.get.user";
import { AppRoutes } from "@/constants/app.routes";
import { useProfileCollectionStore } from "@/store/profile-collection.store";

const CollectionPage = () => {
  const router = useRouter();
  const userId = useMemo(() => {
    return router.query.user_id as string;
  }, [router.query.user_id]);
  const { user } = useGetUser(userId);
  const { collections, offset, loading } = useProfileCollectionStore(
    useShallow((state) => ({
      collections: state.collections,
      offset: state.offset,
      loading: state.loading,
    }))
  );
  const { fetchCollections, updateOffset, resetCollections } =
    useProfileCollectionStore(useShallow((state) => state.actions));

  const [lastCollectionRef, _lastCollectionInView, lastCollectionEntry] =
    useInView();

  useEffect(() => {
    if (lastCollectionEntry?.isIntersecting) {
      updateOffset();
    }
  }, [lastCollectionRef, lastCollectionEntry, updateOffset]);

  useEffect(() => {
    if (offset > 0) {
      fetchCollections();
    }
  }, [offset, fetchCollections]);

  useEffect(() => {
    if (userId) {
      resetCollections(userId, "loading");
      fetchCollections();
    }
    return () => {
      resetCollections("", "idle");
    };
  }, [userId, resetCollections, fetchCollections]);

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
        {collections.map((collection) => (
          <NFTCollectionImageCard data={collection} key={collection.id} />
        ))}

        {(loading === "loading" || loading === "idle") && (
          <div className="!h-[104px] !w-full animate-pulse rounded-xl bg-[#3C3F4A] [@media(min-width:768px)]:!h-[275px] [@media(min-width:768px)]:!w-[275px]"></div>
        )}

        <div ref={lastCollectionRef} />
      </div>

      {loading === "loaded" && collections.length === 0 && (
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
