import { useEffect, useState } from "react";
import { EvmChain } from "@moralisweb3/common-evm-utils";

import { MoralisFetcher } from "@/utils/fetch.files.tools/moralis.fetcher.util";
import { customLog } from "@/utils/custom.log";

export const useBNBPrice = () => {
  const [bnbPrice, setBNBPrice] = useState(0);

  useEffect(() => {
    const fetchBNBPrice = async () => {
      let _price = 0;
      try {
        const fetcher = new MoralisFetcher();
        const tempPrice = await fetcher.getTokenPrice({
          address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
          chain: EvmChain.BSC,
        });

        if (!tempPrice) {
          throw new Error("Cannot get token price.");
        }

        _price = tempPrice;
      } catch (error: any) {
        customLog(error, ["development"]);
      } finally {
        setBNBPrice(_price);
      }
    };
    fetchBNBPrice();
  }, []);

  return bnbPrice;
};
