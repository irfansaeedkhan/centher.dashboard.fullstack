import { BigNumber, PopulatedTransaction, ethers } from "ethers";
import {
  TransactionReceipt,
  TransactionResponse,
  Web3Provider,
} from "@ethersproject/providers";

import { SignupState } from "./form.fields.data";
import { SmartContractProvider } from "@/web3/blockchain/providers/smart.contract.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";

export const registerWithSmartContract = async (
  library: ethers.providers.JsonRpcSigner,
  signupData: SignupState,
  fee: string
): Promise<{
  status: "success";
  message: string;
  message_description: string;
  data: TransactionResponse | TransactionReceipt;
}> => {
  try {
    // Get the signer and account address from the library
    const signer = library;
    const address = await signer.getAddress();
    const registrationContract = SmartContractProvider.getContract(
      SmartContractName.REGISTRATION,
      signer
    );

    // Check if the connected account address is the same as the user's registered account address
    if (address.toLowerCase() !== signupData.account_address.toLowerCase()) {
      throw {
        status: "app_error",
        message: "account_address_mismatch",
        message_description: `Please connect your wallet to the correct account!`,
      };
    }

    // Check connected account address is same as referred_by address
    if (address.toLowerCase() === signupData.referred_by.toLowerCase()) {
      throw {
        status: "app_error",
        message: "own_referral_address",
        message_description: `You can not use your own address as referral address!`,
      };
    }

    // Only check the validity of referral address if the user has enetered one
    if (signupData.referred_by.trim() !== "") {
      // Check if the referral address is valid
      isAccountAddressValid(
        signupData.referred_by,
        `Referral address is not valid!`
      );

      // Check if the referral address is registered
      if (!(await registrationContract.isRegistered(signupData.referred_by))) {
        throw {
          status: "app_error",
          message: "referral_address_not_registered",
          message_description: "Referral address is not registered",
        };
      }
    }

    // Get balance of the user's account
    const bnbBalance = await library.getBalance();

    let tx: TransactionResponse;

    if (signupData.referred_by !== "") {
      // If BNB balance is less than estimated gas fee, return error
      if (
        bnbBalance.lt(
          await registrationContract.estimateGas.registerWithReferrer(
            signupData.referred_by
          )
        )
      ) {
        throw {
          status: "app_error",
          message: "insufficient_funds",
          message_description: `You don't have enough balance to pay the gas fee`,
        };
      }
      tx = await registrationContract.registerWithReferrer(
        signupData.referred_by
      );
    } else {
      // Convert registration fee to BigNumber
      const registrationFee = ethers.utils.parseEther(fee);

      // If the user's balance is less than the registration fee, return error
      if (bnbBalance.lt(registrationFee)) {
        throw {
          status: "app_error",
          message: "insufficient_funds",
          message_description: `You don't have enough balance to pay the registration fee`,
        };
      }

      let gasPrice = await library.getGasPrice();

      if (gasPrice.lt(ethers.utils.parseUnits("10", "gwei"))) {
        gasPrice = ethers.utils.parseUnits("10", "gwei");
      }

      tx = await registrationContract.registerWithoutReferrer({
        value: ethers.utils.hexlify(registrationFee),
        gasPrice: ethers.utils.hexlify(gasPrice),
      });
      await tx.wait(2);
    }

    return {
      status: "success",
      message: "registration_successful",
      message_description: "You have successfully registered",
      data: tx,
    };
  } catch (error: any) {
    console.log(error);
    if (error.code === "ACTION_REJECTED") {
      throw {
        status: "app_error",
        message: "user_denial",
        message_description: "Transaction rejected",
      };
    }
    if (error.reason?.toLowerCase()?.includes("user_already_registered")) {
      throw {
        status: "app_error",
        message: "user_already_registered",
        message_description: "You are already registered",
      };
    }

    if (error.status === "app_error") {
      throw error;
    }

    throw {
      status: "app_error",
      message: "trx_error",
      message_description:
        "Something went wrong while registering. Please try again later",
    };
  }
};

export const getRegistrationFee = async (
  signer: ethers.providers.JsonRpcSigner,
  signupData: SignupState
) => {
  const registrationContract = SmartContractProvider.getContract(
    SmartContractName.REGISTRATION,
    signer.provider
  );
  let registrationFee: BigNumber;

  if (signupData.referred_by.trim() !== "") {
    // Check if referred_by address is valid
    isAccountAddressValid(
      signupData.referred_by,
      `Referral address is not valid!`
    );
    registrationFee =
      (await registrationContract.registrationFeeWithReferrer()) as BigNumber;
  } else {
    registrationFee =
      (await registrationContract.registrationFeeWithoutReferrer()) as BigNumber;
  }

  return ethers.utils.formatEther(registrationFee);
};

const isAccountAddressValid = (address: string, errorMessage?: string) => {
  const error = {
    status: "app_error",
    message: "invalid_account_address",
    message_description: errorMessage || "Account address is not valid!",
  };

  if (
    !ethers.utils.isAddress(address) ||
    address.toLowerCase() === "0x0000000000000000000000000000000000000000"
  ) {
    throw error;
  }

  return true;
};
