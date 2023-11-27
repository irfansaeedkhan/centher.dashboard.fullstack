import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { LoadingState } from "@/models/common";
import { NFTCardData } from "@/components/nft.card";
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

        const formattedHotNFTs = _hotNFTs.map((item) => getNFTCardData(item));

        const nfts = formattedHotNFTs.filter((item) => {
          return item.type.startsWith("image"); // FIXME: Video is already supported, why this line is still here
        });

        setState((state) => ({
          ...state,
          hotNFTs: nfts,
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
