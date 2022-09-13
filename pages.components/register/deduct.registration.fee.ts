import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

interface DeductRegistrationFeeParams {
  library: Web3Provider;
  referralSignup: boolean;
}

export const deductRegistrationFee = async ({
  library,
  referralSignup,
}: DeductRegistrationFeeParams) => {
  const signer = library.getSigner();

  // Check if user has enough balance to pay for registration fee
  const balance = await signer.getBalance();
  const registrationFee = ethers.utils.parseEther(
    referralSignup
      ? process.env.NEXT_PUBLIC_SIGNUP_REGISTRATION_FEE_BNB_WITH_REFERRAL!
      : process.env.NEXT_PUBLIC_SIGNUP_REGISTRATION_FEE_BNB_WITHOUT_REFERRAL!
  );

  if (balance.lt(registrationFee)) {
    return {
      error: {
        message: "Insufficient balance to pay for registration fee",
      },
      trx_hash_bnb: null,
    };
  }

  const tx = {
    to: process.env.NEXT_PUBLIC_ADMIN_ACCOUNT_FOR_BNB_FEE,
    value: registrationFee,
  };

  try {
    const receipt = await signer.sendTransaction(tx);
    await receipt.wait();

    return {
      trx_hash_bnb: receipt.hash,
      error: null,
    };
  } catch (error: any) {
    let message = "Something went wrong";

    if (error?.code === "ACTION_REJECTED") {
      message = "Transaction cancelled";
    }

    return {
      error: {
        message,
      },
      trx_hash_bnb: null,
    };
  }
};
