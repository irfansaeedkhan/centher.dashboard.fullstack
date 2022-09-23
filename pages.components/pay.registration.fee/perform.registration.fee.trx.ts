import { ethers } from "ethers";
import { TransactionResponse, Web3Provider } from "@ethersproject/providers";

import { User } from "@/models/user";

export const performRegistrationFeeTrx = async (
  library: Web3Provider,
  user: User,
  registrationFee: number
): Promise<Result> => {
  try {
    // Get the signer and account address from the library
    const signer = library.getSigner();
    const address = await signer.getAddress();

    // Check if the connected account address is the same as the user's registered account address
    if (address.toLowerCase() !== user.account_address) {
      return {
        status: "error",
        message: "account_address_mismatch",
        message_description: `Please connect your wallet to the correct account: ${user.account_address}`,
        data: null,
      };
    }

    // Get BNB balance of the user's account
    const bnbBalance = await library.getBalance(address);

    // If the user's BNB balance is less than the registration fee, return error
    if (ethers.utils.formatEther(bnbBalance) < registrationFee.toString()) {
      return {
        status: "error",
        message: "insufficient_funds",
        message_description:
          "You don't have enough BNBs to pay the registration fee",
        data: null,
      };
    }

    // Send the transaction
    const tx = await signer.sendTransaction({
      to: process.env.NEXT_PUBLIC_ADMIN_ACCOUNT,
      value: ethers.utils.parseEther(registrationFee.toString()),
      from: address,
    });

    return {
      status: "success",
      message: "registration_fee_paid",
      message_description: "Registration fee paid successfully",
      data: tx,
    };
  } catch (error: any) {
    console.dir(error);

    if (error.code === "ACTION_REJECTED") {
      return {
        status: "error",
        message: "user_denial",
        message_description: "Transaction rejected",
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

interface BaseResult {
  message: string;
  message_description: string;
}

interface ErrorResult extends BaseResult {
  status: "error";
  data: null;
}

interface SuccessResult extends BaseResult {
  status: "success";
  data: TransactionResponse;
}

type Result = ErrorResult | SuccessResult;
