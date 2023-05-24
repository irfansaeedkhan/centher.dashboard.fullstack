import { Networks } from "./enum/networks.enum";
import { IBlockchainConfig } from "./types";

import dxcAbi from "../abis/dxc.json";
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

import { BigNumber } from "ethers";

export const BlockchainConfig: IBlockchainConfig = {
  supportedNetworks: {
    [Networks.BSC]: true,
    [Networks.GOERLI]: true,
  },
  contracts: {
    CENTHER_TOKEN: {
      // CENTHER Token Contract Address
      56: "0x0000000000000000000000000000000000000000",
      5: "0x2b6526F243a5cF6fBe25a3a1C15aEBa94Cfb0Ff0",
    },
    REGISTRATION: {
      // Register Contract Address
      56: "0x31fEeD5619fBF3a870E1dD0bCc6465512FBD0381",
      5: "0x538584360a8ec67338Ce73721585aC386d7a4e6E",
    },
    PRESALE: {
      // Presale Contract Address
      56: "0x23a376C486CD5536674fE84f42A1c3b81B00E5ca",
      5: "0x2E4BcE6cD74133a68FADb5855AcA92EAE77BE303",
    },
    MARKETPALCE: {
      56: "0x08c4153B3fDa5215cd284c58e7Cb641df0f54d29",
      5: "0x05901C4ef5742D2dE298a7970C38b0de4412BfD9",
    },
    OLD_MARKETPALCE: {
      56: "0x761135A25bB3b5e4Cad435073735a54B6E624Ea6",
      5: "0xc7E952Ae4C3Ad5Dc8Aa0E615De9d9780305a3437",
    },
    MULTICALL: {
      // Multicall Contract Address
      56: "0x0000000000000000000000000000000000000000",
      5: "0xd753294Cc2F2be848C1cfAAffceEB2F4d7899B1f",
    },
    PANCAKE_ROUTER: {
      56: "0x0000000000000000000000000000000000000000",
      5: "0xd753294Cc2F2be848C1cfAAffceEB2F4d7899B1f",
    },
    WBNB: {
      56: "0x0000000000000000000000000000000000000000",
      5: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    },
    BUSD: {
      56: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      5: "0x60194b3eDF9b95A6087FE1940275AE7036641dd8",
    },
    NTR: {
      56: "0x0000000000000000000000000000000000000000",
      5: "0x4fF5719EF59e28aA5fd86c50Af2a3563cC01905B",
    },
    NATIVE_COLLECTION: {
      56: "0x67d19ebb78a0c4610f9a51a95b41868e39864d04",
      5: "0x0fb63a3666bf6078d0beb546ea82cb39d85a3b55",
    },
    DXC: {
      56: "0x1981D10B9Bb0990A4637126b4bdFA0e8e0bA903A",
      5: "0xBA6FF371D403A7710335BB426A4889773f8FAD1e",
    },
    NFT_ADAPTER: {
      56: "0x0000000000000000000000000000000000000000",
      5: "0xC8DA70cF9625C710D34b97927a5b3a80EF298a1d",
    },
  },
  network:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? Networks.BSC
      : Networks.GOERLI,
  rpcProvider:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? "https://bsc-dataseed1.binance.org"
      : "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
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
    NFT_ADAPTER: nftadapter,
  },
  toastErrors: false,
  maxSupply: BigNumber.from("260000"),
  networkDecimals: 1e-18,
  percent: [6, 4, 2, 2, 2, 2],
  fee:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? {
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
        : "https://goerli.etherscan.io",
  },
  ipfsUrl:
    process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL ||
    "https://centher-staging.infura-ipfs.io",
  subgraphUrl:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? "https://api.thegraph.com/subgraphs/name/algoalliance/marketplace-v2"
      : "https://api.thegraph.com/subgraphs/name/rezahssini/test-migration",
};

export const SwapCollection =
  process.env.NEXT_PUBLIC_APP_ENV === "production"
    ? "0x2A6c77A2731Bc076409C9C702783A4e69FE85b96"
    : "0x5637abde4520fb4b8169d558948d9deb8fce7004";

// TODO: Implement configuration validator function
