import { BlockchainConfig } from "@/web3/blockchain/config";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { providers } from "ethers";

export function getDefaultProvider(
  rpcAddress: string
): providers.StaticJsonRpcProvider {
  return new providers.StaticJsonRpcProvider(rpcAddress);
}

export function getSigner(library: Web3Provider): JsonRpcSigner {
  if (!library) {
    return simpleRpcProvider().getSigner();
  }

  const signer = library.getSigner();
  if (!signer) {
    throw new Error("Invalid signer");
  }

  return signer;
}

export function simpleRpcProvider(): providers.StaticJsonRpcProvider {
  const address = BlockchainConfig.rpcProvider;
  if (!address) {
    throw new Error("invalid rpc address");
  }
  return getDefaultProvider(address);
}
