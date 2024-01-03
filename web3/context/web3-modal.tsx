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

const goerli = {
  chainId: 5,
  name: "GOERLI",
  currency: "ETH",
  explorerUrl: "https://goerli.etherscan.io/",
  rpcUrl: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
};

// 3. Create modal
const metadata = {
  name: "Centher",
  description: "Centher",
  url: "https://app.centher.io",
  icons: ["https://app.centher.io/images/centher-new-logo.png"],
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
    process.env.NEXT_PUBLIC_APP_ENV == "production" ? [mainnet] : [goerli],
  projectId,
});

interface WEb3ModalProps {
  children: React.ReactNode;
}

export function Web3ModalProvider({ children }: WEb3ModalProps) {
  return children;
}
