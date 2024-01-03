import React, { useMemo } from "react";
import { useGlobalModalContext } from "./global-modal";
import { CustomNewModal } from "../custom.new.modal";
import { GradientArrowOutline } from "@/assets/svgs";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { BlockchainConfig } from "@/web3/blockchain/config";

const Networks = {
  "0x5": {
    chainName: "Goerli",
    rpc: BlockchainConfig.rpcProvider,
    nativeCurrency: {
      name: "GoerliETH",
      symbol: "GoerliETH",
      decimals: 18,
    },
    blockExplorerUrls: BlockchainConfig.scanner.url,
  },
  "0x38": {
    chainName: "BSC",
    rpc: BlockchainConfig.rpcProvider,
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    blockExplorerUrls: BlockchainConfig.scanner.url,
  },
};
export const WrongNetworkModal = () => {
  const { hideModal } = useGlobalModalContext();

  const supportedChainId = useMemo(() => {
    return process.env.NEXT_PUBLIC_APP_ENV == "production" ? "0x38" : "0x5"; // 0x38 >> BSC , 0x5 >> GOERLI
  }, []);

  const addNetwork = () => {
    const provider = window.ethereum as unknown as MetaMaskInpageProvider;
    if (provider) {
      provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: supportedChainId,
            rpcUrls: [Networks[supportedChainId].rpc],
            chainName: Networks[supportedChainId].chainName,
            nativeCurrency: {
              name: Networks[supportedChainId].nativeCurrency.name,
              symbol: Networks[supportedChainId].nativeCurrency.symbol,
              decimals: Networks[supportedChainId].nativeCurrency.decimals,
            },
            blockExplorerUrls: [Networks[supportedChainId].blockExplorerUrls],
          },
        ],
      });
    }
  };
  const changeNetwork = async () => {
    try {
      const provider = window.ethereum as unknown as MetaMaskInpageProvider;
      if (provider) {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: supportedChainId }],
        });
      }
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        addNetwork();
      }
    }
  };
  return (
    <CustomNewModal
      onClose={() => {
        hideModal();
      }}
      disable="yes"
      title={"Wrong Network"}
    >
      <div className="mb-8 flex w-full justify-center px-5 md:px-10">
        <p className="mt-2 w-full max-w-[366px] text-center text-xs text-gray-shade-14">
          You are connected to wrong network
        </p>
      </div>
      <div className="ml-auto flex w-full  flex-col items-center  justify-center gap-2 px-5 md:px-10">
        <div className="gradient-border-3 w-full max-w-[400px] !rounded-xl p-[1px]">
          <div
            onClick={() => changeNetwork()}
            className="flex w-full cursor-pointer items-center justify-between gap-10 !rounded-xl px-5 py-3"
          >
            <div className="flex items-center gap-3 fsm:gap-6">
              <h3 className="text-sm font-semibold text-white fmd:text-base">
                Connect To BSC
              </h3>
            </div>
            <span>
              <GradientArrowOutline />
            </span>
          </div>
        </div>
      </div>
    </CustomNewModal>
  );
};
