import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useOnClickOutside } from "usehooks-ts";
import { LoggedInUser } from "@/models/user";
import {
  GradientArrowOutline,
  CentherIcon,
  NewWalletIcon,
} from "@/assets/svgs";
import { WalletEnum } from "@/web3/hooks/use.wallet";
import ModalContainer from "./modal-container";

interface Props {
  loggedInUser: LoggedInUser | undefined;
  notloginCheck?: boolean;
  connectedAddress: string | null | undefined;
  disconnectWallet: () => void;
  connectWallet: (wallet?: WalletEnum, showError?: boolean) => Promise<void>;
  onClose: () => void;
  open: boolean;
}

const ConnectWalletModal: React.FC<Props> = ({
  loggedInUser,
  notloginCheck,
  connectedAddress,
  disconnectWallet,
  connectWallet,
  onClose,
  open,
}) => {
  useEffect(() => {
    if (connectedAddress && !notloginCheck) {
      if (loggedInUser?._id.toLowerCase() !== connectedAddress?.toLowerCase()) {
        toast.error("Please connect to correct account");
        disconnectWallet();
      }
    }
  }, [loggedInUser, connectedAddress, notloginCheck, disconnectWallet]);

  const connectionWallet = async (wallet: WalletEnum) => {
    if (notloginCheck) {
      await connectWallet(wallet);
    } else {
      if (!loggedInUser) {
        toast.error("Please login to buy this nft");
        onClose();
        return;
      }
      await connectWallet(wallet);
    }
    onClose();
  };

  return (
    <ModalContainer
      modalId="connect-wallet-modal"
      isOpen={open}
      onClose={onClose}
      modalContentClassName="max-w-2xl p-6 rounded-2xl"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
    >
      <div className="flex items-center">
        <h3 className="flex-grow text-center text-xl font-semibold text-white">
          Connect to wallet
        </h3>
        <button className="text-white" onClick={onClose}>
          <IoClose className="h-6 w-6" />
        </button>
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
        <div className="gradient-border-3 w-full max-w-[400px] !rounded-xl p-[1px]">
          <div
            onClick={async () => {
              connectionWallet(WalletEnum.WALLET_SERVICE);
            }}
            className="flex w-full cursor-pointer items-center justify-between gap-10 !rounded-xl bg-popup-0 px-5 py-3"
          >
            <div className="flex items-center gap-3 fsm:gap-6">
              <CentherIcon />
              <h3 className="text-sm font-semibold text-white fmd:text-base">
                Wallet for dummies
              </h3>
            </div>
            <span>
              <GradientArrowOutline />
            </span>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ConnectWalletModal;
