import { Networks } from "./enum/networks.enum";
import { IBlockchainConfig } from "./types";

import dxcAbi from "../abis/dxc.json";
import centherAbi from "../abis/centher.json";
import presaleAbi from "../abis/presale.json";
import marketplaceAbi from "../abis/marketplace.json";
import registrationAbi from "../abis/registration.json";
import multicallAbi from "../abis/multicall.json";
import busdAbi from "../abis/erc20.json";
import ntrAbi from "../abis/ntr.json";
import routerAbi from "../abis/router.json";
import ERC721Abi from "../abis/erc721.json";

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
      56: "0x811EdC3B67e9275397bfeaf7FAf7687e8F55FeEb",
      5: "0x32607f0B1713C7E05f5c9DeF875688A8d4654d01",
    },
    PRESALE: {
      // Presale Contract Address
      56: "0x23a376C486CD5536674fE84f42A1c3b81B00E5ca",
      5: "0x2E4BcE6cD74133a68FADb5855AcA92EAE77BE303",
    },
    MARKETPALCE: {
      // Presale Contract Address
      56: "0x761135A25bB3b5e4Cad435073735a54B6E624Ea6",
      5: "0x3F625d143CBDe71812cee43FC10f058Db2e11b55",
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
      56: "0x0000000000000000000000000000000000000000",
      5: "0x60194b3eDF9b95A6087FE1940275AE7036641dd8",
    },
    NTR: {
      56: "0x0000000000000000000000000000000000000000",
      5: "0x4fF5719EF59e28aA5fd86c50Af2a3563cC01905B",
    },
    NATIVE_COLLECTION: {
      56: "0xdf0c0d515aa8c73fe50eef65afecef425a6450f6",
      5: "0x546EF9a07044500B00D1079a89A1e3Bd8Bc8B696",
    },
    DXC: {
      56: "0x1981D10B9Bb0990A4637126b4bdFA0e8e0bA903A",
      5: "0xBA6FF371D403A7710335BB426A4889773f8FAD1e",
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
    MULTICALL: multicallAbi,
    PANCAKE_ROUTER: routerAbi,
    WBNB: {},
    BUSD: busdAbi,
    NTR: ntrAbi,
    NATIVE_COLLECTION: {},
    ERC721: ERC721Abi,
    DXC: dxcAbi,
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
        },
  scanner: {
    name:
      process.env.NEXT_PUBLIC_APP_ENV === "production"
        ? "BSCScan"
        : "Etherscan",
    url:
      process.env.NEXT_PUBLIC_APP_ENV === "production"
        ? "https://bscscan.com/address/"
        : "https://goerli.etherscan.io/",
  },
  ipfsUrl:
    process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL ||
    "https://centher-staging.infura-ipfs.io",
  subgraphUrl:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? "https://api.thegraph.com/subgraphs/name/algoalliance/centher-marketplace"
      : "https://api.studio.thegraph.com/query/39184/nethernft_dev/v0.0.32",
};

//TODO=> Implement configuration validator function
