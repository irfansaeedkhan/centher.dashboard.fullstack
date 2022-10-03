import { CHAIN } from "../constants/common";
import addresses from "../constants/contracts";

export interface Address {
  97: string;
  56: string;
  4: string;
  1: string;
}

export const getAddress = (address: Address): string => {
  const chainId = CHAIN;
  return address[chainId];
};

export const getNtrdaoAddress = () => {
  return getAddress(addresses.ntrdao);
};
export const getPresaleAddress = () => {
  return getAddress(addresses.presale);
};
export const getRegistrationAddress = () => {
  return getAddress(addresses.registration);
};
export const getMulticallAddress = () => {
  return getAddress(addresses.multicall);
};
export const getRouterAddress = () => {
  return getAddress(addresses.pancakeRouter);
};
export const getWBNBAddress = () => {
  return getAddress(addresses.wbnb);
};
export const getBusdAddress = () => {
  return getAddress(addresses.busd);
};
