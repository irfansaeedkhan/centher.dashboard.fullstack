import { customLog } from "@/utils/custom.log";
import { BigNumber, ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

import { getMarketplaceAddress, getPresaleAddress } from "./address.helpers";
import {
  getBusdContract,
  getMarketplaceContract,
  getPresaleContract,
  getStandardNFTContract,
} from "./contract.helpers";
import { parseErrorMsg } from "./utils";
import { delay, isEmpty } from "./utility";
import { getTokenContract, TokenName } from "../hooks/use.contracts.functions";

const MAX_SUPPLY = BigNumber.from("260000");

export const getTokenApproval = async (
  tokenName: TokenName,
  library: Web3Provider
) => {
  try {
    let loop = true;
    let tx = null;
    const presaleAddress = getPresaleAddress();

    const tokenContract = getTokenContract(tokenName, library.getSigner());
    if (!tokenContract) {
      throw new Error("Token contract not found");
    }

    const amount = ethers.utils.parseUnits(MAX_SUPPLY.toString());

    const { hash: approveHash } = await tokenContract.functions.approve(
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

export const buyNtrDao = async (
  tokenName: TokenName,
  amount: number,
  library: Web3Provider
) => {
  try {
    let loop = true;
    let tx = null;
    const presaleContract = getPresaleContract(library.getSigner());
    const purchaseAmount = ethers.utils.parseUnits(amount.toString(), 18);

    let tokenPurchase;
    let estimateGasTokenPurchase;

    if (tokenName === "BUSD") {
      tokenPurchase = presaleContract.functions.tokenPurchaseWithBUSD;
      estimateGasTokenPurchase =
        presaleContract.estimateGas.tokenPurchaseWithBUSD;
    } else if (tokenName === "NTR") {
      tokenPurchase = presaleContract.functions.tokenPurchaseWithNtr;
      estimateGasTokenPurchase =
        presaleContract.estimateGas.tokenPurchaseWithNtr;
    }

    if (!tokenPurchase || !estimateGasTokenPurchase) {
      throw new Error("Token cannot be purchased");
    }

    // console.log(
    //   "gas limit = ",
    //   (
    //     await presaleContract.estimateGas.tokenPurchaseWithBUSD(
    //       purchaseAmount
    //     )
    //   ).toNumber()
    // );
    const { hash: purchasedHash } = await tokenPurchase(purchaseAmount, {
      gasLimit: 500000,
    });

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
    console.dir(error);
    // customLog("[Buy token Error] = ", ["development"]);
    // customLog(error, ["development"]);

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

export const callApproveNFTToMarketplace = async (
  library: Web3Provider,
  collection: string
) => {
  try {
    const nftContract = getStandardNFTContract(library.getSigner(), collection);
    const operator = getMarketplaceAddress();
    const tx = await nftContract.functions.setApprovalForAll(operator, true);
    await tx.wait();
    return {
      success: true,
      hash: tx.hash,
    };
  } catch (error: any) {
    console.log("[Create Collection Error] = ", error);
    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};

export const callCreateCollection = async (
  library: Web3Provider,
  name: string,
  symbol: string,
  category: string,
  uri: string,
  maxsupply: number | null,
  fee: number
) => {
  try {
    const marketplaceContract = getMarketplaceContract(library.getSigner());
    const tx = await marketplaceContract.functions.createCollection(
      name,
      symbol,
      category,
      uri,
      maxsupply,
      { value: ethers.utils.parseEther(fee.toString()) }
    );
    await tx.wait();
    return {
      success: true,
      hash: tx.hash,
    };
  } catch (error: any) {
    console.log("[Create Collection Error] = ", error);
    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};

export const callCreateNFT = async (
  library: Web3Provider,
  collection: string,
  category: string,
  tokenUri: string,
  supply: number,
  isAuction: boolean,
  price: number,
  period: number,
  fee: number
) => {
  try {
    const marketplaceContract = getMarketplaceContract(library.getSigner());
    const tx = await marketplaceContract.functions.createItems(
      collection,
      category,
      tokenUri,
      supply,
      isAuction,
      ethers.utils.parseEther(price.toString()),
      period,
      { value: ethers.utils.parseEther(fee.toFixed(10)) }
    );
    await tx.wait();
    return {
      success: true,
      hash: tx.hash,
    };
  } catch (error: any) {
    console.log("[Create NFT Error] = ", error);
    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};

export const callCancelItemForSale = async (
  library: Web3Provider,
  collection: string,
  tokenId: number
) => {
  try {
    const marketplaceContract = getMarketplaceContract(library.getSigner());
    const tx = await marketplaceContract.functions.cancelItemForSale(
      collection,
      tokenId
    );
    await tx.wait();
    return {
      success: true,
      hash: tx.hash,
    };
  } catch (error: any) {
    console.log("[Cancel Item for Sale Error] = ", error);
    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};

export const callEditItemForSale = async (
  library: Web3Provider,
  collection: string,
  tokenId: number,
  newPrice: number
) => {
  try {
    const marketplaceContract = getMarketplaceContract(library.getSigner());
    const tx = await marketplaceContract.functions.editItemForSale(
      collection,
      tokenId,
      ethers.utils.parseEther(newPrice.toString())
    );
    await tx.wait();
    return {
      success: true,
      hash: tx.hash,
    };
  } catch (error: any) {
    console.log("[Edit Item For Sale Error] = ", error);
    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};

export const callListItemForSale = async (
  library: Web3Provider,
  collection: string,
  tokenId: number,
  newPrice: number
) => {
  try {
    const marketplaceContract = getMarketplaceContract(library.getSigner());
    const tx = await marketplaceContract.functions.listItemForSale(
      collection,
      tokenId,
      ethers.utils.parseEther(newPrice.toString())
    );
    await tx.wait();
    return {
      success: true,
      hash: tx.hash,
    };
  } catch (error: any) {
    console.log("[Edit Item For Sale Error] = ", error);
    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};

export const callBuyListedItem = async (
  library: Web3Provider,
  collection: string,
  tokenId: number,
  price: number
) => {
  try {
    const marketplaceContract = getMarketplaceContract(library.getSigner());
    const tx = await marketplaceContract.functions.buyForListedItem(
      collection,
      tokenId,
      { value: price }
    );
    await tx.wait();
    return {
      success: true,
      hash: tx.hash,
    };
  } catch (error: any) {
    console.log("[Edit Item For Sale Error] = ", error);
    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};

export const callCreateAuction = async (
  library: Web3Provider,
  collection: string,
  tokenId: number,
  startPrice: number,
  period: number
) => {
  try {
    const marketplaceContract = getMarketplaceContract(library.getSigner());
    const tx = await marketplaceContract.functions.createAuction(
      collection,
      tokenId,
      ethers.utils.parseEther(startPrice.toString()),
      period
    );
    await tx.wait();
    return {
      success: true,
      hash: tx.hash,
    };
  } catch (error: any) {
    console.log("[Edit Item For Sale Error] = ", error);
    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};

export const callBidOnAuction = async (
  library: Web3Provider,
  collection: string,
  tokenId: number,
  price: number
) => {
  try {
    const marketplaceContract = getMarketplaceContract(library.getSigner());
    const tx = await marketplaceContract.functions.bidOnAuction(
      collection,
      tokenId,
      { value: ethers.utils.parseEther(price.toString()) }
    );
    await tx.wait();
    return {
      success: true,
      hash: tx.hash,
    };
  } catch (error: any) {
    console.log("[Edit Item For Sale Error] = ", error);
    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};

export const callEndAuction = async (
  library: Web3Provider,
  collection: string,
  tokenId: number
) => {
  try {
    const marketplaceContract = getMarketplaceContract(library.getSigner());
    const tx = await marketplaceContract.functions.endAuction(
      collection,
      tokenId
    );
    await tx.wait();
    return {
      success: true,
      hash: tx.hash,
    };
  } catch (error: any) {
    console.log("[Edit Item For Sale Error] = ", error);
    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};

export const callCancelAuction = async (
  library: Web3Provider,
  collection: string,
  tokenId: number
) => {
  try {
    const marketplaceContract = getMarketplaceContract(library.getSigner());
    const tx = await marketplaceContract.functions.cancelAuction(
      collection,
      tokenId
    );
    await tx.wait();
    return {
      success: true,
      hash: tx.hash,
    };
  } catch (error: any) {
    console.log("[Edit Item For Sale Error] = ", error);
    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};
