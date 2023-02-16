import React, { useState, useEffect } from "react";
import useRefresh from "../hooks/use.refresh";
import { EvmChain } from "@moralisweb3/common-evm-utils";

import { MoralisFetcher } from "@/utils/fetch.files.tools/moralis.fetcher.util";

const ChainInfoContext = React.createContext({ bnbPrice: 0 });

const ChainInfoContextProvider = ({ children }: { children: any }) => {
  const [bnbPrice, setBNBPrice] = useState(0);
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const fetchBNBPrice = async () => {
      try {
        const fetcher = new MoralisFetcher();
        const _price = await fetcher.getTokenPrice({
          address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
          chain: EvmChain.BSC,
        });
        if (!_price) {
          throw new Error("Cannot get token price.");
        }
        setBNBPrice(_price);
      } catch (error) {
        setBNBPrice(0);
      }
    };
    fetchBNBPrice();
  }, [fastRefresh]);

  return (
    <ChainInfoContext.Provider value={{ bnbPrice }}>
      {children}
    </ChainInfoContext.Provider>
  );
};

export { ChainInfoContext, ChainInfoContextProvider };
