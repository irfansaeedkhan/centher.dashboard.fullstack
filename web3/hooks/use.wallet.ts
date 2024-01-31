import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import {
  JsonRpcProvider,
  JsonRpcSigner,
  TransactionReceipt,
} from "@ethersproject/providers";
import useUser from "@/hooks/use.user";
import { useGlobalModalContext } from "@/components/modal/global-modal/global-modal";
import { BlockchainConfig } from "../blockchain/config";
import { useWalletConnectService } from "./use.walletconnect";
import { useWalletService } from "./use.wallet.service";

export enum WalletEnum {
  METAMASK = "METAMASK",
  WALLET_SERVICE = "WALLET_SERVICE",
  WALLET_CONNECT = "WALLET_CONNECT",
}

const CONNECTED_WALLET_KEY = "connected_wallet";
const IS_WALLET_CONNECTED = "is_wallet_connected";

export const useWallet = () => {
  const { user: loggedInUser } = useUser();
  const { showModal, hideModal, MODAL_TYPES } = useGlobalModalContext();
  const { open, walletProvider, disconnectFromWalletConnect, walletAccount } =
    useWalletConnectService();

  const {
    address,
    connect,
    disconnect,
    sign,
    signer,
    send,
    showWallet,
    provider,
  } = useWalletService();
  const [connectedAddress, setConnectedAddress] = useState<
    string | null | undefined
  >(null);

  const walletConnectSigner = useMemo(() => {
    if (walletAccount.address && walletAccount.isConnected) {
      if (walletProvider) {
        const provider = new ethers.providers.Web3Provider(walletProvider);
        const signer = provider.getSigner();
        return signer;
      }
    }
  }, [walletAccount.address, walletAccount.isConnected, walletProvider]);

  const updateConnectedAccount = useCallback(() => {
    if (address || walletAccount.address) {
      const connected_wallet = getWalletType();
      if (connected_wallet) {
        if (connected_wallet == WalletEnum.WALLET_SERVICE) {
          if (address) {
            setConnectedAddress(address);
            return address;
          } else {
            return undefined;
          }
        } else if (connected_wallet == WalletEnum.WALLET_CONNECT) {
          if (walletAccount.address) {
            setConnectedAddress(walletAccount.address);
            return walletAccount.address;
          } else {
            return undefined;
          }
        }
      }
    } else {
      setConnectedAddress(undefined);
      return undefined;
    }
  }, [address, walletAccount.address]);

  useEffect(() => {
    const connectedAddress = updateConnectedAccount();

    if (loggedInUser?._id && connectedAddress) {
      if (loggedInUser._id.toLowerCase() !== connectedAddress.toLowerCase()) {
        showModal(MODAL_TYPES.WRONG_CONNECTED_ACCOUNT);
      } else {
        hideModal(MODAL_TYPES.WRONG_CONNECTED_ACCOUNT);
      }
    }
  }, [
    loggedInUser?._id,
    MODAL_TYPES,
    updateConnectedAccount,
    showModal,
    hideModal,
  ]);

  const getSigner = useCallback((): JsonRpcSigner | null => {
    const connected_wallet = getWalletType();
    if (connected_wallet) {
      if (
        connected_wallet == WalletEnum.WALLET_CONNECT &&
        walletProvider &&
        walletConnectSigner
      ) {
        return walletConnectSigner;
      } else if (connected_wallet == WalletEnum.WALLET_SERVICE) {
        return signer;
      }
    }
    return null;
  }, [walletProvider, walletConnectSigner, signer]);

  const getProvider = useCallback((): JsonRpcProvider => {
    return new ethers.providers.JsonRpcProvider(BlockchainConfig.rpcProvider);
  }, []);

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
    authType: "login" | "register" = "login",
    showError: boolean = true
  ): Promise<void> => {
    if (wallet == WalletEnum.WALLET_SERVICE) {
      setWalletType(wallet);
      await connect(authType);
      localStorage.setItem(IS_WALLET_CONNECTED, "true");
    } else if (wallet == WalletEnum.WALLET_CONNECT) {
      setWalletType(wallet);
      await open();
      localStorage.setItem(IS_WALLET_CONNECTED, "true");
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    const wallet = getWalletType();

    if (wallet == WalletEnum.WALLET_CONNECT) {
      if (walletProvider) {
        const provider = new ethers.providers.Web3Provider(walletProvider);
        const signer = provider.getSigner();
        const signature = await signer?.signMessage(message);
        return signature;
      }
    }
    return sign(message);
  };

  const sendTransaction = async (
    data: ethers.PopulatedTransaction,
    description?: string
  ): Promise<TransactionReceipt | undefined> => {
    const wallet = getWalletType();
    if (wallet == WalletEnum.WALLET_CONNECT) {
      if (walletProvider) {
        const provider = new ethers.providers.Web3Provider(walletProvider);

        const signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        const tx = signer.sendTransaction(data);
        return (await tx).wait(1);
      }
    } else {
      return send(data, description);
    }
  };

  const disconnectWallet = () => {
    const wallet = getWalletType();
    if (wallet == WalletEnum.WALLET_SERVICE) {
      disconnect();
    }
    if (wallet == WalletEnum.WALLET_CONNECT) {
      disconnectFromWalletConnect.disconnect();
    }
    localStorage.setItem(IS_WALLET_CONNECTED, "false");
    setConnectedAddress(undefined);
  };

  const openWallet = async () => {
    const type = getWalletType();
    if (type == WalletEnum.METAMASK) {
    } else if (type == WalletEnum.WALLET_CONNECT) {
      open();
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
    getProvider,
  };
};
