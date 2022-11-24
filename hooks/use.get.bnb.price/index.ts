import { useEffect, useState } from "react";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";
import useRefresh from "@/web3/hooks/use.refresh";

export const useBNBPrice = () => {
  const [bnbPrice, setBNBPrice] = useState(0);
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    const fetchBNBPrice = async () => {
      try {
        const _price: any = await Moralis.EvmApi.token.getTokenPrice({
          address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
          chain: EvmChain.BSC,
        });
        setBNBPrice(_price.data.usdPrice);
      } catch (error) {
        setBNBPrice(0);
      }
    };
    fetchBNBPrice();
  }, [slowRefresh]);

  return bnbPrice;
};
