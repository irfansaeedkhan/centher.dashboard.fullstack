import { useCallback, useEffect, useMemo } from "react";
import {
  useDisconnect,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";
import { MetaMaskInpageProvider } from "@metamask/providers";
import {
  MODAL_TYPES,
  useGlobalModalContext,
} from "@/components/modal/global-modal/global-modal";

export const useWalletConnectService = () => {
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();
  const disconnectFromWalletConnect = useDisconnect();
  const walletAccount = useWeb3ModalAccount();
  const { showModal, hideModal } = useGlobalModalContext();

  const supportedChainId = useMemo(() => {
    return process.env.NEXT_PUBLIC_APP_ENV == "production" ? 56 : 11155111; // 56 >> BSC , 11155111 >> SEPOLIA
  }, []);

  const showModalMethod = useCallback(() => {
    showModal(MODAL_TYPES.WRONG_NETWORK);
  }, [showModal]);

  const hideModalMethod = useCallback(() => {
    hideModal(MODAL_TYPES.WRONG_NETWORK);
  }, [hideModal]);

  // The app's own connection flag: connectWallet sets it "true" for both
  // the WalletConnect and the wallet-service paths, disconnectWallet sets
  // it "false". Web3Modal's isConnected covers the WalletConnect path.
  // Either one means the user actually connected a wallet through the app.
  // A merely installed injected provider (MetaMask on some other chain)
  // is NOT a connection, and must never trigger the modal.
  const isWalletConnectedNow = useCallback((): boolean => {
    if (walletAccount.isConnected) {
      return true;
    }
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("is_wallet_connected") === "true";
      } catch {
        return false;
      }
    }
    return false;
  }, [walletAccount.isConnected]);

  const isDismissedThisSession = useCallback((): boolean => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("wrong_network_dismissed") === "1";
      } catch {
        return false;
      }
    }
    return false;
  }, []);

  const handleChainChanged = useCallback(
    (chainId: number): void => {
      if (chainId !== 0) {
        const chainInNumber = Number(chainId);
        if (chainInNumber === supportedChainId) {
          if (typeof window !== "undefined") {
            try {
              sessionStorage.removeItem("wrong_network_dismissed");
            } catch {
              // ignore storage errors
            }
          }
          hideModalMethod();
        } else {
          // Never block a user who has not connected a wallet: the whole
          // app (feed, chat, staking pages, everything non-chain) must stay
          // usable without any wallet connection.
          if (!isWalletConnectedNow()) {
            hideModalMethod();
            return;
          }
          // A dismissed warning stays dismissed for this session until the
          // chain changes, so closing it once is enough.
          if (isDismissedThisSession()) {
            hideModalMethod();
            return;
          }
          showModalMethod();
        }
      }
    },
    [
      hideModalMethod,
      showModalMethod,
      supportedChainId,
      isWalletConnectedNow,
      isDismissedThisSession,
    ]
  );

  const checkNetwork = useCallback(
    async (chainId = 0) => {
      try {
        let CID = 0;
        if (chainId != 0) {
          CID = chainId;
        } else if (window && window.ethereum) {
          const ethereum = window.ethereum as unknown as MetaMaskInpageProvider;
          const c_id = await ethereum.request({ method: "eth_chainId" });
          CID = c_id as number;
        }
        handleChainChanged(CID);
      } catch (error) {
        console.error("Error fetching chain ID:", error);
      }
    },
    [handleChainChanged]
  );

  useEffect(() => {
    // A chain change re-enables the warning: a dismissal applies to the
    // chain the user dismissed, not to every future chain.
    const listener = () => {
      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem("wrong_network_dismissed");
        } catch {
          // ignore storage errors
        }
      }
      checkNetwork();
    };
    if (window && window.ethereum) {
      checkNetwork();
      const ethereum = window.ethereum as unknown as MetaMaskInpageProvider;
      ethereum.on("chainChanged", listener);
    }
    return () => {
      if (window && window.ethereum) {
        const ethereum = window.ethereum as unknown as MetaMaskInpageProvider;
        ethereum.removeListener("chainChanged", listener);
      }
    };
  }, [walletAccount.address, checkNetwork]);

  return {
    open,
    walletProvider,
    disconnectFromWalletConnect,
    walletAccount,
  };
};
