import {
  claimCentherHistory,
  genealogyAtLevelQuery,
  genealogyQuery,
  purchaseWithBusdHistory,
  purchaseWithNtrHistory,
  referralRewardsInPresaleQuery,
  referrerClaimPresaleQuery,
  registrationHistory,
} from "@/subgraph/querys";
import "@testing-library/jest-dom";
import { QueryNames } from "../enum/query.names.enum";
import { QueryFactory } from "../providers/queries";

describe("query factory", () => {
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
