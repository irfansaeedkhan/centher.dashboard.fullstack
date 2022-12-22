import { useEffect, useState } from "react";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";
import useRefresh from "@/web3/hooks/use.refresh";

export const useNTRPrice = () => {
  const [ntrPrice, setNTRPrice] = useState(0);
  // const { slowRefresh } = useRefresh();

  useEffect(() => {
    const fetchNTRPrice = async () => {
      try {
        const _price: any = await Moralis.EvmApi.token.getTokenPrice({
          address: "0x8182ac1c5512eb67756a89c40fadb2311757bd32",
          chain: EvmChain.BSC,
        });
        setNTRPrice(_price.data.usdPrice);
      } catch (error) {
        setNTRPrice(0);
      }
    };
    fetchNTRPrice();
  }, []);

  return ntrPrice;
};
