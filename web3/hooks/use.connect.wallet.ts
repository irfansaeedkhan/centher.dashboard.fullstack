import { useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-hot-toast";

import { injectedConnector } from "@/web3/connector";

export const useConnectWallet = () => {
  const { activate, error, deactivate } = useWeb3React();

  useEffect(() => {
    if (error) {
      if (error.message.toLocaleLowerCase().includes("unsupported chain id")) {
        let network = "testnet";
        if (process.env.NEXT_PUBLIC_WEB3_MODE === "production") {
          network = "mainnet";
        }
        toast.error(`Please connect to the BSC ${network}!`);
      }
    }
  }, [error]);

  const connectWallet = useCallback(async () => {
    await activate(injectedConnector);
  }, [activate]);

  const disconnectWallet = useCallback(() => {
    deactivate();
    toast.success("Metamask Disconnected Successfully");
  }, [deactivate]);

  const getConnectedAccount = useCallback(async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      try {
        return await provider.getSigner().getAddress();
      } catch {}
    }
  }, []);

  return { connectWallet, getConnectedAccount, disconnectWallet };
};
