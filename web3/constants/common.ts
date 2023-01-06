import { ethers } from "ethers";

// export const CHAIN = process.env.NEXT_PUBLIC_APP_ENV === "production" ? 56 : 5;
// export const BSC_RPC_URLS = process.env.NEXT_PUBLIC_APP_ENV === "production" ?
//   [
//     'https://bsc-dataseed1.ninicoin.io',
//     'https://bsc-dataseed1.defibit.io',
//     'https://bsc-dataseed.binance.org',
//   ] :
//   ["https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"];

export const CHAIN = 56;
export const BSC_RPC_URLS = ["https://bsc-dataseed1.binance.org"];

// IPFS Platform Url
export const NEXT_PUBLIC_IPFS_URL = "https://ipfs.moralis.io:2053";
// IPFS Host
export const NEXT_PUBLIC_IPFS_HOST = "infura-ipfs.io";
// IPFS Project id
export const NEXT_PUBLIC_Project_ID = "2DD9ttRJA3QfrFRdqJ0cHdTPEwr";
// IPFS API Secret
export const NEXT_PUBLIC_API_Secret = "4bb79e429e37d85e6d6f8a2f91f65537";
export const ZeroAddress = ethers.constants.AddressZero;

export const SCAN_URL =
  process.env.NEXT_PUBLIC_APP_ENV === "production"
    ? "https://bscscan.com/address/"
    : "https://goerli.etherscan.io/";

export const DAY = 60 * 5;

export const FEE = {
  createItemFeeForMarketplace: 0.0001,
  createItemFeeForCreator: 0.0,
  createCollectionFee: 0.0001,
  buyItemFeeForMarketplace: 1.5,
  buyItemFeeForCreator: 1.5,
  buyItemFeeForMultilevel: 7,
  level1: 0.7,
  level2: 1.4,
  level3: 2.1,
  level4: 1.4,
  level5: 0.7,
  level6: 0.7,
};

export const percent = [6, 4, 2, 2, 2, 2];
