import { InjectedConnector } from "@web3-react/injected-connector";

const supportedChainIds: number[] = [];

if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
  supportedChainIds.push(56);
} else {
  supportedChainIds.push(97);
}

export const injectedConnector = new InjectedConnector({
  supportedChainIds,
});
