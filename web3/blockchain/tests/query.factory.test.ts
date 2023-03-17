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
import "@testing-library/jest-dom";
import { QueryNames } from "../enum/query.names.enum";
import { QueryFactory } from "../providers/queries";

describe("query factory", () => {
  it('should return "collectionsQuery"', () => {
    const result = QueryFactory.getQuery(QueryNames.ALL_COLLECTIONS);
    expect(result).toEqual(collectionsQuery);
  });

  it('should return "hotNFTsQuery"', () => {
    const result = QueryFactory.getQuery(QueryNames.HOT_NFTS);
    expect(result).toEqual(hotNFTsQuery);
  });

  it('should return "collectionsByCategoryQuery"', () => {
    const result = QueryFactory.getQuery(QueryNames.COLLECTIONS_BY_CATEGORIES);
    expect(result).toEqual(collectionsByCategoryQuery);
  });

  it('should return "allNFTsQuery"', () => {
    const result = QueryFactory.getQuery(QueryNames.ALL_NFTS);
    expect(result).toEqual(allNFTsQuery);
  });

  it('should return "allNFTsByFilterQuery"', () => {
    const result = QueryFactory.getQuery(QueryNames.NFTS_BY_CATEGORY);
    expect(result).toEqual(allNFTsByFilterQuery);
  });

  it('should return "nftQuery"', () => {
    const result = QueryFactory.getQuery(QueryNames.NFT);
    expect(result).toEqual(nftQuery);
  });

  it('should return "saleQuery"', () => {
    const result = QueryFactory.getQuery(QueryNames.SALE_HISTORY);
    expect(result).toEqual(saleQuery);
  });

  it('should return "collectionQuery"', () => {
    const result = QueryFactory.getQuery(QueryNames.COLLECTION);
    expect(result).toEqual(collectionQuery);
  });

  it('should return "nftsQuery"', () => {
    const result = QueryFactory.getQuery(QueryNames.COLLECTION_NFTS);
    expect(result).toEqual(nftsQuery);
  });

  it('should return "nftsBySaleStateQuery"', () => {
    const result = QueryFactory.getQuery(QueryNames.NFT_BY_SALE_STATE);
    expect(result).toEqual(nftsBySaleStateQuery);
  });

  it('should return "collectionsByAccount"', () => {
    const result = QueryFactory.getQuery(QueryNames.ACCOUNT_COLLECTION);
    expect(result).toEqual(collectionsByAccount);
  });

  it('should return "listedNFTsByAccount"', () => {
    const result = QueryFactory.getQuery(QueryNames.LISTED_NFT_BY_ACCOUNT);
    expect(result).toEqual(listedNFTsByAccount);
  });

  it('should return "listedUserNFTsByAccount"', () => {
    const result = QueryFactory.getQuery(QueryNames.LISTED_USER_NFT_BY_ACCOUNT);
    expect(result).toEqual(listedUserNFTsByAccount);
  });

  it('should return "createdNFTsByAccount"', () => {
    const result = QueryFactory.getQuery(QueryNames.ACCOUNT_CREATED_NFTS);
    expect(result).toEqual(createdNFTsByAccount);
  });

  it('should return "registeredCollections"', () => {
    const result = QueryFactory.getQuery(QueryNames.REGISTERED_COLLECTION);
    expect(result).toEqual(registeredCollections);
  });

  it('should return "myCollections"', () => {
    const result = QueryFactory.getQuery(QueryNames.COLLECTIONS_BY_ACCOUNT);
    expect(result).toEqual(myCollections);
  });

  it('should return "topCreatorsQuery"', () => {
    const result = QueryFactory.getQuery(QueryNames.TOP_CREATOR_QUERY);
    expect(result).toEqual(topCreatorsQuery);
  });

  it('should return "collectionsByAccount"', () => {
    const result = QueryFactory.getQuery(QueryNames.ACCOUNT_COLLECTION);
    expect(result).toEqual(collectionsByAccount);
  });
  it('should return "genealogyQuery"', () => {
    const result = QueryFactory.getQuery(QueryNames.GENEALOGY);
    expect(result).toEqual(genealogyQuery);
  });

  it('should return "genealogyAtLevelQuery"', () => {
    const result = QueryFactory.getQuery(QueryNames.GENEALOGY_AT_LEVEL);
    expect(result).toEqual(genealogyAtLevelQuery);
  });

  it('should return "referralRewardsInPresaleQuery"', () => {
    const result = QueryFactory.getQuery(QueryNames.REFERRAL_REWARD_IN_PRESALE);
    expect(result).toEqual(referralRewardsInPresaleQuery);
  });

  it('should return "referrerClaimPresaleQuery"', () => {
    const result = QueryFactory.getQuery(QueryNames.REFERRER_CLAIM_PRESALE);
    expect(result).toEqual(referrerClaimPresaleQuery);
  });

  it('should return "purchaseWithBusdHistory"', () => {
    const result = QueryFactory.getQuery(QueryNames.PURCHASE_WITH_BUSD);
    expect(result).toEqual(purchaseWithBusdHistory);
  });

  it('should return "purchaseWithNtrHistory"', () => {
    const result = QueryFactory.getQuery(QueryNames.PURCHASE_WITH_NTR);
    expect(result).toEqual(purchaseWithNtrHistory);
  });

  it('should return "claimCentherHistory"', () => {
    const result = QueryFactory.getQuery(QueryNames.CLAIM_CENTHER_HISTORY);
    expect(result).toEqual(claimCentherHistory);
  });

  it('should return "registrationHistory"', () => {
    const result = QueryFactory.getQuery(QueryNames.REGISTRATION_HISTORY);
    expect(result).toEqual(registrationHistory);
  });
});
