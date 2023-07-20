import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { LoadingState } from "@/models/common";
import { CollectionCardData } from "@/components/collection.card/collection-card-v2";
import { getCollectionCardData } from "@/lib/get-collection-card-data";
import { getCollections } from "@/lib/get-collections";
import { blackListedAddresses } from "@/utils/blacklist_addresses/collection_addresses";

export const useHotCollections = () => {
  const [state, setState] = useState<{
    loading: LoadingState;
    hotCollections: CollectionCardData[];
  }>({
    loading: "idle",
    hotCollections: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const hotCollections = await getCollections({
          limit: 15,
          skip: 0,
        });

        const filteredCollection = hotCollections.filter(
          (e) => !blackListedAddresses.includes(e.collection)
        );

        const hotCollectionsCardDataPromises = filteredCollection.map((item) =>
          getCollectionCardData(item)
        );

        const hotCollectionsCardData = (
          await Promise.allSettled(hotCollectionsCardDataPromises)
        ).filter(
          (item) => item.status === "fulfilled"
        ) as PromiseFulfilledResult<CollectionCardData>[];

        setState((state) => ({
          ...state,
          hotCollections: hotCollectionsCardData.map((item) => item.value),
          loading: "loaded",
        }));
      } catch (error: any) {
        setState((state) => ({ ...state, loading: "failed" }));
        toast.error("Cannot load Hot Collections");
      }
    })();
  }, []);

  return state;
};
