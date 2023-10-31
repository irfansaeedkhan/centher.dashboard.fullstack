import React from "react";
import toast from "react-hot-toast";
import { LoggedInUser } from "@/models/user";
import { GradientArrowOutline, MetamaskIcon2 } from "@/assets/svgs";
import { CustomNewModal } from "@/components/modal/custom.new.modal";

interface Props {
  setConnectWalletModal: (value: boolean) => void;
  loggedInUser: LoggedInUser | undefined;
  deactivate: () => void;
  connectWallet: any;
}

const ConnectWalletModal: React.FC<Props> = ({
  setConnectWalletModal,
  loggedInUser,
  deactivate,
  connectWallet,
}) => {
  return (
    <CustomNewModal
      onClose={() => {
        setConnectWalletModal(false);
      }}
      title={"Connect to wallet"}
    >
      <div className="mb-8 flex w-full justify-center px-5 md:px-10">
        <p className="mt-2 w-full max-w-[366px] text-center text-xs text-gray-shade-14">
          Please Connect your wallet to continue, the system support following
          wallet.
        </p>
      </div>
      <div className="flex w-full justify-center px-5 md:px-10">
        <div className="gradient-border-3 w-full max-w-[400px] !rounded-xl p-[1px]">
          <div
            onClick={async () => {
              if (!loggedInUser) {
                toast.error("Please login to buy this nft");
                setConnectWalletModal(false);
                return;
              }
              const _account = await connectWallet();
              if (loggedInUser._id.toLowerCase() !== _account?.toLowerCase()) {
                toast.error("Please connect to correct account");
                deactivate();
              }
              setConnectWalletModal(false);
            }}
            className="flex w-full cursor-pointer items-center justify-between gap-10 !rounded-xl px-5 py-3"
          >
            <div className="flex items-center gap-3 fsm:gap-6">
              <MetamaskIcon2 />
              <h3 className="text-sm font-semibold text-white fmd:text-base">
                Metamask
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

export default ConnectWalletModal;
