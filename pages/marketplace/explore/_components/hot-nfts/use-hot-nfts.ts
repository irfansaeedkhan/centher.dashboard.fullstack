import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { LoadingState } from "@/models/common";
import { NFTCardData } from "@/components/nft.card/nft.card.v2";
import { getNFTs } from "@/lib/get-nfts";
import { getNFTCardData } from "@/lib/get-nft-card-data";

export const useHotNFTs = () => {
  const [state, setState] = useState<{
    loading: LoadingState;
    hotNFTs: NFTCardData[];
  }>({
    loading: "idle",
    hotNFTs: [],
  });

  useEffect(() => {
    (async () => {
      try {
        setState((state) => ({ ...state, loading: "loading" }));
        const _hotNFTs = await getNFTs({
          limit: 15,
          skip: 0,
        });

        const formattedHotNFTsPromises = _hotNFTs.map((item) =>
          getNFTCardData(item)
        );

        const formattedHotNFTs = (
          await Promise.allSettled(formattedHotNFTsPromises)
        ).filter(
          (item) => item.status === "fulfilled"
        ) as PromiseFulfilledResult<NFTCardData>[];

        setState((state) => ({
          ...state,
          hotNFTs: formattedHotNFTs
            .map((item) => item.value)
            .filter((item) => item.type.startsWith("image")),
        }));
        setState((state) => ({ ...state, loading: "loaded" }));
      } catch (error: any) {
        setState((state) => ({ ...state, loading: "failed" }));
        toast.error(error.message);
      }
    })();
  }, []);

  return state;
};
