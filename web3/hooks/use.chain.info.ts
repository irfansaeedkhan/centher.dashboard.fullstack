import { useContext } from "react";
import { ChainInfoContext } from "../context/chain.info.context";

const useBNBPrice = () => {
  const { bnbPrice } = useContext(ChainInfoContext);
  return bnbPrice;
};

export default useBNBPrice;
