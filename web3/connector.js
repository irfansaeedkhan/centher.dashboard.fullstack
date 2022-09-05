import { InjectedConnector } from "@web3-react/injected-connector";

const supportedChainIds = [];

if (process.env.NODE_ENV === "production") {
  supportedChainIds.push(56);
} else {
  supportedChainIds.push(97);
}

export const injectedConnector = new InjectedConnector({
  supportedChainIds,
});
