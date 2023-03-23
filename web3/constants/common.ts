import { ethers } from "ethers";
import { Networks } from "../blockchain/enum/networks.enum";
import { SupportedNetworksList } from "../blockchain/types";

export const ZeroAddress = ethers.constants.AddressZero;

export const DAY = 60 * 60 * 24;
export const MONTH = 60 * 5; // DAY * 30;

export const supportedNetworksList: SupportedNetworksList = {
  [Networks.BSC]: true,
  [Networks.GOERLI]: true,
};
