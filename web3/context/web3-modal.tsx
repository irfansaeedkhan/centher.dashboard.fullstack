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
  rpcUrl: "https://sepolia.infura.io/v3/8ca3f33ab9a94790b1ebf1b734d19ba0",
};

// 3. Create modal
const metadata = {
  name: "369x",
  description: "369x",
  url: "https://dapp.396x.io",
  icons: ["https://dapp.369x.io/images/369x.logo.favicon.png"],
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
