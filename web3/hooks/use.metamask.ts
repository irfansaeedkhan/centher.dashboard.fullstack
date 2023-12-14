import { useWeb3React } from "@web3-react/core";

export const useMetamask = () => {
  const { account, activate, library, deactivate } = useWeb3React();

  return {
    account,
    activate,
    library,
    deactivate,
  };
};
