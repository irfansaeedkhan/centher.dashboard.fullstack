import { QueryNames } from "./enum/query.names.enum";
import { ApolloProvider } from "./providers/apollo.provider";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { ClaimCentherFrom, TokenName, UserReferrer } from "./types";
import { SmartContractProvider } from "./providers/smart.contract.provider";
import { SmartContractName } from "./enum/smart.contract.name.enum";
import { logger } from "./helpers/alert.helper";
import { getSigner, simpleRpcProvider } from "./helpers/provider.helper";
import { normalizeValue } from "./helpers/math.helper";
import { AddressFactory } from "./providers/address.provider";
import { BlockchainConfig } from "./config";
import { ZeroAddress } from "../constants/common";

export class BlockchainRead {
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
      variables
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

  static async getAllCollections(first: number, skip: number): Promise<any[]> {
    const variables = {
      first,
      skip,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.ALL_COLLECTIONS,
      variables
    );

    if (error) {
      throw error;
    }

    return data.collections;
  }

  static async getAccountCreatedNfts(
    account: string,
    first: number,
    skip: number
  ): Promise<any[]> {
    const variables = {
      first,
      skip,
      creator: account,
    };

    const { data, error } = await ApolloProvider.query(
      QueryNames.ACCOUNT_CREATED_NFTS,
      variables
    );

    if (error) {
      throw error;
    }

    return data.nfts;
  }

  static async getHotNFT(first: number, skip: number): Promise<any[]> {
    const variables = {
      first,
      skip,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.HOT_NFTS,
      variables
    );

    if (error) {
      throw error;
    }

    return data.nfts;
  }

  static async getCollectionsByCategory(
    first: number,
    skip: number,
    category: string
  ): Promise<any[]> {
    const variables = {
      first,
      skip,
      category,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.COLLECTIONS_BY_CATEGORIES,
      variables
    );

    if (error) {
      throw error;
    }

    return data.collections;
  }

  static async getAllNfts(first: number, skip: number): Promise<any[]> {
    const variables = {
      first,
      skip,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.ALL_NFTS,
      variables
    );

    if (error) {
      throw error;
    }

    return data.nfts;
  }

  static async getNftsByCategory(
    first: number,
    skip: number,
    category: string
  ): Promise<any[]> {
    const variables = {
      first,
      skip,
      category,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.NFTS_BY_CATEGORY,
      variables
    );

    if (error) {
      throw error;
    }

    return data.nfts;
  }

  static async getNft(
    collection: string,
    tokenId: number,
    useCache = true
  ): Promise<any> {
    const variables = {
      collection,
      tokenId,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.NFT,
      variables,
      useCache
    );

    if (error) {
      throw error;
    }

    return data.nfts[0];
  }

  static async getSaleHistory(
    collection: string,
    tokenId: number
  ): Promise<any[]> {
    const variables = {
      collection,
      tokenId,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.SALE_HISTORY,
      variables
    );

    if (error) {
      throw error;
    }

    return data.marketplaceSaleHistories;
  }

  static async getCollection(collection: string): Promise<any> {
    const variables = {
      collection,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.COLLECTION,
      variables
    );

    if (error) {
      throw error;
    }

    return data.collections[0];
  }

  static async getCollectionNfts(
    collection: string,
    orderDirection: string,
    first: number,
    skip: number
  ): Promise<any[]> {
    const variables = {
      collection,
      orderDirection,
      first,
      skip,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.COLLECTION_NFTS,
      variables
    );

    if (error) {
      throw error;
    }

    return data.nfts;
  }

  static async getNftsBySaleState(
    collection: string,
    orderDirection: string,
    saleState: string,
    first: number,
    skip: number
  ): Promise<any[]> {
    const variables = {
      collection,
      orderDirection,
      saleState,
      first,
      skip,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.NFT_BY_SALE_STATE,
      variables
    );

    if (error) {
      throw error;
    }

    return data.nfts;
  }

  static async getAccountCollections(creator: string): Promise<any[]> {
    const variables = {
      creator,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.COLLECTIONS_BY_ACCOUNT,
      variables
    );

    if (error) {
      throw error;
    }

    return data.collections;
  }

  static async getAccountListedNfts(
    first: number,
    skip: number,
    owner: string
  ): Promise<any[]> {
    const variables = {
      first,
      skip,
      owner,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.LISTED_NFT_BY_ACCOUNT,
      variables
    );

    if (error) {
      throw error;
    }

    return data.nfts;
  }

  static async getUserListedNfts(
    first: number,
    skip: number,
    owner: string
  ): Promise<any[]> {
    const variables = {
      first,
      skip,
      owner,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.LISTED_USER_NFT_BY_ACCOUNT,
      variables
    );

    if (error) {
      throw error;
    }

    return data.nfts;
  }

  static async getRegisteredCollections(): Promise<any[]> {
    const { data, error } = await ApolloProvider.query(
      QueryNames.REGISTERED_COLLECTION
    );

    if (error) {
      throw error;
    }

    return data.collections;
  }

  static async getLockedNFTsAll(): Promise<any[]> {
    const { data, error } = await ApolloProvider.query(
      QueryNames.LOCKED_NFTS_ALL
    );

    if (error) {
      throw error;
    }

    return data.nfts;
  }

  static async getUnlockTime(
    collection: string,
    tokenId: number
  ): Promise<any[]> {
    const variables = {
      collection,
      tokenId,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.UNLOCK_TIME,
      variables
    );

    if (error) {
      throw error;
    }

    return data.nfts;
  }

  static async getCollectionByAccount(creator: string): Promise<any[]> {
    const variables = {
      creator,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.ACCOUNT_COLLECTION,
      variables
    );

    if (error) {
      throw error;
    }

    return data.collections;
  }

  static async getTopCreator(first: number, skip: number): Promise<any[]> {
    const variables = {
      first,
      skip,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.TOP_CREATOR_QUERY,
      variables
    );

    if (error) {
      throw error;
    }

    return data.users;
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
    library: Web3Provider,
    collection: string,
    tokenId: number
  ): Promise<boolean> {
    const signer = getSigner(library);
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

  static async getTokenUnlockTimeFromContract(
    collection: string,
    tokenId: number,
    library?: Web3Provider
  ): Promise<number> {
    let signer;
    if (library) {
      signer = getSigner(library);
    } else {
      signer = simpleRpcProvider();
    }

    const nftContract = SmartContractProvider.getNFTContract(
      collection,
      signer
    );

    const tx = await nftContract.functions.unlockTime(tokenId);
    return tx?.toString();
  }

  static async isTokenSwaped(
    library: Web3Provider,
    collection: string,
    tokenId: number
  ): Promise<boolean> {
    const signer = getSigner(library);
    const nftAdapterContract = SmartContractProvider.getContract(
      SmartContractName.NFT_ADAPTER,
      signer
    );

    const result = await nftAdapterContract.functions.isSwapped(
      collection,
      tokenId
    );

    return result[0];
  }

  static async getCollectionMintedTokensCount(
    collection: string
  ): Promise<number> {
    const variables = {
      collection,
    };

    const { data, error } = await ApolloProvider.query(
      QueryNames.GET_COLLECTION_MINTED_NFTS,
      variables
    );

    if (error) {
      throw error;
    }

    return data.nfts.length;
  }
}
export class BlockchainWrite {
  static async adminUnPauseRegistration(
    library: Web3Provider
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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

  static async adminPauseRegistration(library: Web3Provider): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider,
    feeWithReferralLink: number,
    feeWithoutReferralLink: number
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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

  static async adminChangeReferralRate(
    library: Web3Provider,
    rates: number[]
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider,
    newAddress: string
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider,
    newAddress: string
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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

  static async adminClaimRegistrationBNB(
    library: Web3Provider
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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

  static async adminCallUpdateRoundInfo(
    library: Web3Provider,
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
      const signer = getSigner(library);
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
    library: Web3Provider
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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

  static async callCancelAuction(
    library: Web3Provider,
    collection: string,
    tokenId: number
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider,
    collection: string,
    tokenId: number
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider,
    collection: string,
    tokenId: number,
    price: number
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider,
    collection: string,
    tokenId: number,
    startPrice: number,
    period: number
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider,
    collection: string,
    tokenId: number,
    price: number
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider,
    collection: string,
    tokenId: number,
    newPrice: number
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider,
    collection: string,
    tokenId: number,
    newPrice: number
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider,
    collection: string,
    tokenId: number
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider,
    collection: string,
    tokenUri: string,
    supply: number,
    isAuction: boolean,
    price: number,
    period: number,
    fee: number
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider,
    name: string,
    symbol: string,
    category: string,
    uri: string,
    maxsupply: number | null,
    fee: number
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider,
    collection: string
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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

  static async callClaimNTRForReferral(library: Web3Provider): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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

  static async claimNtrTokens(
    library: Web3Provider,
    round: number,
    claimFrom: ClaimCentherFrom
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
      logger(error, "claimNtrTokens");
      throw error;
    }
  }

  static async buyCenther(
    tokenName: TokenName,
    amount: number,
    library: Web3Provider
  ): Promise<string> {
    try {
      const signer = getSigner(library);
      const presaleContract = SmartContractProvider.getContract(
        SmartContractName.PRESALE,
        signer
      );

      let tokenPurchase;
      const purchaseAmount = ethers.utils.parseUnits(amount.toString(), 18);

      if (tokenName === "BUSD") {
        await presaleContract.callStatic.tokenPurchaseWithBUSD(purchaseAmount);
        tokenPurchase = presaleContract.functions.tokenPurchaseWithBUSD;
      } else if (tokenName === "NTR") {
        await presaleContract.callStatic.tokenPurchaseWithNtr(purchaseAmount);
        tokenPurchase = presaleContract.functions.tokenPurchaseWithNtr;
      }

      if (!tokenPurchase) {
        throw new Error("Token cannot be purchased");
      }

      const tx = await tokenPurchase(purchaseAmount);
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      logger(error, "buyCenther");
      throw error;
    }
  }

  static async getTokenApproval(
    tokenName: TokenName,
    library: Web3Provider
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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

  static async transferNftWithLock(
    library: Web3Provider,
    collection: String,
    tokenId: number,
    receiver: string,
    periodTimeSpan: number
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider,
    collection: string,
    tokenId: number,
    price: number,
    endTime: number
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
          library,
          collection
        );

        if (!approveTx?.length) {
          throw new Error("Approve issue");
        }

        endTime = Math.floor(endTime - +Date.now() / 1000);
        const tx = await this.callCreateAuction(
          library,
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
          library,
          collection
        );

        if (!approveTx?.length) {
          throw new Error("Approve issue");
        }

        const tx = await this.callListItemForSale(
          library,
          collection,
          tokenId,
          price
        );

        return tx;
      }
    } catch (error: any) {
      console.log(error);
      logger(error, "callTransferNftToCurrentMarketplace");
      throw error;
    }
  }

  static async preBookDexa(
    paymentAmountRaw: number,
    paymentAddress: string,
    paymentTokenAddress: string,
    library: Web3Provider
  ): Promise<string> {
    try {
      const signer = getSigner(library);
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
    library: Web3Provider,
    collection: string,
    tokenId: number
  ): Promise<string> {
    const signer = getSigner(library);
    const nftAdapterContract = SmartContractProvider.getContract(
      SmartContractName.NFT_ADAPTER,
      signer
    );

    const nftContract = SmartContractProvider.getNFTContract(
      collection,
      signer
    );

    const lockTime = 0;

    // try {
    //   lockTime = await BlockchainRead.getTokenUnlockTimeFromContract(
    //     collection,
    //     tokenId,
    //     library
    //   );
    // } catch (error) {
    //   throw new Error("cannot get token lock time");
    // }

    // if (+lockTime != 0) {
    //   lockTime = (lockTime - +new Date() / 1000).toFixed(0);
    // }

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
      console.log(error);
      throw new Error("cannot swap token");
    }
  }
}
