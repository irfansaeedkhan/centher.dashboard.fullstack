import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { LoadingState } from "@/models/common";
import { CollectionCardData } from "@/components/collection.card";
import { getCollectionCardData } from "@/lib/get-collection-card-data";
import { getHotCollections } from "@/lib/get-collections";

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
        const hotCollections = await getHotCollections({
          limit: 15,
          skip: 0,
        });

        const hotCollectionsCardData = hotCollections.map((item) =>
          getCollectionCardData(item)
        );

        setState((state) => ({
          ...state,
          hotCollections: hotCollectionsCardData,
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
