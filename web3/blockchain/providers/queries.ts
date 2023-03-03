import {
  allNFTsByFilterQuery,
  allNFTsQuery,
  claimCentherHistory,
  collectionQuery,
  collectionsByAccount,
  collectionsByCategoryQuery,
  collectionsQuery,
  createdNFTsByAccount,
  genealogyAtLevelQuery,
  genealogyQuery,
  hotNFTsQuery,
  listedNFTsByAccount,
  listedUserNFTsByAccount,
  myCollections,
  nftQuery,
  nftsBySaleStateQuery,
  nftsQuery,
  purchaseWithBusdHistory,
  purchaseWithNtrHistory,
  referralRewardsInPresaleQuery,
  referrerClaimPresaleQuery,
  registeredCollections,
  registrationHistory,
  saleQuery,
  topCreatorsQuery,
} from "@/subgraph/querys";
import { QueryNames } from "../enum/query.names.enum";
import { IQueryStorage } from "../types";

export class QueryFactory {
  private static _queries: IQueryStorage = {
    ALL_COLLECTIONS: collectionsQuery,
    HOT_NFTS: hotNFTsQuery,
    COLLECTIONS_BY_CATEGORIES: collectionsByCategoryQuery,
    ALL_NFTS: allNFTsQuery,
    NFTS_BY_CATEGORY: allNFTsByFilterQuery,
    NFT: nftQuery,
    SALE_HISTORY: saleQuery,
    COLLECTION: collectionQuery,
    COLLECTION_NFTS: nftsQuery,
    NFT_BY_SALE_STATE: nftsBySaleStateQuery,
    ACCOUNT_COLLECTION: collectionsByAccount,
    LISTED_NFT_BY_ACCOUNT: listedNFTsByAccount,
    LISTED_USER_NFT_BY_ACCOUNT: listedUserNFTsByAccount,
    ACCOUNT_CREATED_NFTS: createdNFTsByAccount,
    REGISTERED_COLLECTION: registeredCollections,
    COLLECTIONS_BY_ACCOUNT: myCollections,
    TOP_CREATOR_QUERY: topCreatorsQuery,
    GENEALOGY: genealogyQuery,
    GENEALOGY_AT_LEVEL: genealogyAtLevelQuery,
    REFERRAL_REWARD_IN_PRESALE: referralRewardsInPresaleQuery,
    REFERRER_CLAIM_PRESALE: referrerClaimPresaleQuery,
    PURCHASE_WITH_BUSD: purchaseWithBusdHistory,
    PURCHASE_WITH_NTR: purchaseWithNtrHistory,
    CLAIM_CENTHER_HISTORY: claimCentherHistory,
    REGISTRATION_HISTORY: registrationHistory,
  };

  static getQuery(name: QueryNames): string {
    return this._queries[name];
  }
}
