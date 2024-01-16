import { useState } from "react";
import useUser from "@/hooks/use.user";
import Button from "@/components/button";
import ConnectWalletModal from "@/components/modal/connect-wallet-modal";
import { WalletEnum } from "@/web3/hooks/use.wallet";

interface ConnectWalletProps {
  className?: string;
  notloginCheck?: boolean;
  connectedAddress: string | null | undefined;
  disconnectWallet: () => void;
  connectWallet: (wallet?: WalletEnum, showError?: boolean) => Promise<void>;
}

export const ConnectWalletComp: React.FC<ConnectWalletProps> = ({
  className,
  notloginCheck,
  disconnectWallet,
  connectWallet,
  connectedAddress,
}) => {
  const { user: loggedInUser } = useUser();
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
        loggedInUser={loggedInUser}
        onClose={() => setConnectWalletModal(false)}
        open={connectWalletModal}
        notloginCheck={notloginCheck}
        connectWallet={connectWallet}
        connectedAddress={connectedAddress}
        disconnectWallet={disconnectWallet}
      />
    </>
  );
};
