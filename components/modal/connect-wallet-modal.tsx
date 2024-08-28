import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { GradientArrowOutline, X369XIcon, NewWalletIcon } from "@/assets/svgs";
import { WalletEnum } from "@/web3/hooks/use.wallet";
import ModalContainer from "./modal-container";

interface Props {
  open: boolean;
  authType: "login" | "register";
  connectWallet: (
    wallet?: WalletEnum,
    authType?: "login" | "register",
    showError?: boolean
  ) => Promise<void>;
  onClose: () => void;
  crossIcon?: boolean;
}

const ConnectWalletModal: React.FC<Props> = ({
  open,
  authType,
  connectWallet,
  onClose,
  crossIcon = true,
}) => {
  const [runningOnInjectedProvider, setRunningOnInjectedProvider] =
    useState<boolean>(false);

  useEffect(() => {
    // solution is
    // first check if app is running on mobile
    // then check if window.ethereum is exist
    // if true , it means the app is running on custom browser that window.ethereum is injected ( metamask browser)
    const hasEthereum = window.ethereum;
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      setRunningOnInjectedProvider(!!hasEthereum);
    } else {
      setRunningOnInjectedProvider(false);
    }
  }, []);

  const connectionWallet = async (wallet: WalletEnum) => {
    await connectWallet(wallet, authType);
    onClose();
  };

  return (
    <ModalContainer
      modalId="connect-wallet-modal"
      isOpen={open}
      onClose={onClose}
      modalContentClassName="max-w-2xl p-6 rounded-2xl"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <div className="flex items-center">
        <h3 className="flex-grow text-center text-xl font-semibold text-white">
          Connect to wallet
        </h3>
        {crossIcon && (
          <button className="text-white" onClick={onClose}>
            <IoClose className="h-6 w-6" />
          </button>
        )}
      </div>
      <div className="mb-3 mt-8 flex w-full justify-center px-5 md:px-10">
        <p className="w-full max-w-[366px] text-center text-xs text-gray-shade-14">
          Please Connect your wallet to continue, the system support following
          wallet.
        </p>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-5 px-5 md:px-10">
        <div className="gradient-border-3 w-full max-w-[400px] !rounded-xl p-[1px]">
          <div
            onClick={async () => {
              connectionWallet(WalletEnum.WALLET_CONNECT);
            }}
            className="flex w-full cursor-pointer items-center justify-between gap-10 !rounded-xl bg-popup-0 px-5 py-3"
          >
            <div className="flex items-center gap-3 fsm:gap-6">
              <NewWalletIcon />
              <h3 className="text-sm font-semibold text-white fmd:text-base">
                Wallet Connect
              </h3>
            </div>
            <span>
              <GradientArrowOutline />
            </span>
          </div>
        </div>
        {!runningOnInjectedProvider ? (
          <div className="gradient-border-3 w-full max-w-[400px] !rounded-xl p-[1px]">
            <div
              onClick={async () => {
                connectionWallet(WalletEnum.WALLET_SERVICE);
              }}
              className="flex w-full cursor-pointer items-center justify-between gap-10 !rounded-xl bg-popup-0 px-5 py-3"
            >
              <div className="flex items-center gap-3 fsm:gap-6">
                <X369XIcon />
                <h3 className="text-sm font-semibold text-white fmd:text-base">
                  Wallet for Dummies
                </h3>
              </div>
              <span>
                <GradientArrowOutline />
              </span>
            </div>
          </div>
        ) : null}
        <p className="w-full max-w-[366px] text-center text-xs text-gray-shade-14">
          Feeling lost? Login to 369x like you do with other social networks
          simply using username and password instead!
        </p>
      </div>
    </ModalContainer>
  );
};

export default ConnectWalletModal;
