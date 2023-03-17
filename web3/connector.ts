import { InjectedConnector } from "@web3-react/injected-connector";
import { BlockchainConfig } from "./blockchain/config";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [BlockchainConfig.network],
});
