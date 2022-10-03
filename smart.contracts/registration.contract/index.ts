import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import RegistrationABI from "./abi.registration.json";

let contractAddress = "0xc456a1e6ac909f9881af50aee8fe9bb25a8615db";

if (process.env.NODE_ENV === "production") {
  contractAddress = "0x0000000000000000000000000000000000000000";
}

export const getRegistrationContract = (
  providerOrSigner: Provider | Signer
) => {
  return new Contract(contractAddress, RegistrationABI, providerOrSigner);
};
