import { SwapToken } from "@/models/swap";
import { ChainId, V3_SUBGRAPHS } from "@pancakeswap/chains";
import { GraphQLClient } from "graphql-request";
import { bsc, goerli } from "viem/chains";
import { createPublicClient, http } from "viem";
import {
  OnChainProvider,
  SubgraphProvider,
} from "@pancakeswap/smart-router/dist/evm/v3-router/types";

interface IDexConfig {
  rpc: string;
  chainId: ChainId;
  goerliTokens: SwapToken[];
  bscTokens: SwapToken[];
}
export const dexSwappingConfig: IDexConfig = {
  rpc:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? "https://bsc-dataseed1.binance.org"
      : "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  chainId:
    process.env.NEXT_PUBLIC_APP_ENV === "production"
      ? ChainId.BSC
      : ChainId.GOERLI,
  goerliTokens: [
    {
      address: "0xabf0295bEaa3e69bf09b3e20634463E2439A2B3A",
      icon: "dexa-icon.png",
      id: "dvd",
      is_native: false,
      name: "DeXa Coin" || "",
      symbol: "DXC",
      decimal: 18,
      projectLink: "https://dexagon.io/",
      ChainId: ChainId.GOERLI,
    },
    {
      address: "0x49cF1C5111Ab8eE2D3d3C044Bd04673234bbf714",
      icon: "busd-icon.svg",
      id: "sss",
      is_native: false,
      name: "USDT" || "",
      symbol: "USDT",
      decimal: 18,
      projectLink: "https://dexagon.io/",
      ChainId: ChainId.GOERLI,
    },
  ],
  bscTokens: [
    {
      address: "0xEcb4c542DE0d7AF3aA294c5c4Ae0BefE8E93bD9c",
      icon: "dexa-icon.png",
      id: "dvd",
      is_native: false,
      name: "DeXa Coin" || "",
      symbol: "DXC",
      decimal: 18,
      projectLink: "https://dexagon.io/",
      ChainId: ChainId.BSC,
    },
    {
      address: "0x55d398326f99059fF775485246999027B3197955",
      icon: "busd-icon.svg",
      id: "sss",
      is_native: false,
      name: "USDT" || "",
      symbol: "USDT",
      decimal: 18,
      projectLink: "https://dexagon.io/",
      ChainId: ChainId.BSC,
    },
  ],
};

export const SUPPORTED_CHAINS = [ChainId.BSC, ChainId.GOERLI] as const;

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number];

export const v3SubgraphClients: Record<SupportedChainId, GraphQLClient> = {
  [ChainId.GOERLI]: new GraphQLClient(V3_SUBGRAPHS[ChainId.GOERLI], { fetch }),
  [ChainId.BSC]: new GraphQLClient(V3_SUBGRAPHS[ChainId.BSC], { fetch }),
} as const;

const bscClient = createPublicClient({
  chain: bsc,
  transport: http("https://bsc-dataseed1.binance.org"),
});

const goerliClient = createPublicClient({
  chain: goerli,
  transport: http(
    "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
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
    case ChainId.GOERLI:
      return goerliClient;
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
