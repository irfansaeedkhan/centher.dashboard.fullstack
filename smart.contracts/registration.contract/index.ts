import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import RegistrationABI from "./abi.registration.json";

let contractAddress = "0x68F0C2E6bEA1bf3Cc36449793300D94c171F0ef5";

if (process.env.NODE_ENV === "production") {
  contractAddress = "0x0000000000000000000000000000000000000000";
}

export const getRegistrationContract = (
  providerOrSigner: Provider | Signer
) => {
  return new Contract(contractAddress, RegistrationABI, providerOrSigner);
};
