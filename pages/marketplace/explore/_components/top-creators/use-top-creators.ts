import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { getTopCreators } from "@/lib/get-top-creators";
import { LoadingState } from "@/models/common";

import { TopCreatorCardData } from "./creator-card";
import { getTopCreatorCardData } from "./get-top-creator-card-data";

export const useTopCreators = () => {
  const [state, setState] = useState<{
    loading: LoadingState;
    topCreators: TopCreatorCardData[];
  }>({
    loading: "idle",
    topCreators: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const topCreators = await getTopCreators();

        const topCreatorsCardDataPromises = topCreators.map((item) =>
          getTopCreatorCardData(item)
        );

        const topCreatorsCardData = (
          await Promise.allSettled(topCreatorsCardDataPromises)
        ).filter(
          (item) => item.status === "fulfilled"
        ) as PromiseFulfilledResult<TopCreatorCardData>[];

        setState((state) => ({
          ...state,
          topCreators: topCreatorsCardData
            .map((item) => item.value)
            .filter((creator) => creator.membership.status === "citizen"),
          loading: "loaded",
        }));
      } catch (error: any) {
        setState((state) => ({ ...state, loading: "failed" }));
        toast.error(error.message);
      }
    })();
  }, []);

  return state;
};
