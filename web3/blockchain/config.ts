import { Networks } from "./enum/networks.enum";
import { IBlockchainConfig } from "./types";

import dxcAbi from "../abis/dxc.json";
import usdtAbi from "../abis/usdt.json";
import centherAbi from "../abis/centher.json";
import presaleAbi from "../abis/presale.json";
import marketplaceAbi from "../abis/marketplace.json";
import oldMarketplaceAbi from "../abis/marketplace.old.json";
import registrationAbi from "../abis/registration.json";
import multicallAbi from "../abis/multicall.json";
import busdAbi from "../abis/erc20.json";
import ntrAbi from "../abis/ntr.json";
import routerAbi from "../abis/router.json";
import ERC721Abi from "../abis/erc721.json";
import nftadapter from "../abis/nftadapter.json";
import stakingAbi from "../abis/staking.json";
import launchpadAbi from "../abis/launchpad.json";

import { BigNumber } from "ethers";

export const BlockchainConfig: IBlockchainConfig = {
  supportedNetworks: {
    [Networks.BSC]: true,
    [Networks.SEPOLIA]: true,
  },
  contracts: {
    CENTHER_TOKEN: {
      // CENTHER Token Contract Address
      56: "0x0000000000000000000000000000000000000000",

      11155111: "0x0000000000000000000000000000000000000000",
    },
    REGISTRATION: {
      // Register Contract Address
      56: "0x31fEeD5619fBF3a870E1dD0bCc6465512FBD0381",

      11155111: "0xE90352E7166f8Ed132b629EC6D3aCA4d14816404",
    },
    PRESALE: {
      // Presale Contract Address
      56: "0x01F0f48596c4Abae49418210385b7aF882A3cb4e",
      11155111: "0xe0bb7FAD119A0BFaBe69Ce89FD6fb1441f9a314B",
    },
    MARKETPALCE: {
      56: "0x08c4153B3fDa5215cd284c58e7Cb641df0f54d29",
      11155111: "0x92b2C5eFd3F8c7988Afd8aeb3BCe6ac69823a929",
    },
    OLD_MARKETPALCE: {
      56: "0x761135A25bB3b5e4Cad435073735a54B6E624Ea6",
      11155111: "0x0000000000000000000000000000000000000000",
    },
    MULTICALL: {
      // Multicall Contract Address
      56: "0x0000000000000000000000000000000000000000",
      11155111: "0x0000000000000000000000000000000000000000",
    },
    PANCAKE_ROUTER: {
      56: "0x0000000000000000000000000000000000000000",
      11155111: "0x0000000000000000000000000000000000000000",
    },
    WBNB: {
      56: "0x0000000000000000000000000000000000000000",
      11155111: "0x0000000000000000000000000000000000000000",
    },
    BUSD: {
      56: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      11155111: "0x37D6Eb070d29B503e4fc882F6Dc47F2DD201E016",
    },
    USDT: {
      56: "0x55d398326f99059fF775485246999027B3197955",
      11155111: "0x37D6Eb070d29B503e4fc882F6Dc47F2DD201E016",
    },
    NTR: {
      56: "0x8182ac1C5512EB67756A89C40fadB2311757bD32",
      11155111: "0x37D6Eb070d29B503e4fc882F6Dc47F2DD201E016",
    },
    NATIVE_COLLECTION: {
      56: "0x67d19ebb78a0c4610f9a51a95b41868e39864d04",
      11155111: "0x0000000000000000000000000000000000000000",
    },
    DXC: {
      56: "0xEcb4c542DE0d7AF3aA294c5c4Ae0BefE8E93bD9c", //"0x1981D10B9Bb0990A4637126b4bdFA0e8e0bA903A"
      11155111: "0x38d5bfEB6A7F1b755217dB6D1E713BEeF2A6fdAb",
    },
    NFT_ADAPTER: {
      56: "0x8B2825469a27980462E6cf05117aC967eb50b6bA",
      11155111: "0x0000000000000000000000000000000000000000",
    },
    STAKING: {
      56: "0xb2328A1Cd08F72B17ED32B17f76FcDfa383Bbd32",
      11155111: "0x16E3C12d07D1Da9c33a323E3A43912Da5A569eBC",
    },
    LAUNCHPAD: {
      56: "",
      // 5: "0xC8a14A3067cAe2A3FD17BB9dfa87Cc5364A4009c", //"0x6797F0E827F86F4a36E5a538e6CD9dA5cAF43d6D",
      11155111: "0x8544884E25fC204272B19C193F9E3d37Eb5b672b",
    },
  },
  network:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? Networks.BSC
      : Networks.SEPOLIA,
  rpcProvider:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? "https://bsc-dataseed1.binance.org"
      : "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  abis: {
    CENTHER_TOKEN: centherAbi,
    REGISTRATION: registrationAbi,
    PRESALE: presaleAbi,
    MARKETPALCE: marketplaceAbi,
    OLD_MARKETPALCE: oldMarketplaceAbi,
    MULTICALL: multicallAbi,
    PANCAKE_ROUTER: routerAbi,
    WBNB: {},
    BUSD: busdAbi,
    NTR: ntrAbi,
    NATIVE_COLLECTION: {},
    ERC721: ERC721Abi,
    DXC: dxcAbi,
    USDT: usdtAbi,
    NFT_ADAPTER: nftadapter,
    STAKING: stakingAbi,
    LAUNCHPAD: launchpadAbi,
  },
  toastErrors: false,
  maxSupply: BigNumber.from("260000"),
  networkDecimals: 1e-18,
  percent: [6, 4, 2, 2, 2, 2],
  fee:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? {
          createItemFeeForMarketplace: 0.0,
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
        }
      : {
          createItemFeeForMarketplace: 0.0,
          createItemFeeForCreator: 0.0,
          createCollectionFee: 0.0,
          buyItemFeeForMarketplace: 1.5,
          buyItemFeeForCreator: 1.5,
          buyItemFeeForMultilevel: 7,
          level1: 0.7,
          level2: 1.4,
          level3: 2.1,
          level4: 1.4,
          level5: 0.7,
          level6: 0.7,
        },
  scanner: {
    name:
      process.env.NEXT_PUBLIC_APP_ENV === "production"
        ? "BscScan"
        : "Etherscan",
    url:
      process.env.NEXT_PUBLIC_APP_ENV === "production"
        ? "https://bscscan.com"
        : "https://sepolia.etherscan.io",
  },
  ipfsUrl:
    process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL ||
    "https://centher-staging.infura-ipfs.io",
  subgraphUrl:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? "https://api.thegraph.com/subgraphs/name/sasimraza/centher-production"
      : "https://api.thegraph.com/subgraphs/name/sasimraza/centher-production-sepolia",
};

export const SwapCollection =
  process.env.NEXT_PUBLIC_APP_ENV === "production"
    ? "0x2A6c77A2731Bc076409C9C702783A4e69FE85b96"
    : "0x5637abde4520fb4b8169d558948d9deb8fce7004";

// TODO: Implement configuration validator function
