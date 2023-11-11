import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import {
  JsonRpcSigner,
  TransactionReceipt,
  Web3Provider,
} from "@ethersproject/providers";
import toast from "react-hot-toast";
import { injectedConnector } from "@/web3/connector";
import { useWalletService } from "./use.wallet.service";

export enum WalletEnum {
  METAMASK = "METAMASK",
  WALLET_SERVICE = "WALLET_SERVICE",
}

const CONNECTED_WALLET_KEY = "connected_wallet";
// const IS_WALLET_CONNECTED_KEY = "is_wallet_connected";

export const useWallet = () => {
  const { account, activate, library, deactivate } = useWeb3React();
  const { address, connect, disconnect, sign, signer, send, showWallet } =
    useWalletService();
  const [connectedAddress, setConnecteedAddress] = useState<
    string | null | undefined
  >(null);

  const updateConnectedAccount = async () => {
    if (account || address) {
      const connected_wallet = getWalletType();
      if (connected_wallet) {
        if (connected_wallet == WalletEnum.METAMASK) {
          if (account) {
            setConnecteedAddress(account);
            return account;
          } else {
            return undefined;
          }
        } else if (connected_wallet == WalletEnum.WALLET_SERVICE) {
          if (address) {
            setConnecteedAddress(address);
            return address;
          } else {
            return undefined;
          }
        }
      }
    } else {
      setConnecteedAddress(undefined);
      return undefined;
    }
  };

  useEffect(() => {
    updateConnectedAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, address]);

  const getSigner = useCallback((): JsonRpcSigner | null => {
    const connected_wallet = getWalletType();
    if (connected_wallet) {
      if (
        connected_wallet == WalletEnum.METAMASK &&
        account &&
        library != undefined
      ) {
        return library.getSigner();
      } else if (connected_wallet == WalletEnum.WALLET_SERVICE) {
        return signer;
      }
    }
    return null;
  }, [account, library, signer, address]);

  const setWalletType = (wallet: WalletEnum) => {
    localStorage.setItem(CONNECTED_WALLET_KEY, wallet);
  };

  const getWalletType = (): WalletEnum | undefined => {
    if (typeof window !== "undefined") {
      const connected_wallet = localStorage.getItem(CONNECTED_WALLET_KEY);
      if (connected_wallet) {
        return connected_wallet as WalletEnum;
      }
    }

    return undefined;
  };

  const connectWallet = async (
    wallet: WalletEnum = WalletEnum.METAMASK,
    showError: boolean = true
  ): Promise<void> => {
    if (wallet == WalletEnum.METAMASK) {
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

        setWalletType(wallet);
      } else {
        toast.error("Please install MetaMask!");
      }
    } else if (wallet == WalletEnum.WALLET_SERVICE) {
      setWalletType(wallet);
      await connect();
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    const wallet = getWalletType();
    if (wallet == WalletEnum.METAMASK) {
      const signature = await (library as Web3Provider)
        .getSigner()
        .signMessage(message);
      return signature;
    }
    return sign(message);
  };

  const sendTransaction = async (
    data: ethers.PopulatedTransaction,
    description?: string
  ): Promise<TransactionReceipt> => {
    const wallet = getWalletType();
    if (wallet == WalletEnum.METAMASK) {
      const signer: ethers.providers.JsonRpcSigner = library.getSigner();
      const tx = signer.sendTransaction(data);
      return (await tx).wait(1);
    } else {
      return send(data, description);
    }
  };

  const disconnectWallet = () => {
    const wallet = getWalletType();
    if (wallet == WalletEnum.METAMASK) {
      deactivate();
    } else {
      disconnect();
    }
    setConnecteedAddress(undefined);
  };

  const openWallet = async () => {
    const type = getWalletType();
    if (type == WalletEnum.METAMASK) {
    } else {
      showWallet();
    }
  };

  return {
    connectedAddress,
    connectWallet,
    signMessage,
    getWalletType,
    sendTransaction,
    getSigner,
    disconnectWallet,
    openWallet,
  };
};
