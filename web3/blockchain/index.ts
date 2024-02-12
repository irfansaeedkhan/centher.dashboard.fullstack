import { QueryNames } from "./enum/query.names.enum";
import { ApolloProvider } from "./providers/apollo.provider";
import { BigNumber, ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { CitizenShipType } from "@/store/citizen.store";
import { InsufficientFundError } from "@/staking/errors/params.error";
import {
  AddAffiliateSettingsInput,
  MappedCreatePoolInput,
} from "@/staking/types";
import {
  ClaimCentherFrom,
  SignerOrProvider,
  TokenName,
  UserReferrer,
} from "./types";
import { SmartContractProvider } from "./providers/smart.contract.provider";
import { SmartContractName } from "./enum/smart.contract.name.enum";
import { logger } from "./helpers/alert.helper";
import { getSigner, simpleRpcProvider } from "./helpers/provider.helper";
import { normalizeValue } from "./helpers/math.helper";
import { AddressFactory } from "./providers/address.provider";
import { BlockchainConfig } from "./config";
import { ZeroAddress } from "../constants/common";

export class BlockchainRead {
  static async getERC20Allowance(
    signer: JsonRpcSigner | JsonRpcProvider,
    tokenAddress: string,
    owner: string,
    spender: string
  ): Promise<BigNumber> {
    try {
      const tokenContract = SmartContractProvider.getErc20Contract(
        tokenAddress,
        signer
      );
      const tx = await tokenContract.functions.allowance(owner, spender);
      return BigNumber.from(tx.toString());
    } catch (error: any) {
      logger(error, "SetApprovalForWallet");
      throw error;
    }
  }

  static async isContractAddress(
    library: JsonRpcSigner,
    address: string
  ): Promise<boolean> {
    try {
      const code = await library.provider.getCode(address);
      return code == "0x" ? false : true;
    } catch (error) {
      logger(error, "isContractAddress");
      throw error;
    }
  }

  static async getReferrers(
    account: string | null | undefined,
    level: string
  ): Promise<UserReferrer[]> {
    const variables = {
      referrer: account,
      level: Number(level),
    };

    const { data, error } = await ApolloProvider.query(
      QueryNames.GENEALOGY_AT_LEVEL,
      variables,
      false
    );

    if (error) {
      throw error;
    }

    if (!data.genealogies?.length) {
      return [];
    }

    return data.genealogies.map((item: any, index: number) => {
      const people = item.user.people.reduce(
        (partialSum: any, a: any) => partialSum + a,
        0
      );
      return {
        id: index + 1,
        address: item.user.publicKey,
        level: level,
        generatedBUSD: item.user.generatedBUSD[0],
        generatedNTR: item.user.generatedNTR[0],
        people: people,
      };
    });
  }

  static async getReferrersAddress(
    signer: JsonRpcSigner,
    userAddress: string
  ): Promise<string[]> {
    try {
      const registrationContract = SmartContractProvider.getContract(
        SmartContractName.REGISTRATION,
        signer
      );

      const result = await registrationContract.functions.getReferrerAddresses(
        userAddress
      );

      return result[0];
    } catch (error: any) {
      logger(error, "getReferrersAddress");
      throw error;
    }
  }

  static async getGenealogy(referrer_in: string[]): Promise<any[]> {
    const variables = {
      referrer_in,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.GENEALOGY,
      variables
    );

    if (error) {
      throw error;
    }

    return data.users;
  }

  static async getGenealogyAt(referrer: string, level: number): Promise<any[]> {
    const variables = {
      referrer,
      level,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.GENEALOGY_AT_LEVEL,
      variables
    );

    if (error) {
      throw error;
    }

    return data.genealogies;
  }

  static async getReferralRewardInPresale(
    first: number,
    skip: number,
    referrer: string
  ): Promise<any[]> {
    const variables = {
      first,
      skip,
      referrer,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.REFERRAL_REWARD_IN_PRESALE,
      variables
    );

    if (error) {
      throw error;
    }
    return data.presaleGenealogyHistories;
  }

  static async getReferrerClaimInPresale(referrer: string): Promise<any> {
    const variables = {
      referrer,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.REFERRER_CLAIM_PRESALE,
      variables
    );

    if (error) {
      throw error;
    }

    return data.presaleGenalogyClaimHistories;
  }

  static async purchaseInBUSD(first: number, skip: number): Promise<any[]> {
    const variables = {
      first,
      skip,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.PURCHASE_WITH_BUSD,
      variables
    );

    if (error) {
      throw error;
    }

    return data.presalePurchaseWithBusdHistories;
  }

  static async purchaseInNTR(first: number, skip: number): Promise<any> {
    const variables = {
      first,
      skip,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.PURCHASE_WITH_NTR,
      variables
    );

    if (error) {
      throw error;
    }

    return data.presalePurchaseWithNtrHistories;
  }

  static async getAllPurchasesByUser(
    first: number,
    skip: number,
    publicKey: string
  ): Promise<any[]> {
    const variables = {
      first,
      skip,
      publicKey,
    };

    const { data, error } = await ApolloProvider.query(
      QueryNames.PURCHASE_BY_USER,
      variables
    );

    if (error) {
      throw error;
    }

    let filterData = [];

    if (data.presalePurchaseWithBusdHistories.length > 0) {
      for (let i = 0; i < data.presalePurchaseWithBusdHistories.length; i++) {
        filterData.push(data.presalePurchaseWithBusdHistories[i]);
      }
    }

    if (data.presalePurchaseWithNtrHistories.length) {
      for (let i = 0; i < data.presalePurchaseWithNtrHistories.length; i++) {
        filterData.push(data.presalePurchaseWithNtrHistories[i]);
      }
    }

    return [
      data.presalePurchaseWithBusdHistories,
      data.presalePurchaseWithNtrHistories,
    ];
  }

  static async purchaseInBUSDByUser(
    first: number,
    skip: number,
    publicKey: string
  ): Promise<any[]> {
    const variables = {
      first,
      skip,
      publicKey,
    };

    const { data, error } = await ApolloProvider.query(
      QueryNames.PURCHASE_WITH_BUSD_BY_USER,
      variables
    );

    if (error) {
      throw error;
    }
    return data.presalePurchaseWithBusdHistories;
  }

  static async purchaseInNTRByUser(
    first: number,
    skip: number,
    publicKey: string
  ): Promise<any> {
    const variables = {
      first,
      skip,
      publicKey,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.PURCHASE_WITH_NTR_BY_USER,
      variables
    );

    if (error) {
      throw error;
    }

    return data.presalePurchaseWithNtrHistories;
  }

  static async getCentherClaimHistory(
    first: number,
    skip: number
  ): Promise<any[]> {
    const variables = {
      first,
      skip,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.CLAIM_CENTHER_HISTORY,
      variables
    );

    if (error) {
      throw error;
    }

    return data.presaleCentherClaimHistories;
  }

  static async getRegistrationHistory(
    first: number,
    skip: number
  ): Promise<any[]> {
    const variables = {
      first,
      skip,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.REGISTRATION_HISTORY,
      variables
    );

    if (error) {
      throw error;
    }

    return data.users;
  }

  static async isCurrentMarketplaceOwner(
    signer: JsonRpcSigner,
    collection: string,
    tokenId: number
  ): Promise<boolean> {
    const nftContract = SmartContractProvider.getNFTContract(
      collection,
      signer
    );

    await nftContract.callStatic.ownerOf(tokenId);

    const tx = await nftContract.functions.ownerOf(tokenId);
    return (
      tx[0]?.toLowerCase() ==
      BlockchainConfig.contracts.MARKETPALCE[
        BlockchainConfig.network
      ]?.toLowerCase()
    );
  }

  static async isTokenSwaped(
    provider: JsonRpcProvider,
    collection: string,
    tokenId: number
  ): Promise<boolean> {
    const nftAdapterContract = SmartContractProvider.getContract(
      SmartContractName.NFT_ADAPTER,
      provider
    );

    const result = await nftAdapterContract.functions.isSwapped(
      collection,
      tokenId
    );

    return result[0];
  }

  static async isUserWhitelistedForSwap(
    provider: JsonRpcProvider,
    user: string
  ): Promise<boolean> {
    const nftAdapterContract = SmartContractProvider.getContract(
      SmartContractName.NFT_ADAPTER,
      provider
    );

    const result =
      await nftAdapterContract.functions.whitelistedUsersAndAllowance(user);

    if (Number(result) > 0) {
      return true;
    } else {
      return false;
    }
  }

  static async isCitizen(
    signer: JsonRpcSigner,
    address: string
  ): Promise<string> {
    const registrationContract = SmartContractProvider.getContract(
      SmartContractName.REGISTRATION,
      signer
    );

    const result = await registrationContract.functions.isCitizen(address);

    return ethers.BigNumber.from(result[0]).toString();
  }

  static async getCitizenPrice(
    signer: JsonRpcSigner,
    type: CitizenShipType
  ): Promise<string[]> {
    const registrationContract = SmartContractProvider.getContract(
      SmartContractName.REGISTRATION,
      signer
    );

    const result = await registrationContract.functions[type]();

    if (!result) {
      throw new Error("Invalid CitizenshipType");
    }

    return [type, ethers.BigNumber.from(result[0]).toString()];
  }

  static async getUserClaimableStakingRewards(
    signer: JsonRpcSigner,
    poolId: number,
    user: string
  ): Promise<string> {
    const stakingContract = SmartContractProvider.getContract(
      SmartContractName.STAKING,
      signer
    );

    const result = await stakingContract.functions.calculateReward(
      poolId,
      user
    );

    return result[0];
  }

  static async getUserStakingRewards(
    signer: JsonRpcSigner,
    poolId: number,
    user: string
  ): Promise<any> {
    try {
      const stakingContract = SmartContractProvider.getContract(
        SmartContractName.STAKING,
        signer
      );

      const result = await stakingContract.functions.calculateTotalReward(
        poolId,
        user
      );

      return result;
    } catch (error) {
      return [];
    }
  }

  static async getRefClaimableReward(
    signer: JsonRpcSigner,
    poolId: number,
    user: string
  ): Promise<{
    nextTime: string;
    claimableReward: string;
  }> {
    try {
      const stakingContract = SmartContractProvider.getContract(
        SmartContractName.STAKING,
        signer
      );

      const result =
        await stakingContract.functions.calculateClaimableRewardForRef(
          poolId,
          user
        );
      console.log("get ref details for user :", user);
      console.log("claimable reward:", result.claimableReward?.toString());
      console.log("Next time:", result.nextTimeToClaim?.toString());
      console.log("------------------------------------------");
      return {
        nextTime: result.nextTimeToClaim?.toString(),
        claimableReward: result.claimableReward?.toString(),
      };
    } catch (e) {
      return { nextTime: "0", claimableReward: "0" };
    }
  }

  static async getStakeDetails(
    signer: JsonRpcSigner,
    poolId: number,
    user: string,
    stakeId: number
  ): Promise<any> {
    try {
      const stakingContract = SmartContractProvider.getContract(
        SmartContractName.STAKING,
        signer
      );

      const result =
        await stakingContract.functions.calculateTotalRewardPerStake(
          poolId,
          user,
          stakeId
        );

      return result;
    } catch (e) {
      return "0";
    }
  }

  static async getCollectionAdditionalInfo(
    collection: string,
    seller: string
  ): Promise<any> {
    const { data: nfts } = await ApolloProvider.query(
      QueryNames.GET_COLLECTION_ADDITIONAL_INFO,
      { collection }
    );

    const { data } = await ApolloProvider.query(
      QueryNames.GET_USER_TOTAL_SOLD_NFTS,
      {
        collection,
        seller,
      }
    );

    return { nfts: nfts.nfts, history: data.marketplaceSaleHistories };
  }

  static async getUserCollectionNfts(
    collection: string,
    owner: string
  ): Promise<any> {
    const variables = {
      collection,
      owner,
    };
    const { data } = await ApolloProvider.query(
      QueryNames.GET_USER_NFTS,
      variables
    );

    return { nfts: data.nfts };
  }

  static async getERC20Balance(
    account: string,
    tokenAddress: string,
    signer: SignerOrProvider
  ): Promise<string> {
    try {
      const tokenContract = SmartContractProvider.getErc20Contract(
        tokenAddress,
        signer
      );
      const balance = await tokenContract.functions.balanceOf(account);
      const ethValue = ethers.utils.formatUnits(
        BigNumber.from(balance.toString())
      );
      return ethValue.toString();
    } catch (error) {
      logger(error, "getERC20Balance");
    }
    return "0";
  }

  static async getWalletBalance(signer: JsonRpcSigner): Promise<string> {
    try {
      const balance = await signer.getBalance();
      const ethValue = ethers.utils.formatUnits(
        BigNumber.from(balance.toString())
      );
      return ethValue.toString();
    } catch (error) {
      logger(error, "getWalletBalance");
    }
    return "0";
  }
}
export class BlockchainWrite {
  static async transferERC20(
    account: string,
    tokenAddress: string,
    amount: string,
    signer: SignerOrProvider
  ): Promise<void> {
    try {
      signer;
      const tokenContract = SmartContractProvider.getErc20Contract(
        tokenAddress,
        signer
      );
      const ether_amount = ethers.utils.parseUnits(amount, "ether");
      const balance = await tokenContract.functions.transfer(
        account,
        ether_amount
      );
      await balance.wait(1);
    } catch (error) {
      logger(error, "getERC20Balance");
    }
  }

  static async transferNative(
    to: string,
    amount: string,
    signer: JsonRpcSigner
  ): Promise<void> {
    try {
      const tx = {
        to: to,
        value: ethers.utils.parseUnits(amount, "ether"),
      };
      const transaction = await signer.sendTransaction(tx);
      await transaction.wait(1);
    } catch (error) {
      logger(error, "transferNative");
    }
  }

  static async adminUnPauseRegistration(
    signer: JsonRpcSigner
  ): Promise<string> {
    try {
      const registrationContract = SmartContractProvider.getContract(
        SmartContractName.REGISTRATION,
        signer
      );
      //static call
      await registrationContract.callStatic.unPause();
      //actual call
      const tx = await registrationContract.functions.unPause();
      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      logger(error, "adminUnPauseRegistration");
      throw error;
    }
  }

  static async adminPauseRegistration(signer: JsonRpcSigner): Promise<string> {
    try {
      const registrationContract = SmartContractProvider.getContract(
        SmartContractName.REGISTRATION,
        signer
      );
      //static call
      await registrationContract.callStatic.pause();
      //actual call
      const tx = await registrationContract.functions.pause();
      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      logger(error, "adminPauseRegistration");
      throw error;
    }
  }

  static async adminChangeRegistrationFees(
    signer: JsonRpcSigner,
    feeWithReferralLink: number,
    feeWithoutReferralLink: number
  ): Promise<string> {
    try {
      const registrationContract = SmartContractProvider.getContract(
        SmartContractName.REGISTRATION,
        signer
      );

      const feeWithReferralLinkBN = ethers.utils.parseEther(
        feeWithReferralLink + ""
      );
      const feeWithoutReferralLinkBN = ethers.utils.parseEther(
        feeWithoutReferralLink + ""
      );

      await registrationContract.callStatic.changeFees(
        feeWithoutReferralLinkBN,
        feeWithReferralLinkBN
      );

      const tx = await registrationContract.functions.changeFees(
        feeWithoutReferralLinkBN,
        feeWithReferralLinkBN
      );

      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      logger(error, "adminChangeRegistrationFees");
      throw error;
    }
  }

  static async adminClaimRegistrationBNB(
    signer: JsonRpcSigner
  ): Promise<string> {
    try {
      const registrationContract = SmartContractProvider.getContract(
        SmartContractName.REGISTRATION,
        signer
      );
      await registrationContract.callStatic.withdraw();
      const tx = await registrationContract.functions.withdraw();
      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      logger(error, "adminClaimRegistrationBNB");
      throw error;
    }
  }

  static async callCancelAuction(
    signer: JsonRpcSigner,
    collection: string,
    tokenId: number
  ): Promise<string> {
    try {
      const marketplaceContract = SmartContractProvider.getContract(
        SmartContractName.MARKETPALCE,
        signer
      );

      await marketplaceContract.callStatic.cancelAuction(collection, tokenId);

      const tx = await marketplaceContract.functions.cancelAuction(
        collection,
        tokenId
      );
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "callCancelAuction");
      throw error;
    }
  }

  static async callEndAuction(
    signer: JsonRpcSigner,
    collection: string,
    tokenId: number
  ): Promise<string> {
    try {
      const marketplaceContract = SmartContractProvider.getContract(
        SmartContractName.MARKETPALCE,
        signer
      );

      await marketplaceContract.callStatic.endAuction(collection, tokenId);

      const tx = await marketplaceContract.functions.endAuction(
        collection,
        tokenId
      );
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "");
      throw error;
    }
  }

  static async callBidOnAuction(
    signer: JsonRpcSigner,
    collection: string,
    tokenId: number,
    price: number
  ): Promise<string> {
    try {
      const marketplaceContract = SmartContractProvider.getContract(
        SmartContractName.MARKETPALCE,
        signer
      );

      const normalizedValue = ethers.utils.parseEther(
        normalizeValue(price) + ""
      );

      await marketplaceContract.callStatic.bidOnAuction(collection, tokenId, {
        value: normalizedValue,
      });

      const tx = await marketplaceContract.functions.bidOnAuction(
        collection,
        tokenId,
        { value: normalizedValue }
      );
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "callBidOnAuction");
      throw error;
    }
  }

  static async callCreateAuction(
    signer: JsonRpcSigner,
    collection: string,
    tokenId: number,
    startPrice: number,
    period: number
  ): Promise<string> {
    try {
      const marketplaceContract = SmartContractProvider.getContract(
        SmartContractName.MARKETPALCE,
        signer
      );

      const normalizedValue = ethers.utils.parseEther(
        normalizeValue(startPrice) + ""
      );

      await marketplaceContract.callStatic.createAuction(
        collection,
        tokenId,
        normalizedValue,
        period
      );

      const tx = await marketplaceContract.functions.createAuction(
        collection,
        tokenId,
        normalizedValue,
        period
      );
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "callCreateAuction");
      throw error;
    }
  }

  static async callBuyListedItem(
    signer: JsonRpcSigner,
    collection: string,
    tokenId: number,
    price: number
  ): Promise<string> {
    try {
      const marketplaceContract = SmartContractProvider.getContract(
        SmartContractName.MARKETPALCE,
        signer
      );

      await marketplaceContract.callStatic.buyForListedItem(
        collection,
        tokenId,
        { value: price }
      );

      const tx = await marketplaceContract.functions.buyForListedItem(
        collection,
        tokenId,
        { value: price }
      );
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "callBuyListedItem");
      throw error;
    }
  }

  static async callListItemForSale(
    signer: JsonRpcSigner,
    collection: string,
    tokenId: number,
    newPrice: number
  ): Promise<string> {
    try {
      const marketplaceContract = SmartContractProvider.getContract(
        SmartContractName.MARKETPALCE,
        signer
      );

      const normalizedValue = ethers.utils.parseEther(
        normalizeValue(newPrice) + ""
      );

      await marketplaceContract.callStatic.listItemForSale(
        collection,
        tokenId,
        normalizedValue
      );

      const tx = await marketplaceContract.functions.listItemForSale(
        collection,
        tokenId,
        normalizedValue
      );
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "callListItemForSale");
      throw error;
    }
  }

  static async callEditItemForSale(
    signer: JsonRpcSigner,
    collection: string,
    tokenId: number,
    newPrice: number
  ): Promise<string> {
    try {
      const marketplaceContract = SmartContractProvider.getContract(
        SmartContractName.MARKETPALCE,
        signer
      );

      const normalizedValue = ethers.utils.parseEther(
        normalizeValue(newPrice) + ""
      );

      await marketplaceContract.callStatic.editItemForSale(
        collection,
        tokenId,
        normalizedValue
      );

      const tx = await marketplaceContract.functions.editItemForSale(
        collection,
        tokenId,
        normalizedValue
      );
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "callEditItemForSale");
      throw error;
    }
  }

  static async callCancelItemForSale(
    signer: JsonRpcSigner,
    collection: string,
    tokenId: number
  ): Promise<string> {
    try {
      const marketplaceContract = SmartContractProvider.getContract(
        SmartContractName.MARKETPALCE,
        signer
      );

      await marketplaceContract.callStatic.cancelItemForSale(
        collection,
        tokenId
      );

      const tx = await marketplaceContract.functions.cancelItemForSale(
        collection,
        tokenId
      );

      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "callCancelItemForSale");
      throw error;
    }
  }

  static async callCreateNFT(
    signer: JsonRpcSigner,
    collection: string,
    tokenUri: string,
    supply: number,
    isAuction: boolean,
    price: number,
    period: number,
    fee: number
  ): Promise<string> {
    try {
      const marketplaceContract = SmartContractProvider.getContract(
        SmartContractName.MARKETPALCE,
        signer
      );
      const normalizedValue = ethers.utils.parseEther(price.toFixed(18));
      const castedFee = ethers.utils.parseEther(fee.toFixed(18));

      await marketplaceContract.callStatic.createItems(
        collection,
        tokenUri,
        supply,
        isAuction,
        normalizedValue,
        period,
        { value: castedFee }
      );

      const tx = await marketplaceContract.functions.createItems(
        collection,
        tokenUri,
        supply,
        isAuction,
        normalizedValue,
        period,
        { value: castedFee }
      );
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "callCreateNFT");
      throw error;
    }
  }

  static async callCreateCollection(
    signer: JsonRpcSigner,
    name: string,
    symbol: string,
    category: string,
    uri: string,
    maxsupply: number | null,
    fee: number
  ): Promise<string> {
    try {
      const marketplaceContract = SmartContractProvider.getContract(
        SmartContractName.MARKETPALCE,
        signer
      );

      const castedFee = ethers.utils.parseEther(fee.toString());
      await marketplaceContract.callStatic.createCollection(
        name,
        symbol,
        category,
        uri,
        maxsupply,
        { value: castedFee }
      );

      const tx = await marketplaceContract.functions.createCollection(
        name,
        symbol,
        category,
        uri,
        maxsupply,
        { value: castedFee }
      );
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "callCreateCollection");
      throw error;
    }
  }

  static async callApproveNFTToMarketplace(
    signer: JsonRpcSigner,
    collection: string
  ): Promise<string> {
    try {
      const nftContract = SmartContractProvider.getNFTContract(
        collection,
        signer
      );

      const operator = AddressFactory.getContractAddress(
        SmartContractName.MARKETPALCE
      );

      await nftContract.callStatic.setApprovalForAll(operator, true);

      const tx = await nftContract.functions.setApprovalForAll(operator, true);
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "callApproveNFTToMarketplace");
      throw error;
    }
  }

  static async transferNftWithLock(
    signer: JsonRpcSigner,
    collection: String,
    tokenId: number,
    receiver: string,
    periodTimeSpan: number
  ): Promise<string> {
    try {
      const marketplaceContract = SmartContractProvider.getContract(
        SmartContractName.MARKETPALCE,
        signer
      );

      await marketplaceContract.callStatic.transferWithLock(
        collection,
        tokenId,
        receiver,
        periodTimeSpan
      );

      const tx = await marketplaceContract.functions.transferWithLock(
        collection,
        tokenId,
        receiver,
        periodTimeSpan
      );
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "callTransferWithLock");
      throw error;
    }
  }

  static async transferNftToCurrentMarketplace(
    signer: JsonRpcSigner,
    collection: string,
    tokenId: number,
    price: number,
    endTime: number
  ): Promise<string> {
    try {
      const marketplaceContract = SmartContractProvider.getContract(
        SmartContractName.OLD_MARKETPALCE,
        signer
      );

      if (endTime && endTime > +new Date() / 1000) {
        await marketplaceContract.callStatic.cancelAuction(collection, tokenId);

        const cancelLIstTx = await marketplaceContract.functions.cancelAuction(
          collection,
          tokenId
        );

        await cancelLIstTx.wait();

        if (!cancelLIstTx?.hash) {
          throw new Error("Cancel list issue");
        }

        const approveTx = await this.callApproveNFTToMarketplace(
          signer,
          collection
        );

        if (!approveTx?.length) {
          throw new Error("Approve issue");
        }

        endTime = Math.floor(endTime - +Date.now() / 1000);
        const tx = await this.callCreateAuction(
          signer,
          collection,
          tokenId,
          price,
          endTime
        );

        return tx;
      } else {
        await marketplaceContract.callStatic.cancelItemForSale(
          collection,
          tokenId
        );

        const cancelLIstTx =
          await marketplaceContract.functions.cancelItemForSale(
            collection,
            tokenId
          );

        await cancelLIstTx.wait();

        if (!cancelLIstTx?.hash) {
          throw new Error("Cancel list issue");
        }

        const approveTx = await this.callApproveNFTToMarketplace(
          signer,
          collection
        );

        if (!approveTx?.length) {
          throw new Error("Approve issue");
        }

        const tx = await this.callListItemForSale(
          signer,
          collection,
          tokenId,
          price
        );

        return tx;
      }
    } catch (error: any) {
      logger(error, "callTransferNftToCurrentMarketplace");
      throw error;
    }
  }

  static async preBookDexa(
    paymentAmountRaw: number,
    paymentAddress: string,
    paymentTokenAddress: string,
    signer: JsonRpcSigner
  ): Promise<string> {
    try {
      const paymentTokenAbi = BlockchainConfig.abis.BUSD; // TODO: change to ERC20 abi for generic usage
      const paymentTokenContract = SmartContractProvider.getContractInstance(
        paymentTokenAbi,
        paymentTokenAddress,
        signer
      );

      const paymentAmount = ethers.utils.parseUnits(
        paymentAmountRaw.toString(),
        18
      );

      await paymentTokenContract.callStatic.transfer(
        paymentAddress,
        paymentAmount
      );

      const tx = await paymentTokenContract.functions.transfer(
        paymentAddress,
        paymentAmount
      );

      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "preBookDexa");
      throw error;
    }
  }

  static async swapDexagon(
    signer: JsonRpcSigner,
    collection: string,
    tokenId: number
  ): Promise<string> {
    const nftAdapterContract = SmartContractProvider.getContract(
      SmartContractName.NFT_ADAPTER,
      signer
    );

    const nftContract = SmartContractProvider.getNFTContract(
      collection,
      signer
    );

    const lockTime = 0;

    try {
      const approvalTx = await nftContract.functions.setApprovalForAll(
        AddressFactory.getContractAddress(SmartContractName.NFT_ADAPTER),
        true
      );
      await approvalTx.wait();
    } catch (error) {
      throw new Error("cannot set approval for smart contract");
    }

    try {
      const tx = await nftAdapterContract.functions.claim(
        collection,
        tokenId,
        lockTime,
        "",
        {
          value: "1",
        }
      );
      await tx.wait();
      return tx.hash;
    } catch (error) {
      throw new Error("cannot swap token");
    }
  }

  static async buyCitizenShip(
    value: number,
    signer: JsonRpcSigner
  ): Promise<string> {
    try {
      const registrationContract = SmartContractProvider.getContract(
        SmartContractName.REGISTRATION,
        signer
      );
      await registrationContract.callStatic.buyMemberShip({ value });

      const tx = await registrationContract.functions.buyMemberShip({ value });

      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "buyCitizenShip");
      throw error;
    }
  }

  static async createStakingPool(
    signer: JsonRpcSigner,
    data: MappedCreatePoolInput,
    ownerAddress: string,
    preflight: boolean
  ): Promise<string> {
    try {
      const stakingContract = SmartContractProvider.getContract(
        SmartContractName.STAKING,
        signer
      );

      if (data.showOnCenther) {
        const balance = await signer.getBalance();
        const price = await stakingContract.functions.platformFees();

        if (+balance.toString() < +price.toString()) {
          throw new InsufficientFundError(
            `Not enough balance for pay fee, balance: ${balance.toString()}, fee: ${price.toString()}`
          );
        }

        await stakingContract.callStatic.createPool(data, {
          value: price.toString(),
        });

        if (!preflight) {
          const tx = await stakingContract.functions.createPool(data, {
            value: price.toString(),
          });
          await tx.wait(2);
          return tx.hash;
        }

        return "done";
      } else {
        await stakingContract.callStatic.createPool(data);
        if (!preflight) {
          const tx = await stakingContract.functions.createPool(data);
          await tx.wait(2);
          return tx.hash;
        }

        return "done";
      }
    } catch (error: any) {
      logger(error, "createStakingPool");
      throw error;
    }
  }

  static async SetApprovalForWallet(
    signer: JsonRpcSigner,
    tokenAddress: string,
    userAddress: string,
    spenderAddress: string
  ): Promise<string> {
    try {
      const tokenContract = SmartContractProvider.getErc20Contract(
        tokenAddress,
        signer
      );

      const maxUintRange =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";

      const tx = await tokenContract.functions.approve(
        spenderAddress,
        maxUintRange
      );

      await tx.wait(2);

      return tx.hash;
    } catch (error: any) {
      logger(error, "SetApprovalForWallet");
      throw error;
    }
  }

  static async setStakingPoolAffiliateSettings(
    signer: JsonRpcSigner,
    data: AddAffiliateSettingsInput,
    poolId: number
  ): Promise<string> {
    try {
      const stakingContract = SmartContractProvider.getContract(
        SmartContractName.STAKING,
        signer
      );

      await stakingContract.callStatic.setAffiliateSetting(poolId, data);
      const tx = await stakingContract.functions.setAffiliateSetting(
        poolId,
        data
      );

      await tx.wait(2);
      return tx.hash;
    } catch (error: any) {
      logger(error, "setStakingPoolAffiliateSettings");
      throw error;
    }
  }

  static async getCurrentStakingPoolId(signer: JsonRpcSigner): Promise<number> {
    try {
      const stakingContract = SmartContractProvider.getContract(
        SmartContractName.STAKING,
        signer
      );

      const result = await stakingContract.functions.poolIds();
      return +result.toString();
    } catch (error: any) {
      logger(error, "createPool");
      throw error;
    }
  }

  static async stake(
    signer: JsonRpcSigner,
    poolId: string,
    amount: string,
    referrer: string,
    tokenAddress: string,
    spenderAddress: string
  ): Promise<string> {
    try {
      const stakingContract = SmartContractProvider.getContract(
        SmartContractName.STAKING,
        signer
      );

      const tokenContract = SmartContractProvider.getErc20Contract(
        tokenAddress,
        signer
      );

      const approvalTx = await tokenContract.functions.approve(
        spenderAddress,
        amount
      );

      await approvalTx.wait(2);

      const tx = await stakingContract.functions.stake(
        poolId,
        amount,
        referrer
      );

      await tx.wait(2);
      return tx.hash;
    } catch (error: any) {
      logger(error, "stake");
      throw error;
    }
  }

  static async claimReward(
    signer: JsonRpcSigner,
    poolId: string,
    stakesId: number[]
  ): Promise<string> {
    try {
      const stakingContract = SmartContractProvider.getContract(
        SmartContractName.STAKING,
        signer
      );

      await stakingContract.callStatic.claimReward(poolId, stakesId);
      const tx = await stakingContract.functions.claimReward(poolId, stakesId);
      await tx.wait(2);
      return tx.hash;
    } catch (error: any) {
      logger(error, "claimReward");
      throw error;
    }
  }

  static async claimRefReward(
    signer: JsonRpcSigner,
    poolId: string,
    users: string[]
  ): Promise<string> {
    try {
      const stakingContract = SmartContractProvider.getContract(
        SmartContractName.STAKING,
        signer
      );

      await stakingContract.callStatic.batchTxByRef(
        poolId,
        users,
        ZeroAddress,
        false
      );
      const tx = await stakingContract.functions.batchTxByRef(
        poolId,
        users,
        ZeroAddress,
        false
      );

      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      logger(error, "claimRefReward");
      throw error;
    }
  }

  static async stakeRefReward(
    signer: JsonRpcSigner,
    poolId: string,
    users: string[],
    referrer: string
  ): Promise<string> {
    try {
      const stakingContract = SmartContractProvider.getContract(
        SmartContractName.STAKING,
        signer
      );

      await stakingContract.callStatic.batchTxByRef(
        poolId,
        users,
        referrer,
        true
      );

      const tx = await stakingContract.functions.batchTxByRef(
        poolId,
        users,
        referrer,
        true
      );

      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      logger(error, "claimRefReward");
      throw error;
    }
  }

  static async unstake(
    signer: JsonRpcSigner,
    poolId: string,
    stakesId: number[]
  ): Promise<string> {
    try {
      const stakingContract = SmartContractProvider.getContract(
        SmartContractName.STAKING,
        signer
      );

      await stakingContract.callStatic.unstake(poolId, stakesId);
      const tx = await stakingContract.functions.unstake(poolId, stakesId);

      await tx.wait(2);
      return tx.hash;
    } catch (error: any) {
      logger(error, "unstake");
      throw error;
    }
  }

  static async restake(
    signer: JsonRpcSigner,
    poolId: string,
    stakesId: number[]
  ): Promise<string> {
    try {
      const stakingContract = SmartContractProvider.getContract(
        SmartContractName.STAKING,
        signer
      );

      await stakingContract.callStatic.restakeByIds(poolId, stakesId);
      const tx = await stakingContract.functions.restakeByIds(poolId, stakesId);

      await tx.wait(2);
      return tx.hash;
    } catch (error: any) {
      logger(error, "restake");
      throw error;
    }
  }

  //launchpadV1
  static async buyToken(
    tokenName: TokenName,
    amount: number,
    signer: JsonRpcSigner
  ): Promise<string> {
    try {
      const presaleContract = SmartContractProvider.getContract(
        SmartContractName.PRESALE,
        signer
      );

      let tokenPurchase;
      const purchaseAmount = ethers.utils.parseUnits(amount.toString(), 18);

      if (tokenName === "USDT") {
        await presaleContract.callStatic.tokenPurchaseWithBUSD(purchaseAmount);
        tokenPurchase = presaleContract.functions.tokenPurchaseWithBUSD;
      } else if (tokenName === "NTR") {
        await presaleContract.callStatic.tokenPurchaseWithNTR(purchaseAmount);
        tokenPurchase = presaleContract.functions.tokenPurchaseWithNTR;
      }

      if (!tokenPurchase) {
        throw new Error("Token cannot be purchased");
      }

      const tx = await tokenPurchase(purchaseAmount);
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "buyToken");
      throw error;
    }
  }
  static async adminCallUpdateRoundInfo(
    signer: JsonRpcSigner,
    roundIndex: number,
    startTime: number,
    endTime: number,
    lockMonths: number,
    centherPriceForBusd: number,
    centherPriceForNtr: number,
    maxCentherAmountToSell: number,
    minBusdAmountPerUser: number,
    maxBusdAmountPerUser: number,
    minNtrAmountPerUser: number,
    maxNtrAmountPerUser: number,
    enableBusd: boolean
  ): Promise<string> {
    try {
      const presaleContract = SmartContractProvider.getContract(
        SmartContractName.PRESALE,
        signer
      );

      let tx;
      if (enableBusd) {
        await presaleContract.callStatic.setRoundInfoForBusd(
          roundIndex,
          centherPriceForBusd * 100000,
          Math.floor(startTime),
          Math.floor(endTime),
          lockMonths,
          ethers.utils.parseEther(maxCentherAmountToSell + ""),
          ethers.utils.parseEther(minBusdAmountPerUser + ""),
          ethers.utils.parseEther(maxBusdAmountPerUser + "")
        );

        tx = await presaleContract.functions.setRoundInfoForBusd(
          roundIndex,
          centherPriceForBusd * 100000,
          Math.floor(startTime),
          Math.floor(endTime),
          lockMonths,
          ethers.utils.parseEther(maxCentherAmountToSell.toString()),
          ethers.utils.parseEther(minBusdAmountPerUser.toString()),
          ethers.utils.parseEther(maxBusdAmountPerUser.toString())
        );
      } else {
        await presaleContract.callStatic.setRoundInfoForNtr(
          roundIndex,
          centherPriceForNtr * 100000,
          Math.floor(startTime),
          Math.floor(endTime),
          lockMonths,
          ethers.utils.parseEther(maxCentherAmountToSell.toString()),
          ethers.utils.parseEther(minNtrAmountPerUser.toString()),
          ethers.utils.parseEther(maxNtrAmountPerUser.toString())
        );

        tx = await presaleContract.functions.setRoundInfoForNtr(
          roundIndex,
          centherPriceForNtr * 100000,
          Math.floor(startTime),
          Math.floor(endTime),
          lockMonths,
          ethers.utils.parseEther(maxCentherAmountToSell.toString()),
          ethers.utils.parseEther(minNtrAmountPerUser.toString()),
          ethers.utils.parseEther(maxNtrAmountPerUser.toString())
        );
      }

      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      logger(error, "adminCallUpdateRoundInfo");
      throw error;
    }
  }

  static async adminCallClaimNtrForCoreTeam(
    signer: JsonRpcSigner
  ): Promise<string> {
    try {
      const presaleContract = SmartContractProvider.getContract(
        SmartContractName.PRESALE,
        signer
      );

      await presaleContract.callStatic.withdrawNtrForCoreTeam();

      const tx = await presaleContract.functions.withdrawNtrForCoreTeam();
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "adminCallClaimNtrForCoreTeam");
      throw error;
    }
  }

  static async adminCallClaimBusdForCoreTeam(
    signer: JsonRpcSigner
  ): Promise<string> {
    try {
      const presaleContract = SmartContractProvider.getContract(
        SmartContractName.PRESALE,
        signer
      );

      await presaleContract.callStatic.withdrawBusdForCoreTeam();

      const tx = await presaleContract.functions.withdrawBusdForCoreTeam();
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "adminCallClaimBusdForCoreTeam");
      throw error;
    }
  }

  static async adminCallClaimNtrForCompany(
    signer: JsonRpcSigner
  ): Promise<string> {
    try {
      const presaleContract = SmartContractProvider.getContract(
        SmartContractName.PRESALE,
        signer
      );

      await presaleContract.callStatic.withdrawNtr();

      const tx = await presaleContract.functions.withdrawNtr();
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "adminCallClaimNtrForCompany");
      throw error;
    }
  }

  static async adminCallClaimBusdForCompany(
    signer: JsonRpcSigner
  ): Promise<string> {
    try {
      const presaleContract = SmartContractProvider.getContract(
        SmartContractName.PRESALE,
        signer
      );

      await presaleContract.callStatic.withdrawBUSD();

      const tx = await presaleContract.functions.withdrawBUSD();
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "adminCallClaimBusdForCompany");
      throw error;
    }
  }

  static async getTokenApproval(
    tokenName: TokenName,
    signer: JsonRpcSigner
  ): Promise<string> {
    try {
      const presaleAddress = AddressFactory.getContractAddress(
        SmartContractName.PRESALE
      );

      const tokenContract = SmartContractProvider.getTokenContract(
        tokenName,
        signer
      );

      const amount = ethers.utils.parseUnits(
        BlockchainConfig.maxSupply.toString()
      );

      await tokenContract.callStatic.approve(presaleAddress, amount);
      const tx = await tokenContract.functions.approve(presaleAddress, amount);
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "getTokenApproval");
      throw error;
    }
  }
  static async callClaimNTRForReferral(signer: JsonRpcSigner): Promise<string> {
    try {
      const presaleContract = SmartContractProvider.getContract(
        SmartContractName.PRESALE,
        signer
      );

      await presaleContract.callStatic.claimRefRewardNTR();

      const tx = await presaleContract.functions.claimRefRewardNTR();
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "callClaimNTRForReferral");
      throw error;
    }
  }

  static async callClaimBUSDForReferral(
    signer: JsonRpcSigner
  ): Promise<string> {
    try {
      const presaleContract = SmartContractProvider.getContract(
        SmartContractName.PRESALE,
        signer
      );

      await presaleContract.callStatic.claimRefRewardBUSD();

      const tx = await presaleContract.functions.claimRefRewardBUSD();
      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      logger(error, "callClaimBUSDForReferral");
      throw error;
    }
  }

  static async claimTokens(
    signer: JsonRpcSigner,
    round: number,
    claimFrom: ClaimCentherFrom
  ): Promise<string> {
    try {
      const presaleContract = SmartContractProvider.getContract(
        SmartContractName.PRESALE,
        signer
      );

      let claimFunction;
      if (claimFrom === "BUSD") {
        await presaleContract.callStatic.claimTokensFromBusd(round);
        claimFunction = presaleContract.functions.claimTokensFromBusd;
      } else if (claimFrom === "NTR") {
        await presaleContract.callStatic.claimTokensFromNtr(round);
        claimFunction = presaleContract.functions.claimTokensFromNtr;
      } else {
        throw new Error("Can not claim tokens");
      }

      const tx = await claimFunction(round);
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "claimTokens");
      throw error;
    }
  }

  static async adminChangeReferralRate(
    signer: JsonRpcSigner,
    rates: number[]
  ): Promise<string> {
    try {
      const presaleContract = SmartContractProvider.getContract(
        SmartContractName.PRESALE,
        signer
      );

      await presaleContract.callStatic.setReferralRate(rates);
      const tx = await presaleContract.functions.setReferralRate(rates);
      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      logger(error, "adminChangeReferralRate");
      throw error;
    }
  }

  static async adminChangeCompanyAddress(
    signer: JsonRpcSigner,
    newAddress: string
  ): Promise<string> {
    try {
      const presaleContract = SmartContractProvider.getContract(
        SmartContractName.PRESALE,
        signer
      );

      await presaleContract.callStatic.changeCompanyAddress(newAddress);
      const tx = await presaleContract.functions.changeCompanyAddress(
        newAddress
      );

      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      logger(error, "adminChangeCompanyAddress");
      throw error;
    }
  }

  static async adminChangeCoreTeamAddress(
    signer: JsonRpcSigner,
    newAddress: string
  ): Promise<string> {
    try {
      const presaleContract = SmartContractProvider.getContract(
        SmartContractName.PRESALE,
        signer
      );

      await presaleContract.callStatic.changeCoreTeamAddress(newAddress);
      const tx = await presaleContract.functions.changeCoreTeamAddress(
        newAddress
      );
      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      logger(error, "adminChangeCoreTeamAddress");
      throw error;
    }
  }
}
