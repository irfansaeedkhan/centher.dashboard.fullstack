import { ethers } from "ethers";
import { Provider } from "@ethersproject/providers";

import { NullOrUndefined } from "@/models/common";

import { getRegistrationContract } from "@/smart.contracts/registration.contract";

export const getRegistrationFee = async (
  provider: Provider,
  referrer: string | NullOrUndefined
) => {
  const contract = getRegistrationContract(provider);

  console.log(contract);

  if (referrer) {
    const fee = await contract.registrationFeeWithSponsor();
    return Number(ethers.utils.formatEther(fee));
  } else {
    const fee = await contract.registrationFeeWithoutSponsor();
    return Number(ethers.utils.formatEther(fee));
  }
};
