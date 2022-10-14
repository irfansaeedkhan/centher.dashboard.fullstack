import { Web3Provider } from "@ethersproject/providers";

type Provider = ConstructorParameters<typeof Web3Provider>[0];

declare global {
  interface Window {
    ethereum: Provider | undefined;
  }
}
