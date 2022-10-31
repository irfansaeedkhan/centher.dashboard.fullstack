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

export const callApproveNFTToMarketplace = async (
  library: Web3Provider,
  collection: string
) => {
  try {
    const nftContract = getStandardNFTContract(library.getSigner(), collection);
    const operator = getMarketplaceAddress();
    const tx = await nftContract.functions.setApprovalForAll(operator, true);
    await tx.wait();
    console.log("sniper: tx: ", tx);
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
  uri: string,
  maxsupply: number,
  fee: number
) => {
  try {
    const marketplaceContract = getMarketplaceContract(library.getSigner());
    const tx = await marketplaceContract.functions.createCollection(
      name,
      symbol,
      uri,
      maxsupply,
      { value: ethers.utils.parseEther(fee.toString()) }
    );
    await tx.wait();
    console.log("sniper: tx: ", tx);
    console.log("sniper: maxsupply: ", maxsupply);
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
  tokenUri: string,
  supply: number,
  price: number,
  fee: number
) => {
  console.log("sniper: library: ", library);
  try {
    const marketplaceContract = getMarketplaceContract(library.getSigner());
    console.log("sniper: fee: ", fee);
    const tx = await marketplaceContract.functions.createItems(
      collection,
      tokenUri,
      supply,
      ethers.utils.parseEther(price.toString()),
      { value: ethers.utils.parseEther(fee.toFixed(10)) }
    );
    await tx.wait();
    console.log("sniper: tx: ", tx);
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
  console.log("sniper: library: ", library);
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
    console.log(
      "sniper: data: ",
      ethers.utils.parseEther(newPrice.toString()).toString()
    );
    console.log("sniper: collection: ", collection, tokenId);
    const tx = await marketplaceContract.functions.editItemForSale(
      collection,
      tokenId,
      ethers.utils.parseEther(newPrice.toString())
    );
    await tx.wait();
    console.log("sniper: tx: ", tx);
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
      newPrice
    );
    await tx.wait();
    console.log("sniper: tx: ", tx);
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
  console.log("sniper: price: ", price);
  try {
    const marketplaceContract = getMarketplaceContract(library.getSigner());
    const tx = await marketplaceContract.functions.buyForListedItem(
      collection,
      tokenId,
      { value: price }
    );
    await tx.wait();
    console.log("sniper: tx: ", tx);
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
    console.log("sniper: auction: ", collection, tokenId, startPrice, period);
    const tx = await marketplaceContract.functions.createAuction(
      collection,
      tokenId,
      ethers.utils.parseEther(startPrice.toString()),
      period
    );
    await tx.wait();
    console.log("sniper: tx: ", tx);
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
    console.log("sniper: call bid on auction: ", collection, tokenId, price);
    const tx = await marketplaceContract.functions.bidOnAuction(
      collection,
      tokenId,
      { value: ethers.utils.parseEther(price.toString()) }
    );
    await tx.wait();
    console.log("sniper: tx: ", tx);
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
    console.log("sniper: tx: ", tx);
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
    console.log("sniper: tx: ", tx);
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
