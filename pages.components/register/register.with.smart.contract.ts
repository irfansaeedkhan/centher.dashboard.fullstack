// React, Next, NPM Packages
import { BigNumber, ethers } from "ethers";
import { TransactionResponse, Web3Provider } from "@ethersproject/providers";

// App imports
import { getRegistrationContract } from "@/web3/utils/contract.helpers";

// Current directory imports
import { SignupState } from "./form.fields.data";

export const registerWithSmartContract = async (
  library: Web3Provider,
  signupData: SignupState
): Promise<{
  status: "success" | "error";
  message: string;
  message_description: string;
  data: TransactionResponse | null;
}> => {
  try {
    // Get the signer and account address from the library
    const signer = library.getSigner();
    const address = await signer.getAddress();
    const registrationContract = getRegistrationContract(signer);

    // Check if the connected account address is the same as the user's registered account address
    if (address.toLowerCase() !== signupData.account_address.toLowerCase()) {
      return {
        status: "error",
        message: "account_address_mismatch",
        message_description: `Please connect your wallet to the correct account!`,
        data: null,
      };
    }

    // Get BNB balance of the user's account
    const bnbBalance = await library.getBalance(address);

    // If referred_by is not empty, then the user is registering with a referral
    let registrationFee: BigNumber;
    if (signupData.referred_by !== "") {
      registrationFee =
        (await registrationContract.registrationFeeWithReferrer()) as BigNumber;
    } else {
      registrationFee =
        (await registrationContract.registrationFeeWithoutReferrer()) as BigNumber;
    }

    // If the user's BNB balance is less than the registration fee, return error
    if (bnbBalance.lt(registrationFee)) {
      return {
        status: "error",
        message: "insufficient_funds",
        message_description:
          "You don't have enough BNBs to pay the registration fee",
        data: null,
      };
    }

    const gasPrice = await library.getGasPrice();

    let tx: TransactionResponse;

    if (signupData.referred_by !== "") {
      tx = await registrationContract.registerWithReferrer(
        signupData.referred_by,
        {
          value: ethers.utils.hexlify(registrationFee),
          gasPrice: ethers.utils.hexlify(gasPrice),
        }
      );
    } else {
      tx = await registrationContract.registerWithoutReferrer({
        value: ethers.utils.hexlify(registrationFee),
        gasPrice: ethers.utils.hexlify(gasPrice),
      });
    }

    await tx.wait();

    return {
      status: "success",
      message: "registration_fee_paid",
      message_description: "Registration fee paid successfully",
      data: tx,
    };
  } catch (error: any) {
    if (error.code === "ACTION_REJECTED") {
      return {
        status: "error",
        message: "user_denial",
        message_description: "Transaction rejected",
        data: null,
      };
    }
    if (error.reason?.toLowerCase()?.includes("duplicated id")) {
      return {
        status: "error",
        message: "user_already_registered",
        message_description: "You have already paid the registration fee",
        data: null,
      };
    }
    return {
      status: "error",
      message: "trx_error",
      message_description:
        "Something went wrong while paying the registration fee",
      data: null,
    };
  }
};
