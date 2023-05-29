import { BlockchainConfig } from "@/web3/blockchain/config";
import { ethers } from "ethers";

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

export const formatNum2DispNum = (num: number | undefined) => {
  return num ? Number(num.toFixed(5)) : 0;
};

export const formatPriceInUSD = (bnb: number | undefined, bnbPrice: number) => {
  return bnb ? Number((bnb * bnbPrice).toFixed(5)) : 0;
};

export const formatIPFSUrl = (hash: string | undefined) => {
  if (hash === undefined) return "";
  else if (hash.substring(0, 7) === "ipfs://") {
    if (hash.length >= 53)
      return (
        BlockchainConfig.ipfsUrl + "/ipfs/" + hash.substring(7, hash.length)
      );
    else return hash;
  } else {
    const splitHash = hash.split("/Qm");
    if (splitHash.length >= 2) {
      return BlockchainConfig.ipfsUrl + "/ipfs/Qm" + splitHash[1];
    } else {
      return hash;
    }
  }
};

export const formatTxUrl = (hash: string | undefined) => {
  if (hash === undefined) return BlockchainConfig.scanner.url;
  else {
    return `${BlockchainConfig.scanner.url}/tx/${hash}`;
  }
};

export const formatAddressUrl = (hash: string | undefined) => {
  if (hash === undefined) return BlockchainConfig.scanner.url;
  else {
    return `${BlockchainConfig.scanner.url}/address/${hash}`;
  }
};
