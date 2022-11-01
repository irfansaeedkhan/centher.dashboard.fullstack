import { ethers } from "ethers";
import { NEXT_PUBLIC_IPFS_URL } from "@/web3/constants/common";

export const formatAddress = (address: string | undefined) => {
  return address && address.length >= 6
    ? `${address.substring(0, 6)}...${address.substring(
        address.length - 6,
        address.length
      )}`
    : "";
};

export const formatEther2Number = (num: number | undefined) => {
  return Number(num ? ethers.utils.formatEther(num) : 0);
};

export const formatString2Ether = (num: string | undefined) => {
  return Number(num ? ethers.utils.formatEther(num) : 0);
};

export const formatBNB2USD = (bnb: number | undefined) => {
  return bnb ? Number((formatEther2Number(bnb) * 300).toFixed(10)) : 0;
};

export const formatIPFSUrl = (hash: string | undefined) => {
  if (hash === undefined) return "";
  else {
    if (hash.length === 53)
      return NEXT_PUBLIC_IPFS_URL + "/ipfs/" + hash.substring(7, hash.length);
    else return "";
  }
};
