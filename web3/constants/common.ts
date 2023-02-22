import { ethers } from "ethers";

export const CHAIN = process.env.NEXT_PUBLIC_APP_ENV === "production" ? 56 : 5;
export const BSC_RPC_URLS =
  process.env.NEXT_PUBLIC_APP_ENV === "production"
    ? ["https://bsc-dataseed1.binance.org"]
    : ["https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"];

// Infura IPFS Gateway Url
export const NEXT_PUBLIC_IPFS_URL = process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL;

export const ZeroAddress = ethers.constants.AddressZero;

export const SCAN_URL =
  process.env.NEXT_PUBLIC_APP_ENV === "production"
    ? "https://bscscan.com/address/"
    : "https://goerli.etherscan.io/";

export const DAY = 60 * 5;

export const FEE = {
  createItemFeeForMarketplace: 0.0072,
  createItemFeeForCreator: 0.0,
  createCollectionFee: 0.0026,
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

export const networkDecimals = 1e-18;

export const SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_APP_ENV === "production"
    ? "https://api.thegraph.com/subgraphs/name/algoalliance/centher-v1-1"
    : "https://api.studio.thegraph.com/query/39184/nethernft_dev/0.0.21";
