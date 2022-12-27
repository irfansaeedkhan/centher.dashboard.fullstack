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
        let network = "Goerli testnet";
        if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
          network = "BSC mainnet";
        }
        toast.error(`Please connect to the ${network}!`);
      }
    }
  }, [error]);

  const getConnectedAccount = useCallback(async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      try {
        return await provider.getSigner().getAddress();
      } catch {
        return null;
      }
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      await activate(injectedConnector);
      return await getConnectedAccount();
    } else {
      toast.error("Please install MetaMask!");
    }
  }, [activate, getConnectedAccount]);

  const disconnectWallet = useCallback(() => {
    deactivate();
  }, [deactivate]);

  return { connectWallet, getConnectedAccount, disconnectWallet };
};
