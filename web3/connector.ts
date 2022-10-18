import { InjectedConnector } from "@web3-react/injected-connector";

import { CHAIN } from "./constants/common";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [CHAIN],
});
