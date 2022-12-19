import { customLog } from "@/utils/custom.log";
import { BigNumber, ethers } from "ethers";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";

import { getMarketplaceAddress, getPresaleAddress } from "./address.helpers";
import {
  getBusdContract,
  getMarketplaceContract,
  getNTRContract,
  getNtrdaoContract,
  getPresaleContract,
  getStandardNFTContract,
} from "./contract.helpers";
import { parseErrorMsg } from "./utils";
import { delay, isEmpty } from "./utility";

const MAX_SUPPLY = BigNumber.from("260000");

export type TokenName = "BUSD" | "NTR" | "CTHR";

export const getTokenContract = (
  tokenName: TokenName,
  library: Web3Provider | JsonRpcSigner
) => {
  if (tokenName === "BUSD") {
    return getBusdContract(library);
  } else if (tokenName === "NTR") {
    return getNTRContract(library);
  } else if (tokenName === "CTHR") {
    return getNtrdaoContract(library);
  }
};

export const getTokenApproval = async (
  tokenName: TokenName,
  library: Web3Provider
) => {
  try {
    const presaleAddress = getPresaleAddress();

    const tokenContract = getTokenContract(tokenName, library.getSigner());
    if (!tokenContract) {
      throw new Error("Token contract not found");
    }

    const amount = ethers.utils.parseUnits(MAX_SUPPLY.toString());

    const tx = await tokenContract.functions.approve(presaleAddress, amount);
    await tx.wait();

    return {
      success: true,
      hash: tx.hash,
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
    const presaleContract = getPresaleContract(library.getSigner());
    const purchaseAmount = ethers.utils.parseUnits(amount.toString(), 18);

    let tokenPurchase;

    if (tokenName === "BUSD") {
      tokenPurchase = presaleContract.functions.tokenPurchaseWithBUSD;
    } else if (tokenName === "NTR") {
      tokenPurchase = presaleContract.functions.tokenPurchaseWithNtr;
    }

    if (!tokenPurchase) {
      throw new Error("Token cannot be purchased");
    }

    const tx = await tokenPurchase(purchaseAmount);
    await tx.wait();

    return {
      success: true,
      hash: tx.hash,
    };
  } catch (error: any) {
    customLog("[Buy token Error] = ", ["development"]);
    customLog(error, ["development"]);

    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};

export type ClaimNTRDAOFrom = "BUSD" | "NTR";

export const claimNtrTokens = async (
  library: Web3Provider,
  round: number,
  claimFrom: ClaimNTRDAOFrom
) => {
  try {
    const presaleContract = getPresaleContract(library.getSigner());

    let claimFunction;
    if (claimFrom === "BUSD") {
      claimFunction = presaleContract.functions.claimTokensFromBusd;
    } else if (claimFrom === "NTR") {
      claimFunction = presaleContract.functions.claimTokensFromNtr;
    } else {
      throw new Error("Can not claim tokens");
    }

    const tx = await claimFunction(round);
    await tx.wait();
    return {
      success: true,
      hash: tx.hash,
    };
  } catch (error: any) {
    console.log("[Claim token Error] = ", error);
    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};

export const callClaimBUSDForReferral = async (
  library: Web3Provider,
  account: string
) => {
  try {
    const presale = getPresaleContract(library.getSigner());
    const tx = await presale.functions.claimRefRewardBUSD(account);
    await tx.wait();
    return {
      success: true,
      hash: tx.hash,
    };
  } catch (error: any) {
    console.log("[Claim BUSD Error] = ", error);
    return {
      success: false,
      error: parseErrorMsg(error.message),
    };
  }
};

export const callClaimNTRForReferral = async (
  library: Web3Provider,
  account: string
) => {
  try {
    const presale = getPresaleContract(library.getSigner());
    const tx = await presale.functions.claimRefRewardNTR(account);
    await tx.wait();
    return {
      success: true,
      hash: tx.hash,
    };
  } catch (error: any) {
    console.log("[Claim NTR Error] = ", error);
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
