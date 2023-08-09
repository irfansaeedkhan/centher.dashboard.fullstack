import { JsonRpcSigner } from "@ethersproject/providers";
import { Contract } from "ethers";

export type OptionalType<T> = T | null | undefined;

export interface Web3 {
  contract: OptionalType<Contract>;
  signer: OptionalType<JsonRpcSigner>;
}
