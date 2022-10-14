import { Web3Provider } from "@ethersproject/providers";

type Provider = ConstructorParameters<typeof Web3Provider>[0];

export function getLibrary(provider: Provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}
