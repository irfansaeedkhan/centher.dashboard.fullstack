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

  const handleChainChanged = useCallback(
    (chainId: number): void => {
      if (chainId !== 0) {
        const chainInNumber = Number(chainId);
        if (chainInNumber === supportedChainId) {
          hideModalMethod();
        } else {
          showModalMethod();
        }
      }
    },
    [hideModalMethod, showModalMethod, supportedChainId]
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
    const listener = () => checkNetwork();
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
