

import Moralis from "moralis";
import { EvmChain } from '@moralisweb3/evm-utils';
import React, { useState, useEffect } from "react";
import useRefresh from "../hooks/use.refresh";

const ChainInfoContext = React.createContext({ bnbPrice: 0 });

const ChainInfoContextProvider = ({ children }: { children: any }) => {
  const [bnbPrice, setBNBPrice] = useState(0);
  const {fastRefresh} = useRefresh()

  useEffect(() => {
    const fetchBNBPrice = async () => {
      try {
        const _price = await Moralis.EvmApi.token.getTokenPrice({address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", chain: EvmChain.BSC});
        setBNBPrice(_price.data.usdPrice);        
      } catch (error) {
        setBNBPrice(0)
      }
    }
    fetchBNBPrice()
  }, [fastRefresh]);

  return (
    <ChainInfoContext.Provider value={{ bnbPrice }}>
      {children}
    </ChainInfoContext.Provider>
  );
};

export { ChainInfoContext, ChainInfoContextProvider };
