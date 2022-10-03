import {
  getBusdAddress,
  getNtrdaoAddress,
  getPresaleAddress,
} from "./addressHelper";
import { useWeb3React } from "@web3-react/core";
import { Provider, Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { parseEther } from "@ethersproject/units";
import { BigNumber, ethers } from "ethers";
import { simpleRpcProvider } from "./providers";
import {
  getBusdContract,
  getNtrdaoContract,
  getPresaleContract,
} from "./contractHelper";
import { parseErrorMsg } from "./utils";
import { delay, isEmpty } from "./utility";

const dao_abi = require("../abis/ntrdao.json");
const busd_abi = require("../abis/busd.json");

const MAX_SUPPLY = BigNumber.from("260000");

export const setBusdApprove = async (library: Web3Provider) => {
  try {
    let loop = true;
    let tx = null;
    const presaleAddress = getPresaleAddress();
    const busdContract = getBusdContract(library.getSigner());
    const amount = ethers.utils.parseUnits(MAX_SUPPLY.toString());

    const { hash: approveHash } = await busdContract.functions.approve(
      presaleAddress,
      amount
    );
    while (loop) {
      tx = await library.getTransactionReceipt(approveHash);
      if (isEmpty(tx)) {
        await delay(300);
      } else {
        loop = false;
      }
    }
    return {
      success: true,
      hash: approveHash,
    };
  } catch (error: any) {
    console.log("[Busd Approve Error] = ", error);
    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};

export const buyNtrDao = async (library: Web3Provider, amount: BigNumber) => {
  try {
    let loop = true;
    let tx = null;
    const presaleContract = getPresaleContract(library.getSigner());
    const purchaseAmount = ethers.utils.parseUnits(amount.toString());
    const { hash: purchasedHash } =
      await presaleContract.functions.tokenPurchase(purchaseAmount);
    while (loop) {
      tx = await library.getTransactionReceipt(purchasedHash);
      if (isEmpty(tx)) {
        await delay(300);
      } else {
        loop = false;
      }
    }
    return {
      success: true,
      hash: purchasedHash,
    };
  } catch (error: any) {
    console.log("[Buy token Error] = ", error);
    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};

export const claimNtrTokens = async (
  library: Web3Provider,
  round: number,
  index: number
) => {
  try {
    let loop = true;
    let tx = null;
    const presaleContract = getPresaleContract(library.getSigner());
    const { hash: purchasedHash } = await presaleContract.functions.claimTokens(
      round,
      index
    );
    while (loop) {
      tx = await library.getTransactionReceipt(purchasedHash);
      if (isEmpty(tx)) {
        await delay(300);
      } else {
        loop = false;
      }
    }
    return {
      success: true,
      hash: purchasedHash,
    };
  } catch (error: any) {
    console.log("[Claim token Error] = ", error);
    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};
