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

export const formatEther2Number = (num: number | string | undefined) => {
  return Number(num ? ethers.utils.formatEther(`${num}`) : 0);
};

export const formatString2Ether = (num: string | undefined) => {
  return Number(num ? ethers.utils.formatEther(`${num}`) : 0);
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
  let result = "";
  if (hash === undefined) return result;
  else if (hash.substring(0, 7) === "ipfs://") {
    if (hash.length >= 53)
      result =
        BlockchainConfig.ipfsUrl + "/ipfs/" + hash.substring(7, hash.length);
    else result = hash;
  } else if (hash.substring(0, 5) === "ipfs:") {
    if (hash.substring(0, 6) === "ipfs:/") {
      result =
        BlockchainConfig.ipfsUrl + "/ipfs/" + hash.substring(6, hash.length);
    } else {
      result =
        BlockchainConfig.ipfsUrl + "/ipfs/" + hash.substring(5, hash.length);
    }
  } else {
    const splitHash = hash.split("/Qm");
    if (splitHash.length >= 2) {
      result = BlockchainConfig.ipfsUrl + "/ipfs/Qm" + splitHash[1];
    } else {
      result = hash;
    }
  }

  return result.split("/ipfs/")[0] == BlockchainConfig.ipfsUrl
    ? result
    : result.replace(result.split("/ipfs/")[0], BlockchainConfig.ipfsUrl);
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
