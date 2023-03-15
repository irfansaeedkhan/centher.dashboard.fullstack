import { ethers } from "ethers";
import { Networks } from "../blockchain/enum/networks.enum";
import { SupportedNetworksList } from "../blockchain/types";

export const ZeroAddress = ethers.constants.AddressZero;
export const DAY = 60 * 5;

export const supportedNetworksList: SupportedNetworksList = {
  [Networks.BSC]: true,
  [Networks.GOERLI]: true,
};
