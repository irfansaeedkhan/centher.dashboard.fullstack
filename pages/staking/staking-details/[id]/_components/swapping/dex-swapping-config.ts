import { ChainId, V3_SUBGRAPHS } from "@pancakeswap/chains";
import { GraphQLClient } from "graphql-request";
import { bsc, goerli, sepolia } from "viem/chains";
import { createPublicClient, http } from "viem";
import {
  OnChainProvider,
  SubgraphProvider,
} from "@pancakeswap/smart-router/dist/evm/v3-router/types";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { SwapToken } from "@/models/swap";

interface IDexConfig {
  rpc: string;
  chainId: ChainId;
  goerliTokens: SwapToken[];
  bscTokens: SwapToken[];
}
export const dexSwappingConfig: IDexConfig = {
  rpc: BlockchainConfig.rpcProvider,
  chainId:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? ChainId.BSC
      : ChainId.SEPOLIA,
  goerliTokens: [
    {
      address: "0x0000000000000000000000000000000000000000",
      icon: "bnb-icon.svg",
      is_native: true,
      name: "Sepolia",
      symbol: "ETH",
      decimal: 18,
      projectLink: "https://sepolia.etherscan.io/",
      ChainId: ChainId.SEPOLIA,
    },
    {
      address: "0xabf0295bEaa3e69bf09b3e20634463E2439A2B3A",
      icon: "dexa-icon.png",
      is_native: false,
      name: "DeXa Coin",
      symbol: "DXC",
      decimal: 18,
      projectLink: "https://dexagon.io/",
      ChainId: ChainId.GOERLI,
    },
    {
      address: "0x49cF1C5111Ab8eE2D3d3C044Bd04673234bbf714",
      icon: "usdt-icon.svg",
      is_native: false,
      name: "USDT",
      symbol: "USDT",
      decimal: 18,
      projectLink: "https://tether.to/",
      ChainId: ChainId.GOERLI,
    },
  ],
  bscTokens: [
    {
      address: "0x0000000000000000000000000000000000000000",
      icon: "bnb-icon.svg",
      is_native: true,
      name: "BNB",
      symbol: "BNB",
      decimal: 18,
      projectLink: "https://bnbchain.org",
      ChainId: ChainId.BSC,
    },
    {
      address: "0xEcb4c542DE0d7AF3aA294c5c4Ae0BefE8E93bD9c",
      icon: "dexa-icon.png",
      is_native: false,
      name: "DeXa Coin",
      symbol: "DXC",
      decimal: 18,
      projectLink: "https://dexagon.io/",
      ChainId: ChainId.BSC,
    },
    {
      address: "0x55d398326f99059fF775485246999027B3197955",
      icon: "usdt-icon.svg",
      is_native: false,
      name: "USDT",
      symbol: "USDT",
      decimal: 18,
      projectLink: "https://binance.com",
      ChainId: ChainId.BSC,
    },
  ],
};

export const SUPPORTED_CHAINS = [ChainId.BSC, ChainId.SEPOLIA] as const;

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number];

export const v3SubgraphClients: Record<SupportedChainId, GraphQLClient> = {
  [ChainId.SEPOLIA]: new GraphQLClient(V3_SUBGRAPHS[ChainId.SEPOLIA], {
    fetch,
  }),
  [ChainId.BSC]: new GraphQLClient(V3_SUBGRAPHS[ChainId.BSC], { fetch }),
} as const;

const bscClient = createPublicClient({
  chain: bsc,
  transport: http("https://bsc-dataseed1.binance.org"),
});

const sepoliaClient = createPublicClient({
  chain: sepolia,
  transport: http(
    "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  ),
});

// @ts-ignore
export const viemProviders: OnChainProvider = ({
  chainId,
}: {
  chainId?: ChainId;
}) => {
  switch (chainId) {
    case ChainId.BSC:
      return bscClient;
    case ChainId.SEPOLIA:
      return sepoliaClient;
    default:
      return bscClient;
  }
};

// @ts-ignore
export const v3SubgraphProvider: SubgraphProvider = ({
  chainId = ChainId.BSC,
}: {
  chainId?: ChainId;
}) => {
  return (
    v3SubgraphClients[chainId as SupportedChainId] ||
    v3SubgraphClients[ChainId.BSC]
  );
};
