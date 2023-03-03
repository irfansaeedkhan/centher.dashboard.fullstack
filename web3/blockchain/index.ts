import { Collection, NFT } from "@/models/nft";
import { QueryNames } from "./enum/query.names.enum";
import { ApolloProvider } from "./providers/apollo.provider";
import { IListHistory } from "@/hooks/use.get.nft.data.ts";
import { TopCreator } from "@/models/top-creator";
import {
  ClaimHistory,
  Genealogy,
  PurchaseHistory,
  ReferralReward,
  RegistrationHistory,
} from "@/models/referral";

export class BlockchainCalls {
  static async getAllCollections(): Promise<Collection[]> {
    const { data, error } = await ApolloProvider.query(
      QueryNames.ALL_COLLECTIONS
    );

    if (error) {
      throw error;
    }

    return data.collections as Collection[];
  }

  static async getAccountCreatedNfts(
    account: string,
    first: number,
    skip: number
  ): Promise<NFT[]> {
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

    return data.nfts as NFT[];
  }

  static async getHotNFT(first: number, skip: number): Promise<NFT[]> {
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

    return data.nfts as NFT[];
  }

  static async getCollectionsByCategory(
    first: number,
    skip: number,
    category: string
  ): Promise<Collection[]> {
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

    return data.collections as Collection[];
  }

  static async getAllNfts(first: number, skip: number): Promise<NFT[]> {
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

    return data.nfts as NFT[];
  }

  static async getNftsByCategory(
    first: number,
    skip: number,
    category: string
  ): Promise<NFT[]> {
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

    return data.nfts as NFT[];
  }

  static async getNft(collection: string, tokenId: number): Promise<NFT> {
    const variables = {
      collection,
      tokenId,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.NFT,
      variables
    );

    if (error) {
      throw error;
    }

    return data.nfts[0] as NFT;
  }

  static async getSaleHistory(
    collection: string,
    tokenId: number
  ): Promise<IListHistory[]> {
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

    return data.marketplaceSaleHistories as IListHistory[];
  }

  static async getCollection(collection: string): Promise<Collection> {
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

    return data.collections[0] as Collection;
  }

  static async getCollectionNfts(
    collection: string,
    orderDirection: string,
    first: number,
    skip: number
  ): Promise<NFT[]> {
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

    return data.nfts as NFT[];
  }

  static async NFT_BY_SALE_STATE(
    collection: string,
    orderDirection: string,
    saleState: string,
    first: number,
    skip: number
  ): Promise<NFT[]> {
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

    return data.nfts as NFT[];
  }

  static async getAccountCollections(creator: string): Promise<Collection[]> {
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

    return data.collections as Collection[];
  }

  static async getAccountListedNfts(
    first: number,
    skip: number,
    owner: string
  ): Promise<NFT[]> {
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

    return data.nfts as NFT[];
  }

  static async getUserListedNfts(
    first: number,
    skip: number,
    owner: string
  ): Promise<NFT[]> {
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

    return data.nfts as NFT[];
  }

  static async getRegisteredCollections(): Promise<Collection[]> {
    const { data, error } = await ApolloProvider.query(
      QueryNames.REGISTERED_COLLECTION
    );

    if (error) {
      throw error;
    }

    return data.collections as Collection[];
  }

  static async getCollectionByAccount(creator: string): Promise<Collection[]> {
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

    return data.collections as Collection[];
  }

  static async getTopCreator(
    first: number,
    skip: number
  ): Promise<TopCreator[]> {
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

    return data.users as TopCreator[];
  }

  static async getGenealogy(referrer: string): Promise<Genealogy[]> {
    const variables = {
      referrer,
    };
    const { data, error } = await ApolloProvider.query(
      QueryNames.GENEALOGY,
      variables
    );

    if (error) {
      throw error;
    }

    return data.genealogies as Genealogy[];
  }

  static async getGenealogyAt(
    referrer: string,
    level: number
  ): Promise<Genealogy[]> {
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

    return data.genealogies as Genealogy[];
  }

  static async getReferralRewardInPresale(
    first: number,
    skip: number,
    referrer: string
  ): Promise<ReferralReward[]> {
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

    return data.presaleGenealogyHistories as ReferralReward[];
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

  static async purchaseInBUSD(
    first: number,
    skip: number
  ): Promise<PurchaseHistory[]> {
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

    return data.presalePurchaseWithBusdHistories as PurchaseHistory[];
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

    return data.presalePurchaseWithNtrHistories as PurchaseHistory[];
  }

  static async getCentherClaimHistory(
    first: number,
    skip: number
  ): Promise<ClaimHistory[]> {
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

    return data.presaleCentherClaimHistories as ClaimHistory[];
  }

  static async getRegistrationHistory(
    first: number,
    skip: number
  ): Promise<RegistrationHistory[]> {
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

    return data.users as RegistrationHistory[];
  }
}
