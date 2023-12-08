import {
  claimCentherHistory,
  genealogyAtLevelQuery,
  genealogyQuery,
  purchaseWithBusdHistory,
  purchaseWithNtrHistory,
  referralRewardsInPresaleQuery,
  referrerClaimPresaleQuery,
  registrationHistory,
  GET_COLLECTION_ADDITIONAL_INFO,
  GET_USER_TOTAL_SOLD_NFTS,
  purchaseWithBusdHistoryByUser,
  allPurchasesHistoryByUser,
  purchaseWithNtrHistoryByUser,
} from "@/subgraph/querys";
import { QueryNames } from "../enum/query.names.enum";
import { IQueryStorage } from "../types";

export class QueryFactory {
  private static _queries: IQueryStorage = {
    GENEALOGY: genealogyQuery,
    GENEALOGY_AT_LEVEL: genealogyAtLevelQuery,
    REFERRAL_REWARD_IN_PRESALE: referralRewardsInPresaleQuery,
    REFERRER_CLAIM_PRESALE: referrerClaimPresaleQuery,
    PURCHASE_WITH_BUSD: purchaseWithBusdHistory,
    PURCHASE_WITH_NTR: purchaseWithNtrHistory,
    PURCHASE_BY_USER: allPurchasesHistoryByUser,
    PURCHASE_WITH_BUSD_BY_USER: purchaseWithBusdHistoryByUser,
    PURCHASE_WITH_NTR_BY_USER: purchaseWithNtrHistoryByUser,
    CLAIM_CENTHER_HISTORY: claimCentherHistory,
    REGISTRATION_HISTORY: registrationHistory,
    GET_COLLECTION_ADDITIONAL_INFO: GET_COLLECTION_ADDITIONAL_INFO,
    GET_USER_TOTAL_SOLD_NFTS: GET_USER_TOTAL_SOLD_NFTS,
  };

  static getQuery(name: QueryNames): string {
    return this._queries[name];
  }
}
