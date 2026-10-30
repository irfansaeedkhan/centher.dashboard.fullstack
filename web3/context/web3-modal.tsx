"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import { BlockchainConfig } from "../blockchain/config";

// 1. Get projectId
const projectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ??
  "e8b3b83a62a91120e2caa96fccd0a2b9";

// 2. Set chains
const mainnet = {
  chainId: 56,
  name: "BSC",
  currency: "BNB",
  explorerUrl: "https://bscscan.com/",
  rpcUrl: "https://bsc-dataseed1.binance.org",
};

const sepolia = {
  chainId: 11155111,
  name: "SEPOLIA",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io/",
  // Same env-sourced RPC as BlockchainConfig (marketplace-grill Q13) —
  // never hardcode a keyed RPC URL here.
  rpcUrl: BlockchainConfig.rpcProvider,
};

// 3. Create modal
const metadata = {
  name: "Sociaket",
  description: "Sociaket",
  url: "https://dapp.396x.io",
  icons: ["/images/sociaket.logo.favicon.png"],
};

createWeb3Modal({
  ethersConfig: defaultConfig({
    metadata,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
    rpcUrl: BlockchainConfig.rpcProvider,
  }),
  chains:
    process.env.NEXT_PUBLIC_APP_ENV == "production" ? [mainnet] : [sepolia],
  projectId,
});

interface WEb3ModalProps {
  children: React.ReactNode;
}

export function Web3ModalProvider({ children }: WEb3ModalProps) {
  return children;
}
