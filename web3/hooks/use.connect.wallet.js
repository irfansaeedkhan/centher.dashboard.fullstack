import { useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { injectedConnector } from "@/web3/connector";
import { toast } from "react-toastify";

export const useConnectWallet = () => {
  const { activate, error } = useWeb3React();

  useEffect(() => {
    if (error) {
      if (error.name === "UnsupportedChainIdError") {
        toast.error("Please connect to the BSC testnet!");
      }
    }
  }, [error]);

  const connectWallet = useCallback(async () => {
    await activate(injectedConnector);
  }, [activate]);

  const getConnectedAccount = useCallback(async () => {
    if (window.ethereum != null) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      try {
        return await provider.getSigner().getAddress();
      } catch {}
    }
  }, []);

  return { connectWallet, getConnectedAccount };
};
