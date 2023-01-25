import { useEffect, useState } from "react";
import { EvmChain } from "@moralisweb3/evm-utils";

import { MoralisFetcher } from "@/utils/fetch.files.tools/moralis.fetcher.util";
import { customLog } from "@/utils/custom.log";

export const useNTRPrice = () => {
  const [ntrPrice, setNTRPrice] = useState(0);

  useEffect(() => {
    const fetchNTRPrice = async () => {
      let _price = 0;
      try {
        const fetcher = new MoralisFetcher();
        const tempPrice = await fetcher.getTokenPrice({
          address: "0x8182ac1c5512eb67756a89c40fadb2311757bd32",
          chain: EvmChain.BSC,
        });

        if (!tempPrice) {
          throw new Error("Cannot get token price.");
        }

        _price = tempPrice;
      } catch (error: any) {
        customLog(error, ["development"]);
      } finally {
        setNTRPrice(_price);
      }
    };
    fetchNTRPrice();
  }, []);

  return ntrPrice;
};
