import { useState } from "react";
import Button from "@/components/button";
import ConnectWalletModal from "@/components/modal/connect-wallet-modal";
import { WalletEnum } from "@/web3/hooks/use.wallet";

interface ConnectWalletProps {
  authType: "login" | "register";
  className?: string;
  connectWallet: (
    wallet?: WalletEnum,
    authType?: "login" | "register",
    showError?: boolean
  ) => Promise<void>;
}

export const ConnectWalletComp: React.FC<ConnectWalletProps> = ({
  authType,
  className,
  connectWallet,
}) => {
  const [connectWalletModal, setConnectWalletModal] = useState(false);

  return (
    <>
      <Button
        title={"Connect Wallet"}
        variant="primary"
        onClick={() => {
          setConnectWalletModal(true);
        }}
        className={className}
      />
      <ConnectWalletModal
        open={connectWalletModal}
        authType={authType}
        connectWallet={connectWallet}
        onClose={() => setConnectWalletModal(false)}
      />
    </>
  );
};
