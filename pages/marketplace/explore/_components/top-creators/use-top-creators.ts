import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getTopCreators } from "@/lib/get-top-creators";
import { LoadingState } from "@/models/common";
import { TopCreator } from "@/models/top-creator";

export const useTopCreators = () => {
  const [state, setState] = useState<{
    loading: LoadingState;
    topCreators: TopCreator[];
  }>({
    loading: "idle",
    topCreators: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const topCreators = await getTopCreators({
          first: 10,
          skip: 0,
        });

        setState((state) => ({
          ...state,
          topCreators,
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
