import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { injectedConnector } from "@/web3/connector";
import toast from "react-hot-toast";
import { useWalletService } from "./use.wallet.service";
import {
  JsonRpcSigner,
  TransactionReceipt,
  Web3Provider,
} from "@ethersproject/providers";
export enum WalletEnum {
  METAMASK = "METAMASK",
  WALLET_SERVICE = "WALLET_SERVICE",
}
export const useWallet = () => {
  const { account, activate, library, deactivate } = useWeb3React();
  const { address, connect, disconnect, sign, signer, send, showWallet } =
    useWalletService();
  const [connectedAddress, setConnecteedAddress] = useState<
    string | null | undefined
  >(null);

  const getConnectedAccount = useCallback(async () => {
    const connected_wallet = getWalletType();
    if (connected_wallet) {
      if (connected_wallet == WalletEnum.METAMASK) {
        return account;
      } else if (connected_wallet == WalletEnum.WALLET_SERVICE) {
        return address;
      }
    }
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
  }, [account, library, signer]);

  const updateConnectedAddress = useCallback(async () => {
    const connectedAccount = await getConnectedAccount();
    setConnecteedAddress(connectedAccount);
  }, [getConnectedAccount]);

  useEffect(() => {
    updateConnectedAddress();
  }, [getConnectedAccount, updateConnectedAddress]);

  const setWalletType = (wallet: WalletEnum) => {
    localStorage.setItem("connected_wallet", wallet);
  };

  const getWalletType = (): WalletEnum | undefined => {
    if (typeof window !== "undefined") {
      const connected_wallet = localStorage.getItem("connected_wallet");
      if (connected_wallet) {
        return connected_wallet as WalletEnum;
      }
    }

    return undefined;
  };

  const connectWallet = useCallback(
    async (
      wallet: WalletEnum = WalletEnum.METAMASK,
      showError: boolean = true
    ) => {
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
          return await getConnectedAccount();
        } else {
          toast.error("Please install MetaMask!");
        }
      } else if (wallet == WalletEnum.WALLET_SERVICE) {
        setWalletType(wallet);
        return await connect();
      }
    },
    [activate, getConnectedAccount, connect]
  );

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
