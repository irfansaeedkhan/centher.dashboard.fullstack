import {
  MODAL_TYPES,
  useGlobalModalContext,
} from "@/components/modal/global-modal/global-modal";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useMemo } from "react";
import { MetaMaskInpageProvider } from "@metamask/providers";

export const useMetamask = () => {
  const { account, activate, library, deactivate } = useWeb3React();
  const { showModal, hideModal } = useGlobalModalContext();

  const supportedChainId = useMemo(() => {
    return process.env.NEXT_PUBLIC_APP_ENV == "production" ? 56 : 5; // 56 >> BSC , 5 >> GOERLI
  }, []);

  const showModalMethod = useCallback(() => {
    showModal(MODAL_TYPES.WRONG_NETWORK);
  }, [showModal]);

  const hideModalMethod = useCallback(() => {
    hideModal();
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
    if (window && window.ethereum) {
      checkNetwork();
      const ethereum = window.ethereum as unknown as MetaMaskInpageProvider;
      ethereum.on("chainChanged", () => checkNetwork());
    }
  }, [account, checkNetwork]);

  return {
    account,
    activate,
    library,
    deactivate,
  };
};
