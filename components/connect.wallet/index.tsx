import { useState } from "react";

import useUser from "@/hooks/use.user";

import { useWallet } from "@/web3/hooks/use.wallet";

import Button from "@/components/button";
import ConnectWalletModal from "@/components/modal/connect-wallet-modal";

interface ConnectWalletProps {
  className?: string;
  notloginCheck?: boolean;
}

export const ConnectWalletComp: React.FC<ConnectWalletProps> = ({
  className,
  notloginCheck,
}) => {
  const { user: loggedInUser } = useUser();
  const { connectWallet, disconnectWallet } = useWallet();
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
      {connectWalletModal && (
        <ConnectWalletModal
          connectWallet={connectWallet}
          deactivate={disconnectWallet}
          loggedInUser={loggedInUser}
          setConnectWalletModal={setConnectWalletModal}
          notloginCheck={notloginCheck}
        />
      )}
    </>
  );
};
