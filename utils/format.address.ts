import { ethers } from "ethers";
import { NEXT_PUBLIC_IPFS_URL, SCAN_URL } from "@/web3/constants/common";

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

export const formatBNB2USD = (bnb: number | undefined, bnbPrice: number) => {
  return bnb ? Number((formatEther2Number(bnb) * bnbPrice).toFixed(5)) : 0;
};

export const formatIPFSUrl = (hash: string | undefined) => {
  if (hash === undefined) return "";
  else if (hash.substring(0, 7) === "ipfs://") {
    if (hash.length >= 53)
      return NEXT_PUBLIC_IPFS_URL + "/ipfs/" + hash.substring(7, hash.length);
    else return hash;
  } else {
    const splitHash = hash.split("/Qm");
    if (splitHash.length >= 2) {
      return NEXT_PUBLIC_IPFS_URL + "/ipfs/Qm" + splitHash[1];
    } else {
      return hash;
    }
  }
};

export const formatTxUrl = (hash: string | undefined) => {
  if (hash === undefined) return SCAN_URL;
  else {
    return `${SCAN_URL}tx/${hash}`;
  }
};

export const formatAddressUrl = (hash: string | undefined) => {
  if (hash === undefined) return SCAN_URL;
  else {
    return `${SCAN_URL}address/${hash}`;
  }
};
