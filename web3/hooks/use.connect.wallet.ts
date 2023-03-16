import { useCallback } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-hot-toast";

import { injectedConnector } from "@/web3/connector";

export const useConnectWallet = () => {
  const { activate, deactivate } = useWeb3React();

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

  const connectWallet = useCallback(
    async (showError: boolean = true) => {
      if (typeof window.ethereum !== "undefined") {
        await activate(injectedConnector, (error) => {
          if (
            showError &&
            error.message.toLocaleLowerCase().includes("unsupported chain id")
          ) {
            const network =
              process.env.NEXT_PUBLIC_APP_ENV === "production"
                ? "BSC mainnet"
                : "Goerli testnet";
            toast.error(`Please connect to the ${network}!`);
          }
        });
        return await getConnectedAccount();
      } else {
        toast.error("Please install MetaMask!");
      }
    },
    [activate, getConnectedAccount]
  );

  const disconnectWallet = useCallback(() => {
    deactivate();
  }, [deactivate]);

  return { connectWallet, getConnectedAccount, disconnectWallet };
};
